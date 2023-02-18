// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/7/2022

import { BigNumber } from 'ethers';
import {TARGET, SENDER, EVENT_NAME, MESSAGE_TYPE, METHOD_TYPE, REQUEST_KEY} from '../constants'
import { openNotificationWindow, getChromeStorage } from './chrome';

import {recoverPersonalData, getEncryptionPublicKey } from './wallet';

export const sendMsgToBackFromExtension = async (key: string, value: any): Promise<string | boolean | number | any> => {
	return new Promise((res, rej) => chrome.runtime.sendMessage({data: {key, value}, target: TARGET, sender: SENDER.extension },(response) => res(response))
	);
};

export const getPassHash = async () : Promise <any>=> {
	const v =  await sendMsgToBackFromExtension(MESSAGE_TYPE.getPassHash, {});
	if(v) return {result: v.result}
	else return null
}

export const setPassHash = async (v: string) => {
	return new Promise(async (res, rej) => {
		const result =  await sendMsgToBackFromExtension(MESSAGE_TYPE.setPassHash, {value: v});
		if(result.result === true) return res(true);
		else return res(false);
	})
}

export const emitNetworkChange = async (key: number) => {	
	//to webpage
	chrome.tabs.query({}, (tabs) => {
		tabs.forEach((tab) =>
			chrome.tabs.sendMessage(tab.id || 0, {
				data: key,
				target: TARGET,
				sender: SENDER.extension,
				event: EVENT_NAME.chainChanged,
			}, function(response) {
				if (!chrome.runtime.lastError) {}}
		));
	});
};


export const emitConnect = async (chainId: string) => {	
	//to webpage
	chrome.tabs.query({}, (tabs) => {
		tabs.forEach((tab) =>
			chrome.tabs.sendMessage(tab.id || 0, {
				data: chainId,
				target: TARGET,
				sender: SENDER.extension,
				event: EVENT_NAME.connect,
			}, function(response) {
				if (!chrome.runtime.lastError) {}
			})
		);
	});
};

export const emitDisconnect = async (message: string, code: number, data?: unknown) => {	
	//to webpage
	chrome.tabs.query({}, (tabs) => {
		tabs.forEach((tab) =>
		chrome.tabs.sendMessage(tab.id || 0, {
			data: {message, code, data},
			target: TARGET,
			sender: SENDER.extension,
			event: EVENT_NAME.connect,
		}, function(response) {
			if (!chrome.runtime.lastError) {}}
		));
	});
};

export const selectNetwork = async (networks: NetworkObject[], chainKey: string) => {
	let chainId = 0;
	networks && Object.values(networks).map((network) => {
		if( network.chainKey === chainKey){
			chainId = network.chainId
			return;
	}})
	emitNetworkChange(chainId);
	return true;
};  

const emitAccountChange = async (tabid: number, address: string) => {
	//to extenstion itself
	if (typeof window !== 'undefined') {
		window.postMessage({
            data: [address],
            target: TARGET,
            sender: SENDER.extension,
            event: EVENT_NAME.accountsChanged,
		});
	}
	//to webpage
	chrome.tabs.query({}, (tabs) => {
		tabs.forEach((tab) => 
			chrome.tabs.sendMessage(tabid || 0, {
				data: [address],
				target: TARGET,
				sender: SENDER.extension,
				event: EVENT_NAME.accountsChanged,
			}, function(response) {
				if (!chrome.runtime.lastError) {}
			})
		);
	});
};

export const selectAccount = async (tabid: number, address: string) => {
	 emitAccountChange(tabid, address);
	 return true;
};
 

export const onRequestChainId = (request:any, sendResponse:Function) => {
	return new Promise( async (resolve) => {
		const store = await getChromeStorage()
		const chain = store?.currentNetwork;
		const networks = store?.networks;
		let chainId = '0';
		if(chain && networks) {
			Object.values(networks).map((network:NetworkObject) => {
				if( network.chainKey === chain){
					chainId = BigNumber.from(network.chainId)._hex.toString();
					return;
			}})
		}
		sendResponse({
			id: request.id,
			data: chainId,
			target: TARGET,
			sender: SENDER.extension,
		});
	})
}

