// by: Leo Pawel 	<https://github.com/galaxy126>
// at 28/6/2022

import '@ethersproject/shims'
import * as bip39 from 'bip39'
import hdkey from 'hdkey'
import axios from 'axios'
import * as ethUtil from 'ethereumjs-util'
import { BigNumber, ethers} from 'ethers'
import ABI from './ABI.json';
import wallet from "ethereumjs-wallet"
import { toBuffer } from 'ethereumjs-util'
import * as sigUtil from "eth-sig-util";
import * as metamaskSign from '@metamask/eth-sig-util'
export const ZeroAddress = '0x0000000000000000000000000000000000000000'
import {call} from './utils'

const HARDEND= "m/44'/60'/0'/0/"
/**
 * 12 words 128bit
 * 15 words 160bits
 * 18 words 192bits
 * 21 words 224bits
 * 24 words 256bits
 */
export const createMnemonic = (): string => {
	const mnemonic = bip39.generateMnemonic(128)
	return mnemonic
}

export const checkMnemonic = (mnemonic: string) => {
	return bip39.validateMnemonic(mnemonic);
}

export const getAddressFromMnemonic = (mnemonic: string, index: number) => {
	const seed=bip39.mnemonicToSeedSync(mnemonic);
	const lastRoot = hdkey.fromMasterSeed(seed);
	const addrNode = lastRoot.derive(HARDEND + index);
	const privatekey = addrNode.privateKey;
	const pubKey = ethUtil.privateToPublic(privatekey);
	const addr = ethUtil.publicToAddress(pubKey).toString('hex');
	return {privatekey:hex(privatekey), publickey: ethUtil.toChecksumAddress('0x'+addr)};
}

export const getEncryptionPublicKey = (privateKey: string) => {
	return sigUtil.getEncryptionPublicKey(privateKey)
}

export const encryptMessage = (encryptKey: string, msgParams: any) => {
	return sigUtil.encrypt(encryptKey, msgParams, "1")
}

export const decryptMessage = (encryptedData: sigUtil.EthEncryptedData, privateKey: any) => {
	// return sigUtil.decryptSafely(encryptedData.)
}

const  hex = (arrayBuffer: Buffer) => {
    return Array.from(new Uint8Array(arrayBuffer))
        .map(n => n.toString(16).padStart(2, "0"))
        .join("");
}

export const getAddressFromPrivateKey = (privateKey: string) => {
	const w = new ethers.Wallet(privateKey)
	return w.address
}

export const recoverPersonalData  =  (data: any, hash: string) => {
	return metamaskSign.recoverPersonalSignature({data: data, signature: hash})
}

// export const recoverSignData  = async (data: any, hash: string, version:) => {
// 	return metamaskSign.recoverTypedSignature({data: data, signature: hash})
// }

export const personalSign  = async (privateKey: string, msgParams: any) => {
	privateKey = privateKey.replace("0x", "")
	const buf = await toBuffer("0x"+privateKey);
	return metamaskSign.personalSign({privateKey: buf, data: msgParams})
}

export const signTypedData   = async (privateKey: string, msgParams: any) => {
	privateKey = privateKey.replace("0x", "")
	const buf = await toBuffer("0x"+privateKey);
	return metamaskSign.signTypedData({privateKey: buf, data: msgParams, version: metamaskSign.SignTypedDataVersion.V1})
}

export const signTypedData_v3  = async (privateKey: string, msgParams: any) => {
	privateKey = privateKey.replace("0x", "")
	const buf = await toBuffer("0x"+privateKey);
	return metamaskSign.signTypedData({privateKey: buf, data: msgParams, version: metamaskSign.SignTypedDataVersion.V3})
}

export const signTypedData_v4   = async (privateKey: string, msgParams: any) => {
	privateKey = privateKey.replace("0x", "")
	const buf = await toBuffer("0x"+privateKey);
	return metamaskSign.signTypedData({privateKey: buf, data: msgParams, version: metamaskSign.SignTypedDataVersion.V4})
}

export const addHexPrefix = (str:string) => {
	if (typeof str !== 'string' || str.match(/^-?0x/u)) return str;
	if (str.match(/^-?0X/u)) return str.replace('0X', '0x');
	if (str.startsWith('-')) return str.replace('-', '-0x');	
	return `0x${str}`;
};

export const exportToJSON = async (privateKey: string, password: string) => {
	privateKey = privateKey.replace("0x", "")
	const buf = await toBuffer("0x"+privateKey)
	const account = await wallet.fromPrivateKey(buf)
	const content = JSON.stringify(await account.toV3(password))
	return content
}

