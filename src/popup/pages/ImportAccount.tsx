// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import Dropdown from '../components/Dropdown'
import Loading from '../components/Loading'
import '../assets/css/createaccount.scss'
import {addHexPrefix, getAddressFromPrivateKey} from '../../lib/wallet'
import useStore, {showAlert} from '../useStore';
import {decrypt,hash, encrypt} from '../../lib/utils'
import {importFromJSON} from '../../lib/wallet'

interface ConnectDialogProps {
	onClose: Function
}
interface ImportStatus {
	keyType:	boolean
	privateK:	string
	password:	string
	fileContent: string
	loading: boolean
	walletPassword: string
}

export default function ({ onClose }: ConnectDialogProps) {
	const [status, setStatus] = React.useState<ImportStatus>({ 
		keyType: true,
		privateK: "",
		password: "",
		fileContent: '',
		loading: false,
		walletPassword: ""
	});
	const updateStatus = (params: Partial<ImportStatus>) => setStatus({...status, ...params});
	const {vault, accounts, update} = useStore()

	const refFile = React.useRef(null);

	const items = [
		{ key:'privatekey', label: 'Private Key'},
		{ key:'json', label: 'JSON File'}
	]

	const addAccount = async (pubkey: string, privatekey: string, label: string, passHash: string  ) => {
		const plain = await decrypt(vault, passHash);
		if (plain===null || plain==='') return showAlert("Incorrect wallet password", "warning")
		const wallet:WalletObject = JSON.parse(plain)
		var accs:AccountObject[] = [];
		let exists = false;
		accounts && Object.values(accounts).map((account) => {
			accs.push(account)
			if(account.address == pubkey) exists = true;
		})
		if(exists) return showAlert("Already exists same account", "info");
		updateStatus({loading: true})
		const info:AccountObject =  {
			"address": pubkey,
			"index":  0,
			"imported": true,
			"label":  label,
			"value":  {},
			"tokens": {}
		}
		let flag = false;
		accs.map((account, index) => {
			if(account.address === pubkey) flag = true;
		})
		if(!flag) {
			accs.push(info)
		}
		let keys = wallet.keys;
		keys[pubkey] = privatekey;
		const walletInfo = {
			"mnemonic": wallet.mnemonic,
			"keys": keys
		}
		const w = await encrypt(JSON.stringify(walletInfo), passHash) 
		if (w===null) {
			updateStatus({loading: false})
			return showAlert("browser crypto library is wrong", "warning")
		}
		update({currentAccount: pubkey, accounts:accs, vault: w})
		updateStatus({loading: false})
		onClose()
	}

	const importAccount = async () => {
		if(status.walletPassword === "") return showAlert("Please enter wallet password", "warning");
		const passHash = hash(status.walletPassword);
		const label = "Account " + (Object.entries(accounts).length + 1);
		if(status.keyType) {
			try {
				const privKey = status.privateK.trim();
				const prefixed = addHexPrefix(privKey);
				const pubkey = await getAddressFromPrivateKey(prefixed);
				await addAccount(pubkey, prefixed, label, passHash)
			} catch (error) {
				return showAlert("Invalid privatekey", "error")
			}
		} else {
			if(status.fileContent === null || status.fileContent === '') return showAlert("Please select JSON file", "info");
			if(status.password === null || status.password === '') return showAlert("Please input file password", "info");
			try {
				updateStatus({loading: true})
				const info = await importFromJSON(status.fileContent, status.password)
				await addAccount(info.address, info.privatekey, label, passHash)
				updateStatus({loading: false})
			} catch( err: any ) {
				updateStatus({loading: false})
				if(err.message.indexOf("wrong passphrase") > -1) return showAlert("Wrong password", "info");
				return showAlert("Incorrect wallet password", "error");
			}
		}
	}

	const getFileContent = async (e: any) => {
		if (e.target.files && e.target.files[0]) {
			let content = await e.target.files[0].text();
			updateStatus({fileContent: content});
		}
	}
	
	return (
		<div className='account-modal'>
			<div className="container inner-panel" style={{top:'20px'}}>
				<h4>IMPORT ACCOUNT</h4>
				<p className='t0 m0'>
					Imported accounts will not be associated with your originally created Neon Wallet account Secret Recovery Phrase.
				</p>
				<div className="hr mt1"></div>

				<div className="justify mt1">
					<p>Select Type</p>
					<Dropdown placeholder='Select a token' style={{width:'200px'}} items={items} value={'Private Key'} onValueChange = {(v: string) => {updateStatus({keyType: (v==='Private Key'? true: false)}); }}/>
				</div>
				{
					status.keyType && <>
						<p>Enter your private key string here</p>
						<textarea placeholder='Enter private key' rows={3} className={"w100"} value={status.privateK} onChange={(e) => {updateStatus({privateK: e.target.value})}}/>
					</>
				}
				{
					!status.keyType && <>
						<p className='mt1'>Used by a variety of different clients</p>
						<div className='' >
							<input type="file" ref={refFile} pattern="text/json" onChange = {(e) => { getFileContent(e)}}/>
						</div>
						<input type="password" className='w90 mt2 mb1' placeholder='Enter File Password' value={status.password} onChange={(e) => {updateStatus({password: e.target.value})}}/>
					</>
				}
				<p className='m0 mt1'>Wallet Password</p>
				<input type={"password"}  placeholder="wallet password" value={status.walletPassword} onChange = {(e) => {updateStatus({walletPassword: e.target.value})}}/>
				<p className='text-yellow text-center m0'>{status.loading ? 'Loading' : ''}</p>
				<div className="justify justify-around mt3 mb3">
					<button className="btn-cancel  mt1" style={{width:'150px', padding:'1em',  margin:0}} onClick = {() => {onClose()}}>
						CANCEL
					</button>
					<button className="btn-special disabled mt1" disabled ={status.loading}  style={{width:'150px', padding:'1em',  margin:0, opacity: status.loading ? '0.5': '1'}} onClick = {() => {importAccount()}}>
						IMPORT
					</button>
				</div>
			</div>
			{status.loading && <Loading />}
		</div>
	);
}
