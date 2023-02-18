// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import  Icon from '../../components/Icon'
import {BigNumber, ethers} from 'ethers'
import useStore, {copyToClipboard, ellipsis,  roundNumber,  showAlert } from '../../useStore';
import Avartar from '../../components/Avartar'
import Loading from '../../components/Loading'
import {checkContract, checkTransaction, getSendInfo, providerTransaction,  ZeroAddress} from '../../../lib/wallet' 
import {decrypt, hash} from '../../../lib/utils' 
import { bmul, formatUnit} from '../../../lib/bigmath';
import { sendMsgToBackFromExtension } from '../../../lib/api';
import { MESSAGE_TYPE } from '../../../constants';

interface InnerProps {
	onAccept: Function
	info:	{url:string, params: [RequestTransactionParam]}[]
}

interface statusInterface {
	url:		string
	nonce: 		string
	gasPrice:	string
	gas:		string
	to:			string
	from:		string
	value:		string
	data:		string
	chainId:	string
	symbol:			string
	rpc:			string
	gasFee:			string
	balance:		string
	accountName:	string
	password:		string
	tokenAddress:	string
	explorer:		string
	method:			string
	params:			{[index: string]: string}
	erc20?:			{
		symbol: 	string
		decimals: 	number
		value:		string
	}
	tabIndex:		number
	loading:		boolean
}

