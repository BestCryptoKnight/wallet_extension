// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import '../../assets/css/auth/auth.scss'

export default function () {
	return (
		<div className='back-panel'>
			<div className='container inner-panel'>
				<div style={{paddingTop: '15%'}}>
					<div style={{textAlign: 'center'}}>
						<div className='flex center'>
							<Icon icon="Neon" size={120} height={50} />
						</div>
						<h3 className='text-yellow mt5'>Welcome to Neon Wallet</h3>
						<p>Connecting you to Neon and the Decentralized Web.</p>
						<p>We are happy to see you</p>
						<Link className="btn-primary mt5" to="/auth_selectwallet">
							Get Started
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
