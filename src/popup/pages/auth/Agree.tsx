// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import '../../assets/css/auth/auth.scss'
import config from '../../../config.json'

const Agree = () => {
	return (
		<div className='back-panel'>
			<div className='container inner-panel'>
				<div className="justify" style={{alignItems:'start'}}>
					<Link className='back-btn' style={{position:'relative'}} to="/auth_start">
						<Icon icon="ArrowLeft"  size={20} />
					</Link>
					<Icon icon="Neon" size={120} height={50}/>
					<div></div>
				</div>
				<div>
					<div>
						<h5  style={{textAlign:'center'}}>HELP US IMPROVE NEON WALLET</h5>
						<p className='t0'>
							Neon wallet would like to gather basic usage data to
							better understand how our users interact with the
							mobile app. This data will be used to continually
							improve the usability and user experience of our
							product.
						</p>
						<div className="row middle ml1">
							<Icon icon="Check" />
							<p className='t0 ml1'>Always allow you to opt-out via Settings</p>
						</div>
						<div className="row middle ml1">
							<Icon icon="Check" />
							<p className='t0 ml1'>Send anonymized click &amp; pageview</p>
						</div>
						<div className="row middle ml1">
							<Icon icon="Check" />
							<p className='t0 ml1'>Send country, region,  location</p>
						</div>
						<div className="row middle ml1">
							<Icon icon="Close" size={14}/>
							<p className='t0 ml1'>Never collect keys, information</p>
						</div>
					</div>
					<div className="row middle ml1">
						<Icon icon="Close" fill="var(--color-pink)" size={14}/>
						<p className='t0 ml1'>Never collect your IP address</p>
					</div>
					<div className="row middle ml1">
						<Icon icon="Close" fill="var(--color-pink)" size={14}/>
						<p className='t0 ml1'>Never sell data for profit. Ever!</p>
					</div>
					<div className="hr"></div>
					<p className='t0'>
					This data is aggregated and is therefore anonymous
					for the purposes of General Data Protection
					Regulation (EU) 2016/679. For more information in
					relation to our privacy practices, please see our
					<a className='text-yellow' href={config.links.privacyPolicy} target="_blank">Privacy Policy </a>
					here.</p>
					<div className="hr mt3 mb3"></div>
					<div className="justify justify-around">
						<Link className="btn-cancel  mt1" style={{width:'150px'}} to="/auth_importphrase">
							NO THANKS
						</Link>
						<Link className="btn-special  mt1" style={{width:'150px'}} to="/auth_importphrase">
							I AGREE
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
export default Agree