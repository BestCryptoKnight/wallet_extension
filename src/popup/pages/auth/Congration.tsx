// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import '../../assets/css/auth/auth.scss'
import config from '../../../config.json'

export default function () {
	return (
		<div className='back-panel'>
			<div className='container inner-panel'>
				<div className="justify" style={{alignItems:'start'}}>
					<Link className='back-btn' style={{position:'relative'}} to="/auth_agree">
						<Icon icon="ArrowLeft"  size={20}/>
					</Link>
					<Icon icon="Neon" size={120} height={50}/>
					<div></div>
				</div>
				<div>
					<div style={{maxWidth:'780px', marginLeft:'auto', marginRight:'auto'}}>
						<h4 className='mt3 text-center' >Congratulations</h4>
						<p className='t0' >You passed the test-keep your Secret Recovery Phrase safe, it's your responsibility!</p>
						<p className='t0 text-yellow'>Tips on stringly it safely</p>
						<div className="row middle ml1">
							<Icon icon="Check" />
							<p className='m0 ml1 t0 w90'>Save a backup in multiple places.</p>
						</div>
						<div className="row middle ml1">
							<Icon icon="Check" />
							<p className='m0 ml1 t0 w90'>Never share the phrase with anyone</p>
						</div>
						<div className="row middle ml1">
							<Icon icon="Check" />
							<p className='m0 ml1 t0 w90'>Be careful of phishing! Neon Wallet will never spontaneously ask for your Secret Recovery Phrase.</p>
						</div>
						<div className="row middle ml1">
							<Icon icon="Check" />
							<p className='m0 ml1 t0 w90'>If you need to back up your Secret Recovery Phrase again, you can find it in Settings -&gt; Security </p>
						</div>
						<div className="row middle ml1">
							<Icon icon="Check" />
							<p className='m0 ml1 t0 w90'>If you ever have questions or see something fishy, contract our support <a href={config.links.support} target="_blank" className='text-yellow'>here</a></p>
						</div>
						<br></br>
						<p className="t0">*Neon Wallet cannot recover your Secret Recovery Phrase.</p>
						<div>
							<div className="btn-primary  mt1" style={{width:'200px'}} onClick = {() => {window.close()}}>
								ALL DONE
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
