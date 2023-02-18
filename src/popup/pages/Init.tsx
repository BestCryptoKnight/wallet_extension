// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import '../assets/css/auth/auth.scss'
import Icon from '../components/Icon'
import Loading from '../components/Loading';
import useStore, { initChainIcons, initTokenIcons } from '../useStore';

export default function () {
	const {currentNetwork, networks} = useStore()
	
	React.useEffect(() => {
		initChainIcons().then(()=>{});
		Object.values(networks).map((network: NetworkObject) => {
			if(network.chainKey == currentNetwork) {
				initTokenIcons(network.chainId).then(()=>{});		
			}
		})
	}, [])

	return (
		<>
			<div className='back-panel'>
				<div className='container inner-panel'>
					<div className='flex center' style={{height:'100%', justifyContent:'center', marginTop:'-120px', alignItems:'center'}}>
						<Icon icon="Neon" size={120} height={50} />
					</div>
				</div>
			</div>
			<Loading />
		</>
	);
}
