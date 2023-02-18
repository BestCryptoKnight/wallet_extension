// by: Leo Pawel 	<https://github.com/galaxy126>
// at 28/6/2022
// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import { createSlice } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import {toast} from 'react-toastify';
import { ethers } from 'ethers';
import TimeAgo from 'javascript-time-ago'
import timeAgoEn from 'javascript-time-ago/locale/en.json'
import timeAgoZh from 'javascript-time-ago/locale/zh.json'
import langEn from './locales/en-US.json'
import langCn from './locales/zh-CN.json'
import {getPassHash} from '../lib/api'
import { getChromeStorage, setChromeStorage } from '../lib/chrome';

const chainIcons = {} as {[chainId: string]: string}
const tokenIcons = {} as {[address: string]: string}

TimeAgo.addLocale(timeAgoEn)
TimeAgo.addLocale(timeAgoZh)

const timeAgos:{[key:string]:any} = {
	'en-US': new TimeAgo('en'),
	'zh-CN': new TimeAgo('zh'),
}

const locales = {
	"en-US": langEn,
	"zh-CN": langCn,
} as {[lang: string]: {[key: string]: string}}; 

export const fetchJson = async (uri: string, params?: any) => {
	try {
		if (params===undefined) {
			const response = await fetch(uri, {headers: {Accept: "application/json", "Content-Type": "application/json"}});
			return await response.json()
		} else {
			const response = await fetch(uri, {
				body: JSON.stringify(params),
				headers: {Accept: "application/json", "Content-Type": "application/json"},
				method: "POST"
			});
			return await response.json()
		}
		
	} catch (error) {
		// console.log(error)
	}
	return null
}


export const initChainIcons = async () => {
	if (Object.keys(chainIcons).length===0) {
		const res = (await fetchJson("https://resource.neonlink.io/networks.json"));
		for (let k in res) {
			chainIcons[k] = res[k];
		}
	}
}

export const initTokenIcons = async (chainId: number) => {
	if (Object.keys(tokenIcons).length===0) {
		const res = (await fetchJson("https://resource.neonlink.io/tokens/259/"+chainId+"/icons.json"));
		for (let k in res) {
			tokenIcons[k] = res[k];
		}
	}
}

export const getChainIcon = (chainId: number) => {
	if(chainIcons[chainId]) return "https://resource.neonlink.io/networks/"+chainId+ chainIcons[chainId] ;
	return null;
}

export const getTokenIcon = async (chainId: number, address: string) => {
	if(tokenIcons[address]) return "https://resource.neonlink.io/tokens/" + chainId +"/" + address + tokenIcons[address];
	return null
}

export const NF = (n:string|number)=>String(n).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")

export const N = (num: number, p: number = 2) => num.toLocaleString('en', { maximumFractionDigits: p });


export const roundNumber = (number: string | number, p: number = 6) => {
	return parseFloat(number.toString()).toLocaleString("en", {maximumFractionDigits: p}).replace(/,/g, "");
}

export const toDate = (timestamp: number) => {
	const d = new Date(timestamp )
	return [d.getMonth() + 1, d.getDate()].join('/') + " " + d.getHours() +":"+(d.getMinutes())
}

export const toKillo = (n: number) => {
	return (Number(n) < 1000 ? String(n) : `${~~(Number(n)/1000)}k`)
}

export const ellipsis = (address: string, start: number=6) => {
	if (!address || address == null) return ''
	const len = (start ) + 7;
	return address.length > len ? `${address?.slice(0, start)}...${address?.slice(-4)}` : address
}

export const decodeCallData = (iface: ethers.utils.Interface, method: string, data: string) => {
	if (data!==undefined) {
		try {
			const value = iface.decodeFunctionResult(method, data)
			if (Array.isArray(value)) return value[0]
		} catch (error) {
		}
	}
	return null
}

export const showAlert = (text:string, type:"success"|"error"|"info"|"warning"|"default") => {
	switch(type) {
		case "success": toast.success(text, {position: "top-right", style: {color:'white', backgroundColor: 'rgb(0,0,0)'}, delay: 100 } ); break;
		case "warning": toast.warning(text, {position: "top-right", style: {color:'white', backgroundColor: 'rgb(0,0,0)'} }); break;
		case "error": toast.error(text, {position: "top-right", style: {color:'white', backgroundColor: 'rgb(0,0,0)'} }); break;
		case "info": toast.info(text, {position: "top-right", style: {color:'white', backgroundColor: 'rgb(0,0,0)'} }); break;
		default: toast.info(text, {position: "top-right", style: {color:'white', backgroundColor: 'rgb(0,0,0)'} }); break;
	}
}

export const validatePassword = (password:string) => {
	const pt = /^(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,}$/;
	return pt.exec(password) == null ? false : true;
}

export const validateUrl = (str : string) :boolean => {
	var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
	  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
	  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
	  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
	  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
	  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	return !!pattern.test(str);
}

export const getPass = async (): Promise<string> => {
	const p = await getPassHash();
	return p.result;
}

export const copyToClipboard = (text:string) => {
	var textField = document.createElement('textarea')
	textField.innerText = text
	document.body.appendChild(textField)
	textField.select()
	document.execCommand('copy')
	textField.remove()
	showAlert("Copied", "success")
};

export const initialState: StoreObject = {
	inited:				false,
	theme:				'',
	lang:				'en-US',
	loading:			false,
	lastAccessTime:		0,
	vault:				'',		// cipered wallet data
	networks:			[],
	tokens:				{},
	accounts:			[],
	apps:				{},		// connected app
	contacts:			[],
	transactions:		{},
	currentNetwork:		'',		// current network
	currentAccount:		'',		// current address
	setting:			{
		currency:		'USD',
		showTestnet:	true
	},
	createdAccountLayer: 0
}


export const initializeStore =  async () => {
	const ret =  await getChromeStorage() || {};
	return ret;
}

export const slice = createSlice({
	name: 'store',
	initialState,
	reducers: {
		update: (state: any, action:any) => {
			for (const k in action.payload) {
				if (state[k] === undefined) new Error(`undefined store key ${k}`)
				state[k] = action.payload[k]
			}
			setChromeStorage(state)
		}
	}
})

const useStore = () => {
	const G = useSelector((state: StoreObject) => state)
	const L = locales[G.lang]
	const dispatch = useDispatch()
	const update = (payload:Partial<StoreObject>) => dispatch(slice.actions.update({...payload, lastAccessTime: new Date().getTime()}))

	const getError = (code:number, args?:{[key:string]:string|number}|string|number) => T("error."+code, args)

	const T = (key:string, args?:{[key:string]:string|number}|string|number):string => {
		let text = L[key]
		if (text === undefined) throw new Error('Undefined lang key[' + key + ']')
		if (typeof args === 'string' || typeof args === 'number') {
			text = text.replace(/\{\w+\}/, String(args))
		} else if (args){
			for(let k in args) text = text.replace(new RegExp('{'+k+'}', 'g'), String(args[k]))
		}
		return text
	}

	const timeAgo = (time:number):string => {
		if (time<1e12) time *= 1000
		return timeAgos[G.lang].format(time)
	}

	const showLoading = (show: boolean) => update({loading: show})

	return {...G, getError,  update,showLoading, T, timeAgo};
}

export default useStore