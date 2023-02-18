// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import { Link, useHistory} from 'react-router-dom';
import { ethers } from 'ethers';
import Icon from '../../components/Icon';
import Loading from '../../components/Loading';
import useStore, { getChainIcon, initChainIcons, showAlert, validateUrl } from '../../useStore';
import {hash} from '../../../lib/utils'
interface DialogProps {
	onClose: Function
	onClickMenu: Function
}

export const Setting_Network = () => {
	const history = useHistory()
	const {networks, update, currentNetwork} = useStore()
	const [status, setStatus] = React.useState({ 
		addNetwork:		false,
		addNetworkName:	'',
		addRpc:			'',
		addChainId:		'',
		addSymbol:		'',
		addExplorer:	'',
		addTestnet:		false,
		viewNetworkName:'',
		viewRpc:		'',
		viewSymbol:		'',
		viewChainId:	'',
		viewExplorer:	'',
		editNetworkName:'',
		editRpc:		'',
		editSymbol:		'',
		editChainId:	'',
		editExplorer:	'',
		selectedChain:	networks[0].chainId || 0,
		confirmModal:	false,
		confirmChain:	'',
		loading:		false
	});
	const [icons, setIcons] = React.useState<{[key:string]: string}>({});

	const updateStatus = (params:{[key:string]:string|number|boolean}) => setStatus({...status, ...params});
	

	const add = async () => {
		if(status.addNetworkName.trim() === "") return showAlert("Invalid network name", "error");
		if(status.addRpc.trim() === "" || !validateUrl(status.addRpc)) return showAlert("Invalid rpc url", "error");
		if(!parseInt(status.addChainId)) return showAlert("Invalid chainId", "error");
		if(status.addSymbol.trim() === "") return showAlert("Invalid symbol", "error");
		if(status.addExplorer.trim() === "") return showAlert("Invalid explorer", "error");
		try{
			updateStatus({loading:true})
			const provider = new ethers.providers.JsonRpcProvider(status.addRpc);
			const id = await (await provider.getNetwork()).chainId;
			if(Number(status.addChainId) !== Number(id)) {
				updateStatus({loading:false})
				return showAlert("Not match chainId with rpc network", "warning");
			}
			const chainKey = hash(status.addChainId + status.addNetworkName);
			const newNetworks:NetworkObject[] = [];
			let flag = false;
			Object.values(networks).map((v) => {
				newNetworks.push(v)
				if(Number(v.chainId) === Number(status.addChainId)) flag = true;
			})
			if(flag) {
				updateStatus({loading:false})
				return showAlert("Already exists same chain", "warning");
			}
			newNetworks.push({
				"chainKey":	chainKey,
				"url":		status.addExplorer,
				"rpc":		status.addRpc,
				"symbol":	status.addSymbol,
				"testnet":	(status.addNetworkName || '').indexOf('test') > -1 ? true: false,
				"chainId" :	parseInt(status.addChainId),
				"label":	status.addNetworkName,
				"imported":	true
			})
			updateStatus({loading:false})
			update({networks: newNetworks, currentNetwork: chainKey})
			history.push("/assets")
		} catch (err) {
			updateStatus({loading:false})
			showAlert("Invalid network information", "warning")
		}
	}

	const remove = (chainKey: string) => {
		const newNetworks:NetworkObject[] = [];
		Object.values(networks).map((v) => {
			if(v.chainKey != chainKey) newNetworks.push(v);
		})
		const current = currentNetwork === chainKey ? networks[0].chainKey : currentNetwork
		update({networks: newNetworks, currentNetwork: current})
		updateStatus({confirmModal: false, viewSymbol: "", viewNetworkName:"", viewRpc:"", viewChainId:"", viewExplorer:"", editSymbol: "", editNetworkName:"", editRpc:"", editChainId:"", editExplorer:""});
		return showAlert("Removed", "info")
	}

	

	const change = async (chainKey: string) => {
		if(status.editNetworkName.trim() === "") return showAlert("Invalid network name", "error");
		if(status.editRpc.trim() === "" || !validateUrl(status.editRpc)) return showAlert("Invalid rpc url", "error");
		if(!parseInt(status.editChainId)) return showAlert("Invalid chainId", "error");
		if(status.editSymbol.trim() === "") return showAlert("Invalid symbol", "error");
		if(status.editExplorer.trim() === "") return showAlert("Invalid explorer", "error");
		try{
			const provider = new ethers.providers.JsonRpcProvider(status.editRpc);
			const id = await (await provider.getNetwork()).chainId;
			if(Number(status.editChainId) !== Number(id)) {
				updateStatus({loading:false})
				return showAlert("Not match chainId with rpc network", "warning");
			}
			const newNetworks:NetworkObject[] = [];
			let flag = false;
			Object.values(networks).map((v: any) => {
				if(v.chainKey != chainKey) newNetworks.push(v);
			})
			if(flag) {
				updateStatus({loading:false})
				return showAlert("Already exists same chain", "warning");
			}
			newNetworks.push({
				"chainKey":	chainKey,
				"url":		status.editExplorer,
				"rpc":		status.editRpc,
				"symbol":	status.editSymbol,
				"testnet":	(status.editNetworkName || '').indexOf('test') > -1 ? true: false,
				"chainId" :	parseInt(status.editChainId),
				"label":	status.editNetworkName,
				"imported":	true
			})
			updateStatus({loading:false})
			update({networks: newNetworks})
			return showAlert("Changed successfully", "info")
		} catch(e){
			console.log(e)
			return showAlert("Unknown error", "error")
		}
	}

	React.useEffect(() => {
		{Object.values(networks).map((network: any) => {
			if(network.chainKey === currentNetwork) {
				updateStatus({viewNetworkName: network.label, viewRpc: network.rpc, viewSymbol: network.symbol, viewChainId: network.chainId, viewExplorer:network.url, editNetworkName: network.label, editRpc: network.rpc, editSymbol: network.symbol, editChainId: network.chainId, editExplorer:network.url})
			}
		})}
		initChainIcons().then(()=>{
			const _icons = {} as {[key: string]: string}
			for (let k in networks) {
				const icon = getChainIcon(networks[k].chainId);
				if (icon) _icons[networks[k].chainId] = icon;
			}
			setIcons(_icons)
		});
	}, [])

	const gotoBottom = () => {
		document.getElementsByClassName("setting-container")[0].scrollTo(0, 830);
	}

	const gotoTop = () => {
		document.getElementsByClassName("setting-container")[0].scrollTo(0, 0);
	}

	return (
		<>
			{
				status.confirmModal && <div style={{width:'90%', height:'170px',  left:0, right:0, top:0, bottom:0, backgroundColor:'rgba(0,0,0,0.9)', borderRadius:'10px', margin:'auto', position:'absolute', zIndex:1000}}>
					<h5 className='text-center'>Do you want to remove selected chain?</h5>
					<div className="flex center mt3">
						<button className="btn-cancel  mt1" style={{width:'130px', margin:'1em 5px', padding:'1em'}} onClick = {() => {updateStatus({confirmModal: false})}}>
							CANCEL
						</button>
						<button className="btn-special  mt1" style={{width:'130px', margin:'1em 5px', padding:'1em'}} onClick = {() => {remove(status.confirmChain)}}>
							CONFIRM
						</button>
					</div>
				</div>
			}
			{
				!status.addNetwork && <>
					<div className="justify">
						<h4>NETWORKS</h4>
						<button className='btn-primary' style={{width: '133px'}} onClick= {() => {updateStatus({addNetwork: true})}}>Add a network</button>
					</div>			
					<div className="hr mt1 mb3 yellow"></div>
					<div className="row">
						<div className="col-lg-6 col-sm-12">
							{
								Object.values(networks).map((v:NetworkObject) => {
									return <div className="flex middle pointer">
										<div>	
											{icons[v.chainId]===undefined ? (
												<div style={{width: 28, height: 28, borderRadius: '50%', color:'black', marginRight:'0.5em', backgroundColor: '#eee', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{v.label?.slice(0, 1).toUpperCase()}</div>
											) : <img src={icons[v.chainId]} width={28} height={28} alt={v.label} style={{borderRadius:'50%', marginRight:'0.5em',}}/>}
										</div>
										<p style={{color:`${v.chainId === status.selectedChain ? 'var(--color-yellow)': 'white'}`}} onClick={() => {updateStatus({editNetworkName: v.label, editSymbol: v.symbol, editRpc: v.rpc, editChainId: v.chainId, editExplorer: v.url, selectedChain: v.chainId, confirmChain: v.chainKey}); gotoBottom()}}>{v.label}</p>
										{
											!v.imported && <div style={{color:"grey"}}>
												<Icon icon="Key" size={20}/>
											</div>
										}
										{
											v.imported && <div className='pointer' style={{borderRadius: '5px',  padding:'4px', backgroundColor:"#ff0047",  marginLeft:'15px', color:'white'}} onClick={() => {updateStatus({confirmModal : true})}}>Remove</div>
										}
									</div> 
								}) 
							}
						</div>
						<div className="col-lg-6 col-sm-12">
							<div className="justify">
								<p className=''>Network Name</p>
								{
									window.innerWidth < 360  && <div className='pointer' style={{marginRight:'1.2em'}} onClick={() => {gotoTop()}}><Icon icon="ArrowTop" size={20}/></div>
								}
							</div>
							<input type="text" maxLength={30} readOnly={status.selectedChain == 259 || status.selectedChain == 9559}  style={{maxWidth:'300px'}} value={status.editNetworkName} onChange={(e) => {updateStatus({editNetworkName: e.target.value})}}/>
							<p className=''>RPC URL</p>
							<input type="text" maxLength={255} readOnly={status.selectedChain == 259 || status.selectedChain == 9559} style={{maxWidth:'300px'}}  value={status.editRpc}  onChange={(e) => {updateStatus({editRpc: e.target.value})}}/>
							
							<p className=''>Chain ID</p>
							<input type="text" maxLength={18} readOnly={status.selectedChain == 259 || status.selectedChain == 9559} style={{maxWidth:'300px'}} value={status.editChainId}  onChange={(e) => {updateStatus({editChainId: e.target.value})}}/>
							
							<p className=''>Current Symbol</p>
							<input type="text" maxLength={20} readOnly={status.selectedChain == 259 || status.selectedChain == 9559} style={{maxWidth:'300px'}} value={status.editSymbol}  onChange={(e) => {updateStatus({editSymbol: e.target.value})}}/>
							
							<p className=''>Block Explorer URL (Optional)</p>
							<input type="text" maxLength={255} readOnly={status.selectedChain == 259 || status.selectedChain == 9559} style={{maxWidth:'300px'}} value={status.editExplorer}  onChange={(e) => {updateStatus({editExplorer: e.target.value})}}/>
							{(status.selectedChain != 259 && status.selectedChain != 9559 )&&
								<div className="flex center mt3">
									<button className="btn-cancel  mt1" style={{width:'130px', margin:'1em 5px', padding:'1em'}} onClick = {() => {updateStatus({editNetworkName:status.viewNetworkName, editRpc:status.viewRpc, editSymbol:status.viewSymbol, editChainId:status.viewChainId, editExplorer:status.viewExplorer})}}>
										CANCEL
									</button>
									<button className="btn-special  mt1" style={{width:'130px', margin:'1em 5px', padding:'1em'}} onClick = {() => {change(status.confirmChain)}}>
										CONFIRM
									</button>
								</div>
							}
						</div>
					</div>
				</>
			}
			{
				status.addNetwork && <>
					<div className="justify">
						<h4>Add a network</h4>
					</div>			
					<div className="hr mt1 mb3 yellow"></div>
					<div className='row middle'>
						<div className="col-lg-6 col-sm-12">
							<p className=''>Network Name</p>
							<input type="text" maxLength={30} style={{maxWidth:'300px'}} value = {status.addNetworkName} onChange={(e) => {updateStatus({addNetworkName: e.target.value})}}/>
						</div>
						<div className="col-lg-6 col-sm-12">
							<p className=''>RPC URL</p>
							<input type="text" maxLength={255} style={{maxWidth:'300px'}}  value = {status.addRpc} onChange={(e) => {updateStatus({addRpc: e.target.value})}}/>
						</div>
						<div className="col-lg-6 col-sm-12">
							<p className=''>Chain ID</p>
							<input type="text" maxLength={18} style={{maxWidth:'300px'}}  value = {status.addChainId} onChange={(e) => {updateStatus({addChainId: e.target.value})}}/>
						</div>
						<div className="col-lg-6 col-sm-12">
							<p className=''>Currency Symbol</p>
							<input type="text" maxLength={30} style={{maxWidth:'300px'}}  value = {status.addSymbol} onChange={(e) => {updateStatus({addSymbol: e.target.value})}}/>
						</div>
						<div className="col-lg-6 col-sm-12">
							<p className=''>Block Explorer URL</p>
							<input type="text" maxLength={255} style={{maxWidth:'300px'}}  value = {status.addExplorer} onChange={(e) => {updateStatus({addExplorer: e.target.value})}}/>
						</div>
					</div>
					<div className="flex mt3">
						<button className="btn-cancel  mt1" style={{width:'150px', margin:'1em 5px', padding:'1em'}} onClick = {() => {updateStatus({addNetwork: false})}}>
							CANCEL
						</button>
						<button className="btn-special  mt1" style={{width:'150px', margin:'1em 5px', padding:'1em'}} onClick = {() => {add()}}>
							SAVE
						</button>
					</div>
				</>
			}
			{
				status.loading && <Loading />
			}
		</>
	)
}

export const SideMenu_Network = ({onClickMenu, onClose}: DialogProps)=>{
	const history = useHistory()
	return	<>
		<Link className='logo' to="/assets">
			<Icon icon="Neon" size={110} height={50}/>
		</Link>
		{
			(window.location.pathname.split("/")[1] !== "setting" || window.location.pathname.indexOf("network") > 0) && <div className="close-btn" onClick={() => {history.push("/assets")}}>
				<Icon icon="Close" fill='var(--color-pink)' size={15} />
			</div> 
		}
		{
			(window.location.pathname.split("/")[1] !== "setting" || window.location.pathname.indexOf("network") == -1) && <div className="close-btn" onClick={() => {onClose()}}>
				<Icon icon="Close" fill='var(--color-pink)' size={15} />
			</div> 
		}
		<div className="top-line"></div>
		<div className="bottom-line"></div>
		<div className="setting-menu" onClick={() => {onClickMenu("general")}}> <span className = "line" style={{height: '100%',  zIndex:2, transform: 'translateY(calc(-50% - 0.7em))'}}></span>GENERAL</div>
		<div onClick={() => {onClickMenu("advanced")}} className="setting-menu">  <span className = "line" style={{height: '200%',  zIndex:3, transform: 'translateY(calc(-75% - 0.7em))'}}></span>ADVANCED</div>
		<div onClick={() => {onClickMenu("security")}} className="setting-menu"> <span className = "line" style={{height: '400%',  zIndex:5, transform: 'translateY(calc(-88% - 0.7em))'}}></span>SECURITY & PRIVACY</div>
		<div onClick={() => {onClickMenu("alert")}} className="setting-menu"> <span className = "line" style={{height: '500%',  zIndex:6, transform: 'translateY(calc(-91% - 0.7em))'}}></span>ALERTS</div>
		<div onClick={() => {onClickMenu("network")}} className="setting-menu active"> <span className = "line" style={{height: '600%',  zIndex:7, transform: 'translateY(calc(-92% - 0.7em))'}}></span>NETWORKS</div>
		<div onClick={() => {onClickMenu("experimental")}} className="setting-menu"> <span className = "line" style={{height: '700%',  zIndex:8, transform: 'translateY(calc(-94% - 0.7em))'}}></span>EXPERIMENTAL</div>
		<div onClick={() => {onClickMenu("about")}} className="setting-menu"> <span className = "line" style={{height: '800%',  zIndex:9, transform: 'translateY(calc(-94% - 0.7em))'}}></span>ABOUT</div>
	</>
}

export default {
	Setting_Network, SideMenu_Network
}