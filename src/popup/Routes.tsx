import React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Active from "./pages/Active";
import Assets from "./pages/Assets";
import ConnectedSite from "./pages/Connected";
import CreateAccount from "./pages/CreateAccount";
import Deposit from "./pages/Deposit";
import ImportAccount from "./pages/ImportAccount";
import ImportToken from "./pages/ImportToken";
import Send from "./pages/Send";
import Setting from "./pages/Setting";
import Swap from "./pages/Swap";
import Token from "./pages/Token";
import Auth_Confirmsecure from "./pages/auth/ConfirmSecure";
import Auth_Congration from "./pages/auth/Congration";
import Auth_Createpassword from "./pages/auth/CreatePassword";
import Auth_Importphrase from "./pages/auth/ImportPhrase";
import Auth_Selectwallet from "./pages/auth/SelectWallet";
import Auth_Start from "./pages/auth/Start";
import Auth_Agree from "./pages/auth/Agree";
import Auth_Viewsecure from "./pages/auth/ViewSecure";
import Notification_AddNetwork from "./pages/notification/AddNetwork";
import Notification_AllowNetwork from "./pages/notification/AllowNetwork";
import Notification_Connect from "./pages/notification/Connect";
import Notification_Loading from "./pages/notification/Loading";
import Notification_Lock from "./pages/notification/Lock";
import Notification_Init from "./pages/notification/Loading";
import Notification_SignRequest from "./pages/notification/SignRequest";
import Notification_Transfer from "./pages/notification/Transaction";
import Init from './pages/Init'
import useStore, { initializeStore, getPass, showAlert} from "./useStore";
import { IconViewer } from "./components/Icon";
import { checkBalances, waitTx, ZeroAddress } from "../lib/wallet";
import { expandView } from "../lib/chrome";

interface stateInterface {
	lock				:	boolean
	accountLayer 		:	number
	type				:	boolean
}