export const onGetPermission = (request:any, sendResponse:Function) => {
	return new Promise( async (resolve) => {
		let url = ''
		chrome.tabs.query({active: true},
		function (tabs)
		{
			url = new URL(tabs[0].url || '')?.origin;
		});
		const data = [
			{
			  invoker: url,
			  parentCapability: 'eth_accounts',
			  caveats: [
			  ]
			}
		  ];
		sendResponse({
			id: request.id,
			data: data,
			target: TARGET,
			sender: SENDER.extension,
		});
	})
}

export const onEthAccounts = (request:any, sendResponse:Function) => {
	return new Promise((resolve) => {
		let url = ''
		chrome.tabs.query({active: true}, async function (tabs)
		{
			url = new URL(tabs[0].url || '')?.origin;
			const store = await getChromeStorage()
			let accs = [] as any;
			const currentAccount = store?.currentAccount || ""
			accs.push(currentAccount.toString().toLowerCase())
			sendResponse({
				id: request.id,
				data: accs,
				target: TARGET,
				sender: SENDER.extension,
			});
		});
	})
}

export const onRecoverPersonalData = (request:any, sendResponse:Function) => {
	return new Promise((resolve) => {
		const params = request.data.params;
		const plain = recoverPersonalData(params[0], params[1])
		sendResponse({
			id: request.id,
			data: plain,
			target: TARGET,
			sender: SENDER.extension,
		});
	})
}

export const onGetEncryptKey = (request:any, sendResponse:Function) => {
	return new Promise(async (resolve) => {
		const params = request.data.params;
		const store = await getChromeStorage()
		const currentAccount = store?.currentAccount || ""
		let plain = "" as string | null
		if(currentAccount.toLowerCase() !== params[0].toString().toLowerCase())  plain = null
		else plain = getEncryptionPublicKey(params[0])
		sendResponse({
			id: request.id,
			data: plain,
			target: TARGET,
			sender: SENDER.extension,
		});
	})
}


export const onEthPersonalSign = (request:any, sendResponse:Function) => {
	return new Promise((resolve) => {
		chrome.runtime.onConnect.addListener(function(port) {
			if( port.name !== REQUEST_KEY.PERSONAL_SIGN)  return;
			port.onMessage.addListener(function(response) {
				if(response.sender !== SENDER.extension) return;
				if(response) {
					return sendResponse({
						id: request.id,
						data: response.result,
						target: TARGET,
						sender: SENDER.extension,
					});
				}
				else {
					return  sendResponse({
						id: request.id,
						data: [],
						target: TARGET,
						sender: SENDER.extension,
					});
				}
			})
			return true;
		})
		let url = '';
		chrome.tabs.query({active: true},
		function (tabs)
		{
			url = new URL(tabs[0].url || '')?.origin;
			openNotificationWindow({
				type: "notification",
				method: METHOD_TYPE.PERSONAL_SIGN,
				params: [{url: url, params:[...request.data.params]}]
			}).then((win) => {
			})
		});
	})
}

export const onEthSignData3 = (request:any, sendResponse:Function) => {
	return new Promise((resolve) => {
		chrome.runtime.onConnect.addListener(function(port) {
			if( port.name !== REQUEST_KEY.ETH_SIGN_DATA_V3)  return;
			port.onMessage.addListener(function(response) {
				if(response.sender !== SENDER.extension) return;
				if(response) {
					return sendResponse({
						id: request.id,
						data: response.result,
						target: TARGET,
						sender: SENDER.extension,
					});
				}
				else {
					return  sendResponse({
						id: request.id,
						data: [],
						target: TARGET,
						sender: SENDER.extension,
					});
				}
			})
			return true;
		})
		let url = '';
		chrome.tabs.query({active: true},
			function (tabs)
			{
				url = new URL(tabs[0].url || '')?.origin;
				openNotificationWindow({
					type: "notification",
					method: METHOD_TYPE.ETH_SIGN_DATA_V3,
					params: [{url: url, params:[...request.data.params]}]
				})
			}
		);
	})
}