export const importFromJSON = async (content: string, password: string) => {
	const info =  await wallet.fromV3(content, password, true)
	return {checksumAddress: info.getChecksumAddressString(), address: info.getAddressString(), privatekey: info.getPrivateKeyString(), publickey: info.getPublicKeyString()}
}

export const callRpc = (rpc: string, params?:any) : Promise<any>=> {
	return new Promise(async (res, rej) => {
		try {
			const response = await axios.post(rpc, params, {headers: {'Content-Type': 'application/json'}})
			if (response && response.data) return res(response.data)
			else return res(null)
		} catch(err) {
			res(null)
		}
	})
}

export const checkBalances = async (rpc:string, chainKey: string, accounts: AccountObject[]) => {
	try {
		let params = [] as RpcRequestType[]
		let _accounts = [] as Array<{address:string, token?:string}>
		let k = 0
		Object.values(accounts).map((account) => {
			_accounts.push({address: account.address, token: ZeroAddress})
			params.push({jsonrpc: "2.0", method: "eth_getBalance", params: [account.address, "latest"], id: ++k})
			for (let to in account.tokens[chainKey]) {
				_accounts.push({address: account.address, token: to})
				params.push({jsonrpc: "2.0", method: "eth_call", params: [{to, data: `0x70a08231000000000000000000000000${account.address?.slice(2)}`}, "latest"],"id": ++k});
			}
		})
		const rows = await callRpc(rpc, params)
		if (rows && Array.isArray(rows) && rows.length===k) {
			const result = {} as {[address: string]: {[token: string]: string}}
			for (let i of rows) {
				if (i.result) {
					if(i.result === '0x') i.result = '0x0';
					const acc = _accounts[i.id - 1]
					if(!result[acc.address])result[acc.address] = {[ZeroAddress]: '0'}
					if(acc.token) {
						if(Object.keys(result[acc.address]).indexOf(acc.token) === -1)  result[acc.address] = {...result[acc.address], [acc.token]: '0'} ;
						result[acc.address] =  {...result[acc.address], [acc.token]: i.result} ;
					}
				}
			}
			return result
		}
	} catch (error) {
		console.log(error)
	}
	return null
}

export const checkContract = async (rpc: string, tokenAddress: string) : Promise<TokenInterface | null> => {
	return new Promise(async resolve => {
		try { 
			let params = [];
			params.push({jsonrpc: "2.0", method: "eth_call", params: [{
				from: null,
				to: tokenAddress,
				data: '0x95d89b41'
			}, "latest"], id: 1})
			
			params.push({jsonrpc: "2.0", method: "eth_call", params: [{
				from: null,
				to: tokenAddress,
				data: '0x06fdde03'
			}, "latest"], id: 2})
			params.push({jsonrpc: "2.0", method: "eth_call", params: [{
				from: null,
				to: tokenAddress,
				data: '0x313ce567'
			}, "latest"], id: 3})
			const rows = await callRpc(rpc, params)
			if(rows && rows.length > 0 && rows[0].result !== '0x') return resolve({
				address: tokenAddress,
				symbol: ethers.utils.toUtf8String("0x" + rows[0].result.toString().substring(130).replaceAll("00", "")),
				name: ethers.utils.toUtf8String("0x" + rows[1].result.toString().substring(130).replaceAll("00", "")),
				decimals: Number(rows[2].result)
			})
			return resolve(null)
		}
		catch (err) {
			//console.log(err)
			return resolve(null)
		}
})}

export const checkTransaction = (rpc: string, txId: string) : Promise<TransactionResult | null> => {
	return new Promise(async response => {
		try {
			let params = []
			params.push({jsonrpc: "2.0", method: "eth_getTransactionByHash", params: [txId], id: 1})
			const rows = await callRpc(rpc, params)
			response(rows[0].result)
		} catch (error) {
			return response(null)
		}
	})
}


export const signMessage = async (privateKey:string , message:string):Promise<string|null> => {
	return new Promise(async response => {
		let wallet = new ethers.Wallet(privateKey); 
		const bb = new Blob([message])
		const k = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("\x19Ethereum Signed Message:\n" + bb.size + message));
		const sign = await wallet.signMessage(k)
		response(sign)
	});
}

export const providerTransaction = async (rpc: string, chainId: number, privateKey: string, from:string,   to: string, amount: string, nonce: string, data: string, gasPrice: BigNumber, gasLimit: BigNumber): Promise<string | null> => {
	return new Promise(async response => {
		try {
			const provider = new ethers.providers.JsonRpcProvider(rpc)
			let wallet = new ethers.Wallet(privateKey, provider); 
			let transaction = {
				from,
				to,
				value: BigNumber.from(amount)._hex,
				gasLimit,
				nonce: BigNumber.from(nonce)._hex,
				gasPrice: gasPrice,
				chainId: chainId,
				data: data
			};
			let rawTransaction = await wallet.signTransaction(transaction);
			let params = []
			params.push({jsonrpc: "2.0", method: "eth_sendRawTransaction", params: [rawTransaction], id: 1})
			const rows = await callRpc(rpc, params)
			response(rows[0].result)
		} catch(ex) {
			response(null)
		}
	})
}