export const Transaction = ({info,  onAccept }: InnerProps) => {
	const { currentNetwork, accounts, currentAccount, transactions, networks, setting, vault, update} = useStore();
	const [status, setStatus] = React.useState<statusInterface>({
		url:		'',
		from:		'',
		to:			'',
		nonce:		'',
		gasPrice:	'',
		gas:		'',
		value:		'',
		data:		'',
		chainId:	'',
		symbol:		'',
		rpc:		'',
		gasFee: 	'',
		balance:	'',
		accountName: '',
		password:	'',
		tokenAddress: '',
		explorer:		'',
		method:		'',
		params:		{},
		tabIndex:	1,
		loading:	true
	});
	
	const updateStatus = (params: {[key: string]: string | number | boolean | Blob | any }) => setStatus({ ...status, ...params });
	
	const init = async () => {
		const url = info[0].url;
		const param = info[0]?.params?.[0];
		let  rpc = '', symbol = '', chainId = '', explorer="", name='', nativeBalance='';
		Object.values(networks).map((network) => {
			if((param.chainId && network.chainId === Number(param.chainId)) || network.chainKey === currentNetwork) {
				symbol = network.symbol;
				rpc = network.rpc;
				chainId = Number(network.chainId).toString();
				explorer = network.url;
			}
		})
		
		Object.values(accounts).map((account) => {
			if(account.address === currentAccount) {
				name = account.label;
			}
		})
		Object.values(accounts).map((account) => {
			if(account.address === currentAccount) {
				nativeBalance = account.value[currentNetwork] || '0'		
			}
		})
		let from = param.from || currentAccount;
		let {to, data, gasPrice, gas, nonce} = param;

		let value = param.value || "0";

		if(!from || from == null) return onAccept(null)
		// if(!to || to == null) return onAccept(null)
		

		let hexData = "";
		if(data){
			if(data?.startsWith("0x")) data = data?.replace("0x", "")
			hexData = "0x"+data;	
		}
		if(hexData.length % 2 == 1) hexData = "0x0"+data;
		if(BigNumber.from(value).gt(BigNumber.from(nativeBalance))) {
			updateStatus({accountName:name,  symbol, rpc, url, from, to, value, data:hexData, chainId, explorer, loading: false})
			return showAlert("Insufficient  balance", "warning");	
		}
		let method = "", params = {};
		let erc20 = undefined as {
			symbol: 	string
			decimals: 	number
			value:		string
		}|undefined


		if(hexData!=="0x" && hexData!==""){
			const v =  await sendMsgToBackFromExtension(MESSAGE_TYPE.getMethodName, {value: hexData});	
			const methodData = v.result;
			method = methodData?.name || "unknown method";
			params = methodData?.args || {amount: 0};
			const index = 0;
			if (method==='approve') {
				const info = await checkContract(rpc, to);
				const ps = Object.values(params) ;	
				if(info != null  ) {
					erc20 = {
						symbol: 	info.symbol,
						decimals: 	info.decimals,
						value:		formatUnit(String(ps[index] || "0"), info.decimals || 18).toString()
					}
				}	
			}
		}
		const rows = await getSendInfo(Number(chainId), rpc, from, to, ZeroAddress, BigNumber.from(value)._hex || "0", hexData)
		let _gasPrice = gasPrice || rows[0]?.result || 0;
		let _nonce = nonce || rows[1]?.result
		let _limit = gas || rows[2]?.result || 0xff403
		const gasFee = bmul(_gasPrice, _limit).div(1e9).toString();
		updateStatus({accountName:name, method, params, erc20, symbol, rpc, url, from, to, nonce:_nonce, gasPrice:_gasPrice, gas:_limit, value, data:hexData, chainId, gasFee, explorer, loading: false})
	}

	const send = async () => {
		if(status.password === "") return showAlert("Please enter wallet password", "warning");
		const passHash = hash(status.password);
		const plain = await decrypt(vault, passHash);
		if (plain===null || plain==='') return showAlert("Incorrect password", "warning")
		const wallet = JSON.parse(plain)
		let privatekey  = "" as any;
		if(wallet.keys) Object.entries(wallet.keys).map(([publickey, privkey]) => {
			if(publickey.toLowerCase() === status.from.toLowerCase()) privatekey = privkey;
		})
		const tx = await providerTransaction(status.rpc, Number(status.chainId), privatekey, status.from,  status.to, status.value, status.nonce,  status.data, BigNumber.from(status.gasPrice),BigNumber.from(status.gas));
		if(tx != undefined) {
			const result = await checkTransaction(status.rpc, tx)
			if(result) {
				const newtxs = {} as  {[chainKey: string] : {[hash: string]: Transaction}};
				let flag = false;
				if(transactions) Object.entries(transactions).map(([_chain, _transaction]) => {
					if(_chain !== currentNetwork) newtxs[_chain] = _transaction;
					else {
						let txs = {[result.hash]: {
							from:				result.from,
							transactionId:		result.hash,
							to:					status.to,
							status:				result.blockNumber == null ?'pending' : 'confirmed',
							nonce:				Number(result.nonce).toString(),
							amount:				status.value,
							gasPrice:			result.gasPrice,
							gasLimit:			result.gas,
							gasUsed:			'0',
							total:				"0",
							hexData:			result.input.substring(2),
							rpc:				status.rpc,
							chainId:			Number(status.chainId),
							tokenAddress:		status.tokenAddress,
							explorer:			status.explorer,
							symbol:				status.symbol,
							decimals:			Number(18),
							log:				[],
							created:			'0',
							time:				+new Date() + 100000000,
							method:				status.method
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
						to:					status.to,
						status:				result.blockNumber == null ?'pending' : 'confirmed',
						nonce:				Number(result.nonce).toString(),
						amount:				result.value,
						gasPrice:			result.gasPrice,
						gasLimit:			result.gas,
						gasUsed:			result.gas,
						total:				"0",
						hexData:			result.input.substring(2),
						rpc:				status.rpc,
						chainId:			Number(status.chainId),
						tokenAddress:		status.tokenAddress,
						explorer:			status.explorer,
						symbol:				status.symbol,
						decimals:			18,
						log:				[],
						created:			'0',
						time:				+new Date() + 100000000,
						method:				status.method
					}
					newtxs[currentNetwork] = txs;
				}
				update({transactions: newtxs})
				return onAccept(result.hash)
			}
			return onAccept(null)
		}
		else {
			onAccept(null)
		}
	}

	const onCancel = () => {
		let error = new Error('The user rejected the request') as any;
		error.reason = "user rejected transaction"
		error.code = "ACTION_REJECTED"
		error.action = "sendTransaction"
		error.transaction = {
			data: status.data,
			to: status.to,
			from: status.from,
			gasLimit: ethers.BigNumber.from(status.gas)
		}
		onAccept(error)
	}

	React.useEffect(() => {
		init()
	}, [])
	

	return (
			<div className=''>
				<div className="flex center middle" style={{borderRadius: '20px', border: '1px solid var(--line-color)'}}>
					<p className='ml2'>{info[0]?.url}</p>
				</div>
				<div className="row mt1 mb1">
					<div className="col-5 text-center center" >
						<div className={`avartar`} style={{marginLeft:'auto', marginRight:'auto', width:'35px'}}> 
							<Avartar address={status.from} type={setting.identicon === 'jazzicons'? 1: 2} /> 
						</div>
						<p className='m0'>{status.accountName !== "" ? status.accountName : ellipsis(status.from, 7)}</p>	
					</div>
					<div className="col-2 flex middle">
						<Icon icon="ArrowRightLong" size={30} />
					</div>
					<div className="col-5 text-center center" >
						<div className={`avartar`} style={{marginLeft:'auto', marginRight:'auto', width:'35px'}}> 
							<Avartar address={status.to || ZeroAddress} type={setting.identicon === 'jazzicons'? 1: 2} /> 
						</div>
						<p className='m0'>{ellipsis(status.to || "", 7)}</p>	
					</div>
				</div>
				{
					(status.data !== "") && <div className="flex mt2">
						<div style={{padding:'5px 1em', cursor:'pointer', borderBottom:status.tabIndex===1?'2px solid rgb(144, 59, 255)':'2px solid transparent'}} onClick={() => {updateStatus({tabIndex:1})}}>DETAILS</div>
						<div style={{padding:'5px 1em', cursor:'pointer', borderBottom:status.tabIndex===2?'2px solid rgb(144, 59, 255)':'2px solid transparent'}} onClick={() => {updateStatus({tabIndex:2})}}>DATA</div>
						<div style={{padding:'5px 1em', cursor:'pointer', borderBottom:status.tabIndex===3?'2px solid rgb(144, 59, 255)':'2px solid transparent'}} onClick={() => {updateStatus({tabIndex:3})}}>HEX</div>
					</div>
				}
				<div className="hr"></div>
				{
					(status.tabIndex === 1) && <>
						<div className="justify" style={{padding: '2em 1em 0'}}>
							<div>
								<div className="row middle">
									<p className='t0'><b>Gas</b> (estimated)</p>
									<Icon icon="Warning" size={15} marginLeft={10}/>
								</div>
							</div>
							<div className='text-right'>
								<p className='t0'>{roundNumber(formatUnit(status.gasFee || "0", 9).toString())}</p>
								<p className='t0 t-small'><b>Max fee:</b> {roundNumber(formatUnit(status.gasFee || "0", 9).toString()) + status.symbol}</p>
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
									  status.value !== "0" && status.value !== "0x0" ? roundNumber(Number(formatUnit(status.gasFee || "0", 9))  + Number(formatUnit(status.value || "0", 18))).toString().concat(" ", status.symbol) : roundNumber(Number(formatUnit(status.gasFee || "0", 9))).concat(" ", status.symbol)
								}
								</p>
							</div>
						</div>
						<div className="hr mt1 mb1"></div>
						{
							setting.showTxNonce && 
							<div className="justify" style={{padding:'1em'}}>
								<p>CUSTOM NONCE</p>
								<input type="number"  style={{padding:'0.5em', width:'130px'}} value={Number(status.nonce)} onChange={(e) => {updateStatus({inputNonce: e.target.value})}} placeholder={status.nonce}/>
							</div>
						}
					</>
				}
				{
					status.tabIndex === 2 && <>
						<div className="flex middle">
							<p className='m0 mt3'>FUNCTION TYPE</p>
							<b className='ml3 mt3'>{status.method}</b>
						</div>
						<p className='m0'>PARAMETERS: </p>
						{
							status.params && Object.entries(status.params).map(([key, param]) => (
								<p className='m0'>{status.method === "approve" ? key +" : ": ""} 
									{status.erc20 ? 
										key !== "amount" ? ellipsis(param, 20) : `${formatUnit(param, status.erc20.decimals || 18)}${status.erc20.symbol}` 
										: 
										ellipsis(param, 25)
									}
								</p>
							))
						} 
					</>
				}
				{
					status.tabIndex === 3 && <>
						<div className="flex middle ml2">
							<p>FUNCTION TYPE</p>
							<b className='ml3'>{status.method}</b>
						</div>
						<div className="alert" style={{wordBreak:'break-all', margin:'0'}}>
							{status.data}
						</div>
						<div className="flex middle  pointer" onClick={() => {copyToClipboard(status.data)}}>
							<Icon icon='Copy' margin={15}/>
							<p>Copy raw transaction data</p>
						</div>
					</>
				}
				
				<p style={{margin:'1.5em 0 0'}}>Enter Wallet Password</p>
				<input type="password" value={status.password} onChange={(e) => {updateStatus({password: e.target.value})}} /> 
				<div className="hr mt3"></div>
				<div className="justify justify-around">
					<div className="btn-cancel  mt1" style={{width:'130px'}} onClick = {onCancel}>
						REJECT
					</div>
					<div className="btn-special  mt1" style={{width:'130px'}} onClick = {send}>
						CONFIRM
					</div>
				</div>
				{status.loading && <Loading />}
			</div>
	);
}

export default Transaction