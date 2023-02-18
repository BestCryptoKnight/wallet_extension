// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import CryptoJS  from "crypto-js";

const hmacKey = '12Fd6B0dAE5a52348A1500940fCeD6276C1603c'

export const hash = (message: string) => CryptoJS.HmacSHA1(message, hmacKey).toString()

export const encrypt =  (plain: string, iv: string): string|null => {
	try {
		return CryptoJS.AES.encrypt(plain, iv).toString();
	} catch(error) {
		// console.log(error)
	}
	return null
}

export const decrypt = (cipher: string, iv: string): string|null => {	
	try {
		return CryptoJS.AES.decrypt(cipher, iv).toString(CryptoJS.enc.Utf8);		
	} catch(error) {
		// console.log(error)
	}
	return null;
}

export const call = async (url: string) => {
	try {
		const result = await fetch(url, { method:"GET", headers: { 'content-type': 'application/json' }});
		return await result.json();
	} catch (error) {
		console.log(error)
	}
	return null
}