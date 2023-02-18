// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import '../assets/css/account.scss'
import Icon from '../components/Icon';
import useStore, { copyToClipboard, ellipsis,  showAlert} from '../useStore';
import QRCode from '../components/Qrcode';
import {hash, decrypt} from '../../lib/utils'
import Avartar from '../components/Avartar'

interface ConnectDialogProps {
	onClose: Function
}

export default function ({ onClose }: ConnectDialogProps) {
	const [status, setStatus] = React.useState({ 
		openViewPrivatekey: false,
		password: '',
		privateK: '',
		passLock: true,
		editAccount: false,
		tmpAccountName: '',
		accountName: ''
	});
	const updateStatus = (params:{[key:string]:string|number|boolean}) => setStatus({...status, ...params});
	const {currentAccount, accounts, networks, currentNetwork, vault, setting, update} = useStore()

	const showPrivatekey = async () => {
		try {
			const passHash = hash(status.password);
			const plain = await decrypt(vault, passHash);
			if (plain===null || plain==='') return showAlert("Incorrect password", "warning")
			const wallet = JSON.parse(plain)
			const privatekey  = wallet.keys?.[currentAccount]
			if (privatekey) {
				updateStatus({privateK: privatekey, passLock: false, password: ""})
			} else {
				showAlert("Could not found wallet infomation.", "warning");
			}
		} catch (error) {
			showAlert("Incorrect password", "warning");
		}
	}

	const setAccountName = () => {
		const label = status.tmpAccountName;
		updateStatus({accountName: label, editAccount: false});	
		const newAccounts:AccountObject[] = [];
		Object.values(accounts).map((account) => {
			var newAccount:AccountObject = {
				"address": account.address,
				"imported": account.imported,
				"index": account.index,
				"label": account.address === currentAccount ? label: account.label,
				"tokens": account.tokens,
				"value": account.value
			};
			newAccounts.push(newAccount)
		})
		update({accounts: {...newAccounts}})
	}

	React.useEffect(()=> {
		Object.values(accounts).map((account) => {
			if(account.address === currentAccount) {
				updateStatus({accountName: account.label});
				return;
			}
		})
	}, [])

	return (
		<div className='account-modal'>
			<div className="token-panel">
				<div className='top-bar'></div>
				<div className="header">
					
					<div className = "avartar" onClick={(e) => { {updateStatus({openSettingModal:true})}}}> 
						<Avartar address={currentAccount} size={50} type={setting.identicon === 'jazzicons'? 1: 2}/>
					</div>
					<div className="flex center middle">
						<h4 className='mr1 text-center'>
							{!status.editAccount && <>{status.accountName}</>}  
							{status.editAccount && <input type="text" maxLength={20} value={status.tmpAccountName} style={{textAlign:'center', padding:'0.2em 1em'}} onChange={(e)=> {updateStatus({tmpAccountName: e.target.value })}}/>}
						</h4>
						{
							!status.editAccount && <span style={{cursor:'pointer'}} onClick={()=> {updateStatus({editAccount: true, tmpAccountName: status.accountName})}}><Icon icon="Edit" fill='var(--color-yellow)' marginLeft={10}/></span>
						}
						{
							status.editAccount && <span style={{cursor:'pointer'}} onClick={()=> { setAccountName()}}><Icon icon="Check" fill='var(--color-yellow)' marginLeft={10}/></span>
						}
					</div>
					<span className="close-btn" onClick={()=>onClose()}>
						<Icon icon="Close" size= {12} fill="var(--color-pink)"/>
					</span>
				</div>
				<div className="content">
					<div className={`${status.openViewPrivatekey? 'hide': 'show'}`}>
						<div className='qrcode'>
							<QRCode address={currentAccount} size={120}/>
						</div>
						<div className="justify mt1 justify-around" style={{padding: '0 1em'}}>
								<p className='t0 public-key flex center'> 
									{ellipsis(currentAccount, 15)}
									<span onClick={()=> {copyToClipboard(currentAccount)}}><Icon icon="Copy" marginLeft={10}/></span>
							   </p>
						</div>
						<div className="hr mt1 mb3"></div>
						<div className="text-center">
								{Object.values(networks).map((network) => {
									if( network.chainKey === currentNetwork){
								 		return <>
											<a className="btn-primary flex" style={{width:'300px', margin:'5px', justifyContent:'center', display:'flex', flexDirection:'row', alignItems:'center', marginLeft:'auto', marginRight:'auto'}} href={network.url + "address/"+currentAccount} target="_blank">
												<Icon icon="View" size={16} fill={"white"}/>
												<p className='t0 m0 ml1'>View account on explorer</p>
											</a>
										</>
									}	
									})
								}
							<div className="btn-primary "  style={{width:'300px', margin:'5px'}} onClick={() => {updateStatus({openViewPrivatekey: true})}}>
								EXPORT PRIVATE KEY
							</div>
						</div>
					</div>
					<div style={{padding: '0 1em'}}  className={`${status.openViewPrivatekey? 'show': 'hide'}`}>
						<p className="public-key" style={{width:'100%', marginTop:'0.5em', marginBottom:'0.5em'}} onClick={()=> {copyToClipboard(currentAccount)}}>
							{ellipsis(currentAccount, 25)}
						</p>
						<h4 className='text-center m0'>SHOW PRIVATE KEYS</h4>	
						<p className='text-center t0 m1'>{status.passLock ? "Type your Neon Wallet password" : "This is your private key"}</p>
						{
							status.passLock && <input type="password" placeholder="Password" style={{fontSize: '1.5em',
								padding: "0.4em 0.8em"}} value={status.password} onChange = {(e) => {updateStatus({password: e.target.value})}}/>
						}
						{
							!status.passLock && <textarea style={{height:'100px', margin:'1em auto'}}  value={status.privateK} readOnly/>
						}
							
						<div className='alert' style={{marginTop:'2em'}}>
							<Icon icon="Warning" size={35} margin={10}/>
							<p className='t0'>Warning: Never disclose this key. Anyone with your private keys can steal any assets held in your account.</p>
						</div>
						<div className="hr mt3"></div>
						{
							status.passLock && <>
								<div className="justify justify-around mb3">
									<div className="btn-cancel  mt1" style={{width:'150px'}} onClick= {()=>{updateStatus({openViewPrivateKey: false, passLock: true, privateK: ''}); onClose()}}>
										CANCEL
									</div>
									<div className="btn-special  mt1" style={{width:'150px'}} onClick = {() => {showPrivatekey()}}>
										CONFIRM
									</div>
								</div>	
							</>
						}
						{
							!status.passLock && 
							<div style={{width:'100%', textAlign:'center'}} className="mb3">
								<div className="btn-special mt1" style={{width:'150px', marginLeft:'auto', marginRight:'auto'}} onClick = {() => {onClose()}}>
									DONE
								</div>
							</div>
						}
					</div>
				</div>
			</div>
		</div>
	);
}
