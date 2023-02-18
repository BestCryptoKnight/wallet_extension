// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

declare global {
    interface Window {
        ethereum:any;
    }
}

import {EVENT, EVENT_NAME, SENDER, TARGET} from './constants'
import { callRpc } from './lib/wallet';

export const Message = {
	sendToBackground: function (request:any) {
		return new Promise((res, rej) =>
		chrome.runtime.sendMessage({ ...request, target: TARGET, sender: SENDER.webpage }, async (response) => {
				if(response.data && response.data?.callrpc) {
					const rows = await callRpc(response.data?.rpc, response.data?.params)
					res({
						id: response.id,
						sender: response.sender,
						target: response.target,
						data: rows[0].result
					})
				}
				else {
					res(response)
				}
			}
		));
	},
	sendToContent: function ({method, data} : any) {
		return new Promise((res, rej) => {
			const requestId = Math.random().toString(36).substr(2, 9);
			window.addEventListener('message', function responseHandler(e) {
				const response = e.data;
				if (typeof response !== 'object' || response === null || !response.target || response.target !== TARGET || !response.id || response.id !== requestId || !response.sender || response.sender !== SENDER.extension) return;
				window.removeEventListener('message', responseHandler);
				if (response.error) rej(response.error);
				else res(response);
			});
			window.postMessage(
				{
					method,
					data,
					target: TARGET,
					sender: SENDER.webpage,
					id: requestId,
				},
				window.origin
			);
		});
	},

	createProxyController: () => {
		//listen to events from background
		chrome.runtime.onMessage.addListener((response) => {
			if (typeof response !== 'object' || response === null || !response.target || response.target !== TARGET || !response.sender || response.sender !== SENDER.extension || !response.event) return;
			const eventName = response.event;
			if(Object.keys(EVENT_NAME).indexOf(eventName) === -1)  return;
			switch(eventName) {
				case EVENT_NAME.accountsChanged: {
					EVENT.accountsChanged.forEach(ename => {
						const event = new CustomEvent(`${TARGET}_${ename}`, {
							detail: response.data,
						});
						window.dispatchEvent(event);
					});
					break;
				}
				case EVENT_NAME.connect: {
					EVENT.connect.forEach(ename => {
						const event = new CustomEvent(`${TARGET}_${ename}`, {
							detail: response.data,
						});
						window.dispatchEvent(event);
					});
					break;
				}
				case EVENT_NAME.disconnect: {
					EVENT.disconnect.forEach(ename => {
						const event = new CustomEvent(`${TARGET}_${ename}`, {
							detail: response.data,
						});
						window.dispatchEvent(event);
					});
					break;
				}
				case EVENT_NAME.message: {
					EVENT.message.forEach(ename => {
						const event = new CustomEvent(`${TARGET}_${ename}`, {
							detail: response.data,
						});
						window.dispatchEvent(event);
					});
					break;
				}
				case EVENT_NAME.chainChanged: {
					EVENT.chainChanged.forEach(ename => {
						const event = new CustomEvent(`${TARGET}_${ename}`, {
							detail: response.data,
						});
						window.dispatchEvent(event);
					});
					break;
				}
				case EVENT_NAME.unlockChange: {
					EVENT.unlockChange.forEach(ename => {
						const event = new CustomEvent(`${TARGET}_${ename}`, {
							detail: response.data,
						});
						window.dispatchEvent(event);
					});
					break;
				}
			}
			return true;
		});

		//listen to function calls from webpage
		window.addEventListener('message', function (e) {
			const request = e.data;
			if (typeof request !== 'object' || request === null || !request.target || request.target !== TARGET || !request.sender || request.sender !== SENDER.webpage) return;
			request.origin = window.origin;
			Message.sendToBackground(request).then((response) => {
				window.postMessage(response);
			});
		});
	}
};
