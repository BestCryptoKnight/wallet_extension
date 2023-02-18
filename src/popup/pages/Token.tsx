// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import Header from '../components/Header'
import Icon from '../components/Icon';
import Avartar from '../components/Avartar';
import { Link, useHistory } from 'react-router-dom';
import Send from './Send'
import Swap from './Swap'
import Deposit from './Deposit'
import Receive from './Receive'
import '../assets/css/active.scss'
import { expandView } from '../../lib/chrome';
import AccountDetails from './AccountDetails';
import useStore, {ellipsis,  copyToClipboard,  toDate, roundNumber, initChainIcons, getChainIcon, initTokenIcons, getTokenIcon} from '../useStore';
import { ZeroAddress } from '../../lib/wallet';
import { formatUnit } from '../../lib/bigmath';
import config from '../../config.json'

interface Status {
	openHideToken:	boolean
	openSend:			boolean
	openTransaction:	boolean
	openSwap:			boolean
	openDeposit:		boolean
	connected:			boolean
	openAccount:		boolean
	openAccountDetails:	boolean
	balance:			string
	symbol:				string
	decimals:			string
	tokenAddress:		string	
	imported:	boolean
	openTokenDetails: boolean	
	txs:				Transaction[]
	viewTxInfo:			Transaction | null
	loading:			boolean
}

