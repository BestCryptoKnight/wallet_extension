// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import useStore, { showAlert } from '../../useStore';

interface DialogProps {
	onClose: Function
	onClickMenu: Function
}

export const Setting_Advanced = () => {
	const {setting, update, } = useStore()
	const updateSetting = (key: SettingObjectKeyType, value: any) => {
		const sets: SettingObject = {
			currency:			key === 'currency' ? value : setting.currency,
			isFiat:				key === 'isFiat' ? value : setting.isFiat,		
			identicon:			key === 'identicon' ? value : setting.identicon,
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

	const downloadLog = () => {
		return showAlert("Upcoming", "info")
	}

	const resetAccount = () => {
		update({setting: {currency:'USD', showTestnet: true}, apps: {}, contacts: [], transactions: {}})
		showAlert("Reseted account setting information", "info")
	}

	return (
		<>
		<div className="justify">
			<h4>ADVANCED</h4>
		</div>
		
		<div className="hr mt1 mb3 yellow"></div>
		{/* <h5 className='m0'>STATE LOGS</h5>
		<p className='t0 ml0'>State logs contain your public account addresses and sent transactions.</p>
		<div className="btn-primary  mt1" style={{width:'250px', margin:0}} onClick = {() => {downloadLog()}}>
			DOWNLOAD STATE LOGS
		</div> */}
		{/* <p className='t0 ml0 mt3'>Sync with mobile</p>
		<div className="btn-primary  mt1" style={{width:'250px', margin:0}}>
			DOWNLOAD WITH MOBILE
		</div> */}
		{/* <div className="hr mt3 mb3"></div> */}
		<h5 className='m0'>RESET ACCOUNT</h5>
		<p className='t0 ml0'>Resetting your account will clear your transaction history. THis will not change the balances in your accounts or require you to re-enter your Secret Recovery Phrase.</p>
		<div className="btn-cancel  mt1" style={{width:'250px', margin:0}} onClick={() => {resetAccount()}}>
			RESET ACCOUNT
		</div>
		
		<div className="hr mt3 mb3"></div>
		<h5 className='m0'>ADVANCED GAS CONTROLS</h5>
		<p className='t0 ml0'>
			Select this to show gas price and limit controls directly on the send and confirm screens.
		</p>
		<div className="flex" >
			<div className={`switch ${setting.gasControls ? 'checked' : ''}`} onClick={() => {updateSetting("gasControls", !setting.gasControls)}}>
				<input type="checkbox" hidden />
				<div className={`case ${setting.gasControls ? 'checked' : ''}`}></div>
			</div>
			<p className='m0'>{setting.gasControls ? 'ON' : 'OFF'}</p>
		</div>
		
		<div className="hr mt3 mb3"></div>
		<h5 className='m0'>SHOW HEX DATA</h5>
		<p className='t0 ml0'>
			Select this to show the hex data field send screen
		</p>
		<div className="flex" >
			<div className={`switch ${setting.showHexData ? 'checked' : ''}`} onClick={() => {updateSetting("showHexData", !setting.showHexData)}}>
				<input type="checkbox" hidden />
				<div className={`case ${setting.showHexData ? 'checked' : ''}`}></div>
			</div>
			<p className='m0'>{setting.showHexData ? 'ON' : 'OFF'}</p>
		</div>
{/* 		
		<div className="hr mt3 mb3"></div>
		<h5 className='m0'>Show Conversion on test networks</h5>
		<p className='t0 ml0'>
		Select this to show fiat conversion on test networks
		</p>
		<div className="flex" >
			<div className={`switch ${setting.showFiatOnTestnet ? 'checked' : ''}`} onClick={() => {updateSetting("showFiatOnTestnet", !setting.showFiatOnTestnet)}}>
				<input type="checkbox" hidden />
				<div className={`case ${setting.showFiatOnTestnet ? 'checked' : ''}`}></div>
			</div>
			<p className='m0'>{setting.showFiatOnTestnet ? 'ON' : 'OFF'}</p>
		</div> */}
		<div className="hr mt3 mb3"></div>
		<h5 className='m0'>Show test networks</h5>
		<p className='t0 ml0'>
		Select this to show test networks in network list
		</p>
		<div className="flex" >
			<div className={`switch ${setting.showTestnet ? 'checked' : ''}`} onClick={() => {updateSetting("showTestnet", !setting.showTestnet)}}>
				<input type="checkbox" hidden />
				<div className={`case ${setting.showTestnet ? 'checked' : ''}`}></div>
			</div>
			<p className='m0'>{setting.showTestnet ? 'ON' : 'OFF'}</p>
		</div>
		
		<div className="hr mt3 mb3"></div>
		<h5 className='m0'>Customize transaction nonce</h5>
		<p className='t0 ml0'>
		Turn this on to change the nonce (transaction number) on confirmation screens. This is an advanced feature, use cautiously.
		</p>
		<div className="flex" >
			<div className={`switch ${setting.showTxNonce ? 'checked' : ''}`} onClick={() => {updateSetting("showTxNonce", !setting.showTxNonce)}}>
				<input type="checkbox" hidden />
				<div className={`case ${setting.showTxNonce ? 'checked' : ''}`}></div>
			</div>
			<p className='m0'>{setting.showTxNonce ? 'ON' : 'OFF'}</p>
		</div>
		
		<div className="hr mt3 mb3"></div>
		<h5 className='m0'>Auto-Lock Timer (minutes)</h5>
		<p className='t0 ml0'>
		Set the idle time in minutes before Neon wallet will become locked.
		</p>
		<input type="number" value = {setting.autoLockTimer} style={{width: '300px', marginLeft:'auto', marginRight:'auto'}} onChange = {(e) => {updateSetting("autoLockTimer", e.target.value)}}/>
		<br/>
		<button className='btn-primary' style={{marginLeft:0, marginTop: '1em'}}>Save</button>	
	</>
	)
}

export const SideMenu_Advanced = ({onClickMenu, onClose}: DialogProps)=>(
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
		<div className="setting-menu" onClick={() => {onClickMenu("general")}}> <span className = "line" style={{height: '100%',  zIndex:2, transform: 'translateY(calc(-50% - 0.7em))'}}></span>GENERAL</div>
		<div onClick={() => {onClickMenu("advanced")}} className="setting-menu active"> <span className = "line" style={{height: '200%',  zIndex:3, transform: 'translateY(calc(-75% - 0.7em))'}}></span>ADVANCED</div>
		<div onClick={() => {onClickMenu("security")}} className="setting-menu"> <span className = "line" style={{height: '400%',  zIndex:5, transform: 'translateY(calc(-88% - 0.7em))'}}></span>SECURITY &amp; PRIVACY</div>
		<div onClick={() => {onClickMenu("alert")}} className="setting-menu"> <span className = "line" style={{height: '500%',  zIndex:6, transform: 'translateY(calc(-91% - 0.7em))'}}></span>ALERTS</div>
		<div onClick={() => {onClickMenu("network")}} className="setting-menu"> <span className = "line" style={{height: '600%',  zIndex:7, transform: 'translateY(calc(-92% - 0.7em))'}}></span>NETWORKS</div>
		<div onClick={() => {onClickMenu("experimental")}} className="setting-menu"> <span className = "line" style={{height: '700%',  zIndex:8, transform: 'translateY(calc(-94% - 0.7em))'}}></span>EXPERIMENTAL</div>
		<div onClick={() => {onClickMenu("about")}} className="setting-menu"> <span className = "line" style={{height: '800%',  zIndex:9, transform: 'translateY(calc(-94% - 0.7em))'}}></span>ABOUT</div>
	</>
)

export default {
	Setting_Advanced, SideMenu_Advanced
}