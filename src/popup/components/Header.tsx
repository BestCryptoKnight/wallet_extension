// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import { Link, useHistory} from 'react-router-dom';
import Icon from './Icon'
import CreateAccount from '../pages/CreateAccount';
import ImportAccount from '../pages/ImportAccount';
import Setting from '../pages/Setting';
import useStore, {ellipsis, roundNumber} from '../useStore';
import Avartar from '../components/Avartar'
import {selectAccount, selectNetwork, setPassHash} from '../../lib/api';
import { formatUnit } from '../../lib/bigmath';
import config from '../../config.json'

interface HeaderStatus {
	openNetworks: boolean
	openSettingModal: boolean
	openImportAccount: boolean
	openCreateAccount: boolean
	openSettingPage: boolean
	avartarAddress: string
}

const Header = () => {
	const history = useHistory();

	const {currentAccount, accounts, setting, apps, currentNetwork, networks, update} = useStore()

	const [status, setStatus] = React.useState<HeaderStatus>({ 
		openNetworks: false,
		openSettingModal: false,
		openImportAccount: false,
		openCreateAccount: false,	
		openSettingPage: false,
		avartarAddress:  ''
	});
	const updateStatus = (params: Partial<HeaderStatus>) => setStatus({...status, ...params});

	const changeNetwork = (chainKey: string) => {
		updateStatus({openNetworks: false})
		selectNetwork(networks, chainKey)
		update({currentNetwork: chainKey})
	}

	const changeAccount = (account: string) => {
		chrome.tabs.query({active: true, currentWindow: true},function(tabs){
			var url = new URL(tabs[0].url || '').origin;
			if(apps[url]){
				Object.values(apps[url]).map((_account) => {
					if(_account === account) {
						selectAccount(tabs[0].id || 0, account);
					}
				})
			}
		})
		update({currentAccount: account});
		updateStatus({openSettingModal: false, avartarAddress: account});
	}

	const setLock = async  () => {
		update({lastAccessTime: 0})
		await setPassHash("")
		history.push("/notification_lock")
	}

	React.useEffect(() => {
		updateStatus({avartarAddress: currentAccount})
	}, [])

	return (
		<div>
			<div className="justify middle">
				<Link className='logo' to="/assets">
					<Icon icon="Neon" size={100} height={50}/>
				</Link>
				<div className="justify">
					<div className="header-dropdown" onClick={(e)=> {updateStatus({openNetworks:true})}} >
						{Object.values(networks).map((network: any) => {
							if( network.chainKey === currentNetwork){
								return ellipsis(network.label, 10)
							}}) 
						}
						<div className="icon">
							<Icon icon="ArrowDown" size={15} height={20}/>
						</div>
					</div>
					<div className={`avartar`}  onClick={(e) => { {updateStatus({openSettingModal:true})}}}> 
						<Avartar address={status.avartarAddress} type={setting.identicon === 'jazzicons'? 1: 2}/>
					</div>
				</div>
			</div>
			
			{status.openNetworks && (
				<>
					<div className="network-panel" >
						<div className="header" style={{height:'30px'}}>
							<h4 className='m0'>NETWORKS</h4>
						</div>
						<div className="content" style={{maxHeight:'300px'}}>
							{Object.values(networks).map((network: any) => {
								if(setting.showTestnet || !network.testnet){
									return <div className={`network-list ${network.chainKey === currentNetwork ? 'active': ''}`} onClick={ () => {changeNetwork(network.chainKey)}}>
										<div style={{color:`${network.chainKey === currentNetwork? '#59F256': ''}`}}>
											<Icon icon="Dot" size={15} height={28} />
										</div>
										<p>{ellipsis(network.label, 20)}</p>
										<div style={{color:`${network.chainKey === currentNetwork? '#59F256': ''}`}}>
											<Icon icon="Check" size={10} height={22}/>
										</div>
									</div>
								}
							})}
						</div>
						<div className="btn-primary  mt1" style={{width:'200px'}} onClick={() => {history.push("/setting/network")}}>
							ADD NETWORK
						</div>
					</div>
					<div style={{width:'100%', height:'100%', position:'fixed', left:'0', top:'0', backgroundColor:'rgba(0,0,0,0)'}} onClick={() => {updateStatus({openNetworks: false})}}></div>
				</>
			)}
			{status.openSettingModal && (
				<>
					<div className="setting-panel" >
						<div className="header" >
							<div className="justify">
								<h5 className='m0'>MY ACCOUNTS</h5>
								<div className="badge active pointer" onClick={() => {setLock()}}>Lock</div>
							</div>
						</div>
						<div className="content">
							{Object.entries(accounts).map(([index, account]: any) => (
								<div className="account-menu" key={index} onClick={() =>  {changeAccount(account.address)}}>
									{<div style={{width:'30px'}}>{account.address === currentAccount  ? <Icon icon='Check'/>:<></>}</div>}
									<div className={`avartar`}>
										<Avartar address={account.address} type={setting.identicon === 'jazzicons'? 1: 2}/>
									</div>
									<div>
										<p className='m0'>{account.label}</p>
										<p className='m0 t-small'>
											{
												roundNumber(formatUnit(account.value[currentNetwork]  || "0", 18), 8)
											}
											{
												 Object.values(networks).map((network: any) => {
													if( network.chainKey === currentNetwork){
														return " " + network.symbol
												}})
											}
										</p>
									</div>
									{account.imported && <div className='imported'>Imported</div>}
								</div>
							))}
						</div>
						<div className="footer">
							<div className="footer-link" onClick={() => {updateStatus({openCreateAccount: true, openSettingModal: false})}}>
								<Icon icon="Add" fill='var(--color-yellow)' />
								<p className='text-yellow'>CREATE ACCOUNT</p>
							</div>
							<div className="footer-link" onClick={() => {updateStatus({openImportAccount: true, openSettingModal: false})}}>
								<Icon icon="Deposit" size={17} fill='var(--color-yellow)' />
								<p className='text-yellow'>IMPORT ACCOUNT</p>
							</div>
							<a target="_blank" href={config.links.support} className="footer-link">
								<Icon icon="Support" fill='var(--color-yellow)' />
								<p className='text-yellow'>SUPPORT</p>
							</a>
							<div className="footer-link" onClick={() => {updateStatus({openSettingPage: true, openSettingModal: false})}}>
								<Icon icon="Setting" fill='var(--color-yellow)' />
								<p className='text-yellow'>SETTINGS</p>
							</div>
						</div>
					</div>
					<div style={{width:'100%', height:'100%', position:'fixed', left:'0', top:'0', backgroundColor:'rgba(0,0,0,0)'}} onClick={() => {updateStatus({openSettingModal: false})}}></div>
				</>
			)}
			{status.openSettingPage && (
				<Setting onClose={() => {updateStatus({openSettingPage: false, openSettingModal: false})}} />
			)}
			{status.openCreateAccount && (
				<CreateAccount onClose={() => {updateStatus({openCreateAccount: false, openSettingModal: false})}} />
			)}
			{status.openImportAccount && (
				<ImportAccount onClose={() => {updateStatus({openImportAccount: false, openSettingModal: false})}} />
			)}
		</div>
	);
}



export default Header