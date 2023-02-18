// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import { useHistory } from 'react-router-dom';
import {isValidAddress} from 'ethereumjs-util';
import { BigNumber, ethers} from 'ethers'
import '../assets/css/send.scss'
import Icon from '../components/Icon';
import Loading from '../components/Loading';
import Avartar from '../components/Avartar';
import {decrypt, hash} from '../../lib/utils'
import useStore, {copyToClipboard, ellipsis,  getChainIcon,  getTokenIcon,  initChainIcons,  initTokenIcons,  roundNumber,  showAlert} from '../useStore';
import { ZeroAddress,  sendTransaction, checkTransaction, getSendInfo } from '../../lib/wallet';
import { bmul, formatUnit, parseUnit} from '../../lib/bigmath';


interface ConnectDialogProps {
	onClose: Function
	tokenAddress?: string | null
}

interface Status {
	modalType:	number
	showMyAccounts:		boolean
	toAddressLabel:		string
	toAddress:			string | null
	inputValue:			string
	inputBalance:		string
	inputNonce:			string
	hexData:			string
	data:				string
	showEditModal:		boolean
	feeLevel:			number
	showHowChoose:		boolean
	showAdvanced:		boolean
	timelineLabel:		string
	maxFee:				string
	gasLimit:			string
	baseFee:			string
	priorityFee:		string
	gasFee:				string
	gasPrice:			string
	balance:			string
	symbol:				string
	tokenAddress:		string
	decimals:			string
	inputError:			boolean
	rpc:				string
	chainId:			number
	explorer:			string
	nativeSymbol:		string
	nativeBalance:		string
	password:			string
	tabIndex:			number
	rawTransactionData:	string
	loading:			boolean
}


