// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import Loading from '../../components/Loading'
import useStore, { ellipsis, getChainIcon, initChainIcons, showAlert } from '../../useStore';
import {checkContract} from '../../../lib/wallet'
import Avartar from '../../components/Avartar';

interface InnerProps {
	onAccept: Function
	info:	{url:string, params: WatchAssetParams}[]
}

interface stateInterface {
	tokenInfo : WatchAssetParams | null,
	loading:	boolean
}

export const AddToken = ({info,  onAccept }: InnerProps) => {
	const [icon,  setIcon] = React.useState<string>("");
	const [state, setStates] = React.useState<stateInterface>({
		tokenInfo : null,
		loading: true
	});
	
	const updateStatus = (params: {[key: string]: string | number | boolean | any }) => setStates({ ...state, ...params });
	
	const {accounts, networks, setting, tokens, currentAccount, update, currentNetwork} = useStore()

	React.useEffect(() => {
		const chain = info[0]?.params;
		updateStatus({tokenInfo: chain, loading: false});
		getContractInfo(chain.options.address).then(v => {
			if(v === null) return onAccept(false)
		})
		Object.values(networks).map((network) => {
			if(network.chainKey === currentNetwork) {
				initChainIcons().then(()=>{
					const icon = getChainIcon(network.chainId) || "";
					setIcon(icon)
				})
			}
		})
	}, [])

	
	const getContractInfo = async (address: string) :  Promise<Partial<TokenInterface> | null>=> (
		new Promise(async response => {
			let rpc = null;
			Object.values(networks).map((network) => {
				if( network.chainKey === currentNetwork){
					rpc = network.rpc;
				}
			})
			if(rpc !== null) {
				const info = await checkContract(rpc, address)
				if(info != null) {
					const name = info.name
					const contractAddress = info.address
					const decimals = info.decimals;
					const symbol = info.symbol;
					return response({name, decimals, symbol, address:contractAddress})	
				}
			}
			return response(null)
		})
	);

	const add = async () => {
		try {
			const address = state.tokenInfo?.options.address || '';
			const symbol = state.tokenInfo?.options.symbol || '';
			const decimals = (state.tokenInfo?.options.decimals || 18).toString();
			const icon =  state.tokenInfo?.options.image || '';
			const info = await getContractInfo(address);
			if(info === null) return onAccept(false)
			var accs:AccountObject[] = [];
			Object.values(accounts).map((account) => {
				let tokens:{[tkey:string] :string} = {};
				if(account.tokens[currentNetwork] ) Object.entries(account.tokens[currentNetwork]).map(([tkey, tvalue]) => {
					tokens[tkey] = tvalue;
				})
				if(account.address === currentAccount) {
					tokens[address || ''] = "0";
				}
				let newAccount:AccountObject = {
					"address": account.address,
					"imported": account.imported,
					"index": account.index,
					"label": account.label,
					"value": account.value,
					"tokens": {[currentNetwork]: tokens}
				}
				accs.push(newAccount)
			})
			let newTokens:{[chainKey: string]: {[token: string]: TokenInfoObject}}  = {}
			if(Object.keys(tokens).length> 0) {
				let flag = false;
				Object.entries(tokens).map(([chainKey, tks]) => {
					if(chainKey !== currentNetwork) newTokens[chainKey] = tks;
					else {
						let newTks:{[token: string]: TokenInfoObject} = {};
						Object.entries(tks).map(([adr, info]) => {
							newTks[adr] = info;
						})
						newTks[address] = {
							"name": "",
							"symbol": symbol,
							"decimals": decimals,
							"icon": "",
							"type":"ERC20"
						};
						newTokens[chainKey] = newTks;
						flag = true;
					}
				})
				if(!flag) {
					let newTks:{[token: string]: TokenInfoObject} = {};
					newTks[address] = {
						"name": "",
						"symbol": symbol,
						"decimals": decimals,
						"icon": "",
						"type":"ERC20"
					};
					newTokens[currentNetwork] = newTks;
				}
			}
			else {
				let newTks:{[token: string]: TokenInfoObject} = {};	
				newTks[address] = {
					"name": "",
					"symbol": symbol,
					"decimals": decimals,
					"icon": "",
					"type":"ERC20"
				};
				newTokens[currentNetwork] = newTks;
			}
			update({accounts: accs, tokens:newTokens});
			showAlert("Imported token successfully", "success")
			onAccept(true)
		} catch(e) {
			onAccept(false)
		}
	}
	
	return (
		<div>
			<div className="flex center middle" style={{borderRadius: '20px', border: '1px solid var(--line-color)'}}>
				<>
					{
						icon != "" ? <div style={{width:'25px'}}><img src={icon} width={25} height={25} style={{borderRadius:'50%', marginRight:'0.5em',}}/> </div>: 
						<div style={{width:'25px'}}>
							<div className={`avartar`}>
								<Avartar address={currentNetwork} size={20} type={setting.identicon === 'jazzicons'? 1: 2}/>
							</div>
						</div>
					}
				</>
				<p className='ml2'>{ellipsis(info[0]?.url, 25)}</p>
			</div>
			<h4 className='text-center'>
				Add Suggested Tokens
			</h4>
			<p className='text-center'>Would you like to import these  tokens?</p>
			
			<div className="hr mt3 mb3"></div>
			<div style={{padding: '1em', borderRadius: '10px', border: '1px solid var(--color-modal)'}}>
				<div className="flex middle">
					<p className='m0'>Address</p>
				</div>
				<b className='t0 m0'>{ellipsis(state.tokenInfo?.options.address || '', 20)}</b>
				<div className="hr mt1 mb1"></div>
				<div className="flex middle">
					<p className='m0'>Symbol</p>
				</div>
				<b className='t0 m0'>{state.tokenInfo?.options.symbol}</b>
				<div className="hr mt1 mb1"></div>
				<div className="flex middle">
					<p className='m0'>Decimals</p>
				</div>
				<b className='t0 m0'>{state.tokenInfo?.options.decimals}</b>
			</div>
			<div className="justify justify-around mt3">
				<div className="btn-cancel  mt1" style={{width:'130px'}} onClick = {() => {onAccept("failure")}}>
					CANCEL
				</div>
				<div className="btn-special  mt1" style={{width:'130px'}} onClick = {() => {add()}}>
					APPROVE
				</div>
			</div>
			{state.loading && <Loading />}
		</div>
	);
}

export default AddToken