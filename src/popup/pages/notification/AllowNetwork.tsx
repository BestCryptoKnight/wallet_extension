// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import Loading from '../../components/Loading'
import useStore, { ellipsis, getChainIcon, initChainIcons } from '../../useStore';
import Avartar from '../../components/Avartar';
import '../../assets/css/auth/auth.scss'

interface InnerProps {
	onAccept: Function
	info:	{url:string, params: [{chainId: string}]}[]
}

export const SwitchNetwork = ({info,  onAccept }: InnerProps) => {
	const {networks, currentNetwork, setting, update} = useStore()
	const [icon,  setIcon] = React.useState<string>("");
	const [state, setStates] = React.useState({
		chainId : 0,
		chainKey: '',
		label: '',
		loading: true
	});
	const updateStatus = (params: {[key: string]: string | number | boolean | any }) => setStates({ ...state, ...params });
	
	React.useEffect(() => {
		const chainId = Number(info[0]?.params?.[0].chainId);
		let flag = false;
		Object.values(networks).map((network: NetworkObject) => {
			if(Number(network.chainId) === chainId) {
				flag = true;
				updateStatus({chainId, chainKey: network.chainKey, label: network.label, loading: false})
			}
		})
		if(!flag) onAccept(false)

		initChainIcons().then(()=>{
			const icon = getChainIcon(Number(chainId)) || "";
			setIcon(icon)
		});
	}, [])

	const changeNetwork = () => {
		try {
			update({currentNetwork: state.chainKey})
			onAccept(null)
		} catch(err) {
			onAccept(false)
		}
	}

	return (
		<div>
			<div className="flex center middle" style={{borderRadius: '20px', border: '1px solid var(--line-color)'}}>
				<>
					{
						icon != "" ? <div style={{width:'25px'}}><img src={icon} width={25} height={25} style={{borderRadius:'50%', marginRight:'0.5em',}}/> </div>: 
						<div style={{width:'25px'}}>
							<div className={`avartar`}>
								<Avartar address={currentNetwork} size={20} type={setting.identicon === 'jazzicons'? 1: 2}/>
							</div>
						</div>
					}
				</>
				<p className='ml2'>{ellipsis(info[0]?.url, 25)}</p>
			</div>
			<h4 className='text-center'>
				Allow this site to switch the network?
			</h4>
			<div className="hr mt3 mb3"></div>
			<div style={{padding: '1em', borderRadius: '10px', border: '1px solid var(--color-modal)'}}>
				<div className="flex middle">
					<p className='m0'>Name</p>
				</div>
				<b className='t0 m0'>{ellipsis(state.label, 30)}</b>
				<div className="hr mt1 mb1"></div>
				<div className="flex middle">
					<p className='m0'>ChainId</p>
				</div>
				<b className='t0 m0'>{state.chainId}</b>
			</div>
			<div className="justify justify-around mt3">
				<div className="btn-cancel  mt1" style={{width:'130px'}} onClick = {() => {onAccept("failure")}}>
					CANCEL
				</div>
				<div className="btn-special  mt1" style={{width:'130px'}} onClick = {() => {changeNetwork()}}>
					SWITCH
				</div>
			</div>
			{state.loading && <Loading />}
		</div>
	);
}

export default SwitchNetwork