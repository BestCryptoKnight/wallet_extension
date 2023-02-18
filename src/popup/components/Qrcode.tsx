// by: Olesa tanya 	<https://github.com/olesatanya>
// 1/7/2022

import React from 'react';
import { QRCode } from 'react-qrcode-logo';

interface QrcodeProps {
	address: string
	size?: number
	bgcolor?: string
}

const Qrcode = ({address, size=70, bgcolor='white'} : QrcodeProps) => {
	return (	
		<QRCode value={address} eyeRadius={5} size={size}  bgColor={bgcolor}  />
	)
}

export default Qrcode	