function App() {  
	const {inited, currentNetwork, transactions, networks, accounts, update} = useStore();
	const [time, setTime] = React.useState(+new Date())

	const [state, setStates] = React.useState<stateInterface>({
		lock				:	true,
		accountLayer 		:	-1,
		type				:	true
	});
	const updateStatus = (params: {[key: string]: string | number | boolean | Blob | any }) => setStates({ ...state, ...params });
	
	React.useEffect(() => {
		if (inited===false) {
			initializeStore().then(async store => {
				console.log(store)
				update({...store, inited:true})
				const _lastAccessTime = store?.lastAccessTime || 0;
				const _accountLayer = store?.createdAccountLayer || 0;
				const _setting = store?.setting || {currency:'usd'};
				if(window.innerWidth < 365 && _accountLayer === 0) {
					expandView()
				}
				const p = await getPass()
				const lock = (p == null || p == "") ? true: ((+new Date() - _lastAccessTime) > ((_setting.autoLockTimer || 5) * 60000 )? true: false);
				const link = new URL(decodeURI(window.location.href));
				const search = new URLSearchParams(link.search);
				const q = search.get("q") || '{}'
				const params = JSON.parse(q)
				const type = params["type"] !== "notification"
				updateStatus({ lock:lock, accountLayer: _accountLayer, type: type})	
			})
		}
	}, [])
	

	React.useEffect(()=>{
		checkBalance()
		const timer = setTimeout(()=>setTime(+new Date()), 10000)
		return () => clearTimeout(timer)
	}, [time, currentNetwork])

	React.useEffect(() => {
		setTimeout(()=> {
			checkTransactionStatus();
		}, 5000)
	}, [transactions])

	const checkBalance = async () => {
		try {
			let net = {} as NetworkObject
			Object.values(networks).map((network) => {
				if( network.chainKey === currentNetwork){
					net = network
				}
			})
			if (net) {
				const result = await checkBalances(net.rpc, currentNetwork, accounts)
				if (result!==null) {
					const _accounts = [] as AccountObject[]
					Object.values(accounts).map((i) => {
							const value = result[i.address][ZeroAddress];
							delete  result[i.address][ZeroAddress];
							_accounts.push({
								...i,
								value: {
									...i.value,
									[currentNetwork]: value
								},
								tokens: {
									...i.tokens,
									[currentNetwork]: result[i.address]
								}
							})
					})
					update({accounts: _accounts})
				}
			}
		} catch (error) {
			return showAlert("Network connection error", "warning")
		}
	}
	
	const checkTransactionStatus = async () => {
		const currentTxs = transactions[currentNetwork];
		let txs:Transaction[] = [];
		let rpc = "";
		if(!currentTxs || Object.keys(currentTxs).length === 0) return;
		{Object.values(currentTxs).map((tx) => {
			if(tx.status === "pending") {
				txs.push(tx)				
			}
		})}  
		
		Object.values(networks).map((network) => {
			if( network.chainKey === currentNetwork){
				rpc =  network.rpc || ''
		}})

		txs.forEach(tx => {
			waitTx(rpc, tx.transactionId).then((result) => {
				if(result !== null) {
					if(result.blockNumber !== null) {
						const newtxs = {} as  {[chainKey: string] : {[hash: string]: Transaction}};
						let flag = false;
						transactions && Object.entries(transactions).map(([_chain, _transaction]) => {
							if(_chain !== currentNetwork) newtxs[_chain] = _transaction;
							else {
								let txs = {..._transaction, [tx.transactionId]: {
									from:				tx.from,
									transactionId:		tx.transactionId,
									to:					tx.to,
									status:				Number(result.status) === 0 ? "failed": 'confirmed',
									nonce:				Number(tx.nonce).toString(),
									amount:				tx.amount,
									gasPrice:			tx.gasPrice,
									gasLimit:			tx.gasLimit,
									gasUsed:			result.gasUsed,
									total:				"0",
									hexData:			tx.hexData,
									rpc:				tx.rpc,
									chainId:			tx.chainId,
									tokenAddress:		tx.tokenAddress,
									explorer:			tx.explorer,
									symbol:				tx.symbol,
									decimals:			Number(tx.decimals),
									log:				result.logs,
									created:			'0',
									time:				+new Date(),
									method:				tx.method
								}};
								newtxs[_chain] = txs;
								flag = true;
							}
						});
						update({transactions: newtxs})
					}
				}
			})
			
		});
	}

 	return (
		<>
			{
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={Auth_Agree}/>
					<Route exact path="/assets" component={Assets}/>
					<Route exact path="/active" component={Active}/>
					<Route exact path="/connectedsite" component={ConnectedSite}/>
					<Route exact path="/createaccount" component={CreateAccount}/>
					<Route exact path="/deposit" component={Deposit}/>
					<Route exact path="/importaccount" component={ImportAccount}/>
					<Route exact path="/importtoken" component={ImportToken}/>
					<Route exact path="/send" component={Send}/>
					<Route path="/setting/*" component={Setting}/>
					<Route exact path="/swap" component={Swap}/>
					<Route exact path="/token/*" component={Token}/>
					
					<Route exact path="/auth_agree" component={Auth_Agree}/>
					<Route  path="/auth_confirmsecure/*" component={Auth_Confirmsecure}/>
					<Route exact path="/auth_congration" component={Auth_Congration}/>
					<Route exact path="/auth_createpassword" component={Auth_Createpassword}/>
					<Route exact path="/auth_importphrase" component={Auth_Importphrase}/>
					<Route exact path="/auth_selectwallet" component={Auth_Selectwallet}/>
					<Route exact path="/auth_start" component={Auth_Start}/>
					<Route path="/auth_viewsecure/*" component={Auth_Viewsecure}/>

					<Route exact path="/notification_addnetwork" component={Notification_AddNetwork}/>
					<Route exact path="/notification_allownetwork" component={Notification_AllowNetwork}/>
					<Route exact path="/notification_connect" component={Notification_Connect}/>
					<Route exact path="/notification_loading" component={Notification_Loading}/>
					<Route exact path="/notification_lock" component={Notification_Lock}/>
					<Route exact path="/notification_signrequest" component={Notification_SignRequest}/>
					<Route exact path="/notification_transfer" component={Notification_Transfer}/>
					<Route exact path="/icons" component={IconViewer}/>
					<Route path="*" component={state.accountLayer === -1 ? Init : (state.accountLayer === 0 ? Auth_Start : (state.type ? (state.lock ? Notification_Lock : Assets ): Notification_Init))}/>
				</Switch>
			</BrowserRouter>
			}
		</>
	);
}

export default App;