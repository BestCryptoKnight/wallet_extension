// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import useStore, { ellipsis, roundNumber, showAlert } from '../../useStore';
import Avartar from '../../components/Avartar';
import Loading from '../../components/Loading'
import { formatUnit } from '../../../lib/bigmath';
import { decrypt, hash } from '../../../lib/utils';
import {personalSign } from '../../../lib/wallet';
import { toUtf8 } from 'ethereumjs-util';

interface InnerProps {
	onAccept: Function
	info:	{url:string, params: any}[]
}

interface stateInterface {
	url:		string
	privatekey: string
	password: 	string
	name:		string
	symbol:		string
	balance:	string
	loading:	boolean
	params:		any
}

export const SignRequest = ({info,  onAccept }: InnerProps) => {
	const url = info[0]?.url || "";
	const params = info[0]?.params || {};

	const [state, setStates] = React.useState<stateInterface>({
		url:		"",
		privatekey: "",
		password: 	"",
		loading:	true,
		name:		"",
		balance: 	"",
		symbol:		"",
		params:		{}
	});
	
	const updateStatus = (params: {[key: string]: string | number | boolean | any }) => setStates({ ...state, ...params });
	
	const {accounts, networks, vault, setting, currentAccount,  currentNetwork} = useStore()

	React.useEffect(() => {
		let balance="0", symbol="", name="";
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

		updateStatus({url, params,  name, symbol, balance, loading: false});
	}, [])

	const getSign = async () => {
		const passHash = hash(state.password);
		const plain = await decrypt(vault, passHash);
		if (plain===null || plain==='') return showAlert("Incorrect password", "warning")
		const wallet = JSON.parse(plain)
		const privatekey  = wallet.keys?.[currentAccount]	
		const sign = await personalSign(privatekey, state.params[0]);
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
					<Avartar address={currentAccount} type={setting.identicon==="jazzicons"?1:2}></Avartar>
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
			<p className="text-center mt0 mb0">You are signing:</p>
			<div className="hr"></div>
			<p className='mt1 mb0'>Message:</p>
			<p className='m0' style={{wordBreak: "break-all", height:'120px', overflowY:'auto'}}>
				{
					toUtf8(state.params[0] || "0x")
				}
			</p>
			<div className="hr mt0 mb1"></div>
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