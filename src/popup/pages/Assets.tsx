// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/assets.scss'
import Header from '../components/Header'
import Icon from '../components/Icon';
import Avartar from '../components/Avartar'
import Connected from './Connected'
import Deposit from './Deposit'
import Send from './Send'
import Swap from './Swap'
import useStore, {ellipsis, copyToClipboard, showAlert, roundNumber, initChainIcons, getChainIcon, initTokenIcons, getTokenIcon} from '../useStore';
import { expandView } from '../../lib/chrome';
import AccountDetails from './AccountDetails';
import {decrypt, encrypt, hash} from '../../lib/utils'
import { formatUnit } from '../../lib/bigmath';
import { selectAccount } from '../../lib/api';
import config from '../../config.json'

interface AssetsStatus {
	openConnectSite: boolean
	openConnectModal:	boolean
	openSend: boolean
	openSwap: boolean
	openAccount: boolean
	openDeposit: boolean
	openAccountDetails: boolean
	connected: boolean
	selectedToken: string | null
	width:		number
	imported:			boolean
	removeAccountView:	boolean
	walletPassword:		string
	url:				string
	tabId:				number
	chainId:			number
}

export default function () {
	const {currentAccount, accounts,apps, setting,  tokens,vault, currentNetwork, networks, update} = useStore()
	
	const [icons, setIcons] = React.useState<{[key:string]: string}>({});
	const [tokenIcons, setTokenIcons] = React.useState<{[key:string]: string}>({});
	const [status, setStatus] = React.useState<AssetsStatus>({ 
		openConnectSite: 	false,
		openSend: 			false,
		openConnectModal:	false,
		openSwap: 			false,
		openAccount: 		false,
		openAccountDetails: false,
		openDeposit: 		false,
		connected: 			false,
		selectedToken: 		'',
		width:				0,
		imported:			false,
		removeAccountView: 	false,
		walletPassword:		"",
		url:				"",
		tabId:				0,
		chainId:			1
	});
	const updateStatus = (params:{[key:string]:string|number|boolean}) => setStatus({...status, ...params});

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
		let imported = false;
		Object.values(accounts).map((account) => {
			if(account.address === currentAccount) {
				imported = account.imported;
			}
		})

		chrome.tabs.query({active: true, currentWindow: true},function(tabs){
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
			updateStatus({connected: connected, tabId, url, openConnectModal: !connected && apps[url] && Object.keys(apps[url]).length>0, imported:imported, width: window.innerWidth})
		});
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
		
		initTokenIcons(status.chainId).then(()=>{
			const _icons = {} as {[key: string]: string}
			if(currentNetwork === "neon") {
				tokens && tokens[currentNetwork] && Object.entries(tokens[currentNetwork]).map(([key, value]) => {			
					Object.values(accounts).map(async  (account) => {	
						if(account.address === currentAccount && account.tokens[currentNetwork] && account.tokens[currentNetwork][key]) {
							const icon = await getTokenIcon(status.chainId, key);
							if (icon) _icons[key] = icon;
						}
					})
				})
			}
			setTokenIcons(_icons)
		});
	}, [])


	

	React.useEffect(() => {
		checkStatus()
	}, [currentAccount])
	
	React.useEffect(() => {
		Object.values(networks).map((network: NetworkObject) => {
			if(network.chainKey == currentNetwork) {
				updateStatus({chainId: network.chainId})
			}
		})
	}, [currentNetwork])


	return (
		<div className='back-panel'>
			<div className='container inner-panel' style={{padding:'0'}}>
				<div style={{margin:'1em 0.5em'}}>
					<Header />
				</div>
				<div className="justify" style={{margin:'0 0.5em'}}>
					{
						window.innerWidth < 365 ? 
						<p className='connect-btn flex middle' onClick={() => {updateStatus({openConnectModal: true})}}>
							{
								status.connected ? <div style={{color: 'var(--color-pink)'}}><Icon icon="Dot" height={20}/> </div>: <Icon icon="Dot" height={20}/>
							}
							{
								status.connected ?  "Connected" : "Not connected"	
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
						{networks && Object.values(networks).map((network) => {
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
						{accounts && Object.values(accounts).map((account) => {
							if(account.address === currentAccount) {
								return roundNumber(formatUnit(account.value[currentNetwork]  || "0", 18), 8)
						}})}  
						{
							 networks && Object.values(networks).map((network) => {
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
						<p className='text-center t0'><b className='text-pink'>//</b> ASSETS</p>
						<div className="hr active "></div>
					</Link>
					<Link className="col-6 pointer m0 pr0" to="/active">
						<p className='text-center t0 text-dark'>//  ACTIVITY</p>
						<div className="hr "></div>
					</Link>	
				</div>
				<div className="assets-panel">
					<>
						<Link className="assets-row" to={"/token/0x0000000000000000000000000000000000000000"}>
							<div className="justify middle">
							<>
								{networks && Object.values(networks).map((network) => {
									if(network.chainKey === currentNetwork)  return <>
										{
											icons[network.chainId] ? <img src={icons[network.chainId]} width={28} height={28} alt={network.label} style={{borderRadius:'50%', marginRight:'0.5em',}}/> : 
											<div className={`avartar`} style={{marginRight:'10px'}}>
												<Avartar address={currentNetwork} type={setting.identicon === 'jazzicons'? 1: 2}/>
											</div>
										}
									</>
								})}
							</>
								<div>
									<p className='m0'> { 
										accounts && Object.values(accounts).map((account) => {
											if(account.address === currentAccount) {											
												return roundNumber(formatUnit(account.value[currentNetwork]  || "0", 18), 8)
											}}
										)}
										{
											networks && Object.values(networks).map((network) => {
												if( network.chainKey === currentNetwork){
													return " " + network.symbol
											}})
										}
										</p>
								</div>
							</div>
							<Icon icon="ArrowRight" /> 
						</Link>
						{(!tokens[currentNetwork]) &&<p className='text-center'>You have no assets</p>}
						{tokens[currentNetwork] && Object.entries(tokens[currentNetwork]).map(([key, value]) => {
							const v= Object.values(accounts).map((account) => {	
								if(account.address === currentAccount && account.tokens[currentNetwork] && account.tokens[currentNetwork][key]) {
									return 	<Link className="assets-row" to={`/token/${key}`}>
												<div className="justify middle">
													{
														currentNetwork === "neon" && tokenIcons[key] ? <img src={tokenIcons[key]} width={28} height={28} style={{borderRadius:'50%', marginRight:'0.5em',}}/> :
														<div className={`avartar`} style={{marginRight:'10px'}}>
															<Avartar address={key} type={setting.identicon === 'jazzicons'? 1: 2}/>
														</div>
													}
													<div>
														<p className='m0'> { roundNumber(formatUnit(account.tokens[currentNetwork][key].toString(), Number(value.decimals)))  +" " + value.symbol}  </p>
													</div>
												</div>
												<Icon icon="ArrowRight" /> 
											</Link>
								}
							})
							if(v) {
								return v
							}
						})}
						<div className="text-center">
							<p>Don't see your token?</p>
							<Link className='pointer text-yellow' to="/importtoken">
								Import tokens
							</Link>
						</div>
					</>
				</div>
				
				{
					status.openConnectModal && (
						<>
							<div className="confirm-panel">
								<div className="header" style={{padding:'1em'}}>
									<h4 className='m0'>{ellipsis(status.url, 30)}</h4>
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
									<h4 className='m0'>Remove Account</h4>
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
							<div className="account-panel">
								<div className="header" >
									{networks && Object.values(networks).map((network) => {
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
										window.innerWidth <370 && <div className="menu-list" onClick={() => {expandView()}}>
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
					status.openConnectSite && (
						<Connected onClose={()=>{updateStatus({openConnectSite: false, openAccount: false})}}/>
					)
				}
				{
					status.openAccountDetails && (
						<AccountDetails onClose={()=>{updateStatus({openAccountDetails: false, openAccount: false})}}/>
					)
				}
				{
					status.openSend && (
						<Send tokenAddress={status.selectedToken} onClose={()=>{updateStatus({openSend: false, openAccount: false})}}/>
					)
				}
				{
					status.openDeposit && (
						<Deposit onClose={()=>{updateStatus({openDeposit: false, openAccount: false})}}/>
					)
				}
				{
					status.openSwap && (
						<Swap onClose={()=>{updateStatus({openSwap: false, openAccount: false})}}/>
					)
				}
			</div>
		</div>
	);
}
