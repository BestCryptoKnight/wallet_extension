// by: Olesa tanya 	<https://github.com/olesatanya>
// 1/7/2022

import React from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
const  {renderIcon }  = require('@download/blockies');

interface AvartarProps {
	address: string
	type: number
	size?: number
}

const Avartar = ({address, size=30, type=1} : AvartarProps) => {
	const [dataUrl, setDataUrl] = React.useState<string>('');
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	
	React.useEffect(() => {
		if(type == 2) {
			const canvas = canvasRef.current;
			renderIcon({ seed: address.toLowerCase() }, canvas);
			if(canvas) {
				const updatedDataUrl = canvas.toDataURL();
				if (updatedDataUrl !== dataUrl) {
					setDataUrl(updatedDataUrl);
				} 
			}
		}
	}, [ address, type]);
 
	  
	if(type === 1) {
		return <Jazzicon diameter={size} seed={jsNumberForAddress(address)} />;
	} else {
		return <>
			<canvas ref={canvasRef} style={{ display: 'none' }} />
			<img src={dataUrl} height={size} width={size} style={{borderRadius:'50%'}}/>
	  	</>
	}
}

export default Avartar