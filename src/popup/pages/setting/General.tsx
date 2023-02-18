// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import Dropdown from '../../components/Dropdown';
import Icon from '../../components/Icon';
import useStore from '../../useStore';
import Avartar from '../../components/Avartar'
import { Link } from 'react-router-dom';

interface DialogProps {
	onClose: Function
	onClickMenu: Function
}

export const Setting_General = () => {
	const {setting, update, currentNetwork, networks, currentAccount, lang} = useStore()
	const currencyItems = [
		{ key:'bnt', label: 'BNT'},
		{ key:'cvc', label: 'Civic'},
		{ key:'usd', label: 'USD'},
	]

	const updateSetting = (key: SettingObjectKeyType, value: any) => {
		const sets: SettingObject = {
			currency:			key === 'currency' ? value : setting.currency,
			isFiat:				key === 'isFiat' ? value : setting.isFiat,		
			identicon:			key === "identicon" ? value : setting.identicon,
			hideToken:			key === 'hideToken' ? value : setting.hideToken,
			gasControls:		key === 'gasControls' ? value : setting.gasControls,
			showHexData:		key === 'showHexData' ? value : setting.showHexData,
			showFiatOnTestnet:	key === 'showFiatOnTestnet' ? value : setting.showFiatOnTestnet,
			showTestnet:		key === 'showTestnet' ? value : setting.showTestnet,
			showTxNonce:		key === 'showTxNonce' ? value : setting.showTxNonce,
			autoLockTimer:		key === 'autoLockTimer' ? value : setting.autoLockTimer,
			backup3Box:			key === 'backup3Box' ? value : setting.backup3Box,
			ipfsGateWay:		key === 'ipfsGateWay' ? value : setting.ipfsGateWay,
			ShowIncomingTxs:	key === 'ShowIncomingTxs' ? value : setting.ShowIncomingTxs,
			phishingDetection:	key === 'phishingDetection' ? value : setting.phishingDetection,
			joinMetaMetrics:	key === 'joinMetaMetrics' ? value : setting.joinMetaMetrics,
			unconnectedAccount: key === 'unconnectedAccount' ? value : setting.unconnectedAccount,
			tryOldWeb3Api:		key === 'tryOldWeb3Api' ? value : setting.tryOldWeb3Api,
			useTokenDetection:	key === 'useTokenDetection' ? value : setting.useTokenDetection,
			enhancedGasFeeUI:	key === 'enhancedGasFeeUI' ? value : setting.enhancedGasFeeUI,
		}
		update({setting: sets})
	}

	return (
			<>
				<div className="justify">
					<h4>GENERAL</h4>
				</div>
				<div className="hr mt1 mb3 yellow"></div>
				{/* <h5 className='m0'>Currency Conversion</h5>
				<p className='t0 ml0'>Updated Sun May 29 2022 18:23:24 GMT+0200 (Central European Summer Time)</p>
				<Dropdown placeholder='Select a token' style={{width:'200px'}} items={currencyItems} value={setting.currency} onValueChange = {(v: string) => {updateSetting("currency", v)}}/>
				<div className="hr mt3 mb3"></div>
				<h5 className='m0'>PRIMARY CURRENCY</h5>
				<p className='t0 ml0'>Select native to prioritize displaying values in the native currency of the chain (e.g. ETH). Select Fiat to prioritize displaying values in your selected fiat currency.</p>
				<div className="flex" >
					<p className='m0'>{
						Object.values(networks).map((network) => {
							if( network.chainKey === currentNetwork){
								return " " + network.symbol
						}})
					}</p>
					<div className={`switch ${setting.isFiat ? 'checked' : ''}`} onClick={() => {updateSetting("isFiat", !setting.isFiat)}}>
						<input type="checkbox" hidden />
						<div className={`case ${setting.isFiat ? 'checked' : ''}`}></div>
					</div>
					<p className='m0'>FIAT</p>
				</div> */}
				{/* <div className="hr mt3 mb3"></div> */}
				<h5 className='m0'>ACCOUNT IDENTICON</h5>
				<p className='t0 ml0'>Jazzicons and Blackies are two different styles of unique icons that help you to identify an account at a glance.</p>
				<div className="flex">
					<div className="flex middle" onClick={() => {updateSetting("identicon", "jazzicons")}}>
						<div className={`avartar ${setting.identicon === 'jazzicons' ? 'active' : ''}`}>
							<Avartar address={currentAccount} type={1}/>
						</div>
						<p className='t0 m0 ml1 mr3'>Jazzicons</p>
					</div>
					<div className="flex middle"  onClick={() => {updateSetting("identicon", "blokies")}}>
						<div className={`avartar ${setting.identicon === 'blokies' ? 'active' : ''}`}>
							<Avartar address={currentAccount} type={2}/>
						</div>
						<p className='t0 m0 ml1 mr3'>Blokies</p>
					</div>
				</div>
				<div className="hr mt3 mb3"></div>
				<p className='t0 ml0'>Hide Tokens Without Balance</p>
				<div className="flex" >
					<div className={`switch ${setting.hideToken ? 'checked': ''}`} onClick={() => {updateSetting('hideToken', !setting.hideToken)}}>
						<input type="checkbox" hidden />
						<div className={`case ${setting.hideToken ? 'checked': ''}`}></div>
					</div>
					<p className='m0'>{setting.hideToken ? 'ON': 'OFF'}</p>
				</div>
			</>
		)
}

export const SideMenu_General = ({onClickMenu, onClose}: DialogProps)=>(
	<>
		<Link className='logo' to="/assets">
			<Icon icon="Neon" size={110} height={50}/>
		</Link>
		{
			window.location.pathname.split("/")[1] !== "setting" && <div className="close-btn" onClick={() => {onClose()}}>
				<Icon icon="Close" fill='var(--color-pink)' size={15} />
			</div> 
		}
		<div className="top-line"></div>
		<div className="bottom-line"></div>
		<div className="setting-menu active" onClick={() => {onClickMenu("general")}}> <span className = "line" style={{height: '100%',  zIndex:2, transform: 'translateY(calc(-50% - 0.7em))'}}></span>GENERAL</div>
		<div onClick={() => {onClickMenu("advanced")}} className="setting-menu"> <span className = "line" style={{height: '200%',  zIndex:3, transform: 'translateY(calc(-75% - 0.7em))'}}></span>ADVANCED</div>
		<div onClick={() => {onClickMenu("security")}} className="setting-menu"> <span className = "line" style={{height: '400%',  zIndex:5, transform: 'translateY(calc(-88% - 0.7em))'}}></span>SECURITY & PRIVACY</div>
		<div onClick={() => {onClickMenu("alert")}} className="setting-menu"> <span className = "line" style={{height: '500%',  zIndex:6, transform: 'translateY(calc(-91% - 0.7em))'}}></span>ALERTS</div>
		<div onClick={() => {onClickMenu("network")}} className="setting-menu"> <span className = "line" style={{height: '600%',  zIndex:7, transform: 'translateY(calc(-92% - 0.7em))'}}></span>NETWORKS</div>
		<div onClick={() => {onClickMenu("experimental")}} className="setting-menu"> <span className = "line" style={{height: '700%',  zIndex:8, transform: 'translateY(calc(-94% - 0.7em))'}}></span>EXPERIMENTAL</div>
		<div onClick={() => {onClickMenu("about")}} className="setting-menu"> <span className = "line" style={{height: '800%',  zIndex:9, transform: 'translateY(calc(-94% - 0.7em))'}}></span>ABOUT</div>
	</>
)
export default {
	SideMenu_General, Setting_General
}