export default function () {	
	
	const [icons, setIcons] = React.useState<{[key:string]: string}>({});
	const [tokenIcons, setTokenIcons] = React.useState<{[key:string]: string}>({});

	const [status, setStatus] = React.useState<Status>({ 
		openHideToken:		false,
		openSend:			false,
		openTransaction:	false,
		openSwap:			false,
		openDeposit:		false,
		connected:			false,
		openAccount:		false,
		openAccountDetails:	false,
		balance:			'0',
		symbol:				'',
		decimals:			'18',
		tokenAddress:		'',
		imported:			false,
		openTokenDetails:	false,
		txs:				[],
		viewTxInfo:			null,
		loading:			false
	});
	const history = useHistory();
	const updateStatus = (params:{[key:string]:string|number|boolean|any}) => setStatus({...status, ...params});
	
	const {currentAccount, accounts,  tokens, setting, transactions, currentNetwork, networks, update} = useStore()

	React.useEffect(() => {
		Object.values(accounts).map((account) => {
			if(account.address === currentAccount) {
				return updateStatus({imported:account.imported, width: window.innerWidth})		
			}
		})
	}, [currentAccount])
	
	const removeToken = async () => {
		let accs:AccountObject[] = [];
		Object.values(accounts).map((account) => {
			if(account.address !== currentAccount) {
				accs.push(account)
			}
			else {
				var tokens:{[chainKey:string]: {[token: string]: string}} = {};
				if(account.tokens) Object.entries(account.tokens).map(([key, chainToken]) => {
					if(key !== currentNetwork) tokens[key] = chainToken;
					else {
						let newToken:{[token: string]: string} = {};
						if(chainToken) Object.entries(chainToken).map(([tk, tn])=> {
							if(tk !== status.tokenAddress) newToken[tk] = tn;
						})
						tokens[key] = newToken;
					}
				})
				let newAccount:AccountObject = {
					"address": account.address,
					"imported": account.imported,
					"index": account.index,
					"label": account.label,
					"value":account.value,
					"tokens": tokens
				};
				accs.push(newAccount)
			}
		})
		update({accounts:accs})	
		updateStatus({openHideToken: false})
		history.push("/assets")
	}

	React.useEffect(() => {
		checkTokenStatus()
		update({lastAccessTime: +new Date()})

		initChainIcons().then(()=>{
			const _icons = {} as {[key: string]: string}
			for (let k in networks) {
				const icon = getChainIcon(networks[k].chainId);
				if (icon) _icons[networks[k].chainId] = icon;
			}
			setIcons(_icons)
		});
		
		
		Object.values(networks).map((network: NetworkObject) => {
			if(network.chainKey == currentNetwork) {
				initTokenIcons(network.chainId || 1).then(()=>{
					const _icons = {} as {[key: string]: string}
					if(currentNetwork === "neon") {
						if(tokens[currentNetwork]) Object.entries(tokens[currentNetwork]).map(([key, value]) => {			
							Object.values(accounts).map( async(account) => {	
								if(account.address === currentAccount && account.tokens[currentNetwork] && account.tokens[currentNetwork][key]) {
									const icon = await getTokenIcon(network.chainId, key);
									if (icon) _icons[key] = icon;
								}
							})
						})
					}
					setTokenIcons(_icons)
				});
			}
		})

	}, [])

	React.useEffect(() => {
		checkTokenStatus()
	}, [currentAccount, currentNetwork, transactions])

	const checkTokenStatus = () => {
		const address = window.location.pathname.split("/")[2];
		let symbol = '';
		let balance = '';
		let decimals = '18';
		updateStatus({loading: true})
		if(address === ZeroAddress) {
			Object.values(accounts).map((account) => {
				if(account.address === currentAccount) {
					balance = account.value[currentNetwork] || '0'		
				}
			})
			Object.values(networks).map((network) => {
				if( network.chainKey === currentNetwork){
					symbol =  network.symbol
					decimals = '18';
			}})
		}
		else {
			Object.values(accounts).map((account) => {
				if(account.address === currentAccount && account.tokens[currentNetwork] && account.tokens[currentNetwork][address]) {
					balance = account.tokens[currentNetwork][address].toString()  || '0'		
				}
			})	
			tokens[currentNetwork] && Object.entries(tokens[currentNetwork]).map(([key, value]) => 
			{
				if(key === address) {
					symbol = value.symbol
					decimals = value.decimals
				}
			})
		}
		const currentTxs = transactions[currentNetwork];
		let txs:Transaction[] = [];
		if(!currentTxs || Object.keys(currentTxs).length === 0) return updateStatus({symbol, tokenAddress: address, balance, loading: false});
		{Object.values(currentTxs).map((tx) => {
			if(tx.tokenAddress == address && (tx.from.toLowerCase() === currentAccount.toLowerCase() || tx.to.toLowerCase() === currentAccount.toLowerCase())) {
				txs.push(tx)
			}
		})}  
		txs = txs.sort((a, b) => {return a.time>b.time? -1: 1})
		updateStatus({txs: txs, symbol, tokenAddress: address, balance, loading: false})
	}
	

	const viewTransaction = (tx: Transaction) => {
		updateStatus({openTransaction: true, viewTxInfo: tx})
	}

	return (
		<div className='back-panel'>
			<div className='container inner-panel' style={{padding: '0'}}>
				<div style={{margin:'1em 0.5em'}}>
					<Header />
				</div>
				<div className="justify" style={{margin:'1em 0.5em'}}>
					<Link className='flex middle' to="/assets">
						<Icon icon="ArrowLeft" margin={10} size={20}/>
						<p>
							{Object.values(accounts).map((account) => {
								if(account.address === currentAccount) {
									return  ellipsis(account.label, 15) + " / "
								}
							})}  
						</p>
						<p className='text-yellow'>
							{
								status.symbol
							}
						</p>
					</Link>
					<div className='pointer'  onClick={() => {updateStatus({openAccount: !status.openAccount})}}>
						<Icon icon="Menu"/>
					</div>
				</div>
				<div className="hr mt1 yellow"></div>
				<div className="text-center	">		
					{
						status.tokenAddress !== ZeroAddress && <>
							{
								currentNetwork === "neon" ? (tokenIcons[status.tokenAddress] ?  
									<div style={{width:'34px', margin:'1em auto'}}>
										<img src={tokenIcons[status.tokenAddress]} width={28} height={28} style={{borderRadius:'50%', marginRight:'0.5em',}}/>
									</div>
									:
									<div style={{width:'34px', margin:'1em auto'}}>
										<div className={`avartar`}>
											<Avartar address={status.tokenAddress} type={setting.identicon === 'jazzicons'? 1: 2}/>
										</div>
									</div>
								) :
								(<div style={{width:'34px', margin:'1em auto'}}>
										<div className={`avartar`}>
											<Avartar address={status.tokenAddress} type={setting.identicon === 'jazzicons'? 1: 2}/>
										</div>
								</div>)
							}
						</>
					}

					{
						status.tokenAddress === ZeroAddress && Object.values(networks).map((network) => {
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
						})
					}

					<h3 className='text-yellow m0'>
						{roundNumber(formatUnit(status.balance || '0', 18), 8)}   {status.symbol}
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
				<div className="hr mt1"></div>
				<div className="active-panel">
					{(!status.txs || status.txs === null || Object.keys(status.txs).length === 0) &&<p className='text-center'>You have no transactions</p>}
					{	
						status.txs.length > 0 && status.txs.map((tx, index) => 
							{
								return <div className="active-row block" onClick={() => {viewTransaction(tx)}}>
											<div className="justify middle">
												<div className="token-icon">
													{
														tx?.method && tx.method !== null && tx.method !== ""  ?  <Icon icon="Swap" size={15} margin={30}/> : (tx.from === currentAccount.toLowerCase() ? <Icon icon="Send" size={15} margin={30}/> : <Icon icon="Receive" margin={30} size={20}/>)
													}
												</div>
												<div>
													<p className='m0 t0'>
														{
															tx?.method && tx.method !== null && tx.method !== ""  ? "Contract Transaction" : ((tx?.from  || '')=== currentAccount.toLowerCase() ? 'SEND' : 'RECEIVE')
														}
													</p>
													<p className='t-small m0 t0'><b className='text-pink'>{tx.status === "confirmed" ? toDate(Number(tx.time)) : tx.status} </b> 
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
				</div>
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
				
				{status.openTokenDetails && 
					(
						<>
							<div className="confirm-panel" style={{height:'500px',width: '350px'}}>
								<div className="header" >
									<h4 className='m1'>Token Details</h4>
								</div>
								<div className="content" style={{textAlign:'left', padding:'1em'}}>
									<div className="justify middle">
										<p>Balance</p>
										<b className='t0 m0 mr1 mb1'>{roundNumber(formatUnit(status.balance, Number(status.decimals || 18)))}</b>
									</div>
									<div className="hr mt1 mb1"></div>
									<p className='m0'>Token Contract Address</p>
									<div className="justify">
										<p className="m0">{ellipsis(status.tokenAddress, 16)}</p>
										<span className='pointer'  onClick={() => {copyToClipboard(status.tokenAddress)}}><Icon icon ="Copy" /></span>
									</div>
									<div className="hr mt1 mb1"></div>
									<p className='m0'>Token Decimals</p>
									<b className='m0' >{status.decimals}</b>
									<div className="hr mt1 mb1"></div>
									<p className='m0'>Token Symbol</p>
									<b className='m0'>{status.symbol}</b>
									<div className="hr mt1 mb1"></div>
									<div className="flex  center">
										<button className="btn-cancel  mt1" style={{width:'100px'}} onClick = {() => {updateStatus({openTokenDetails: false})}}>
											CLOSE
										</button>
									</div>
								</div>
							</div>
							<div style={{width:'100%', height:'100%', position:'fixed', left:'0', top:'0', backgroundColor:'rgba(0,0,0,0)'}} onClick={() => {updateStatus({openTokenDetails: false})}}></div>
						</>
					)
				}
				{status.openHideToken && 
					(
						<>
							<div className="confirm-panel">
								<div className="header" >
									<h4 className='m0'>Hide Token</h4>
								</div>
								<div className="content">
									<div className="flex center middle">
										<p className='t0 mr1'>{status.symbol}</p>
										<span className='pointer flex middle' onClick={() => {copyToClipboard(status.tokenAddress)}}>{ellipsis(status.tokenAddress, 12)} <Icon icon="Copy" size={15} marginLeft = {20}/></span>
									</div>
									<p>Do you want to hide this token?</p>
									<div className="justify justify-around">
									<button className="btn-cancel  mt1" style={{width:'100px'}} onClick = {() => {updateStatus({openHideToken: false})}}>
										NO
									</button>
									<button className="btn-special  mt1" style={{width:'100px'}} onClick = {() => {removeToken()}}>
										YES
									</button>
									</div>
								</div>
							</div>
							<div style={{width:'100%', height:'100%', position:'fixed', left:'0', top:'0', backgroundColor:'rgba(0,0,0,0)'}} onClick={() => {updateStatus({openTokenDetails: false})}}></div>
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
										window.innerWidth < 370 && <div className="menu-list" onClick={() => {expandView()}}>
											<Icon icon="Expand" size={16} fill="white"/>
											<p>Expand view</p>
										</div>
									}
									<div className="menu-list " onClick={()=> {updateStatus({openAccountDetails: true, openAccount: false})}}>
										<Icon icon="Details" size={16} fill="white"/>
										<p>Account Details</p>
									</div>
									{
										status.tokenAddress !== ZeroAddress && 
										<>
											<div className="menu-list" onClick={()=> {updateStatus({openHideToken: true, openAccount: false})}}>
												<Icon icon="Remove" size={16} fill="white"/>
												<p>Hide {status.symbol}</p>
											</div>
											<div className="menu-list " onClick={()=> {updateStatus({openTokenDetails: true, openAccount: false})}}>
												<Icon icon="Details" size={16} fill="white"/>
												<p>Token details</p>
											</div>
										</>
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
			</div>
		</div>
	);
}
