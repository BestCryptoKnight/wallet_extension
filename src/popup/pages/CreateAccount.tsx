// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import '../assets/css/createaccount.scss'
import Loading from '../components/Loading'
import useStore, {showAlert} from '../useStore';
import {getAddressFromMnemonic} from '../../lib/wallet'
import {decrypt,hash, encrypt} from '../../lib/utils'


interface ConnectDialogProps {
	onClose: Function
}

interface AccountType {
	label:		string
	password:	string
	loading:	boolean
}

export default function ({ onClose }: ConnectDialogProps) {
	const [status, setStatus] = React.useState<AccountType>({ 
		label:		'',
		password:	'',
		loading:	false
	});
	const updateStatus = (params: Partial<AccountType>) => setStatus({...status, ...params});

	const {createdAccountLayer, vault, accounts, update} = useStore()
	
	const createAccount = async () => {
		var label = status.label;
		if(label.trim() === "") label = "Account "+(createdAccountLayer + 1)
		if(status.password === "") return showAlert("Please enter wallet password", "warning");
		const passHash = hash(status.password);
		const plain = await decrypt(vault, passHash);
		if (plain===null || plain==='') return showAlert("Incorrect password", "warning")
		updateStatus({loading: true})
		const wallet:WalletObject = JSON.parse(plain)
		const mnemonic = wallet.mnemonic;
		var layer = createdAccountLayer + 1;
		var newAccount = await getAddressFromMnemonic(mnemonic, layer);
		var flag= false;
		var accs:AccountObject[] = [];
		accounts && Object.values(accounts).map((account) => {
			accs.push(account)
			if(account.address === newAccount.publickey) {
				flag = true;
				return;
			}
	   	})
	   	if(flag) update({createdAccountLayer: layer + 1})
		else {
			const info:AccountObject = 
			{
				"address": newAccount.publickey,
				"imported": false,
				"index": 0,
				"label":label,
				"value":{},
				"tokens":{}
			}
			accs.push(info)
			let keys = wallet.keys;
			keys[newAccount.publickey] = newAccount.privatekey;
			const walletInfo = {
				"mnemonic": wallet.mnemonic,
				"keys": keys
			}
			const w = await encrypt(JSON.stringify(walletInfo), passHash) 
			if (w===null) {
				updateStatus({loading: false})
				return showAlert("browser crypto library is wrong", "warning")
			}
			update({currentAccount: newAccount.publickey, accounts:accs, createdAccountLayer: layer + 1, vault: w})
			updateStatus({loading: false})
		}
		onClose()
	}

	React.useEffect(() => {
		update({lastAccessTime: +new Date()})
	}, [])

	return (
		<>
			<div className='account-modal'>
				<div className="container inner-panel " style={{top:'100px', background:'#400888', minHeight:'300px', height:'360px'}}>
					<h4>CREATE ACCOUNT</h4>
					<p className='m0'>Account Name</p>
					<input type="text" maxLength={20}  value = {status.label} onChange={(e) => {updateStatus({label: e.target.value})}}/>
					<p className='m0 mt1'>Wallet Password</p>
					<input type="password"  className='mt1' value = {status.password} onChange={(e) => {updateStatus({password: e.target.value})}}/>
					
					<div className="justify justify-around mt3">
						<div className="btn-cancel  mt1" style={{width:'150px', margin:0}} onClick = {() => {onClose()}}>
							CANCEL
						</div>
						<div className="btn-special disabled mt1" style={{width:'150px', margin: 0}} onClick = {() => {createAccount()}}>
							CONFIRM
						</div>
					</div>
				</div>
			</div>
			{status.loading && <Loading />}
		</>
	);
}
