// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import {useHistory} from 'react-router-dom'
import Header from '../components/Header'
import Icon from '../components/Icon';
import { Link } from 'react-router-dom';
import '../assets/css/importtoken.scss'
import {isValidAddress} from 'ethereumjs-util';
import useStore, { showAlert } from '../useStore';
import {checkContract} from '../../lib/wallet'

interface ImportStatus {
	tabSelect:		number
	inputAddress1:	string
	tokenDecimal1:	string
	tokenSymbol1:	string
	inputAddress2:	string
	tokenDecimal2:	string
	tokenSymbol2:	string
	tokenName1:		string
	tokenName2:		string
	disable1:		boolean
	disable2:		boolean
	loading:		boolean
}

const ImportToken = () => {
	const [status, setStatus] = React.useState<ImportStatus>({ 
		tabSelect:	1,
		inputAddress1:	'',
		tokenDecimal1:		'',
		tokenSymbol1:	'',
		inputAddress2:	'',
		tokenDecimal2:		'',
		tokenSymbol2:	'',
		tokenName1:		'',
		tokenName2:		'',
		disable1:		true,
		disable2:		true,
		loading:		false
	});
	const history = useHistory();
	const updateStatus = (params:Partial<ImportStatus>) => setStatus({...status, ...params});
	const {currentAccount, currentNetwork, networks, accounts, tokens,  update} = useStore()

	const getContractInfo = async (address: string) :  Promise<Partial<TokenInterface> | null>=> (
		new Promise(async response => {
			let rpc = null;
			networks && Object.values(networks).map((network) => {
				if( network.chainKey === currentNetwork){
					rpc = network.rpc;
				}
			})
			if(rpc !== null) {
				const info = await checkContract(rpc, address)
				if(info != null) {
					const name = info.name
					const contractAddress = info.address
					const decimals = info.decimals;
					const symbol = info.symbol;
					return response({name, decimals, symbol, address:contractAddress})	
				}
			}
			return response(null)
		})
	);

	const checkToken = async (address: string) => {
		if(!isValidAddress(address)) {
			if(status.tabSelect===1) updateStatus({inputAddress1: address, tokenSymbol1: '', tokenName1:'', tokenDecimal1: '', disable1: true})
			else  updateStatus({inputAddress2: address, tokenSymbol2: '', tokenDecimal2: '', tokenName2:'', disable2: true});
			return;
		}
		if(status.tabSelect === 1)  updateStatus({inputAddress1: address, loading: true})
		if(status.tabSelect === 2)  updateStatus({inputAddress2: address, loading: true})
		const info  = await getContractInfo(address);
		if(info !== null) {
			if(status.tabSelect === 1) return updateStatus({inputAddress1: address, tokenName1:info.name, tokenSymbol1: info.symbol, tokenDecimal1: info.decimals?.toString(), disable1: false, loading: false})
			if(status.tabSelect === 2) return updateStatus({inputAddress2: address, tokenName2:info.name, tokenSymbol2: info.symbol, tokenDecimal2: info.decimals?.toString(), disable2: false, loading: false})
		}
		else {
			if(status.tabSelect === 1) return updateStatus({inputAddress1: address, tokenName1:'', tokenSymbol1: '', tokenDecimal1: '', disable1: true, loading: false})
			if(status.tabSelect === 2) return updateStatus({inputAddress2: address, tokenName2:'', tokenSymbol2: '', tokenDecimal2: '', disable2: true, loading: false})
		}
	}

	const addToken = () => {
		const address= status.tabSelect === 1 ? status.inputAddress1 : status.inputAddress2;
		const name= status.tabSelect === 1 ? status.tokenName1 : status.tokenName2;
		const symbol= status.tabSelect === 1 ? status.tokenSymbol1 : status.tokenSymbol2;
		const decimals= status.tabSelect === 1 ? status.tokenDecimal1 : status.tokenDecimal2

		var accs:AccountObject[] = [];
		
		
		accounts && Object.values(accounts).map((account: AccountObject) => {
			if(account.address.toLowerCase() !== currentAccount.toLowerCase()) accs.push(account)
			else {
				let tks:{[tkey:string] :string} = {};
				account.tokens[currentNetwork] && Object.entries(account.tokens[currentNetwork]).map(([tkey, tvalue]) => {
					tks[tkey] = tvalue;
				})
				if(account.address === currentAccount) {
					tks[address] = "0";
				}
				let newAccount:AccountObject = {
					"address": account.address,
					"imported": account.imported,
					"index": account.index,
					"label": account.label,
					"value": account.value,
					"tokens": {...account.tokens, [currentNetwork]: tks}
				}
				accs.push(newAccount)
			}
		})

		let newTokens:{[chainKey: string]: {[token: string]: TokenInfoObject}}  = {}
		if(tokens && Object.keys(tokens).length> 0) {
			let flag = false;
			tokens && Object.entries(tokens).map(([chainKey, tks]) => {
				if(chainKey !== currentNetwork) newTokens[chainKey] = tks;
				else {
					let newTks:{[token: string]: TokenInfoObject} = {};
					tks && Object.entries(tks).map(([adr, info]) => {
						newTks[adr] = info;
					})
					newTks[address] = {
						"name": name,
						"symbol": symbol,
						"decimals": decimals,
						"icon": "",
						"type":"ERC20"
					};
					newTokens[chainKey] = newTks;
					flag = true;
				}
			})
			if(!flag) {
				let newTks:{[token: string]: TokenInfoObject} = {};
				newTks[address] = {
					"name": name,
					"symbol": symbol,
					"decimals": decimals,
					"icon": "",
					"type":"ERC20"
				};
				newTokens[currentNetwork] = newTks;
			}
		}
		else {
			let newTks:{[token: string]: TokenInfoObject} = {};	
			newTks[address] = {
				"name": name,
				"symbol": symbol,
				"decimals": decimals,
				"icon": "",
				"type":"ERC20"
			};
			newTokens[currentNetwork] = newTks;
		}
		update({accounts: accs, tokens:newTokens})
		showAlert("Imported token successfully", "success")
		history.push("/assets")
	}

	return (
		<div className='back-panel'>
			<div className="container inner-panel" style={{padding: 0, background:'transparent'}}>
				<div style={{padding:'1em 0.5em'}}>
					<Header />
				</div>
				<div className="token-panel">
					<div className="header">
						<h4 className='m0 text-center'>IMPORT TOKENS</h4>
						<Link className="close-btn" to="/assets">
							<div className="justify">
								<Icon icon="Close" size={12} fill="var(--color-pink)"/>
							</div>
						</Link>
					</div>
					<div className={`content ${status.tabSelect === 1 ? '': 'hide'}`}>
						<div className="justify">
							<div className="col-6 pointer m0 pl0" onClick={() => {updateStatus({tabSelect: 1})}}>
								<p className='text-center t0 text-dark'><b className={`${status.tabSelect === 1? 'text-pink ': ''}`}>//</b> SEARCH</p>
								<div className={`hr ${status.tabSelect === 1? 'active': ''}`}></div>
							</div>
							<div className="col-6 pointer m0 pr0" onClick={()=>{updateStatus({tabSelect: 2})}}>
								<p className='text-center t0 text-dark'>// Custom token</p>
								<div className="hr"></div>
							</div>	
						</div>
						{/* <div className='alert'>
							<Icon icon="Warning" size={45} margin={15}/>
							<p className='t0'>New! Improved token detection is available on Ethereum Mainnet as an experimental feature. <b className='text-yellow'>Enable it from settings.	</b></p>
						</div> */}
						<div className="input-search">
							<span><Icon icon="Search" /></span>
							<input type="text" className='pl5'	 placeholder=' Search Tokens' value={status.inputAddress1} onChange={(e) => {checkToken(e.target.value)}}/>
						</div>
						<>
							{
								status.disable1 && <div className='text-center'>
									<img src= {require('../assets/img/welcome.png')} style={{width:'70px'}}/>
									<p className='t0 w50 ml-auto mr-auto'>Add the tokens you’ve acquired using Neon	Wallet</p>
								</div>
							}
							{
								!status.disable1 && <div className='ml3'>
									<p>Token Name: {status.tokenName1}</p>
									<p>Token Symbol: {status.tokenSymbol1}</p>
									<p>Token Decimals: {status.tokenDecimal1}</p>
								</div>
							}
						</>
						<div className="hr mt1"></div>
						<div className="text-center">
							<button className={`btn-primary  mt1 mb3 ${status.disable1 ? 'disabled': ''}`}   disabled = {status.disable1 ? true: false}   style={{width:'200px', padding:'1.2em 1.6em'}} onClick = {() => {addToken()}}>
								NEXT
							</button>
						</div>
					</div>
					
					<div className={`content ${status.tabSelect === 2 ? '': 'hide'}`}>
						<div className="justify">
							<div className="col-6 pointer m0 pl0" onClick={() => {updateStatus({tabSelect: 1})}}>
								<p className='text-center t0 text-dark'><b className={`${status.tabSelect === 1? 'text-pink ': ''}`}>//</b> SEARCH</p>
								<div className={`hr ${status.tabSelect === 1? 'active': ''}`}></div>
							</div>
							<div className="col-6 pointer m0 pr0" onClick={()=>{updateStatus({tabSelect: 2})}}>
								<p className='text-center t0 text-dark'><b className={`${status.tabSelect === 2? 'text-pink ': ''}`}>//</b> Custom token</p>
								<div className={`hr ${status.tabSelect === 2? 'active': ''}`}></div>
							</div>	
						</div>
						<div className='alert'>
							<Icon icon="Warning" size={45} margin={15}/>
							<p className='t0 t-small'>Anyone can create a token, including creating fake versions of existing tokens.</p>
						</div>
						<div style={{padding: '0 1em'}}>
							<p className='t0 t-small'>Token Contact Address</p>
							<input type="text" value={status.inputAddress2} onChange = {(e) => {checkToken(e.target.value)}}/>
							<p className='t0 t-small'>Token Name</p>
							<input type="text" readOnly value={status.tokenSymbol2} onChange = {(e) => {updateStatus({tokenSymbol2: e.target.value})}}/>
							<p className='t0 t-small'>Token Symbol</p>
							<input type="text" readOnly value={status.tokenDecimal2} onChange = {(e) => {updateStatus({tokenDecimal2: e.target.value})}}/>
						</div>
						
						<div className="hr mt1"></div>
						<div className="text-center">
							<button className={`btn-primary  mt1 mb3 ${status.disable2 ? 'disabled': ''}`}   disabled = {status.disable2 ? true: false}   style={{width:'200px', padding:'1.2em 1.6em'}} onClick = {() => {addToken()}}>
								Add custom token
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ImportToken
