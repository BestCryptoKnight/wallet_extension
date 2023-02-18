// by: Olesa tanya 	<https://github.com/olesatanya>
// 11/8/2022

import ReactLoading from "react-loading";
import React from 'react';
interface LoadingProps {
	size?: number
	bgcolor?: string
}

const Loading = ({size=100, bgcolor='rgba(0,0,0,0.2)'} : LoadingProps) => {
	return (	
		<>
			<div style={{position:'fixed', top:'0', left:'0', width:'100vw', height:'100vh', backgroundColor:`${bgcolor}`}}>
				<div style={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', height:'100%'}}>
					<div style={{width: `${size}px`, height: `${size}px`, borderRadius:'5px', backgroundColor:'rgba(0,0,0,0.45)', display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
						<ReactLoading type="cylon" color="#eee" height='85px' width='85px'/>
					</div>
				</div>
			</div>	
		</>
	)
}

export default Loading