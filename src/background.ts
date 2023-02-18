// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import {ethers } from 'ethers'
import { rpcMethods } from './constants';
import {METHOD_TYPE, SENDER, TARGET, MESSAGE_TYPE} from './constants'
import { onRequestAccount, onAddChain, onRequestChainId, onWatchAsset, onSwitchNetwork, onSendTransaction, onRequestAccountPermission, onEthAccounts, onGetPermission, onEthSign, onEthPersonalSign, onEthSignData4, onEthSignData, onEthSignData3, onRecoverPersonalData, onGetEncryptKey } from './lib/api';
import { getChromeStorage} from './lib/chrome';
import  METHOD_SIGNATURE from './lib/functions.json'

interface FunctionInfoType {
    name: string
    args: {[arg: string]: string|number|boolean}
}

const HASH_KEY = 'passhash';
let PASSWORD_HASH = "";

class BackgroundController {
	_methodList: any;

	constructor() {
		this._methodList = {};
		chrome.storage.session.get(HASH_KEY).then(result=>{
			if (result) PASSWORD_HASH = result[HASH_KEY];
		})
	}

	setPassHash(k: string) {
		chrome.storage.session.set({[HASH_KEY]: k});
		PASSWORD_HASH = k;
		return true
	}
	getPassHash() {
		if (PASSWORD_HASH!=='') return PASSWORD_HASH;
	}

	getMethodName(data: string): FunctionInfoType|null {
		const methods = METHOD_SIGNATURE as {[func: string]: string}
		const specs = {
			"095ea7b3": "approve(address spender,uint256 amount)"
		} as {[func: string]: string}
	
		try {
			const signature = data?.slice(2, 10);
			const func = specs[signature] || methods[signature];
			if (func!==undefined) {
				const p = func.indexOf('(');
				if (p!==-1) {
					const name = func?.slice(0, p);
					const iface = new ethers.utils.Interface([`function ${func} returns()`]);
					const fragment = Object.entries(iface.functions)[0][1];
					const decodedData = iface.decodeFunctionData(name, data);
					if (fragment.inputs.length===decodedData.length) {
						let result = {name, args: {}} as FunctionInfoType
						let k = 0;
						for (let i of decodedData) {
							result.args[fragment.inputs[k].name || k] = i instanceof ethers.BigNumber ? i.toString() : i;
							k++;
						}
						return result;
					}
				}
			}
		} catch (error) {
		} 
		return null;
	}
	add = (method: string, func: Function) => { 
		this._methodList[method] = func; 
	};

	listen = () => {
		chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
			if(request.target === TARGET && request.sender === SENDER.extension && !request.event && request.data) {
				const {key, value} = request.data;
				if(key) {
					switch(key) {
						case MESSAGE_TYPE.getPassHash: {
							sendResponse({result: this.getPassHash()})
							break;
						}
						case MESSAGE_TYPE.setPassHash: {
							this.setPassHash(value.value);
							sendResponse({result: true})
							break;
						}
						case MESSAGE_TYPE.getMethodName: { 
							sendResponse({result: this.getMethodName(value.value)}); 
							break;
						}
					}
				}
			}
			else if (request.target === TARGET && request.sender === SENDER.webpage) {  /// from content script
				this._methodList[request.method](request, sendResponse);
			}
			return true;
		});
	};
}


const app = new BackgroundController();

app.add('isConnected', (request: any, sendResponse:Function) => {
	sendResponse({
		id: request.id,
		data: true,
		target: TARGET,
		sender: SENDER.extension
	})
})

