// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import { Link } from 'react-router-dom';
import { decrypt, hash } from '../../../lib/utils';
import Icon from '../../components/Icon';
import useStore, { copyToClipboard, showAlert} from '../../useStore';
import { CSVLink} from "react-csv";


interface DialogProps {
	onClose: Function	
	onClickMenu: Function
}

export const Setting_Security = () => { 
	const [status, setStatus] = React.useState({ 
		checkedPassword: 	false,
		password:			'',
		phrase:				'',
		openPasswordModal:	false
	});
	const updateStatus = (params:{[key:string]:string|number|boolean}) => setStatus({...status, ...params});

	const {setting, update, vault} = useStore()

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

	const getPhrase = async () => {
		const passHash = hash(status.password);
		const plain = await decrypt(vault, passHash);
		if (plain===null || plain==='') return showAlert("Incorrect password", "warning")
		const wallet = JSON.parse(plain)
		updateStatus({phrase:  wallet.mnemonic, checkedPassword: true, password:''});
	}

	return (
		<>
			<div className="justify">
				<h4>SECURITY &amp; PRIVACY</h4>
			</div>
			
			<div className="hr mt1 mb3 yellow"></div>
			<h5 className='m0'>REVEAL SECRET RECOVERY PHRASE</h5>
			<div className="btn-primary  mt1" style={{width:'320px', margin:0, marginTop:'1em'}} onClick = {() => {updateStatus({checkedPassword: false, openPasswordModal: true, password:''})}}>
				REVEAL SECRET RECOVERY PHRASE
			</div>
			<div className="hr mt3 mb3"></div>
			<h5 className='m0'>SHOW INCOMING TRANSACTIONS</h5>
			<p className='t0 ml0'>Select this to use Neonscan to show incoming transactions in the transactions list</p>
			<div className="flex" onClick={() => {updateSetting("ShowIncomingTxs", !setting.ShowIncomingTxs)}}>
				<div className={`switch ${setting.ShowIncomingTxs ? 'checked' : ''}`}>
					<input type="checkbox" hidden />
					<div className={`case ${setting.ShowIncomingTxs ? 'checked' : ''}`}></div>
				</div>
				<p className='m0'>{setting.ShowIncomingTxs ? 'ON' : 'OFF'}</p>
			</div>
			{/* <div className="hr mt3 mb3"></div>
			<h5 className='m0'>USE PHISHING DETECTION</h5>
			<p className='t0 ml0'>Display a warning for domains targeting Ethereum users</p>
			<div className="flex" onClick={() => {updateSetting("phishingDetection", !setting.phishingDetection)}}>
				<div className={`switch ${setting.phishingDetection ? 'checked' : ''}`}>
					<input type="checkbox" hidden />
					<div className={`case ${setting.phishingDetection ? 'checked' : ''}`}></div>
				</div>
				<p className='m0'>{setting.phishingDetection ? 'ON' : 'OFF'}</p>
			</div>

			
			<div className="hr mt3 mb3"></div>
			<h5 className='m0'>PARTICIPATE IN METAMETRICS</h5>
			<p className='t0 ml0'>Participate in MetaMetrics to help Neon Wallet better</p>
			<div className="flex" onClick={() => {updateSetting("joinMetaMetrics", !setting.joinMetaMetrics)}}>
				<div className={`switch ${setting.joinMetaMetrics ? 'checked' : ''}`}>
					<input type="checkbox" hidden />
					<div className={`case ${setting.joinMetaMetrics ? 'checked' : ''}`}></div>
				</div>
				<p className='m0'>{setting.joinMetaMetrics ? 'ON' : 'OFF'}</p>
			</div> */}
			{
				status.openPasswordModal && <div className='password-modal'>
					<div className='token-panel'>
						<div className="header">
							<h4 className='m0 text-center'>Secret Recovery Phrase</h4>
							<span className="close-btn" style={{backgroundColor: 'transparent', top:0, right:0}} onClick={() => {updateStatus({openPasswordModal: false, checkedPassword: false, password:'', phrase:''})}}>
								<Icon icon="Close" size={12} fill="var(--color-pink)"/>
							</span>
						</div>
						<div className="content container p3" style={{paddingTop:0}}>
							<p className='t0'>If you ever change browsers or move computers, you will need this Secret Recovery Phrase to access your accounts. Save them somewhere safe and secret.</p>
							<div className='alert' style={{padding:0, margin:0}}>
								<span style={{margin: '1em'}}><Icon icon="Check" size={15}/></span>
								<div>
									<p className='t0'>
										DO NOT share this phrase with anyone!
										These words can be used to steal all your accounts.
									</p>
								</div>
							</div>
							{
								status.checkedPassword && <>
									<p className='t0'>
										Your private Secret Recovery Phrase
									</p>
									<textarea value={status.phrase} style={{height:'90px'}} readOnly />
									<div className="hr mt3"></div>
									<div className="text-center">
										<div className="btn-special  " style={{margin:0, marginTop:'0.5em'}} onClick = {() => {copyToClipboard(status.phrase)}}>
											Copy
										</div>
										<CSVLink filename='neonwallet.csv' data={[{mnemonic: status.phrase}]}><div className="btn-special  " style={{margin:0, marginTop:'0.5em'}} >
											Save as CSV File
										</div></CSVLink>
									</div>
									<div className="text-center">
										<div className="btn-cancel  mt1" style={{width:'150px'}} onClick = {() => {updateStatus({openPasswordModal: false, phrase: '', checkedPassword: false, password:''})}}>
											CLOSE
										</div>
									</div> 
								</>
							}
							{
								!status.checkedPassword && <>
									<p className='t0'>
										Enter password to continue
									</p>
									<input type="password" placeholder='Password' value={status.password} onChange={(e) => {updateStatus({password: e.target.value})}}/>
									<div className="hr mt3"></div>
									<div className="justify">
										<div className="btn-cancel  mt1" style={{width:'130px'}} onClick = {() => {updateStatus({openPasswordModal: false, phrase: '', checkedPassword: false})}}>
											CANCEL
										</div>
										<div className="btn-special  mt1" style={{width:'130px'}} onClick = {() => {getPhrase()}}>
											NEXT
										</div>
									</div>
								</>
							}
						</div>
					</div>
				</div>
			}
		</>
	)
}

