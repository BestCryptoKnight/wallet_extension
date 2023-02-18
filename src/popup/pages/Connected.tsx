// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import Icon from '../components/Icon';
import '../assets/css/connected.scss'
import useStore, { ellipsis } from '../useStore';

interface ConnectDialogProps {
	onClose: Function
}

export default function ({ onClose }: ConnectDialogProps) {
	const {currentAccount, apps, accounts, update} = useStore()

	const [status, setStatus] = React.useState({ 
		sites: [] as string[],
		connectCount: 0 as number,
		openDisconnect: false,
		disconnectUrl: ''
	})
	const updateStatus = (params:{[key:string]:string|number|boolean|any}) => setStatus({...status, ...params});

	const disconnect = (all: boolean) => {
		var newApps:ConnectedAppObject= {};
		apps && Object.entries(apps).map(([_url, _accounts]) => {
			if(_url !== status.disconnectUrl) {
				newApps[_url] = _accounts;
			}
			else {
				if(!all){
					var accounts:any = [];
					Object.values(_accounts).map(( _address) => {
						if(_address !== currentAccount)	accounts.push(_address)
					})
					newApps[_url] = accounts;
				}
			}
		}) 
		update({apps: newApps})
		updateStatus({openDisconnect:false})
	}

	const checkApp = () => {
		let site = [] as string[], total = 0;
		apps && Object.entries(apps).map(([url, accs]) => {
			Object.values(accs).map((_account) => {
				if(_account === currentAccount) {
					site.push(url);
					total ++;
				}
			})
		})
		updateStatus({sites: site, connectCount: total});
	}

	React.useEffect(() => {
		update({lastAccessTime: +new Date()})
		checkApp()
	}, [])

	React.useEffect(() => {
		checkApp()
	}, [apps])

	return (
		<div className='connected-modal'>
			<div className=" token-panel">
				<div className="header">
					<h4 className='m0 text-center'>CONNECTED SITES</h4>
					<p className='t0  ml-auto mr-auto text-center'>
						{accounts && Object.values(accounts).map((account) => {
							if(account.address === currentAccount) {
								return account.label
							}
						})}  
						&nbsp; {
							status.connectCount === 0 ? ' is not connected to any sites.':'is connected to these sites. They can view your account address.'
						}
					</p>
					<span className="close-btn" onClick={()=>onClose()}>
						<div className="justify">
							<Icon icon="Close" size={12} fill="var(--color-pink)"/>
						</div>
					</span>
				</div>
				<div className="content">
					{
						status.sites.map((url, index) => {
							return <div className="site-row justify middle" >
								<div className='justify middle'>
									<div className="avartar"></div>	
									<p className='ml1'>{ellipsis(url, 18)}</p>
								</div>
								<p className='text-yellow' onClick={() => {updateStatus({disconnectUrl: url, openDisconnect: true})}}>Disconnect</p>
							</div>
						})
					}
				</div>
			</div>
			{
				status.openDisconnect && <div className="confirm-panel" style={{backgroundColor:'#22024c', padding:'1em 0'}}>
					<div className="content" style={{minHeight:'200px', height:'280px'}}>
						<h4 className='m0'>Disconnect {status.disconnectUrl}</h4>
						<p>Are you sure you want to disconnect? You may lose site functionality.</p>
						<div className="hr"></div>
						
						<div className="justify justify-around mt3">
							<div className="btn-cancel  mt1" style={{width:'120px'}} onClick = {() => {updateStatus({openDisconnect: false, disconnectUrl: ''})}}>
								CANCEL
							</div>
							<div className="btn-special  mt1" style={{width:'140px'}} onClick = {() => {disconnect(false)}}>
								DISCONNECT
							</div>
						</div>
						<p  onClick={() => {disconnect(true)}} className="pointer text-yellow">Disconnect all accounts</p>
					</div>
				</div>
			}
		</div>
	);
}
