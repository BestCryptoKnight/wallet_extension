// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import Icon from '../../components/Icon'
import useStore, { ellipsis, getChainIcon, initChainIcons, showAlert } from '../../useStore';
import {hash} from '../../../lib/utils'
import Loading from '../../components/Loading'
import { selectNetwork } from '../../../lib/api';
import Avartar from '../../components/Avartar';
import { ZeroAddress } from '../../../lib/wallet';

interface ConnectDialogProps {
	onAccept: Function
	info:	{url:string, params: [AddEthereumChainParameter]}[]
}

interface stateInterface {
	confirm: boolean,
	alert:	boolean,
	loading: boolean
}

export const AddNetwork = ({info,  onAccept }: ConnectDialogProps) => {
	const chain = info[0]?.params?.[0] as AddEthereumChainParameter | null;

	const [icon,  setIcon] = React.useState<string>("");
	const [state, setStates] = React.useState<stateInterface>({
		confirm: false,
		alert:	false,
		loading: true
	});
	const updateStatus = (params: {[key: string]: string | number | boolean | any }) => setStates({ ...state, ...params });
	
	const {networks,  setting,  update} = useStore()
	
	const add = async () => {
		try {
			const chainKey = hash((chain?.chainId || '') + (chain?.chainName || ''));
			const newNetworks:NetworkObject[] = [];
			let exists = false;
			let existsChain;
			Object.values(networks).map((v) => {
				newNetworks.push(v)
				if(Number(v.chainId) === Number(chain?.chainId)) {
					exists = true;
					existsChain = v.chainKey;
				}
			})
			if(exists) 
			{
				update({ currentNetwork: existsChain})
				showAlert("Already exists same chain", "warning");
				return onAccept(null)
			}
			const network = {
				"chainKey": chainKey,
				"url": chain?.blockExplorerUrls?.[0] || '',
				"rpc": chain?.rpcUrls?.[0] || '',
				"symbol": chain?.nativeCurrency?.symbol || '',
				"testnet": (chain?.chainName || '').indexOf('test') > -1 ? true: false,
				"chainId" : Number(chain?.chainId) || 0,
				"label": chain?.chainName || '',
				"imported": true
			}
			let flag = false
			Object.values(networks).map((v) => {
				if(v.chainId === Number(chain?.chainId))  flag = true;
			})
			if(!flag) {
				newNetworks.push(network)
				update({networks: newNetworks, currentNetwork: chainKey})
				selectNetwork(networks, chainKey)
				onAccept(null)
			}
			else {
				onAccept("failure")
			}
		} catch (err: any){
			onAccept("failure")
		}
	}

	React.useEffect(() => {
		updateStatus({loading: false})
		initChainIcons().then(()=>{
			const icon = getChainIcon(Number(chain?.chainId)) || "";
			setIcon(icon)
		});
	}, [])

	return (
		<div>
			<div className="flex center middle" style={{borderRadius: '20px', border: '1px solid var(--line-color)'}}>
				<>
					{
						icon != "" ? <div style={{width:'25px'}}><img src={icon} width={25} height={25} alt={chain?.chainId} style={{borderRadius:'50%', marginRight:'0.5em',}}/> </div>: 
						<div style={{width:'25px'}}>
							<div className={`avartar`}>
								<Avartar address={chain?.chainName || ZeroAddress} size={20} type={setting.identicon === 'jazzicons'? 1: 2}/>
							</div>
						</div>
					}
				</>
				<p className='ml2'>{ellipsis(info[0]?.url, 25)}</p>
			</div>
			<h4 className='text-center'>
				Allow this site to add a network?
			</h4>
			<p>This will allow this network to be used within Neon Wallet.</p>
			<p><b>Neon Wallet does not verify custom networks.</b> Learn about <span className='text-yellow'>scams and network security risks</span>.</p>
			<div style={{padding: '1em', borderRadius: '10px', border: '1px solid var(--color-modal)'}}>
				<div className="flex middle">
					<p className='m0'>Network Name</p>
				</div>
				<b className='t0 m0'>{ellipsis(chain?.chainName || '', 30)}</b>
				<div className="hr mt1 mb1"></div>
				<div className="flex middle">
					<p className='m0 mt1'>Network URL</p>
				</div>
				<b className='t0 m0'>{ellipsis(chain?.rpcUrls?.[0] || '', 30)}</b>
				<div className="hr mt1 mb1"></div>
				<div className="flex middle">
					<p className='m0 mt1'>Chain ID</p>
				</div>
				<b className='t0 m0'>{chain?.chainId || '0'}</b>
				<div className="hr mt1 mb1"></div>
				<p className='pointer text-pink m0' onClick={() => {updateStatus({confirm: true})}}>View all details</p>
			</div>
			{
				state.alert && 
				<div className='alert'>
					<Icon icon="Warning" size={40}/>
					<p className='t0 mt0 mb0 ml1'>The network details for this chain ID do not match our records. We recommend that you <span className='text-yellow'>verify the network details</span> before proceeding.</p>
				</div>
			}
			{
				state.confirm && <div style={{padding: '1em', borderRadius: '10px',backgroundColor: 'rgb(255 255 255)', position: 'fixed', height: '340px', marginTop: 'auto', marginBottom: 'auto',marginLeft: '1em', marginRight:'1em', top:0, left:0, right:0, bottom:0, color:'black'}}>
					<span className="close-btn pointer" style={{position:'absolute', right:'10px', top:'10px'}} onClick={()=>{updateStatus({confirm: false})}}>
						<div className="justify">
							<Icon icon="Close" size={12} fill="var(--color-pink)"/>
						</div>
					</span>
					<p className='m0 mt1'>Chain name</p>
					<b className='t0 m0'>{ellipsis(chain?.chainName || '', 30)}</b>
					<div className="hr mt1 mb1"></div>
					<p className='m0 mt1'>Chain Id</p>
					<b className='t0 m0'>{chain?.chainId || ''}</b>
					<div className="hr mt1 mb1"></div>
					<p className='m0 mt1'>RPC URL</p>
					<b className='t0 m0'>{ellipsis(chain?.rpcUrls?.[0] || '', 30)}</b>
					<div className="hr mt1 mb1"></div>
					<p className='m0 mt1'>Explorer</p>
					<b className='t0 m0'>{ellipsis(chain?.blockExplorerUrls?.[0] || '', 30)}</b>
					<div className="hr mt1 mb1"></div>
					<p className='m0 mt1'>Symbol</p>
					<b className='t0 m0'>{chain?.nativeCurrency?.symbol || ''}</b>
					<div className="hr mt1 mb1"></div>
				</div>
			}
			<div className="justify justify-around">
				<div className="btn-cancel  mt1" style={{width:'130px'}} onClick = {() => {onAccept("failure")}}>
					CANCEL
				</div>
				<div className="btn-special  mt1" style={{width:'130px'}} onClick = {() => {add()}}>
					APPROVE
				</div>
			</div>
			{state.loading && <Loading />}
		</div>
	);
}

export default AddNetwork