export default function ({ onClose }: ConnectDialogProps) {
	const history = useHistory();

	const [icons, setIcons] = React.useState<{[key:string]: string}>({});
	const [tokenIcons, setTokenIcons] = React.useState<{[key:string]: string}>({});

	const [status, setStatus] = React.useState<Status>({ 
		modalType:			1,
		showMyAccounts: 	true,
		toAddressLabel:		'',
		toAddress:			'',
		inputValue:			'',
		inputBalance:		'',
		hexData:			'',
		data:				'',
		inputNonce:			'',
		showEditModal:		false,
		feeLevel:			1,
		showHowChoose:		false,
		showAdvanced:		false,
		balance:			'0',
		timelineLabel:		`Likely in > 30 seconds`,
		maxFee:				'0',
		gasLimit:			'',
		baseFee:			'0',
		gasPrice:			'0',
		priorityFee:		'0',
		gasFee:				'0',
		symbol:				'',
		tokenAddress:		'',
		decimals:			'18',
		inputError:			false,
		rpc:				'',
		chainId:			0,
		explorer:			'',
		nativeSymbol:		'',
		nativeBalance:		'',
		password:			"",
		tabIndex:			1,
		rawTransactionData:	"",
		loading:			false
	});
	
	const updateStatus = (params:{[key:string]:string|number|boolean}) => setStatus({...status, ...params});
	const {currentAccount, accounts, setting, tokens, currentNetwork, transactions, vault, networks, update} = useStore()

	const checkAddress = (address: string) => {
		if(isValidAddress(address)) updateStatus({toAddress: address, toAddressLabel:'',  inputValue: '', modalType: 2, inputBalance:'0'})
	}

	const tokenInit = async () => {
		try {
			let address = window.location.pathname.split("/")[2];
			if(!address || address === null ) address = ZeroAddress;
			let symbol = '';
			let balance = '';
			let decimals = '18';
			let rpc = '', chainId = 0, explorer = '';
			let psymbol = '';
			let nativeBalance  = '';
			updateStatus({loading: true})
			Object.values(networks).map((network) => {
				if( network.chainKey === currentNetwork){
					symbol =  network.symbol;
					psymbol = network.symbol;
			}})
			if(address === ZeroAddress) {		
				Object.values(accounts).map((account) => {
					if(account.address === currentAccount) {
						balance = account.value[currentNetwork] || '0'		
						nativeBalance = account.value[currentNetwork] || '0'		
					}
				})
				decimals = '18';
			}
			else {
				Object.values(accounts).map((account) => {
					if(account.address === currentAccount) {
						nativeBalance = account.value[currentNetwork] || '0'		
					}
				})
				Object.values(accounts).map((account) => {
					if(account.address === currentAccount && account.tokens[currentNetwork] && account.tokens[currentNetwork][address]) {
						balance = account.tokens[currentNetwork][address].toString()  || '0'		
					}
				})	
				tokens[currentNetwork] && Object.entries(tokens[currentNetwork]).map(([key, value]) => 
				{
					if(key.toLowerCase() == address.toLowerCase()) {	
						symbol = value.symbol
						decimals = value.decimals;
					}
				})
			}
	
			Object.values(networks).map((network) => {
				if( network.chainKey === currentNetwork){
					rpc =  network.rpc || ''
					chainId = network.chainId;
					explorer = network.url;
			}})
	
			const rows = await getSendInfo(chainId, rpc, currentAccount, status.toAddress || "0xBEea22240fDDc880018d35EadDDEe147f0472515", address,  "0x1", "")
			let gasPrice = rows[0]?.result
			let nonce = rows[1]?.result
			let limit = rows[2]?.result
			let rawTransactionData = rows[3];
			gasPrice = (ethers.BigNumber.from(gasPrice).toString());
			const updateData = {symbol, rawTransactionData, nativeBalance, nativeSymbol:psymbol, tokenAddress: address, balance, rpc, explorer, chainId,  gasPrice: gasPrice, gasLimit: limit, inputNonce: nonce, loading: false}
			updateStatus(updateData);
		} catch(err) {
			updateStatus({loading: false})
		}
	}

	const checkTokenStatus = async (amount: string, data: string) => {
		if(data.startsWith("0x")) data = data.replace("0x", "")
		let hexData = '';
		if(!data.startsWith("0x")) hexData = "0x"+data;
		if(hexData.length % 2 == 1) hexData = "0x0"+data;
		updateStatus({inputValue: amount, tabIndex:1})

		if(Number(amount) > Number(formatUnit(status.balance, Number(status.decimals)))) return showAlert("Insufficient  balance", "warning");	

		if(!ethers.utils.isHexString(hexData)) {
			updateStatus({inputValue: amount,  inputBalance:parseUnit(amount, Number(status.decimals)).toString(), data: data, hexData:hexData, tabIndex:1});
			return showAlert("Invalid hex data", "warning");
		}
		if(Number(amount) === 0) return updateStatus({inputValue: amount, inputBalance:parseUnit(amount, Number(status.decimals)).toString(), data: data, tabIndex:1})
		const  rows = await getSendInfo(status.chainId, status.rpc, currentAccount, status.toAddress || "0xBEea22240fDDc880018d35EadDDEe147f0472515", status.tokenAddress,  parseUnit(amount, Number(status.decimals))._hex.toString() || "0", hexData || "")
		let gasPrice = rows[0]?.result || 0;
		let nonce = rows[1]?.result
		let limit = rows[2]?.result; 
		let rawTransactionData = rows[3]
		const gasFee = Number(bmul(gasPrice, limit).div(1e9)).toString();
		updateStatus({ inputValue: amount, rawTransactionData, inputBalance:parseUnit(amount, Number(status.decimals)).toString(), hexData, data: data, gasLimit: limit, gasPrice, inputNonce:nonce, gasFee: gasFee, tabIndex:1}) 
	}
	
	const setMax = async ()=> {
		let fee;
		updateStatus({loading: true})
		const  rows = await getSendInfo(status.chainId, status.rpc, currentAccount, status.toAddress || "0xBEea22240fDDc880018d35EadDDEe147f0472515", status.tokenAddress,  BigNumber.from(status.balance)._hex.toString() || "0", status.hexData || "")
		let gasPrice = rows[0]?.result || 0;
		let nonce = rows[1]?.result
		let limit = rows[2]?.result
		let rawTransactionData = rows[3];
		fee = bmul(gasPrice, limit).div(status.tokenAddress === ZeroAddress ? 1 : 1e9);
		const max = BigNumber.from(status.balance).sub(fee).toString()
		updateStatus({inputBalance: max,  rawTransactionData, inputValue: roundNumber(formatUnit(max, 18)), gasPrice: gasPrice, inputNonce:nonce, gasLimit: limit, gasFee: Number(fee), loading: false})
	}
	const saveAdvanced = () => {
	}

	const confirmSend = async () => {
		updateStatus({modalType: 3})
	}

	const send = async () => {
		if(status.inputValue === '' || status.inputValue.toString() === '0' ) return showAlert("Please input value", "info");
		let chainId = 0, rpc = "";
		Object.values(networks).map((network) => {
			if( network.chainKey === currentNetwork){
				chainId = network.chainId;
				rpc = network.rpc
			}
		})
		if(status.password === "") return showAlert("Please enter wallet password", "warning");
		const passHash = hash(status.password);
		const plain = await decrypt(vault, passHash);
		if (plain===null || plain==='') return showAlert("Incorrect password", "warning")
		updateStatus({loading: true})
		const wallet = JSON.parse(plain)
		const privatekey  = wallet.keys?.[currentAccount]	
		if(BigNumber.from(status.nativeBalance).lt(BigNumber.from(status.gasFee))) return showAlert("Insufficient funds for gas", "warning");
		const tx = await sendTransaction(rpc, chainId, privatekey, status.tokenAddress, status.toAddress || ZeroAddress, status.inputBalance, status.inputNonce,  status.hexData, ethers.BigNumber.from(status.gasPrice), ethers.BigNumber.from(status.gasLimit), ethers.BigNumber.from(0), ethers.BigNumber.from(0))
		if(tx != undefined) {
			const result = await checkTransaction(status.rpc, tx)
			if(result) {
				const newtxs = {} as  {[chainKey: string] : {[hash: string]: Transaction}};
				let flag = false;
				transactions && Object.entries(transactions).map(([_chain, _transaction]) => {
					if(_chain !== currentNetwork) newtxs[_chain] = _transaction;
					else {
						let txs = {[result.hash]: {
							from:				result.from,
							transactionId:		result.hash,
							to:					status.toAddress || status.tokenAddress,
							status:				result.blockNumber == null ?'pending' : 'confirmed',
							nonce:				Number(result.nonce).toString(),
							amount:				status.tokenAddress === ZeroAddress ? result.value : status.inputBalance,
							gasPrice:			result.gasPrice,
							gasLimit:			result.gas,
							gasUsed:			'0',
							total:				"0",
							hexData:			result.input.substring(2),
							rpc:				status.rpc,
							chainId:			status.chainId,
							tokenAddress:		status.tokenAddress,
							explorer:			status.explorer,
							symbol:				status.symbol,
							decimals:			Number(status.decimals),
							log:				[],
							created:			'0',
							time:				+new Date() + 100000000,
							method:				null
						}, ..._transaction};
						newtxs[_chain] = txs;
						flag = true;
					}
				});
				if(!flag) {
					let txs = {} as {[hash: string]: Transaction};
					txs[result.hash] = {
						from:				result.from,
						transactionId:		result.hash,
						to:					status.toAddress || status.tokenAddress,
						status:				result.blockNumber == null ?'pending' : 'confirmed',
						nonce:				Number(result.nonce).toString(),
						amount:				status.tokenAddress === ZeroAddress ? result.value : status.inputBalance,
						gasPrice:			result.gasPrice,
						gasLimit:			result.gas,
						gasUsed:			result.gas,
						total:				"0",
						hexData:			result.input.substring(2),
						rpc:				status.rpc,
						chainId:			status.chainId,
						tokenAddress:		status.tokenAddress,
						explorer:			status.explorer,
						symbol:				status.symbol,
						decimals:			Number(status.decimals),
						log:				[],
						created:			'0',
						time:				+new Date() + 100000000,
						method:				null
					}
					newtxs[currentNetwork] = txs;
				}
				update({transactions: newtxs})
			}
			updateStatus({loading: false})
			showAlert("Successfully sent", "info")
			onClose()
			history.push("/active");
		}
		else {
			showAlert("Could not transfer token", "warning");
		}
	}


	React.useEffect(() => {
		tokenInit()
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
				tokens[currentNetwork] && Object.entries(tokens[currentNetwork]).map(([key, value]) => {			
					Object.values(accounts).map(async (account: any) => {	
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


	return (
		<div className='send-modal'>
			<div className="overlay"></div>
			<div className="token-panel">
				<div className={`${status.modalType === 1? "": 'hide'}`} style={{position:'relative'}}>
					<span className="close-btn" onClick={()=>onClose()}>
						<Icon icon="Close" size= {12} fill={'var(--color-pink)'}/>
					</span>
					<div className="header">
						<h4 className='m0 text-center'>SEND TO</h4>						
					</div>
					<div className="content p1" style={{height:'450px'}}>
						<div className="input-search" style={{margin: 0}}>
							<span><Icon icon="Search" /></span>
							<input type="text" className='pl5'	 placeholder='Search, public address (0x), or ENS'  onChange={(e) => {checkAddress(e.target.value)}}/>
						</div>
						{
							!status.showMyAccounts && <p className='text-center pointer t0' onClick={()=>{updateStatus({showMyAccounts: true})}}>Transfer between my accounts</p>
						}
						{
							status.showMyAccounts && <p className='text-center pointer  t0 flex center middle' onClick={()=>{updateStatus({showMyAccounts: false})}}> 
							<Icon icon="ArrowLeft" margin={10} size={10} height={20}/> Back to All</p>
						}
						{
							status.showMyAccounts && <>
								<p className='t-small ml3'>My Accounts</p>
								{Object.values(accounts).map((account: any) => {
									if(account.address !== currentAccount) {
										return <>
											<div className="address-row" onClick={() => {updateStatus({toAddress: account.address, toAddressLabel: account.label, modalType: 2})}}>
													<div className={`avartar`}>
														<Avartar address={account.address} type={setting.identicon === 'jazzicons'? 1: 2}/>
													</div>
													<div>
														<p className='t0 m0'><b>{ellipsis(account.label, 20)}</b></p>
														<p className='t0 m0'>{ellipsis(account.address, 16)}</p>
													</div>
												</div> 
											<div className="hr"></div>
										</>
									}
							   })}  
							</>
						}
					</div>
				</div>
				<div className={`${status.modalType === 2? "": 'hide'}`}>
					<div className="header">
						<h4 className='m0 text-center'>SEND</h4>
						<span className="back-btn" onClick={()=>onClose()}>
							<div className="justify">
								<Icon icon="ArrowLeft" size= {18} fill={'var(--color-yellow)'}/>
							</div>
						</span>
					</div>
					<div className="content">
						<div className='alert'>
							<div className="justify">
								<span style={{margin: '1em'}}><Icon icon="Check" size={15}/></span>
								<div>
									<p className='t0 m0'>{status.toAddressLabel}</p>
									<p className='t0 m0 t-small'>{ellipsis(status.toAddress || '', 24)}</p>
								</div>
							</div>
							<span style={{color:'var(--color-pink)'}} className="pointer" onClick={() => {updateStatus({toAddress:'', toAddressLabel:'', modalType: 1, inputValue: '', inputBalance:'0'})}}><Icon icon="Close"  margin={20} /></span>
						</div>
						<div className="hr mt1"></div>
						<div className="p2">
							<div className="justify middle">
								<p>Assets: </p>
								<div className="badge flex middle">

									{
										status.tokenAddress !== ZeroAddress && <>
											{
												currentNetwork === "neon" ? (tokenIcons[status.tokenAddress || ZeroAddress] ?  
													<div style={{width:'34px', margin:'0 6px'}}>
														<img src={tokenIcons[status.tokenAddress || ZeroAddress]} width={28} height={28} style={{borderRadius:'50%', marginRight:'0.5em',}}/>
													</div>
													:
													<div style={{width:'34px', margin:'0 6px'}}>
														<div className={`avartar`}>
															<Avartar address={status.tokenAddress || currentNetwork} type={setting.identicon === 'jazzicons'? 1: 2}/>
														</div>
													</div>
												) :
												(<div style={{width:'34px', margin:'0 6px'}}>
														<div className={`avartar`}>
															<Avartar address={status.tokenAddress || currentNetwork} type={setting.identicon === 'jazzicons'? 1: 2}/>
														</div>
												</div>)
											}
										</>	
									}
													
									{
										status.tokenAddress === ZeroAddress && Object.values(networks).map((network: any) => {
											if(network.chainKey === currentNetwork)  return <>
												{
													icons[network.chainId] ? <div style={{width:'38px', margin:'0 6px'}}><img src={icons[network.chainId]} width={38} height={38} alt={network.label} style={{borderRadius:'50%', marginRight:'0.5em',}}/> </div>: 
													<div style={{width:'34px', margin:'0 6px'}}>
														<div className={`avartar`}>
															<Avartar address={currentNetwork} type={setting.identicon === 'jazzicons'? 1: 2}/>
														</div>
													</div>
												}
											</>
										})
									}

									<div style={{textAlign:'left'}}>
										<p className='t0 m0'><b>{
											status.symbol
										}</b></p>
										<p className='t-small t0 m0'>Balance: {roundNumber(formatUnit(status.balance || '0', Number(status.decimals)), 8) +" "+ status.symbol}</p>
									</div>
								</div>
							</div>
							<div className="justify middle">
								<div>
									<p className='t0 m0'>Amount: </p>
									<div className="badge active" style={{width:'50px', padding:'0.3em'}} onClick={() => {
										setMax()
									}}>Max</div>
								</div>
								<div>
									<div className="badge justify">
										<div style={{textAlign:'left'}}>	
											<p className='t0 m0'>
												<input type={"number"} className="input-value" style={{width:'67px', padding:0}} value={status.inputValue} onChange = {(e) => {checkTokenStatus(e.target.value, status.data); }} placeholder="0"/>
												{status.symbol}
											</p>
											<p className='t-small t0 m0'>No Conversion Rate Available</p>
										</div>
									</div>
									{
										status.inputError && <p style={{color:'red', marginLeft:'0.8em'}}>Insufficient funds.</p>
									}
								</div>
							</div>
							{
								<div className="justify middle mt1 mb1">
									<div className='flex'>
										<div className="col-6">
											<p className='t-small m0'>Gas Price (GWEI)</p>
											<input type="number" style={{padding:'0.5em'}} placeholder="gas price" value = {formatUnit((status.gasPrice || '0'), 9).toString() || ""} onChange = {(e) => {updateStatus({gasPrice: parseUnit(e.target.value, 9).toString() || ""})}}/>
										</div>
										<div className="col-6">
											<p className='t-small m0'>Gas Limit</p>
											<input type="number" style={{padding:'0.5em'}} placeholder="gas limit" value = {Number(status.gasLimit || "0")} onChange = {(e) => {updateStatus({gasLimit: e.target.value})}}/>
										</div>
									</div>
								</div>
							}
							<div className="justify middle" style={{minHeight:'50px'}}>
								{
									setting.showHexData && status.tokenAddress === ZeroAddress && <>
										<p>Hex Data: </p>
										<textarea placeholder='Optional' style={{width:'220px', margin:'5px'}} value={status.data} onChange = {(e) => {checkTokenStatus(status.inputValue, e.target.value)}}/>
									</>
								}
							</div>
						</div>
						<div className="hr mt1"></div>
						
						<div className="justify justify-around p1">
							<div className="btn-cancel  mt1" style={{width:'150px'}} onClick = {() => {updateStatus({modalType: 0, toAddress:'', inputValue: '',  toAddressLabel:''}); onClose()}}>
								CANCEL
							</div>
							<div className="btn-special  mt1" style={{width:'150px'}} onClick={() => {confirmSend()}}>
								NEXT
							</div>
						</div>
					</div>
				</div>
				<div className={`${status.modalType === 3? "": 'hide'}`}>
					<div className="header">
						<h4 className='m0 text-center'>SENDING &nbsp;
							{
								status.symbol
							}
						</h4>
						<span className="back-btn" onClick={()=>{updateStatus({modalType: 2})}}>
							<div className="justify">
								<Icon icon="ArrowLeft" size={12}  fill={'var(--color-yellow)'}/>
							</div>
						</span>
					</div>
					<div className="content">
						<div className="justify justify-around middle">
							<div className='avartar-panel'>
								<div className={`avartar`} style={{border:'none', padding:'0.5em'}}>
								<Avartar address={currentAccount} type={setting.identicon === 'jazzicons'? 1: 2}/>
							</div>
							<p>
								{Object.values(accounts).map((account) => {
									if(account.address === currentAccount) {
										return ellipsis(account.label, 15)
									}})
								}
							</p>
							</div>
							<div className='wallet-btn'>
								<Icon icon="ArrowRightLong" />
							</div>
							<div className='avartar-panel'>
								<div className={`avartar`} style={{border:'none', padding:'0.5em'}}>
									<Avartar address={status.toAddress || ''} type={setting.identicon === 'jazzicons'? 1: 2}/>
								</div>
								<p> {status.toAddressLabel} </p>
							</div>
						</div>
						<div className="text-center">
							<div className="row center middle m0">
								<h3 className='text-yellow m0 mt1 mb1'>{status.inputValue }</h3>
							</div>
						</div>
						<p className='t0 flex middle center pointer mt3' style={{color:'var(--color-yellow)'}} onClick={() => {updateStatus({showEditModal: true})}}>
							{/* MARKET <Icon icon='ArrowRight' size={10} height={20} marginLeft={8}/> */}
						</p>
						{
							(status.tokenAddress !== ZeroAddress || status.data !== "") && <div className="flex">
								<div style={{padding:'5px 1em', cursor:'pointer', borderBottom:status.tabIndex===1?'2px solid rgb(144, 59, 255)':'2px solid transparent'}} onClick={() => {updateStatus({tabIndex:1})}}>DETAILS</div>
								<div style={{padding:'5px 1em', cursor:'pointer', borderBottom:status.tabIndex===2?'2px solid rgb(144, 59, 255)':'2px solid transparent'}} onClick={() => {updateStatus({tabIndex:2})}}>DATA</div>
								<div style={{padding:'5px 1em', cursor:'pointer', borderBottom:status.tabIndex===3?'2px solid rgb(144, 59, 255)':'2px solid transparent'}} onClick={() => {updateStatus({tabIndex:3})}}>HEX</div>
							</div>
						}
						<div className="hr"></div>
						{
							(status.tabIndex === 1)&& <>
								<div className="justify" style={{padding: '0 1em'}}>
									<div>
										<div className="flex middle">
											<p className='t0'><b>Gas</b> (estimated)</p>
											<Icon icon="Warning" size={15} marginLeft={10}/>
										</div>
										<p className='t0 t-small  text-pink'>{status.timelineLabel}</p>
									</div>
									<div className='text-right'>
										<p className='t0'>{roundNumber(formatUnit(status.gasFee, 9))}</p>
										<p className='t0 t-small'><b>Max fee:</b> {roundNumber(formatUnit(status.gasFee, 9)) + status.nativeSymbol}</p>
									</div>
								</div>
								<div className="hr mt1 mb1"></div>
								
								<div className="justify" style={{padding: '0 1em'}}>
									<div>
										<p className='t0'><b>Total</b></p>
										<p className='t0 t-small text-pink'>Amount + gas fee</p>
									</div>
									<div className='text-right'>
										<p className='t0'>
										{
											status.tokenAddress === ZeroAddress &&  roundNumber(formatUnit(status.gasFee, 9) + Number(status.inputValue), 6).concat(" ", status.nativeSymbol)
										}
										{
											status.tokenAddress !== ZeroAddress && status.inputValue+ status.symbol +" " +roundNumber(formatUnit(status.gasFee, 9), 6) + status.nativeSymbol
										}
										</p>
									</div>
								</div>
								<div className="hr mt1 mb1"></div>
								{
									setting.showTxNonce && 
									<div className="justify" style={{padding:'1em'}}>
										<p>CUSTOM NONCE</p>
										<input type="number"  style={{padding:'0.5em', width:'130px'}} value={Number(status.inputNonce)} onChange={(e) => {updateStatus({inputNonce: e.target.value})}} placeholder={status.inputNonce}/>
									</div>
								}
							</>
						}
						{
							status.tabIndex === 2 && <>
								<div className="flex middle ml2">
									<p>FUNCTION TYPE</p>
									<b className='ml3'>Transfer</b>
								</div>
								<div className="alert">
									Transaction decoding is not available for this chain
								</div>
							</>
						}
						{
							status.tabIndex === 3 && <>
								<div className="flex middle ml2">
									<p>FUNCTION TYPE</p>
									<b className='ml3'>Transfer</b>
								</div>
								<div className="alert" style={{wordBreak:'break-all', margin:'0 1em'}}>
									{status.tokenAddress===ZeroAddress?  status.hexData : status.rawTransactionData}
								</div>
								<div className="flex middle ml3 pointer" onClick={() => {copyToClipboard(status.tokenAddress===ZeroAddress?  status.hexData : status.rawTransactionData)}}>
									<Icon icon='Copy' margin={15}/>
									<p>Copy raw transaction data</p>
								</div>
							</>
						}
						<div className="justify justify-around">
							<div className="btn-cancel  mt1 mb3" style={{width:'150px'}} onClick={()=> {onClose()}} >
								REJECT
							</div>
							<div className="btn-special  mt1 mb3" style={{width:'150px'}} onClick={()=> {updateStatus({modalType:4})}} >
								CONFIRM 
							</div>
						</div>
					</div>
					{status.showEditModal && setting.enhancedGasFeeUI && <>
						
					</>}
					{status.showEditModal && !setting.enhancedGasFeeUI && <>
						<div className='edit-modal'>
							<div className="overlay"></div>
							<div className="token-panel">
								<div className={`${status.showHowChoose ? 'hide':''}`}>
									<div className="header">
										<h4 className='m0'>Edit riority</h4>
										<span className="close-btn" style={{color:'var(--color-pink)'}} onClick={() => {updateStatus({showEditModal: false})}}><Icon icon="Close" /></span>
									</div>
									<div className="content">
										{
											!status.showAdvanced && <>
											<h3 className='m0 text-center'>{status.gasFee}</h3>
											<h3 className='m0 mt1 mb2 text-center'>{status.symbol}</h3>
											<p className='text-center t0 m0'><b>Max fee: </b>({status.gasFee + " " + status.symbol})</p>
											<p className={`t-small text-center  m0 ${status.feeLevel=== 0 ? 'text-red' :'text-yellow' }`}>{status.timelineLabel} </p>

											<div className="flex justify-around mt3 mb1">
												<div className='pointer' onClick={() => {updateStatus({feeLevel: 0, timelineLabel:'Maybe in 30 seconds'})}}>
													<div className={`radio ${status.feeLevel === 0 ? 'selected' : ''}`}></div>
												</div>
												<div className='pointer' onClick={() => {updateStatus({feeLevel: 1, timelineLabel: 'Likely in < 30 seconds'})}}>
													<div className={`radio ${status.feeLevel === 1 ? 'selected' : ''}`}></div>
												</div>
												<div className='pointer' onClick={() => {updateStatus({feeLevel: 2, timelineLabel: 'Very likely in < 15 seconds'})}}>
													<div className={`radio ${status.feeLevel === 2 ? 'selected' : ''}`}></div>
												</div>
											</div>
											<div className="hr mt3" style={{width:'80%'}}></div>
											<div className="flex justify-around">
												<div style={{width:'50px'}} onClick={() => {updateStatus({feeLevel: 0, timelineLabel:'Maybe in 30 seconds'})}}>
													<div style={{height:'10px', border:'1px solid var(--line-color)', width:'1px', marginLeft:'auto', marginRight:'auto', marginTop:'-12px'}}></div>
													<p className={`m0 text-center pointer ${status.feeLevel === 0 ? '':'text-dark'}`}>Low</p>
												</div>
												<div style={{width:'50px'}} onClick={() => {updateStatus({feeLevel: 1, timelineLabel: 'Likely in < 30 seconds'})}}>
													<div style={{height:'10px', border:'1px solid var(--line-color)', width:'1px', marginLeft:'auto', marginRight:'auto', marginTop:'-12px'}}></div>
													<p className={`m0 text-center pointer ${status.feeLevel === 1 ? '':'text-dark'}`}>Medium</p>
												</div>
												<div style={{width:'50px'}} onClick={() => {updateStatus({feeLevel: 2, timelineLabel: 'Very likely in < 15 seconds'})}}>
													<div style={{height:'10px', border:'1px solid var(--line-color)', width:'1px', marginLeft:'auto', marginRight:'auto', marginTop:'-12px'}}></div>
													<p className={`m0 text-center pointer ${status.feeLevel === 2 ? '':'text-dark'}`}>High</p>
												</div>
											</div>
										</>
										}
										<p className='t0 flex middle pointer center' onClick={() => {updateStatus({showAdvanced: !status.showAdvanced})}}>Advanced Options 
										{status.showAdvanced ? <Icon icon="ArrowTop" size={12} height={28} marginLeft={10}/> : <Icon icon="ArrowDown" size={12} height={28} marginLeft={10}/>}
										</p>
										{
											status.showAdvanced && <div className='p2'>
												<p className='t0 m0'>Gas Limit</p>
												<input type="number" style={{padding:'0.5em'}} value={status.gasLimit} onChange={(e) => {updateStatus({gasLimit: e.target.value})}}/>
												<p className='t0 m0 mt1'>Max priority fee(GWEI)</p>
												<input type="number" style={{padding:'0.5em'}} value={status.priorityFee} onChange={(e) => {updateStatus({priorityFee: e.target.value})}}/>
												<p className='t0 m0 mt1'>Max fee(GWEI)</p>
												<input type="number" style={{padding:'0.5em'}} value={status.maxFee} onChange = {(e) =>  {updateStatus({maxFee: e.target.value})}}/>
											</div>
										}
										<p className='t-small text-yellow pointer text-center' onClick={() => {updateStatus({showHowChoose: true})}}>How Should I Choose?</p>
										<div className="hr"></div>
										<div className="flex center">
											<button className="btn-primary mt2 mb2" onClick={()=> {saveAdvanced()}} >
												SAVE
											</button>
										</div>
									</div>
								</div>
								<div className={`${status.showHowChoose ? '':'hide'}`}>
									<div className="header">
										<h4 className='m0 flex middle' onClick={() => {updateStatus({showHowChoose: false})}}><Icon icon="ArrowLeft" size={8} height={30} margin={10}/> How to choose?</h4>
										<span className="close-btn" style={{color:'var(--color-pink)'}} onClick={() => {updateStatus({showEditModal: false})}}><Icon icon="Close" /></span>
									</div>
									<div className="content p2">
										<p className='t0 m0'>Selecting the right gas fee depends on the type of transaction and how important it is to you.</p>
										<h5 style={{margin:'0.3em 0'}}>High</h5>
										<div className="hr"></div>
										<p className='t0 m0'>This is best for time sensitive transactions (like Swaps) as it increases the likelihood of a successful transaction. If a Swap takes too long to process it may fail and result in losing some of your gas fee.</p>
										<h5 style={{margin:'0.3em 0'}}>Medium</h5>
										<div className="hr"></div>
										<p className='t0 m0'>A medium gas fee is good for sending, withdrawing or other non-time sensitive transactions. This setting will most often result in a successful transaction.</p>
										<h5 style={{margin:'0.3em 0'}}>Low</h5>
										<div className="hr"></div>
										<p className='t0 m0'>A lower gas fee should only be used when processing time is less important. Lower fees make it hard predict when (or if) your transaction will be successful.</p>
									</div>
								</div>
							</div>	
						</div>
					</> }
				</div>
				<div className={`${status.modalType === 4? "": 'hide'}`}>
					<div className="confirm-panel">
						<div className="header" >
							<h4 className='m0'>Confirming Send</h4>
						</div>
						<div className="content" style={{minHeight:'200px', height:'200px'}}>
							<p>Enter Wallet Password</p>
							<input type={"password"}  placeholder="wallet password" value={status.password} onChange = {(e) => {updateStatus({password: e.target.value})}}/>
							<div className="justify justify-around mt3">
							<button className="btn-cancel  mt1" style={{width:'100px'}} onClick = {() => {updateStatus({modalType: 3})}}>
								NO
							</button>
							<button className="btn-special  mt1" style={{width:'100px'}} onClick = {() => {send()}}>
								YES
							</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			{status.loading && <Loading />}
		</div>
	);
}
