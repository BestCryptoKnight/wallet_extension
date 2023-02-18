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
				<div className="justify" style={{alignItems:'start'}}>
					<Link className='back-btn' style={{position:'relative'}} to="/auth_start">
						<Icon icon="ArrowLeft" size={20}/>
					</Link>
					<Icon icon="Neon" size={120} height={50}/>
					<div style={{width:'20px'}}></div>
				</div>
				<div style={{paddingTop: '5%'}}>
					<div style={{textAlign: 'center'}}>
						<h4 className='text-yellow' style={{margin:'0'}}>New to Neon Wallet?</h4>
						<div className="row middle center">
							<div className="col-lg-6 col-sm-12 row center">
								<div className="select-card">
									<h5 className='text-center' style={{margin:'0.5em'}}>No, I already have a Secret Recovery Phrase</h5>
									<p style={{lineHeight:'1.5em'}}>Import your existing wallet using a Secret Recovery Phrase</p>
									<Link className="btn-primary" to="/auth_agree">
										Import Wallet
									</Link>
								</div>
							</div>
							<div className="col-lg-6 col-sm-12 row center">
								<div className="select-card" >
									<h5 className='text-center' style={{margin:'0.5em'}}>Yes, let's get set up! </h5>
									<br></br>
									<p style={{lineHeight:'1.5em'}}>This will create a new wallet and Secret Recovery Phrase</p>
									<Link className="btn-primary" to="/auth_createpassword">
										Create a Wallet
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
