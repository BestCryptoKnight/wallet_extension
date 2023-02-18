// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import { SENDER, METHOD_TYPE, REQUEST_KEY} from '../../../constants';
import AccountConnect from './Connect';
import AccountConnectPermission from './ConnectPermission';
import AddNetwork from './AddNetwork';
import AddToken from './AddToken';
import SwitchNetwork from './AllowNetwork';
import Transaction from './Transaction';
import useStore, { showAlert} from '../../useStore';
import {hash, decrypt} from '../../../lib/utils'
import {setPassHash} from '../../../lib/api'
import SignRequest from './SignRequest';
import Loading from '../../components/Loading';
import PersonalSign from './PersonalSign';
import SignDataV from './SignDataV';
import SignDataV3 from './SignDataV3';
import SignDataV4 from './SignDataV4';

interface Interface {
	lock	:	boolean
	page	:	any | null
	password: 	string
	loading:	boolean
}

export default function () {
	const [state, setStates] = React.useState<Interface>({
		lock: false,
		page: null,
		password: '',
		loading:	true
	});
	const updateStatus = (params: {[key: string]: string | number | boolean | Blob | any }) => setStates({ ...state, ...params });
	
	const {vault, lastAccessTime, setting, apps, update} = useStore();

	React.useEffect(() => {
		let lock = false;
		// let p = ''
		// let currentId = 0;
		// (async () => {	
		// 	currentId = (await chrome.tabs.getCurrent()).id || 0;
			// p = await getPass();
			// lock = (p == null || p == "") ? true: (new Date().getTime() - lastAccessTime>  (setting.autoLockTimer || 5) * 60000 ? true: false);
		// })()
		const link = new URL(decodeURI(window.location.href));
		const search = new URLSearchParams(link.search);
		const q = search.get("q") || '{}'
		const params = JSON.parse(q)
		const method = params['method'];
		if(!method) {
			window.close()
		}
		if(method) {
			switch(method) {
				case METHOD_TYPE.ETH_REQUEST_ACCOUNTS : {
					const port = chrome.runtime.connect({name: REQUEST_KEY.ETH_REQUEST_ACCOUNTS});
					updateStatus({
						page: <AccountConnect info={params['params']} onAccept = {(v: string[]) => {								
								port.postMessage({sender: SENDER.extension, "accounts": v}); 
								setTimeout(() => {
									window.close()
								}, 200)
							}}/>,
						loading: false,
						lock
					})
					break;
				}
				case METHOD_TYPE.WALLET_REQUEST_PERMISSION : {
					const port = chrome.runtime.connect({name: REQUEST_KEY.WALLET_REQUEST_PERMISSION});
					updateStatus({
						page: <AccountConnectPermission info={params['params']} onAccept = {(v: string[]) => {								
								port.postMessage({sender: SENDER.extension, "accounts": v}); 
								setTimeout(() => {
									window.close()
								}, 200)
							}}/>,
						loading: false,
						lock
					})
					break;
				}
				case METHOD_TYPE.ADD_ETHEREUM_CHAIN : {
					const port = chrome.runtime.connect({name: REQUEST_KEY.ADD_ETHEREUM_CHAIN});
					updateStatus({
						page: <AddNetwork info={params['params']} onAccept = {(v: string[]) => {								
								port.postMessage({sender: SENDER.extension, "result": v}); 
								setTimeout(() => {
									window.close()
								}, 200)
							}}/>,
						loading: false,
						lock
					})
					break;
				}
				case METHOD_TYPE.WATCH_ASSET : {
					const port = chrome.runtime.connect({name: REQUEST_KEY.WATCH_ASSET});
					updateStatus({
						page: <AddToken info={params['params']} onAccept = {(v: string[]) => {								
								port.postMessage({sender: SENDER.extension, "result": v}); 
								setTimeout(() => {
									window.close()
								}, 200)
							}}/>,
						loading: false,
						lock
					})
					break;
				}
				case METHOD_TYPE.SWITCH_ETHEREUM_CHAIN : {
					const port = chrome.runtime.connect({name: REQUEST_KEY.SWITCH_ETHEREUM_CHAIN});
					updateStatus({
						page: <SwitchNetwork info={params['params']} onAccept = {(v: string[]) => {								
								port.postMessage({sender: SENDER.extension, "result": v}); 
								setTimeout(() => {
									window.close()
								}, 200)
							}}/>,
						loading: false,
						lock
					})
					break;
				}
				case METHOD_TYPE.ETH_SEND_TRANSACTION : {
					const port = chrome.runtime.connect({name: REQUEST_KEY.ETH_SEND_TRANSACTION});
					updateStatus({
						page: <Transaction info={params['params']} onAccept = {(v: string[]) => {								
								port.postMessage({sender: SENDER.extension, "result": v}); 
								setTimeout(() => {
									window.close()
								}, 200)
							}}/>,
						loading: false,
						lock
					})
					break;
				}
				
				case METHOD_TYPE.ETH_SIGN : {
					const port = chrome.runtime.connect({name: REQUEST_KEY.ETH_SIGN});
					updateStatus({
						page: <SignRequest info={params['params']} onAccept = {(v: string[]) => {								
								port.postMessage({sender: SENDER.extension, "result": v});  
								setTimeout(() => {
									window.close()
								}, 200)
							}}/>,
						loading: false,
						lock
					})
					break;
				}
				case METHOD_TYPE.PERSONAL_SIGN : {
					const port = chrome.runtime.connect({name: REQUEST_KEY.PERSONAL_SIGN});
					updateStatus({
						page: <PersonalSign info={params['params']} onAccept = {(v: string[]) => {								
								port.postMessage({sender: SENDER.extension, "result": v});  
								setTimeout(() => {
									window.close()
								}, 200)
							}}/>,
						loading: false,
						lock
					})
					break;
				}
				case METHOD_TYPE.ETH_SIGN_DATA : {
					const port = chrome.runtime.connect({name: REQUEST_KEY.ETH_SIGN_DATA});
					updateStatus({
						page: <SignDataV info={params['params']} onAccept = {(v: string[]) => {								
								port.postMessage({sender: SENDER.extension, "result": v});  
								setTimeout(() => {
									window.close()
								}, 200)
							}}/>,
						loading: false,
						lock
					})
					break;
				}
				case METHOD_TYPE.ETH_SIGN_DATA_V3 : {
					const port = chrome.runtime.connect({name: REQUEST_KEY.ETH_SIGN_DATA_V3});
					updateStatus({
						page: <SignDataV3 info={params['params']} onAccept = {(v: string[]) => {								
								port.postMessage({sender: SENDER.extension, "result": v});  
								setTimeout(() => {
									window.close()
								}, 200)
							}}/>,
						loading: false,
						lock
					})
					break;
				}
				case METHOD_TYPE.ETH_SIGN_DATA_V4 : {
					const port = chrome.runtime.connect({name: REQUEST_KEY.ETH_SIGN_DATA_V4});
					updateStatus({
						page: <SignDataV4 info={params['params']} onAccept = {(v: string[]) => {								
								port.postMessage({sender: SENDER.extension, "result": v});  
								setTimeout(() => {
									window.close()
								}, 200)
							}}/>,
						loading: false,
						lock
					})
					break;
				}
			}
		}
	}, [])

	
	const unlock = async () => {
		const passHash = hash(state.password)
		const plain = await decrypt(vault, passHash);
		if (plain===null || plain==='') return showAlert("Incorrect password", "warning")
		const wallet = JSON.parse(plain)
		if(!wallet) {
			return showAlert("Could not found wallet info.", "warning");
		}
		const res = await setPassHash(passHash)
		updateStatus({lock: false})
	}

	return (
		<div className='back-panel'>
			<div className='container inner-panel'>
				{
					// !state.lock &&
					state.page
				}
				{
					state.loading && <Loading />
				}
				{/* {
					state.lock && <div className="justify middle center text-center">
						<div className='w100 mt5'>
							<div className="flex center">
								<Icon icon="Neon" size={110} height={50} />
							</div>
							<h3>Welcome Back!</h3>
							<h5>The decentralized web awaits</h5>
							<input type={"password"} placeholder = "Password" value={state.password} onChange={(e) => {updateStatus({password: e.target.value })}} style={{width:'100%'}}/>
							<div className="btn-primary  mt3" style={{width:'100%', padding:'0.8em'}} onClick={() => {unlock()}}>
								UNLOCK  
							</div>
							<a href='/terms/forget-password' className='t-small text-pink block mt3 mb3' >FORGET PASSWORD?</a>
							<div style={{position:'absolute', bottom:'35px', left:0, right:0}}>
								<a href='/terms/support'>
									<p className='t0'>Need help? Contact</p>
									<span className='pointer text-yellow'>Neon Wallet Support</span>
								</a>
							</div>
						</div>
					</div>
				} */}
			</div>
		</div>
	);
}
