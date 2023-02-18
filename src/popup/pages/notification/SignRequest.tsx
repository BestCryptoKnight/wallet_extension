// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import useStore, { roundNumber, showAlert } from '../../useStore';
import Avartar from '../../components/Avartar';
import Loading from '../../components/Loading'
import { formatUnit } from '../../../lib/bigmath';
import { decrypt, hash } from '../../../lib/utils';
import {signMessage } from '../../../lib/wallet';

interface InnerProps {
	onAccept: Function
	info:	{url:string, params: [account:string, message:string]}[]
}

interface stateInterface {
	message : 	string
	url:		string
	address:	string
	privatekey: string
	password: 	string
	name:		string
	symbol:		string
	balance:	string
	loading:	boolean
}

export const SignRequest = ({info,  onAccept }: InnerProps) => {
	const [state, setStates] = React.useState<stateInterface>({
		message : 	"",
		url:		"",
		address: 	"",
		privatekey: "",
		password: 	"",
		name:		"",
		balance: 	"",
		symbol:		"",
		loading:	true
	});
	
	const updateStatus = (params: {[key: string]: string | number | boolean | any }) => setStates({ ...state, ...params });
	
	const {accounts, networks, vault, setting, currentAccount,  currentNetwork} = useStore()

	React.useEffect(() => {
		const url = info[0]?.url || "";
		const address = info[0]?.params[0] || "";
		const message = info[0]?.params[1] || "";
		let balance="0", symbol, name;
		Object.values(accounts).map((account) => {
			if(account.address === currentAccount) {
				balance = account.value[currentNetwork] || '0'		
				name = account.label;
			}
		})
		Object.values(networks).map((network) => {
			if( network.chainKey === currentNetwork){
				symbol = network.symbol;
		}})
		updateStatus({url, address, message, balance, name, symbol, loading: false});
		if(address.toLowerCase() !== currentAccount.toLowerCase()) return showAlert("Not match account with wallet account", "warning");
	}, [])

	const getSign = async () => {
		const passHash = hash(state.password);
		const plain = await decrypt(vault, passHash);
		if (plain===null || plain==='') return showAlert("Incorrect password", "warning")
		const wallet = JSON.parse(plain)
		const privatekey  = wallet.keys?.[currentAccount]	
		const sign = await signMessage(privatekey, state.message);
		onAccept(sign)
	}

	return (
		<div>
			<h4 className='text-center'>
				Signature Request
			</h4>
			<div className='justify'>
				<p className='m0'>Account:</p>
				<p className='m0'>Balance:</p>
			</div>
			<div className="justify middle">
				<div className='flex middle'>
					<Avartar address={state.address} type={setting.identicon==="jazzicons"?1:2}></Avartar>
					<p className='m0 ml1'>{state.name}</p>
				</div>
				<div className='flex middle'>
					<p className='m0'>{roundNumber(formatUnit(state.balance || "0", 18), 8)}</p>
					<p className='m0'>{state.symbol}</p>
				</div>
			</div>
			<div className="justify">
				<p className=''>Origin</p>
				<p className='ml2'>{state.url}</p>
			</div>
			<div className="hr"></div>
			<p>Message:</p>
			<p style={{wordBreak:"break-all"}}>{state.message}</p>
			<div className="hr mt3 mb1"></div>
			<input type="password" placeholder='Enter Wallet Password' value={state.password} onChange={(e) => {updateStatus({password:e.target.value})}}/>
			<div className="hr mt1 mb3"></div>
			<div className="justify justify-around mt3">
				<div className="btn-cancel  mt1" style={{width:'130px'}} onClick = {() => {onAccept(null)}}>
					CANCEL
				</div>
				<div className="btn-special  mt1" style={{width:'130px'}} onClick = {() => {getSign()}}>
					SIGN
				</div>
			</div>
			{state.loading && <Loading />}
		</div>
	);
}

export default SignRequest