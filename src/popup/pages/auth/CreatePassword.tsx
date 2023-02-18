// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import { Link, useHistory } from 'react-router-dom'
import '../../assets/css/auth/auth.scss'
import Icon from '../../components/Icon'
import { hash } from '../../../lib/utils';
import { showAlert } from '../../useStore';

export default function () {
	const [status, setStatus] = React.useState({ 
		password1:		'',
		password2:		'',
		remember:		false,
		checked:		false
	});
	const updateStatus = (params:{[key:string]:string|number|boolean}) => setStatus({...status, ...params});
	const history = useHistory();

	const checkPassword = () => {
		if(status.password1 ==="") return showAlert("Invalid password", "info")
		if((status.password1.length < 8)) return showAlert("Invalid password", "info");
		if(status.password1 !== status.password2) return showAlert("Invalid confirm password", "info")
		if(!status.checked) return showAlert("Please select check to accept of term", "info")
		history.push("/auth_viewsecure/"+hash(status.password1)); 
	}

	return (
		<div className='back-panel'> 
			<div className='container inner-panel'>
				<div className="justify" style={{alignItems:'start'}}>
					<Link className='back-btn' style={{position:'relative'}} to="/auth_selectwallet">
						<Icon icon="ArrowLeft"  size={20}/>
					</Link>
					<Icon icon="Neon" size={120} height={50}/>
					<div></div>
				</div>
				<div>
					<div style={{textAlign: 'center'}}>
						<h4  style={{margin:'0.5em'}}>CREATE PASSWORD</h4>
						<p className='t0'>This password will unlock your Neon Wallet only on this device</p>
						<div className="justify">
							<p className='t0'>New password (8 characters min)</p>
						</div>	
						<div style={{position: 'relative'}}>
							<input type="password" placeholder='New password' value={status.password1} onChange={(e) => {updateStatus({password1: e.target.value})}}/>
						</div>
						
						<div className="justify">
							<p className='t0'>Confirm password</p>
						</div>
						<div style={{position: 'relative'}}>
						<input type="password" placeholder='Confirm password' value={status.password2} onChange={(e) => {updateStatus({password2: e.target.value})}}/>
						</div>
						<div className="flex middle" onClick={() => {updateStatus({checked: !status.checked})}}>
							<div className='checkbox pointer' >
								{status.checked && <Icon icon="Check" size={8} height={20} fill="var(--color-pink)" />}
							</div>
							<p className='t0 ml1 pointer' style={{textAlign:'left', width:'90%' }}>I understand that Neon Wallet cannot recover this password for me. 
								
							</p>	
						</div>						
						<button className={`btn-primary mt1 ${status.checked ? '': 'disabled'}`} disabled={status.checked ?false : true} style={{width:'200px'}} onClick={()=>{checkPassword()}}>
							CONTINUE
						</button>
					</div>
				</div>
			</div>	
		</div>
	);
}
