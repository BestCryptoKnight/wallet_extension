// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import {Message} from './controller'
const injectScript = () => {
	const script = document.createElement('script');
	script.async = false;
	script.src = chrome.runtime.getURL('injectscript.js');
	(document.head || document.documentElement).appendChild(script); 
};
function shouldInject() {
	const documentElement = document.documentElement.nodeName;
	const docElemCheck = documentElement ? documentElement.toLowerCase() === 'html' : true;
	const { docType }: any = window.document;
	const docTypeCheck = docType ? docType.name === 'html' : true;
	return docElemCheck && docTypeCheck;
}

if (shouldInject()) {
	injectScript();
	Message.createProxyController();
}