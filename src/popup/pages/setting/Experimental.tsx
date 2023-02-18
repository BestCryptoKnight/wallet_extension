// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import useStore from '../../useStore';

interface DialogProps {
	onClose: Function
	onClickMenu: Function
}

export const Setting_Experimental = () => {
	const {setting, update} = useStore()
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

	return (
		<>
			<div className="justify">
				<h4>EXPERIMENTAL</h4>
			</div>
			<div className="hr mt1 mb3 yellow"></div>
			<h5 className='m0'>USE TOKEN DETECTION</h5>
			<p className='t0 ml0'>We use third-party APIs to detect and display new tokens sent to your wallet. Turn off if you don’t want Neon Wallet to pull data from services.</p>
			<div className="flex" >
				<div className={`switch ${setting.useTokenDetection ? 'checked' : ''}`} onClick={() => {updateSetting("useTokenDetection", !setting.useTokenDetection)}}>
					<input type="checkbox" hidden />
					<div className={`case ${setting.useTokenDetection ? 'checked' : ''}`}></div>
				</div>
				<p className='m0'>{setting.useTokenDetection ? 'ON' : 'OFF'}</p>
			</div>
			<div className="hr mt3 mb3"></div>
			<h5 className='m0'>ENABLE ENHANCED GAS FEE UI </h5>
			<p className='t0 ml0'>We’ve upgraded how gas estimation and customization works. Turn on if you’d like to use the new gas experience.</p>
			<div className="flex" >
				<div className={`switch ${setting.enhancedGasFeeUI ? 'checked' : ''}`} onClick={() => {updateSetting("enhancedGasFeeUI", !setting.enhancedGasFeeUI)}}>
					<input type="checkbox" hidden />
					<div className={`case ${setting.enhancedGasFeeUI ? 'checked' : ''}`}></div>
				</div>
				<p className='m0'>{setting.enhancedGasFeeUI ? 'ON' : 'OFF'}</p>
			</div>
		</>
	)
}

export const SideMenu_Experimental = ({onClickMenu, onClose}: DialogProps)=>(
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
		<div className="setting-menu " onClick={() => {onClickMenu("general")}}> <span className = "line" style={{height: '100%',  zIndex:2, transform: 'translateY(calc(-50% - 0.7em))'}}></span>GENERAL</div>
		<div onClick={() => {onClickMenu("advanced")}} className="setting-menu"> <span className = "line" style={{height: '200%',  zIndex:3, transform: 'translateY(calc(-75% - 0.7em))'}}></span>ADVANCED</div>
		<div onClick={() => {onClickMenu("security")}} className="setting-menu"> <span className = "line" style={{height: '400%',  zIndex:5, transform: 'translateY(calc(-88% - 0.7em))'}}></span>SECURITY & PRIVACY</div>
		<div onClick={() => {onClickMenu("alert")}} className="setting-menu"> <span className = "line" style={{height: '500%',  zIndex:6, transform: 'translateY(calc(-91% - 0.7em))'}}></span>ALERTS</div>
		<div onClick={() => {onClickMenu("network")}} className="setting-menu"> <span className = "line" style={{height: '600%',  zIndex:7, transform: 'translateY(calc(-92% - 0.7em))'}}></span>NETWORKS</div>
		<div onClick={() => {onClickMenu("experimental")}} className="setting-menu active"> <span className = "line" style={{height: '700%',  zIndex:8, transform: 'translateY(calc(-94% - 0.7em))'}}></span>EXPERIMENTAL</div>
		<div onClick={() => {onClickMenu("about")}} className="setting-menu"> <span className = "line" style={{height: '800%',  zIndex:9, transform: 'translateY(calc(-94% - 0.7em))'}}></span>ABOUT</div>
	</>
)

export default {
	SideMenu_Experimental, Setting_Experimental
}