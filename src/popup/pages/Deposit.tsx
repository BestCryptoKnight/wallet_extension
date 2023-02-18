// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import Icon from '../components/Icon';
import '../assets/css/deposit.scss'
import useStore from '../useStore';
import AccountDetails from './AccountDetails';

interface ConnectDialogProps {
	onClose: Function
}

export default function ({ onClose }: ConnectDialogProps) {
	const {currentNetwork, networks} = useStore()

	const [status, setStatus] = React.useState({ 
		openConnectSite: false,
		currentSymbol: "",
		openAccountDetails: false
	});
	const updateStatus = (params:{[key:string]:string|number|boolean}) => setStatus({...status, ...params});


	React.useEffect(()=> {
		Object.values(networks).map((network) => {
			if( network.chainKey === currentNetwork){
				updateStatus({currentSymbol:network.symbol})
			}	
		})
	}, [])
	
	return (
		<div className='deposit-modal'>
			<div className=" token-panel">
				<div className="header">
					<h3 className='m0 text-center'>DEPOSIT {status.currentSymbol}</h3>
					<p className='t0 w90 ml-auto mr-auto text-center'>To interact with decentralized applications using Neon Wallet, you’ll need ETH in your wallet.</p>
					<span className="close-btn" onClick={()=>onClose()}>
						<div className="justify">
							<Icon icon="Close" size={12} fill="var(--color-pink)"/>
						</div>
					</span>
				</div>
				<div className="content">
					<div className="hr mt1 mb1"></div>
					<div className="text-center">
						<img src= {require('../assets/img/deposit.png')} style={{width:'200px', margin:'0.5em'}}/>
					</div>
					<h5 className='text-center'>Buy  {status.currentSymbol} with Transak</h5>
					<p className='t0 p1'>Transak supports credit &amp; debit cards, Apple Pay, MobiKwik, and bank transfers (depending on location) in 100+ countries.  {status.currentSymbol} deposits directly into your Neon Wallet account.</p>
					<div className="text-center">
						<div className="btn-primary  mt1 mb3" style={{width: '250px'}}  onClick={()=> {updateStatus({openAccountDetails: true})}} >
							VIEW ACCOUNT
						</div>
					</div>
				</div>
				{
					status.openAccountDetails && (
						<AccountDetails onClose={()=>{updateStatus({openAccountDetails: false})}}/>
					)
				}
			</div>
		</div>
	);
}