export const sendTransaction = async (rpc: string, chainId: number, privateKey: string,  tokenAddress: string, to: string, amount: string, nonce: string, data: string, gasPrice: BigNumber, gasLimit: BigNumber, maxFee: BigNumber, maxPriority: BigNumber): Promise<string | null> => {
	return new Promise(async response => {
		try {
			const provider = new ethers.providers.JsonRpcProvider(rpc)
			let wallet = new ethers.Wallet(privateKey, provider); 
			const from = await wallet.getAddress();
			// let feeData = await provider.getFeeData();
			// const maxFeePerGas = ethers.BigNumber.from(feeData?.maxFeePerGas  || 0);
			// const maxPriorityFeePerGas = ethers.BigNumber.from(feeData?.maxPriorityFeePerGas || 0) ;
			if(tokenAddress === ZeroAddress) {
				let transaction = {
					from,
					to,
					value: BigNumber.from(amount)._hex,
					gasLimit,
					nonce: BigNumber.from(nonce)._hex,
					gasPrice: gasPrice,
					chainId: chainId,
					data: data
					// maxPriorityFeePerGas: maxPriorityFeePerGas._hex,
					// maxFeePerGas: maxFeePerGas._hex,
					// type: 2,
				};
				let rawTransaction = await wallet.signTransaction(transaction);
				let params = []
				params.push({jsonrpc: "2.0", method: "eth_sendRawTransaction", params: [rawTransaction], id: 1})
				const rows = await callRpc(rpc, params)
				response(rows[0].result)
			}
			else {
				let iface = new ethers.utils.Interface(ABI.ERC20);
				const encode = iface.encodeFunctionData("transfer", ([to, amount]))
				let transaction = {
					from,
					to: tokenAddress || '',
					gasLimit,
					nonce:BigNumber.from(nonce)._hex,
					chainId,
					gasPrice,
					data: encode
				};
				let rawTransaction = await wallet.signTransaction(transaction);
				let params = []
				params.push({jsonrpc: "2.0", method: "eth_sendRawTransaction", params: [rawTransaction], id: 1})
				const rows = await callRpc(rpc, params)
				response(rows[0].result)
			}
		} catch (err) {
			//console.log(err)
			response(null)
		}
	});
}

export const getSendInfo = async (chainId:number, rpc: string, account: string, to:string, tokenAddress: string,  value: string,  data: string, gasPrice?: string): Promise<any> =>  {
	return new Promise((async response => {
		try {
			let params = [];
			params.push({jsonrpc: "2.0", method: "eth_gasPrice", params: [], id: 1})
			params.push({jsonrpc: "2.0", method: "eth_getTransactionCount", params: [account, "pending"], id: 2})
			let rawData = "0x";
			if(tokenAddress !== ZeroAddress) {
				let iface = new ethers.utils.Interface(ABI.ERC20);
				const encode = iface.encodeFunctionData("transfer", ([to, value]));
				rawData = encode;
				params.push({jsonrpc: "2.0", method: "eth_estimateGas", params: [{
					from: account,
					to: tokenAddress,
					data: encode
				}], id: 3}) 
			} else {
				value = value.replace("0x0", "0x");
				params.push({jsonrpc: "2.0", method: "eth_estimateGas", params: [{
					from: account,
					to: to,
					value: value,
					// gasPrice: await getGasPrice(rpc),
					data: data
				}], id: 3})
			}
			let rows = await callRpc(rpc, params)
			rows.push(rawData)
			const gasPrice = await call(`https://gas-api.metaswap.codefi.network/networks/${Number(chainId)}/gasPrices`)
			if(rows && rows.length > 0) {
				if(!gasPrice?.error) rows[0] = gasPrice?.ProposeGasPrice+"000000000"
				return response(rows)
			}
			return null
		} catch(err) {
			//console.log(err)
			return response(null)
		}
	}))
}


export const waitTx = async (rpc:string, txid:string): Promise<any> => {
	return new Promise(async response => {
		try { 
			let params = [];
			params.push({jsonrpc: "2.0", method: "eth_getTransactionReceipt", params: [txid], id: 1})
			const rows = await callRpc(rpc, params)
			response(rows[0].result);
		}
		catch (err) {
			//console.log(err)
			return response(null)
		}
	})
}