export const SideMenu_Security = ({onClickMenu, onClose}: DialogProps)=>(
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
		<div onClick={() => {onClickMenu("advanced")}} className="setting-menu">  <span className = "line" style={{height: '200%',  zIndex:3, transform: 'translateY(calc(-75% - 0.7em))'}}></span>ADVANCED</div>
		<div onClick={() => {onClickMenu("security")}} className="setting-menu active"> <span className = "line" style={{height: '400%',  zIndex:5, transform: 'translateY(calc(-88% - 0.7em))'}}></span>SECURITY &amp; PRIVACY</div>
		<div onClick={() => {onClickMenu("alert")}} className="setting-menu"> <span className = "line" style={{height: '500%',  zIndex:6, transform: 'translateY(calc(-91% - 0.7em))'}}></span>ALERTS</div>
		<div onClick={() => {onClickMenu("network")}} className="setting-menu"> <span className = "line" style={{height: '600%',  zIndex:7, transform: 'translateY(calc(-92% - 0.7em))'}}></span>NETWORKS</div>
		<div onClick={() => {onClickMenu("experimental")}} className="setting-menu"> <span className = "line" style={{height: '700%',  zIndex:8, transform: 'translateY(calc(-94% - 0.7em))'}}></span>EXPERIMENTAL</div>
		<div onClick={() => {onClickMenu("about")}} className="setting-menu"> <span className = "line" style={{height: '800%',  zIndex:9, transform: 'translateY(calc(-94% - 0.7em))'}}></span>ABOUT</div>
	</>
)

export default {
	Setting_Security, SideMenu_Security
}