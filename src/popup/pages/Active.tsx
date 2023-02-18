// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/active.scss'
import Header from '../components/Header'
import Avartar from '../components/Avartar'
import Icon from '../components/Icon';
import Connected from './Connected'
import Send from './Send'
import Swap from './Swap'
import Deposit from './Deposit'
import Receive from './Receive'
import AccountDetails from './AccountDetails';
import useStore, {ellipsis, copyToClipboard, showAlert, toDate, roundNumber, initChainIcons, getChainIcon,  getTokenIcon} from '../useStore';
import { expandView } from '../../lib/chrome';
import {decrypt, encrypt, hash} from '../../lib/utils'
import { selectAccount } from '../../lib/api';
import { formatUnit } from '../../lib/bigmath';
import config from '../../config.json'

interface Status {
	openConnectSite: 	boolean
	openConnectModal:	boolean
	openSend: 			boolean
	openTransaction: 	boolean
	openSwap: 			boolean
	openDeposit: 		boolean
	openAccountDetails: boolean
	connected: 			boolean
	openAccount: 		boolean
	width:				number
	imported:			boolean
	removeAccountView:	boolean
	txs:				Transaction[]
	viewTxInfo:			Transaction | null
	walletPassword:		string
	url:				string
	tabId:				number
}

export default function () {
	const {currentAccount, accounts, apps, transactions,vault, currentNetwork, tokens, networks,setting,  update} = useStore()
	
	const [icons, setIcons] = React.useState<{[key:string]: string}>({});
	const [status, setStatus] = React.useState<Status>({ 
		openConnectSite: 	false,
		openConnectModal:	false,
		openSend: 			false,
		openTransaction: 	false,
		openSwap: 			false,
		openDeposit: 		false,
		openAccountDetails: false,
		connected: 			false,
		openAccount: 		false,
		width:				0,
		imported:			false,
		removeAccountView: 	false,
		txs:				[],
		viewTxInfo:			null,
		walletPassword:		"",
		url:				"",
		tabId:				0
	});
	const updateStatus = (params:{[key:string]:string|number|boolean|any}) => setStatus({...status, ...params});
	
	const removeAccount = async () => {
		let accs:AccountObject[] = [];
		Object.values(accounts).map((account) => {
			if(account.address !== currentAccount) {
				accs.push(account)
			}
		})
		let nextAccount = accounts[0].address; 
		if(status.walletPassword === "") return showAlert("Please enter wallet password", "warning");
		const passHash = hash(status.walletPassword);
		const plain = await decrypt(vault, passHash) || '';
		if (plain===null || plain==='') return showAlert("Incorrect wallet password", "warning");
		const wallet:WalletObject = JSON.parse(plain)
		let keys = wallet.keys;
		delete keys[currentAccount]
		const walletInfo = {
			"mnemonic": wallet.mnemonic,
			"keys": keys
		}
		const w = await encrypt(JSON.stringify(walletInfo), passHash) 
		if (w===null) return showAlert("browser crypto library is wrong", "warning")
		updateStatus({removeAccountView: false})
		update({currentAccount: nextAccount, accounts:accs, vault: w})	
	}

	const connectSite = (account: string) => {
		chrome.tabs.query({active: true, currentWindow: true},function(tabs){
			if (!chrome.runtime.lastError) {
				var url = new URL(tabs[0].url || '').origin;
				let app = {} as {[url:string]: string[]};
				apps && Object.entries(apps).map(([_url, _accounts]) => {
					if(_url !== url) {
						app[_url] = _accounts;
					}else {
						let acs = [account];
						Object.values(_accounts).map((value) => {
							if(value !== account) acs.push(value)
						})
						app[url] = acs
					}
				})
				if(!app[url]) app[url] = [account]
				selectAccount(tabs[0].id || 0, account);
				update({apps: app})
				updateStatus({connected: true, url});
			}
		});
	}

	const disconnectSite = (account: string) => {
		chrome.tabs.query({active: true, currentWindow: true},function(tabs){
			if (!chrome.runtime.lastError) {
				var url = new URL(tabs[0].url || '').origin;
				let app = {} as {[url:string]: string[]};
				apps && Object.entries(apps).map(([_url, _accounts]) => {
					if(_url !== url) {
						app[_url] = _accounts;
					}else {
						let acs = [] as string[];
						Object.values(_accounts).map((value) => {
							if(value !== account) acs.push(value)
						})
						app[url] = acs
					}
				})
				update({apps: app})
				updateStatus({connected: false, url});
				selectAccount(tabs[0].id || 0, apps[url][0])
			}
		});

	}

	const checkStatus = () => {
		const currentTxs = transactions[currentNetwork];
		let txs:Transaction[] = [];
		if(!currentTxs || Object.keys(currentTxs).length === 0) return;
		{Object.values(currentTxs).map((tx) => {
			if(tx.from.toLowerCase() === currentAccount.toLowerCase() || tx.to.toLowerCase() === currentAccount.toLowerCase() || tx.tokenAddress == "") {
				txs.push(tx)
			}
		})}  
		txs = txs.sort((a, b) => {return a.time>b.time? -1: 1})
		
		Object.values(accounts).map((account) => {
			if(account.address === currentAccount) {
				return updateStatus({imported:account.imported, width: window.innerWidth, txs: txs})		
			}
		})
		
		let imported = false;
		Object.values(accounts).map((account) => {
			if(account.address === currentAccount) {
				imported = account.imported;
			}
		})

		chrome.tabs.query({active: true, currentWindow: true},function(tabs){
			if (!chrome.runtime.lastError) {
				var url = new URL(tabs[0].url || '').origin;
				var tabId = tabs[0].id || 0;
				var connected = false;
				apps && Object.entries(apps).map(([_url, _accounts]) => {
					if(_url === url) {
						Object.values(_accounts).map((value) => {
							if(value == currentAccount) connected = true;
						})
					}
				})
				updateStatus({connected: connected, tabId, url, openConnectModal: !connected && apps[url] && Object.keys(apps[url]).length>0, imported:imported, width: window.innerWidth, txs})
			}
		})
	}

	const viewTransaction = (tx: Transaction) => {
		updateStatus({openTransaction: true, viewTxInfo: tx})
	}

	React.useEffect(() => {
		checkStatus()
		update({lastAccessTime: +new Date()})

		initChainIcons().then(()=>{
			const _icons = {} as {[key: string]: string}
			for (let k in networks) {
				const icon = getChainIcon(networks[k].chainId);
				if (icon) _icons[networks[k].chainId] = icon;
			}
			setIcons(_icons)
		});
	}, [])
	

	React.useEffect(() => {
		checkStatus()
	}, [currentAccount, currentNetwork, transactions])
	
	return (
		<div className='back-panel'>
			<div className='container inner-panel' style={{padding: '0'}}>
				<div style={{margin:'1em 0.5em'}}>
					<Header />
				</div>
				
				<div className="justify" style={{margin:'0 0.5em'}}>
					{
						window.innerWidth < 365 ? 
						<p className='connect-btn flex middle' onClick={() => {updateStatus({openConnectModal: true}); }}>
							{
								status.connected ? <div style={{color: 'var(--color-pink)'}}><Icon icon="Dot" height={20}/> </div>: <Icon icon="Dot" height={20}/>
							}
							{
								status.connected ? "Connected" : "Not connected"
							}
						</p>
						:
						<p style={{width:'100px'}}></p>
					}
					
					<div className='text-center' style={{marginRight:'5em'}}>
						<h5 className='mb0 mt0'>
							   {Object.values(accounts).map((account) => {
									if(account.address === currentAccount) {
										return ellipsis(account.label, 15)
									}
							   })}  
						</h5>
						<div className="justify">
							<p className='t0 mr1'>{ellipsis(currentAccount)}</p>
							<span className='pointer' onClick={() => {copyToClipboard(currentAccount)}}><Icon icon="Copy" size={15}/></span>
						</div>
					</div>
					<div className='pointer'  onClick={() => {updateStatus({openAccount: !status.openAccount})}}>
						<Icon icon="Menu" />
					</div>
				</div>
				<div className="hr mt1 yellow"></div>
				<div className="text-center	">
					<>
						{Object.values(networks).map((network) => {
							if(network.chainKey === currentNetwork)  return <>
								{
									icons[network.chainId] ? <div style={{width:'38px', margin:'1em auto'}}><img src={icons[network.chainId]} width={38} height={38} alt={network.label} style={{borderRadius:'50%', marginRight:'0.5em',}}/> </div>: 
									<div style={{width:'34px', margin:'1em auto'}}>
										<div className={`avartar`}>
											<Avartar address={currentNetwork} type={setting.identicon === 'jazzicons'? 1: 2}/>
										</div>
									</div>
								}
							</>
						})}
					</>

					<h3 className='text-yellow m0'>
						{Object.values(accounts).map((account) => {
							if(account.address === currentAccount) {
								return roundNumber(formatUnit(account.value[currentNetwork]  || "0", 18), 8)
						}})}  
						{
							 Object.values(networks).map((network) => {
								if( network.chainKey === currentNetwork){
									return " " + network.symbol
							}})
						}
					</h3>
					<p className='t0'>
					</p>
					<div className="row center m0">
						<div className='text-center' style={{opacity:'0.5'}}>
							<div className='wallet-btn disabled'>
								<Icon icon="Deposit" />
							</div>
							<p>Buy</p>
						</div>
						<div className='text-center'>
							<div className='wallet-btn disabled' onClick={() => {updateStatus({openSend: true, openAccount: false})}}>
								<Icon icon="Send"/>
							</div>
							<p>Send</p>
						</div>
						<a className='text-center' href={config.links.swapLink} target={"_blank"}>
							<div className='wallet-btn disabled' >
								<Icon icon="Swap" />
							</div>
							<p>Swap</p>
						</a>
					</div>
				</div>
				<div className="justify">
					<Link className="col-6 pointer m0 pl0" to="/assets">
						<p className='text-center t0 text-dark'>// ASSETS</p>
						<div className="hr "></div>
					</Link >
					<Link className="col-6 pointer m0 pr0" to="/active">
						<p className='text-center t0'><b className='text-pink'>//</b> ACTIVITY</p>
						<div className="hr active"></div>
					</Link>	
				</div>

				<div className="active-panel">
					<>
						{status.txs.length === 0 &&<p className='text-center'>You have no transactions</p>}
						{	
							status.txs.length > 0 && status.txs.map((tx, index) => {
								return <div className="active-row block" onClick={() => {viewTransaction(tx)}}>
									<div className="justify middle">
										<div className="token-icon">
											{
												tx?.method && tx.method !== null && tx.method !== ""  ?  <Icon icon="Swap" size={15} margin={30}/> : (tx.from.toLowerCase() === currentAccount.toLowerCase() ? <Icon icon="Send" size={15} margin={30}/> : <Icon icon="Receive" margin={30} size={20}/>)
											}
										</div>
										<div>
											<p className='m0 t0'>
												{
													tx?.method && tx.method !== null && tx.method !== ""  ? "Contract Transaction" : ((tx?.from  || '')=== currentAccount.toLowerCase() ? 'SEND' : 'RECEIVE')
												}
											</p>
											<p className='t-small m0 t0'><b className='text-pink'>{tx.status === "confirmed" ? toDate(tx.time || 0) : tx.status} </b> 
												<b> / </b> 
												{tx.from === currentAccount.toLowerCase() ? 'To ' + ellipsis(tx.to, 6) : 'From ' + ellipsis(tx.from, 6)}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className='m0'>{`${tx.from === currentAccount.toLowerCase() ? '-' : ''} ${roundNumber(formatUnit(tx.amount, Number(tx.decimals)))} ${tx.symbol}`} </p>
									</div>
								</div>
							}
							)
						}

						<div className="text-center" style={{marginTop: '2em'}}>
							<p className='t0'>
								Need help? Contact
							</p>
							<a className='pointer text-yellow' href={config.links.support} target={"_blank"}>
								Neon Wallet Support
							</a>
						</div>
					</>
				</div>

				{
					status.openConnectModal && (
						<>
							<div className="confirm-panel">
								<div className="header" style={{padding:'1em'}}>
									<h4 className='m0'>{status.url}</h4>
									<span style={{position:'absolute', top:'10px', right:'10px'}} onClick={()=>{updateStatus({openConnectModal: false})}}>
										<div className="justify">
											<Icon icon="Close" size={12} fill="var(--color-pink)"/>
										</div>
									</span>
								</div>
								<div className="content" style={{height:'240px'}}>
									{
										apps[status.url]  && <div>
											<div className="hr"></div>	
											<div className="justify middle" style={{border:'1px solid red'}}>
												<div className="flex middle">
													<div className={`avartar`}>
														<Avartar address={currentAccount} type={setting.identicon === 'jazzicons'? 1: 2}/>
													</div>
													<div style={{textAlign:'left', marginLeft:'1em'}}>
														<p className='m0'>{ellipsis(currentAccount, 12)}{status.connected ? <span className='t-small'>(Active)</span>:<span className='t-small'>(Not connected)</span>}</p>
														{!status.connected && <p className='m0 mt1 text-yellow pointer t-small' onClick={() => {connectSite(currentAccount)}}>Connect</p>}
													</div>
												</div>
												{
													status.connected && 
													<span className='pointer' onClick={() => {disconnectSite(currentAccount)}}>
														<Icon icon='Menu' />
													</span>
												}
											</div>
										</div>
									}
									{
										!apps[status.url] && <div>
											<div className="hr"></div>
											<p>Neon Wallet is not connected to this site. To connect to a web3 site, find and click the connect button.</p>
										</div>
									}
									{
										apps[status.url]  && Object.entries(apps[status.url]).map(([_index, _account]) => {
											if(_account !== currentAccount) {
												return <div>
													<div className="hr"></div>	
													<div className="justify middle">
														<div className="flex middle">
															<div className={`avartar`}>
																<Avartar address={_account} type={setting.identicon === 'jazzicons'? 1: 2}/>
															</div>
															<div style={{textAlign:'left', marginLeft:'1em'}}>
																<p className='m0'>{ellipsis(_account, 12)} {_account === currentAccount ? " (Active)":""}</p>
																{_account !== currentAccount && <p className='m0 mt1 text-yellow pointer t-small' onClick={() => {update({currentAccount: _account}); selectAccount(status.tabId, _account)}}>Switch to this account</p>}
															</div>
														</div>
														<span className='pointer' onClick={() => {disconnectSite(_account)}}>
															<Icon icon='Menu' />
														</span>
													</div>
												</div>
											}
										})
									}
								</div>
							</div>
							<div style={{width:'100%', height:'100%', position:'fixed', left:'0', top:'0', backgroundColor:'rgba(0,0,0,0)'}} onClick={() => {updateStatus({removeAccountView: false})}}></div>
						</>
					)
				}
				{status.removeAccountView && 
					(
						<>
							<div className="confirm-panel">
								<div className="header" >
									<h4 className='m0'>RemoveAccount</h4>
								</div>
								<div className="content">
									<div className="flex center middle">
										<p className='t0 mr1'>{ellipsis(currentAccount, 20)}</p>
										<span className='pointer' onClick={() => {copyToClipboard(currentAccount)}}><Icon icon="Copy" size={15}/></span>
									</div>
									<p>Do you want to remove this account?</p>
									<input type={"password"}  placeholder="wallet password" value={status.walletPassword} onChange = {(e) => {updateStatus({walletPassword: e.target.value})}}/>
									<div className="justify justify-around mt1">
									<button className="btn-cancel  mt1" style={{width:'100px'}} onClick = {() => {updateStatus({removeAccountView: false})}}>
										NO
									</button>
									<button className="btn-special  mt1" style={{width:'100px'}} onClick = {() => {removeAccount()}}>
										YES
									</button>
									</div>
								</div>
							</div>
							<div style={{width:'100%', height:'100%', position:'fixed', left:'0', top:'0', backgroundColor:'rgba(0,0,0,0)'}} onClick={() => {updateStatus({removeAccountView: false})}}></div>
						</>
					)
				}
				{status.openAccount && 
					(
						<>
							<div className="account-panel" onBlur={(e)=> {updateStatus({openAccount: false}); }}>
								<div className="header" >
									{Object.values(networks).map((network) => {
										if( network.chainKey === currentNetwork){
											return <>
												<a className="menu-list" href={network.url + "address/"+currentAccount} target="_blank">
													<Icon icon="View" size={16} fill="white"/>
													<p>View Account on explorer</p>
												</a>
											</>
										}	
										})
									}
								</div>
								<div className="content">
									{
										window.innerWidth < 370  && <div className="menu-list" onClick={() => {expandView()}}>
											<Icon icon="Expand" size={16} fill="white"/>
											<p>Expand view</p>
										</div>
									}
									<div className="menu-list " onClick={()=> {updateStatus({openAccountDetails: true, openAccount: false})}}>
										<Icon icon="Details" size={16} fill="white"/>
										<p>Account Details</p>
									</div>
									<div className="menu-list " onClick={()=> {updateStatus({openConnectSite: true, openAccount: false})}}>
										<Icon icon="Connected" size={16} fill="white"/>
										<p>Connected sites</p>
									</div>
									{
										status.imported && 
										<div className="menu-list " onClick={()=> {updateStatus({removeAccountView: true, openAccount: false})}}>
											<Icon icon="Remove" size={16} fill="white"/>
											<p>Remove Account</p>
										</div>
									}
								</div>
							</div>
							<div style={{width:'100%', height:'100%', position:'fixed', left:'0', top:'0', backgroundColor:'rgba(0,0,0,0)'}} onClick={() => {updateStatus({openAccount: false})}}></div>
						</>
					)
				}
				
				{
					status.openAccountDetails && (
						<AccountDetails onClose={()=>{updateStatus({openAccountDetails: false, openAccount: false})}}/>
					)
				}
				{
					status.openConnectSite && (
						<Connected onClose={()=>{updateStatus({openConnectSite: false})}}/>
					)
				}
				{
					status.openSend && (
						<Send onClose={()=>{updateStatus({openSend: false})}}/>
					)
				}
				{
					status.openSwap && (
						<Swap onClose={()=>{updateStatus({openSwap: false})}}/>
					)
				}
				{
					status.openDeposit && (
						<Deposit onClose={()=>{updateStatus({openDeposit: false})}}/>
					)
				}
				{
					status.openTransaction && (
						<Receive tx = {status.viewTxInfo} onClose={()=>{updateStatus({openTransaction: false})}}/>
					)
				}
			</div>
		</div>
	);
}
