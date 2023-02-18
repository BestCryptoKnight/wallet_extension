// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import Icon from '../../components/Icon'
import Avartar from '../../components/Avartar'
import Loading from '../../components/Loading'
import useStore, {ellipsis, getChainIcon, initChainIcons, roundNumber } from '../../useStore';
import { formatUnit} from '../../../lib/bigmath';

interface ConnectDialogProps {
	onAccept: Function
	info:	any[]
}

interface StateInterface {
	selected: {[key:string] : boolean} 
	selectAll:	boolean
	inited:		boolean
	loading:	boolean
}

export const AccountConnect = ({info,  onAccept }: ConnectDialogProps) => {
	const { currentNetwork, currentAccount, networks, apps, accounts, setting,  update} = useStore();
	
	const [icon,  setIcon] = React.useState<string>("");
	const [state, setStates] = React.useState<StateInterface>({
		selected:	{},
		selectAll:	false,
		inited:		false,
		loading:	true
	});
	
	const updateStatus = (params: {[key: string]: string | number | boolean | Blob | any }) => setStates({ ...state, ...params });
	
	const selectAll = () => {
		let select = state.selected;
		if(select) Object.entries(select).map(([key, value]) => {
			select[key] = !state.selectAll;
		})
		updateStatus({selectAll: !state.selectAll, selected: select})
	}

	const updateSelect = (address: string) => {
		let select = state.selected;
		select[address] = !select[address]
		updateStatus({selected: select})
	}

	const returnAccounts = () => {
		let accs = [] as string [];
		if(state.selected) Object.entries(state.selected).map(([key, value])=> {
			if(value) {
				accs.push(key)
			}
		})
		const url = info[0].url;
		let app = {} as ConnectedAppObject;
		let flag = false;
		if(apps) Object.entries(apps).map(([_url, _accounts]) => {
			app = {...app, [_url]:  _accounts, [url]: accs};
			flag = true;
		})
		if(!flag ){
			app = {...app, [url]:  accs};
		}
		update({apps: app})
		onAccept(accs);
	}


	React.useEffect(() => {
		const url = info[0].url;
		if(Object.keys(apps).indexOf(url) > -1 && Object.values(apps[url]).length > 0) {
			return onAccept(Object.values(apps[url]));
		}
		let sels = {} as  {[key:string] : boolean} ;
		Object.values(accounts).map((account) => {
			if(account.address === currentAccount)	sels[account.address] = true;
			else sels[account.address] = false;
		})
		updateStatus({selected: sels, inited: true, loading: false})
		
		Object.values(networks).map((network) => {
			if(network.chainKey === currentNetwork) {
				initChainIcons().then(()=>{
					const icon = getChainIcon(network.chainId) || "";
					setIcon(icon)
				})
			}
		})
	}, [])

	return (
		<>
			{!state.inited && 
				<div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', height:'100%'}}>
					<Icon icon="Neon" size={110} height={50}/>
			</div>} 
			{
				state.inited && <div style={{height:'95%', }}>	
				<div className='flex middle center'>
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
							<p className='ml2'>{ellipsis(info[0].url, 25)}</p>
						</div>
						<h4 className='text-center'>
							CONNECT WITH NEON WALLET
						</h4>
						<p className='text-center'>Select the account(s) to use on this site</p>
						<div className="justify  middle">
							<div className="justify middle ml2" onClick={() => {selectAll()}}>
								<div className='checkbox pointer'>
									{state.selectAll && <Icon icon="Check" size={12} height={20} fill="var(--color-pink)" />}
								</div>
								<p className='pointer t0 m0 ml2'>SELECT ALL</p>
							</div>
						</div>
						<div style={{padding: '0 1em', borderRadius: '10px', height:'218px', overflowY:'auto', border: '1px solid var(--color-modal)'}}>
							{
								Object.values(accounts).map((account) => {	
									return <div className="flex middle cursor" style={{margin:'0.4em', borderBottom:'1px solid #381d4c'}} onClick={() => {updateSelect(account.address)}}>
											<div className='checkbox pointer'>
												{state.selected[account.address] && <Icon icon="Check" size={12} height={20} fill="var(--color-pink)" />}
											</div>
											<div className={`avartar`} style={{marginLeft:'0.5em', marginRight:'0.5em'}}> 
												<Avartar address={account.address} type={setting.identicon === 'jazzicons'? 1: 2} /> 
											</div>
											<div>
												<p className='t0 m0'> {account.label} ({ellipsis(account.address)})</p>
												<p className='t0 m0'>
												{
													roundNumber(formatUnit(account.value[currentNetwork] || '0', 18),8)
												}
												{
													networks && Object.values(networks).map((network) => {
														if( network.chainKey === currentNetwork){
															return " " + network.symbol
													}})
												}
												</p>
											</div>
										</div>
								})
							}
						</div>
						<p className='t0'>Only Connect with sites you trust.</p>
						<div className="hr mt1 mb1"></div>
						<div className="justify justify-around">
							<div className="btn-cancel  mt1" style={{width:'130px'}} onClick = {() => {onAccept(false)}}>
								CANCEL
							</div>
							<div className="btn-special  mt1" style={{width:'130px'}} onClick = {() => {returnAccounts()}}>
								NEXT
							</div>
						</div>
					</div>
				</div>
				<div className="flex middle center hide">
					<div>	
						<div className="flex center" style={{padding: '0.5em', borderRadius: '20px', border: '1px solid var(--line-color)'}}>
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
							<p>{info[0].url}</p>
						</div>
						<h3 className='text-center m0'>
						CONNECT WITH NEON WALLET</h3>
						<div className="justify middle">
							<Icon icon="View" size={20} />
							<p className='mt3'>See address, account balance, activity and suggest transactions to approve</p>
						</div>
						<div className="hr mt3 mb3"></div>
						<p className='t0'>Only connect with sites you trust.</p>
						<div className="hr"></div>	
						<div className="justify justify-around">
							<div className="btn-cancel  mt1" style={{width:'130px'}} onClick = {() => {onAccept(false)}}>
								CANCEL
							</div>
							<div className="btn-special  mt1" style={{width:'130px'}} onClick = {() => {onAccept(true)}}>
								NEXT
							</div>
						</div>
					</div>
				</div>
			</div>
			}
			{state.loading && <Loading />}
		</>
	);
}

export default AccountConnect