// by: Leo Pawel 	<https://github.com/galaxy126>
// 28/6/2022
// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import { POPUP_WINDOW } from '../constants';
export const getChromeStorage = (key?: StoreObjectKeyType): Promise<Partial<StoreObject>|null> => (
	new Promise(response => {
		chrome.storage.local.get(key || null, (result) => {
			try {
				if (!chrome.runtime.lastError) {
					response(result)
					return
				}
			} catch (error) {
				response(null);
				return;
			}
		})
	})
)

export const setChromeStorage = (attrs: Partial<StoreObject>) => (chrome.storage.local.set({...attrs}))

export const showNotification = (title: string, message: string, url?: string) => {	
	chrome.notifications.create(url || '', {
		type: 'basic',
		title,
		iconUrl: url || chrome.runtime.getURL('../images/icon-16.png'),
		message,
	});
}

export const openNotificationWindow =  (search: any): Promise<chrome.windows.Window> => {
	return new Promise(async (res) => {
		chrome.windows.getCurrent({}, async function (win) {
			const width = win?.width || 1000;
			let url = chrome.runtime.getURL('popup.html');
			url = url + "?q=" + JSON.stringify(search);
			const link = encodeURI(url)
			chrome.windows.create({url: link, type: "popup", top:(win.top || 0), left:width + (win.left || 0) - POPUP_WINDOW.width, width:  POPUP_WINDOW.width, height: POPUP_WINDOW.height, focused: true}, function (notificationWindow) {
				res(notificationWindow || win)	;
			});	
		})
	})
}

export const expandView =  () => {
	const url = chrome.runtime.getURL('popup.html');
	window.open(url, "_blank")
}