export const onEthSignData4 = (request:any, sendResponse:Function) => {
	return new Promise((resolve) => {
		chrome.runtime.onConnect.addListener(function(port) {
			if( port.name !== REQUEST_KEY.ETH_SIGN_DATA_V4)  return;
			port.onMessage.addListener(function(response) {
				if(response.sender !== SENDER.extension) return;
				if(response) {
					return sendResponse({
						id: request.id,
						data: response.result,
						target: TARGET,
						sender: SENDER.extension,
					});
				}
				else {
					return  sendResponse({
						id: request.id,
						data: [],
						target: TARGET,
						sender: SENDER.extension,
					});
				}
			})
			return true;
		})
		let url = '';
		chrome.tabs.query({active: true},
		function (tabs)
		{
			url = new URL(tabs[0].url || '')?.origin;
			openNotificationWindow({
				type: "notification",
				method: METHOD_TYPE.ETH_SIGN_DATA_V4,
				params: [{url: url, params:[...request.data.params]}]
			})
		});
	})
}

export const onEthSignData = (request:any, sendResponse:Function) => {
	return new Promise((resolve) => {
		chrome.runtime.onConnect.addListener(function(port) {
			if( port.name !== REQUEST_KEY.ETH_SIGN_DATA)  return;
			port.onMessage.addListener(function(response) {
				if(response.sender !== SENDER.extension) return;
				if(response) {
					return sendResponse({
						id: request.id,
						data: response.result,
						target: TARGET,
						sender: SENDER.extension,
					});
				}
				else {
					return  sendResponse({
						id: request.id,
						data: [],
						target: TARGET,
						sender: SENDER.extension,
					});
				}
			})
			return true;
		})
		let url = '';
		chrome.tabs.query({active: true},
			function (tabs)
			{
				url = new URL(tabs[0].url || '')?.origin;
				openNotificationWindow({
					type: "notification",
					method: METHOD_TYPE.ETH_SIGN_DATA,
					params: [{url: url, params:[...request.data.params]}]
				})
		});
	})
}


export const onEthSign = (request:any, sendResponse:Function) => {
	return new Promise((resolve) => {
		chrome.runtime.onConnect.addListener(function(port) {
			if( port.name !== REQUEST_KEY.ETH_SIGN)  return;
			port.onMessage.addListener(function(response) {
				if(response.sender !== SENDER.extension) return;
				if(response) {
					return sendResponse({
						id: request.id,
						data: response.result,
						target: TARGET,
						sender: SENDER.extension,
					});
				}
				else {
					return  sendResponse({
						id: request.id,
						data: [],
						target: TARGET,
						sender: SENDER.extension,
					});
				}
			})
			return true;
		})
		let url = '';
		chrome.tabs.query({active: true},
		function (tabs)
		{
			url = new URL(tabs[0].url || '')?.origin;
			openNotificationWindow({
				type: "notification",
				method: METHOD_TYPE.ETH_SIGN,
				params: [{url: url, params:[...request.data.params]}]
			})
		});
	})
}

export const onRequestAccount = (request:any, sendResponse:Function) => {
	return new Promise((resolve) => {
		chrome.runtime.onConnect.addListener(function(port) {
			if( port.name !== REQUEST_KEY.ETH_REQUEST_ACCOUNTS)  return;
			port.onMessage.addListener(function(response) {
				if(response.sender !== SENDER.extension) return;
				if(response) {
					return sendResponse({
						id: request.id,
						data: response.accounts,
						target: TARGET,
						sender: SENDER.extension,
					});
				}
				else {
					return  sendResponse({
						id: request.id,
						data: [],
						target: TARGET,
						sender: SENDER.extension,
					});
				}
			})
			return true;
		})
		let url = '';
		chrome.tabs.query({active: true},
		function (tabs)
		{
			url = new URL(tabs[0].url || '')?.origin;
			openNotificationWindow({
				type: "notification",
				method: METHOD_TYPE.ETH_REQUEST_ACCOUNTS,
				params: [{url: url}]
			})
		});
	})
}

export const onRequestAccountPermission = (request:any, sendResponse:Function) => {
	return new Promise((resolve) => {
		chrome.runtime.onConnect.addListener(function(port) {
			if( port.name !== REQUEST_KEY.WALLET_REQUEST_PERMISSION)  return;
			port.onMessage.addListener(function(response) {
				if(response.sender !== SENDER.extension) return;
				if(response) {
					return sendResponse({
						id: request.id,
						data: response.accounts,
						target: TARGET,
						sender: SENDER.extension,
					});
				}
				else {
					return  sendResponse({
						id: request.id,
						data: [],
						target: TARGET,
						sender: SENDER.extension,
					});
				}
			})
			return true;
		})
		let url = '';
		chrome.tabs.query({active: true},
		function (tabs)
		{
			url = new URL(tabs[0].url || '')?.origin;
			openNotificationWindow({
				type: "notification",
				method: METHOD_TYPE.WALLET_REQUEST_PERMISSION,
				params: [{url: url}]
			})
		});
	})
}