app.add('request', async(request: any, sendResponse: Function) => {
	const args = request.data;
	let method = "", params = "" as any;
	if(typeof args === "string") {
		method = args;
		params = [];
	} else {
		method = args.method;
		params = args.params;
	}
	if (typeof method !== 'string' || method.length === 0) {
		throw new Error('invalidRequestArgs');
	}
	switch (method) {
		case METHOD_TYPE.ETH_REQUEST_ACCOUNTS: {
			sendResponse({id: request.id, data: await onRequestAccount(request, sendResponse), target: TARGET, sender: SENDER.extension});
			break;
		}
		case METHOD_TYPE.ADD_ETHEREUM_CHAIN: {
			sendResponse({id: request.id, data: await onAddChain(request, sendResponse), target: TARGET, sender: SENDER.extension});
			break;
		}
		case METHOD_TYPE.ETH_CHAIN_ID: {
			sendResponse({id: request.id, data: await onRequestChainId(request, sendResponse), target: TARGET, sender: SENDER.extension});
			break;
		}
		case METHOD_TYPE.WATCH_ASSET: {
			sendResponse({id: request.id, data: await onWatchAsset(request, sendResponse), target: TARGET, sender: SENDER.extension});
			break;
		}
		case METHOD_TYPE.SWITCH_ETHEREUM_CHAIN: {
			sendResponse({id: request.id, data: await onSwitchNetwork(request, sendResponse), target: TARGET, sender: SENDER.extension});
			break;
		}
		case METHOD_TYPE.ETH_SEND_TRANSACTION: {
			sendResponse({id: request.id, data: await onSendTransaction(request, sendResponse), target: TARGET, sender: SENDER.extension});
			break;
		}
		case METHOD_TYPE.WALLET_REQUEST_PERMISSION: {
			sendResponse({id: request.id, data: await onRequestAccountPermission(request, sendResponse), target: TARGET, sender: SENDER.extension});
			break;
		}
		case METHOD_TYPE.WALLET_GET_PERMISSION: {
			sendResponse({id: request.id, data: await onGetPermission(request, sendResponse), target: TARGET, sender: SENDER.extension});
			break;
		}
		case METHOD_TYPE.ETH_ACCOUNTS: {
			sendResponse({id: request.id, data: await onEthAccounts(request, sendResponse), target: TARGET, sender: SENDER.extension});
			break;
		}
		case METHOD_TYPE.ETH_SIGN: {
			sendResponse({id: request.id, data: await onEthSign(request, sendResponse), target: TARGET, sender: SENDER.extension});
			break;
		}
		
		case METHOD_TYPE.RECOVER_PERSONAL: {
			sendResponse({id: request.id, data: await onRecoverPersonalData(request, sendResponse), target: TARGET, sender: SENDER.extension});
			break;
		}
		case METHOD_TYPE.GET_ENCRYPT_KEY: {
			sendResponse({id: request.id, data: await onGetEncryptKey(request, sendResponse), target: TARGET, sender: SENDER.extension});
			break;
		}
		case METHOD_TYPE.PERSONAL_SIGN: {
			sendResponse({id: request.id, data: await onEthPersonalSign(request, sendResponse), target: TARGET, sender: SENDER.extension});
			break;
		}
		case METHOD_TYPE.ETH_SIGN_DATA: {
			sendResponse({id: request.id, data: await onEthSignData(request, sendResponse), target: TARGET, sender: SENDER.extension});
			break;
		}
		case METHOD_TYPE.ETH_SIGN_DATA_V3: {
			sendResponse({id: request.id, data: await onEthSignData3(request, sendResponse), target: TARGET, sender: SENDER.extension});
			break;
		}
		case METHOD_TYPE.ETH_SIGN_DATA_V4: {
			sendResponse({id: request.id, data: await onEthSignData4(request, sendResponse), target: TARGET, sender: SENDER.extension});
			break;
		}
		default: {
			if(rpcMethods.indexOf(method) > -1) {
				const store = await getChromeStorage();
				let rpc = "";
				store?.networks && Object.values(store.networks).map((network) => {
					if(network.chainKey === store.currentNetwork) {
						rpc = network.rpc;
					} 
				})
				let p = [] as RpcRequestType[]
				p.push({jsonrpc: "2.0", method, params, id: Math.floor(Math.random()*10 + 1)})
				sendResponse({id: request.id, data: {callrpc: true, rpc, params: p}, target: TARGET, sender: SENDER.extension});
			}
			else {
				sendResponse({id: request.id, data: {value: null, error:'Could not found rpc method'}, target: TARGET, sender: SENDER.extension});
			}
			break;
		}
	}
})
app.listen()