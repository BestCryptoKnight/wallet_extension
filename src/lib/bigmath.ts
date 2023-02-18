// by: Leo Pawel 	<https://github.com/galaxy126>
// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import {BigNumber, ethers} from 'ethers'

export type WeiType = number|string|ethers.BigNumber

export const badd = (a: WeiType, b: WeiType) : BigNumber => {
    let n1:BigNumber, n2:BigNumber;
	if(typeof a === "string" || typeof a === "number") { n1 = BigNumber.from(Number(a).toFixed(0));}
	else n1 = a;
	if(typeof b === "string" || typeof b === "number") { n2 = BigNumber.from(Number(b).toFixed(0));}
	else n2 = b;
	return n1.add(n2)
}

export const bsub = (a: WeiType, b: WeiType) => {
	let n1:BigNumber, n2:BigNumber;
	if(typeof a === "string" || typeof a === "number") { n1 = BigNumber.from(Number(a).toFixed(0));}
	else n1 = a;
	if(typeof b === "string" || typeof b === "number") { n2 = BigNumber.from(Number(b).toFixed(0));}
	else n2 = b;
	return n1.sub(n2)
}

export const bmul = (a: WeiType, b: WeiType) => {
	let n1:BigNumber, n2:BigNumber;
	if(typeof a === "string" || typeof a === "number") { n1 = BigNumber.from(Number(a).toFixed(0));}
	else n1 = a;
	if(typeof b === "string" || typeof b === "number") { n2 = BigNumber.from(Number(b).toFixed(0));}
	else n2 = b;
	return n1.mul(n2)
}

export const bdiv = (a: WeiType, b: WeiType) => {
	let n1:BigNumber, n2:BigNumber;
	if(typeof a === "string" || typeof a === "number") { n1 = BigNumber.from(Number(a).toFixed(0));}
	else n1 = a;
	if(typeof b === "string" || typeof b === "number") { n2 = BigNumber.from(Number(b).toFixed(0));}
	else n2 = b;
	return n1.div(n2)
}

export const parseUnit = (v: WeiType, unit: number) => {
	if(typeof v === "number" || typeof v === "string") v = Number(v).toString()
	else if(typeof v !== "string") v = v.toString()
	return ethers.utils.parseUnits(v, unit)
}

export const formatUnit = (v: WeiType, unit: number) => {
	if(typeof v === "number" || typeof v === "string") v = BigNumber.from(v).toString();
	return ethers.utils.formatUnits(v, unit)
}