export const onAddChain = (request:any, sendResponse:Function) => {
	return new Promise((resolve) => {
		chrome.runtime.onConnect.addListener(function(port) {
			if( port.name !== REQUEST_KEY.ADD_ETHEREUM_CHAIN)  return;
			port.onMessage.addListener(function(response) {
				if(response.sender !== SENDER.extension) return;
				if(response) {
					return sendResponse({
						id: request.id,
						data: response.result,
						target: TARGET,
						sender: SENDER.extension,
					});
				}
				else {
					return  sendResponse({
						id: request.id,
						data: null,
						target: TARGET,
						sender: SENDER.extension,
					});
				}
			})
			return true;
		})
		let url = '';
		chrome.tabs.query({active: true},
		function (tabs)
		{
			url = new URL(tabs[0].url || '')?.origin;
			openNotificationWindow({
				type: "notification",
				method: METHOD_TYPE.ADD_ETHEREUM_CHAIN,
				params:  [{url: url, params:request.data.params}]
			})
		});
	})
}
export const onSwitchNetwork = (request:any, sendResponse:Function) => {
	return new Promise((resolve) => {
		chrome.runtime.onConnect.addListener(function(port) {
			if( port.name !== REQUEST_KEY.SWITCH_ETHEREUM_CHAIN)  return;
			port.onMessage.addListener(function(response) {
				if(response.sender !== SENDER.extension) return;
				if(response) {
					return sendResponse({
						id: request.id,
						data: response.result,
						target: TARGET,
						sender: SENDER.extension,
					});
				}
				else {
					return  sendResponse({
						id: request.id,
						data: null,
						target: TARGET,
						sender: SENDER.extension,
					});
				}
			})
			return true;
		})
		let url = '';
		chrome.tabs.query({active: true},
		function (tabs)
		{
			url = new URL(tabs[0].url || '')?.origin;
			openNotificationWindow({
				type: "notification",
				method: METHOD_TYPE.SWITCH_ETHEREUM_CHAIN,
				params:  [{url: url, params:request.data.params}]
			})
		});
	})
}

export const onWatchAsset = (request:any, sendResponse:Function) => {
	return new Promise((resolve) => {
		chrome.runtime.onConnect.addListener(function(port) {
			if( port.name !== REQUEST_KEY.WATCH_ASSET)  return;
			port.onMessage.addListener(function(response) {
				if(response.sender !== SENDER.extension) return;
				if(response) {
					return sendResponse({
						id: request.id,
						data: response.result,
						target: TARGET,
						sender: SENDER.extension,
					});
				}
				else {
					return  sendResponse({
						id: request.id,
						data: null,
						target: TARGET,
						sender: SENDER.extension,
					});
				}
			})
			return true;
		})
		let url = '';
		chrome.tabs.query({active: true},
		function (tabs)
		{
			url = new URL(tabs[0].url || '')?.origin;
			openNotificationWindow({
				type: "notification",
				method: METHOD_TYPE.WATCH_ASSET,
				params: [{url: url, params:request.data.params}]
			}).then((win) => {
			})
		});
	})
}

export const onSendTransaction = (request:any, sendResponse:Function) => {
	return new Promise((resolve) => {
		chrome.runtime.onConnect.addListener(function(port) {
			if( port.name !== REQUEST_KEY.ETH_SEND_TRANSACTION)  return;
			port.onMessage.addListener(function(response) {
				if(response.sender !== SENDER.extension) return;
				if(response) {
					return sendResponse({
						id: request.id,
						data: response.result,
						target: TARGET,
						sender: SENDER.extension,
					});
				}
				else {
					return  sendResponse({
						id: request.id,
						data: null,
						target: TARGET,
						sender: SENDER.extension,
					});
				}
			})
			return true;
		})
		let url = '';
		chrome.tabs.query({active: true},
		function (tabs)
		{
			url = new URL(tabs[0].url || '')?.origin;
			openNotificationWindow({
				type: "notification",
				method: METHOD_TYPE.ETH_SEND_TRANSACTION,
				params:  [{url: url, params:request.data.params}]
			})
		});
	})
}



