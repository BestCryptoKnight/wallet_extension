// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import {EVENT, EVENT_NAME, METHOD_TYPE, TARGET} from "./constants"
import {Message} from './controller'

declare global {
    interface Window {
        ethereum:any;
    }
}

window.ethereum = {	
	...(window.ethereum || {}), 
	isNeon: true,
	isMetaMask: true,
	chainId: null,
	networkVersion: null,
	selectedAddress: null,
	isTrust: false,
	isTrustWallet: false,
	isCoin98: false,
	isSafePal: false,
	isTokenPocket: false,
	_metamask: {
		_isUnlocked: false,
		isUnlocked: () => {
			return window.ethereum._metamask._isUnlocked;
		}
	},
	_events: {},
	_state: {
		accounts: [],
		initialized: true,
		isConnected: true
	},
	enable: () => {
		return sendRequest('request', {method: 'eth_requestAccounts'});
	},
	isConnected:  () => {
		return sendRequest("isConnected", []) 
	},
	send: (args: object) => {
		return sendRequest('request', args);
	},
	sendAsync: (args: object) => {
		return sendRequest('request', args);
	},
	request: (args: object) => {
		return sendRequest('request', args);
	},
	on: (method: string, callback: Function) => {
	  return on(method, callback)
	},
	removeAllListeners: (event: string, callback: Function) => {
		return off(event, callback)
	},
	off: (method: string, callback: Function) => {
		return off(method, callback)
	},
	removeListener: (method: string, callback: Function) => {
		return off(method, callback)
	},
    addListener: (method: string, callback: Function) => {
      return on(method, callback)
    },
    once: (method: string, callback: Function) => {
      return on(method, callback)
    }
};

export const on = (eventName: string, callback: Function) => {
	const handler = (event: any) =>  callback(event.detail)
	if(Object.keys(EVENT_NAME).indexOf(eventName) === -1)  return;
	switch(eventName) {
		case EVENT_NAME.accountsChanged: {
			EVENT.accountsChanged.forEach(ename => {
				window.addEventListener(`${TARGET}_${ename}`, handler)
			});
			break;
		}
		case EVENT_NAME.connect: {
			EVENT.connect.forEach(ename => {
				window.addEventListener(`${TARGET}_${ename}`, handler)
			});
			break;
		}
		case EVENT_NAME.disconnect: {
			EVENT.disconnect.forEach(ename => {
				window.addEventListener(`${TARGET}_${ename}`, handler)
			});
			break;
		}
		case EVENT_NAME.message: {
			EVENT.message.forEach(ename => {
				window.addEventListener(`${TARGET}_${ename}`, handler)
			});
			break;
		}
		case EVENT_NAME.chainChanged: {
			EVENT.chainChanged.forEach(ename => {
				window.addEventListener(`${TARGET}_${ename}`, handler)
			});
			break;
		}
		case EVENT_NAME.unlockChange: {
			EVENT.unlockChange.forEach(ename => {
				window.addEventListener(`${TARGET}_${ename}`, handler)
			});
			break;
		}
	}
}; 
export const off = (eventName: string, callback: Function) => {
	if(Object.values(EVENT_NAME).indexOf(eventName) === -1)  return;
	switch(eventName) {
		case EVENT_NAME.accountsChanged: {
			EVENT.accountsChanged.forEach(ename => {
				window.removeEventListener(`${TARGET}_${ename}`, callback());
				// delete window.ethereum._events[ename]
			});
			break;
		}
		case EVENT_NAME.connect: {
			EVENT.connect.forEach(ename => {
				// window.removeEventListener(`${TARGET}_${ename}`, callback());
				// delete window.ethereum._events[ename]
			});
			break;
		}
		case EVENT_NAME.disconnect: {
			EVENT.disconnect.forEach(ename => {
				// window.removeEventListener(`${TARGET}_${ename}`, callback());
				// delete window.ethereum._events[ename]
			});
			break;
		}
		case EVENT_NAME.message: {
			EVENT.message.forEach(ename => {
				// window.removeEventListener(`${TARGET}_${ename}`, callback());
				// delete window.ethereum._events[ename]
			});
			break;
		}
		case EVENT_NAME.chainChanged: {
			EVENT.chainChanged.forEach(ename => {
				// window.removeEventListener(`${TARGET}_${ename}`, callback());
				// delete window.ethereum._events[ename]
			});
			break;
		}
		case EVENT_NAME.unlockChange: {
			EVENT.unlockChange.forEach(ename => {
				// window.removeEventListener(`${TARGET}_${ename}`, callback());
				// delete window.ethereum._events[ename]
				
			});
			break;
		}
	}
		
}

const sendRequest = async (method: string, params: any) => {
	const result: any = await Message.sendToContent({ method, data: params });
	const data = result.data;
	switch(params?.method) {
		case METHOD_TYPE.ETH_REQUEST_ACCOUNTS : {
			if(!Array.isArray(data)){
				let error = new Error('The user rejected the request') as any;
				error.code  = 4001
				
				throw error
			}
			else {
				return data
			}
		}; 
		case METHOD_TYPE.ADD_ETHEREUM_CHAIN : {
			if(data === null) {
				return data
			} else {
				let error = new Error('The user rejected the request') as any;
				error.code = 4001
				
				throw error
			}
		}; 
		
		case METHOD_TYPE.SWITCH_ETHEREUM_CHAIN : {
			if(data === null) {
				return data
			} else {
				let error = new Error('The user rejected the request') as any;
				error.code = 4902
				
				throw error
			}
		}; 
		
		case METHOD_TYPE.WALLET_REQUEST_PERMISSION : {
			if(!Array.isArray(data)){
				let error = new Error('Permissions needed to continue') as any;
				error.code  = 4001
				
				throw error
			}
			else {
				return data
			}
		}; 
		case METHOD_TYPE.ETH_SEND_TRANSACTION : {
			if(typeof data==='string'){
				return data
			} else {
				let error = new Error(data.reason) as any;
				error.reason = data.reason
				error.code = data.code
				error.action = data.action
				error.transaction = data.transaction
				throw data
			}
		}; 
		case METHOD_TYPE.ETH_ACCOUNTS : {
			if(!Array.isArray(data)){
				let error = new Error('The user rejected the request') as any;
				error.code  = 4001
				
				throw error
			}
			else {
				return data
			}
		}; 
		
		case METHOD_TYPE.ETH_SIGN : {
			if(data !== null) {
				return data
			} else {
				let error = new Error('The user rejected the request') as any;
				error.code = 4001
				
				throw error
			}
		}; 
		
		case METHOD_TYPE.PERSONAL_SIGN : {
			if(data !== null) {
				return data
			} else {
				let error = new Error('The user rejected the request') as any;
				error.code = 4001
				throw error
			}
		}; 
		
		case METHOD_TYPE.ETH_SIGN_DATA_V4 : {
			if(data !== null) {
				return data
			} else {
				let error = new Error('The user rejected the request') as any;
				error.code = 4001
				
				throw error
			}
		}; 
	}
	return result.data
}

window.addEventListener("load", ()=> {
	window.dispatchEvent(new Event('ethereum#initialized'));
})