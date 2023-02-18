// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022


import React from 'react';
import { useHistory } from 'react-router-dom';
import Icon from '../../components/Icon'
import useStore, { showAlert} from '../../useStore';
import {hash, decrypt} from '../../../lib/utils'
import {setPassHash} from '../../../lib/api'
import config from '../../../config.json'

export default function () {	
	const [status, setStatus] = React.useState({ 
		password:		''
	});
	const updateStatus = (params:{[key:string]:string|number|boolean}) => setStatus({...status, ...params});
	const {vault} = useStore();
	const history = useHistory();

	const unlock = async () => {
		const passHash = hash(status.password)
		const plain = await decrypt(vault, passHash);
		if (plain===null || plain==='') return showAlert("Incorrect password", "warning")
		const wallet = JSON.parse(plain)
		if(!wallet) {
			return showAlert("Could not found wallet information.", "warning");
		}
		const res = await setPassHash(passHash)
		if(res) history.push("/assets")
	}

	return (
		<>
			<div className='back-panel'>
				<div className='container inner-panel'>
					<div className="justify middle center text-center">
						<div className='w100 mt5'>
							<div className="flex center">
								<Icon icon="Neon" size={110} height={50}/>
							</div>
							<h3>Welcome Back!</h3>
							<h5>The decentralized web awaits</h5>
							<input type={"password"} placeholder = "Password" value={status.password} onChange={(e) => {updateStatus({password: e.target.value })}} style={{width:'100%'}}/>		
							<div className="btn-primary  mt3" style={{width:'100%', padding:'0.8em'}} onClick={() => {unlock()}}>
								UNLOCK  
							</div>
							<div style={{position:'absolute', bottom:'35px', left:0, right:0}}>
								<div>
									<p className='t0'>Need help? Contact</p>
									<a className='pointer text-yellow' href={config.links.support} target={"_blank"}>
										Neon Wallet Support
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
