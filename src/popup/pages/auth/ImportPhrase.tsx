// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import { Link, useHistory} from 'react-router-dom'
import Icon from '../../components/Icon'
import {checkMnemonic, getAddressFromMnemonic} from '../../../lib/wallet'
import {hash, encrypt} from '../../../lib/utils'
import useStore, {showAlert} from '../../useStore';
import Dropdown from '../../components/Dropdown';
import {setPassHash} from '../../../lib/api'
import { DEFAULT_NETWORKS } from '../../../constants'
import '../../assets/css/auth/auth.scss'
import config from '../../../config.json'

export default function () {
	const [state, setStates] = React.useState({
		password1		:	'',
		password2 		:	'',
		remember		:	false,
		keyType			:	12,
		dropLabel		:	'I have a 12-words phrase',
		word1			:	'',
		word2			:	'',
		word3			:	'',
		word4			:	'',
		word5			:	'',
		word6			:	'',
		word7			:	'',
		word8			:	'',
		word9			:	'',
		word10			:	'',
		word11			:	'',
		word12			:	'',
		word13			:	'',
		word14			:	'',
		word15			:	'',
		word16			:	'',
		word17			:	'',
		word18			:	'',
		word19			:	'',
		word20			:	'',
		word21			:	'',
		word22			:	'',
		word23			:	'',
		word24			:	'',
		pasted:				false
	});
	const updateStatus = (params: {[key: string]: string | number | boolean | Blob | any }) => setStates({ ...state, ...params })
	
	const history = useHistory();
	
	const {update} = useStore();

	const items = [
		{ key:'12', label: 'I have a 12-words phrase'},
		{ key:'15', label: 'I have a 15-words phrase'},
		{ key:'18', label: 'I have a 18-words phrase'},
		{ key:'21', label: 'I have a 21-words phrase'},
		{ key:'24', label: 'I have a 24-words phrase'}
	]

	const importSeed = async () => {
		var phrase = "";
		if(state.keyType === 12) phrase = state.word1 + " " + state.word2 + " "+ state.word3 + " "+ state.word4+" "+ state.word5 + " "+ state.word6 + " "+ state.word7 +" " + state.word8 + " "+state.word9 +" "+state.word10 + " "+ state.word11 + " "+state.word12;
		else if(state.keyType === 15) phrase = state.word1 + " " + state.word2 + " "+ state.word3 + " "+ state.word4+" "+ state.word5 + " "+ state.word6 + " "+ state.word7 +" " + state.word8 + " "+state.word9 +" "+state.word10 + " "+ state.word11 + " "+state.word12 + " "+ state.word13 + " "+state.word14 + " " + state.word15;
		else if(state.keyType === 18) phrase = state.word1 + " " + state.word2 + " "+ state.word3 + " "+ state.word4+" "+ state.word5 + " "+ state.word6 + " "+ state.word7 +" " + state.word8 + " "+state.word9 +" "+state.word10 + " "+ state.word11 + " "+state.word12+ " "+ state.word13 + " "+state.word14 + " " + state.word15 + " "+ state.word16 +" "+ state.word17 +" "+ state.word18;
		else if(state.keyType === 21) phrase = state.word1 + " " + state.word2 + " "+ state.word3 + " "+ state.word4+" "+ state.word5 + " "+ state.word6 + " "+ state.word7 +" " + state.word8 + " "+state.word9 +" "+state.word10 + " "+ state.word11 + " "+state.word12+ " "+ state.word13 + " "+state.word14 + " " + state.word15 + " "+ state.word16 +" "+ state.word17 +" "+ state.word18 + " " + state.word19 +" "+state.word20 +" "+ state.word21 ;
		else if(state.keyType === 24) phrase = state.word1 + " " + state.word2 + " "+ state.word3 + " "+ state.word4+" "+ state.word5 + " "+ state.word6 + " "+ state.word7 +" " + state.word8 + " "+state.word9 +" "+state.word10 + " "+ state.word11 + " "+state.word12+ " "+ state.word13 + " "+state.word14 + " " + state.word15 + " "+ state.word16 +" "+ state.word17 +" "+ state.word18 + " " + state.word19 +" "+state.word20 +" "+ state.word21 +" " + state.word22 +" "+state.word23 +" "+state.word24;

		if(!checkMnemonic(phrase))  return showAlert( "Invalid Secret Recovery Phrase", "error");
		if(state.password1 !== state.password2 || state.password1 === '') return showAlert( "Invalid confirm password", "error");
		if((state.password1.length <8))return showAlert( "Invalid password", "error");
		if(!state.remember) return showAlert("Please select checkbox", "info")
		const wallet = await getAddressFromMnemonic(phrase, 0);
		const passHash = hash(state.password1);
		const initWallet = {
			"mnemonic": phrase,
			"keys": {
				[wallet.publickey] : wallet.privatekey
			}
		}
		const vault = await encrypt(JSON.stringify(initWallet), passHash) 
		if (vault===null) return showAlert("browser crypto library is wrong", "warning")
		const accounts:AccountObject[] = [{
			"address": wallet.publickey,
			"imported": false,
			"index": 0,
			"label":"Account 1",
			"value":{},
			"tokens":{}
		}];
		update({vault: vault, accounts: {...accounts}, apps:{}, networks:[...DEFAULT_NETWORKS],  contacts:[], createdAccountLayer:1, currentAccount:wallet.publickey, currentNetwork:"neon", setting: {
				currency:			'USD',
				isFiat: 			true,
				identicon:			"jazzicons",
				hideToken:			false,
				gasControls:		false,
				showHexData:		false,
				showFiatOnTestnet:	false,
				showTestnet:		true,
				showTxNonce:		false,
				autoLockTimer:		5,
				backup3Box:			false,
				ipfsGateWay:		'',
				ShowIncomingTxs:	false,
				phishingDetection:	false,
				joinMetaMetrics:	false,
				unconnectedAccount:	false,
				tryOldWeb3Api:		false,
				useTokenDetection:	false,
				enhancedGasFeeUI:	false
			}, 
			tokens: {}
		})
		if(await setPassHash(passHash) === true) {history.push("/auth_congration")}
	}

	const paste = (v: string) => {
		const words = v.split(' ');
		var args: {[k:string]:string} = {};
		for(var i =0 ;i<words.length ; i++) {
			args["word" + (i+1)] = words[i]
		}
		updateStatus({...args, pasted: true})
	} 
	
	return (
		<div className='back-panel'>
			<div className='container inner-panel'>
				<div className="justify" style={{alignItems:'start'}}>
					<Link className='back-btn flex middle' style={{position:'relative'}} to="/auth_selectwallet">
						<Icon icon="ArrowLeft"  size={20}/>
					</Link>
					<Icon icon="Neon" size={120} height={50}/>
					<div style={{width:'30px'}}></div>
				</div>
				<div>
					<div>
						<h5  style={{marginBottom:'0.5em', textAlign:'center'}}>Import a wallet with Secret Recovery Phrase</h5>
						<p className='t0'>Only the first account on this wallet will auto load. After completing this process, to add additional accounts, click the drop down menu, then select Create Account.</p>
						<div>
							<p className='t0 mr3'>Secret Recovery Phrase</p>
							<Dropdown placeholder='Select a token' style={{width:'300px'}} items={items} value={state.dropLabel} onValueChange = {(v: string) => {updateStatus({dropLabel: v, keyType: parseInt(v.substring(9, 11))})}}/>
						</div>	
						<div className="hr mt mt2 mb1"></div>

						<div className="row">
						 	<div className="col-lg-4 col-sm-12 flex middle p1">
						 		<p className='t0 m0 mr1' style={{width:'20px'}}>1.</p>
								<input type="text" style={{width:'80%'}} onPaste = {(e) => {return paste(e.clipboardData.getData('Text'))}} onChange={(e) => {if(!state.pasted){ updateStatus({pasted: false, 	word1: e.target.value.split(" ")[0]})} else {updateStatus({pasted: false})}}}  value = {state.word1} />
							</div>
							<div className="col-lg-4 col-sm-12 flex middle p1">
						 		<p className='t0 m0 mr1' style={{width:'20px'}}>2.</p>
								<input type="text" style={{width:'80%'}} value = {state.word2} onChange={(e) => {updateStatus({word2: e.target.value})}}/>
							</div>
							<div className="col-lg-4 col-sm-12 flex middle p1">
						 		<p className='t0 m0 mr1' style={{width:'20px'}}>3.</p>
								<input type="text" style={{width:'80%'}} value = {state.word3} onChange={(e) => {updateStatus({word3: e.target.value})}}/>
							</div>
							<div className="col-lg-4 col-sm-12 flex middle p1">
						 		<p className='t0 m0 mr1' style={{width:'20px'}}>4.</p>
								<input type="text" style={{width:'80%'}} value = {state.word4} onChange={(e) => {updateStatus({word4: e.target.value})}}/>
							</div>
							<div className="col-lg-4 col-sm-12 flex middle p1">
						 		<p className='t0 m0 mr1' style={{width:'20px'}}>5.</p>
								<input type="text" style={{width:'80%'}} value = {state.word5} onChange={(e) => {updateStatus({word5: e.target.value})}}/>
							</div>
							<div className="col-lg-4 col-sm-12 flex middle p1">
						 		<p className='t0 m0 mr1' style={{width:'20px'}}>6.</p>
								<input type="text" style={{width:'80%'}} value = {state.word6} onChange={(e) => {updateStatus({word6: e.target.value})}}/>
							</div>
							<div className="col-lg-4 col-sm-12 flex middle p1">
						 		<p className='t0 m0 mr1' style={{width:'20px'}}>7.</p>
								<input type="text" style={{width:'80%'}} value = {state.word7} onChange={(e) => {updateStatus({word7: e.target.value})}}/>
							</div>
							<div className="col-lg-4 col-sm-12 flex middle p1">
						 		<p className='t0 m0 mr1' style={{width:'20px'}}>8.</p>
								<input type="text" style={{width:'80%'}} value = {state.word8} onChange={(e) => {updateStatus({word8: e.target.value})}}/>
							</div>
							<div className="col-lg-4 col-sm-12 flex middle p1">
						 		<p className='t0 m0 mr1' style={{width:'20px'}}>9.</p>
								<input type="text" style={{width:'80%'}} value = {state.word9} onChange={(e) => {updateStatus({word9: e.target.value})}}/>
							</div>
							<div className="col-lg-4 col-sm-12 flex middle p1">
						 		<p className='t0 m0 mr1' style={{width:'20px'}}>10.</p>
								<input type="text" style={{width:'80%'}} value = {state.word10} onChange={(e) => {updateStatus({word10: e.target.value})}}/>
							</div>
							<div className="col-lg-4 col-sm-12 flex middle p1">
						 		<p className='t0 m0 mr1' style={{width:'20px'}}>11.</p>
								<input type="text" style={{width:'80%'}} value = {state.word11} onChange={(e) => {updateStatus({word11: e.target.value})}}/>
							</div>
							<div className="col-lg-4 col-sm-12 flex middle p1">
						 		<p className='t0 m0 mr1' style={{width:'20px'}}>12.</p>
								<input type="text" style={{width:'80%'}} value = {state.word12} onChange={(e) => {updateStatus({word12: e.target.value})}}/>
							</div>
							{state.keyType > 12 && <>
								<div className="col-lg-4 col-sm-12 flex middle p1">
									<p className='t0 m0 mr1' style={{width:'20px'}}>13.</p>
									<input type="text" style={{width:'80%'}} value = {state.word13} onChange={(e) => {updateStatus({word13: e.target.value})}}/>
								</div>
								<div className="col-lg-4 col-sm-12 flex middle p1">
									<p className='t0 m0 mr1' style={{width:'20px'}}>14.</p>
									<input type="text" style={{width:'80%'}} value = {state.word14} onChange={(e) => {updateStatus({word14: e.target.value})}}/>
								</div>
								<div className="col-lg-4 col-sm-12 flex middle p1">
									<p className='t0 m0 mr1' style={{width:'20px'}}>15.</p>
									<input type="text" style={{width:'80%'}} value = {state.word15} onChange={(e) => {updateStatus({word15: e.target.value})}}/>
								</div>
							</>}
							{state.keyType > 15 && <>
								<div className="col-lg-4 col-sm-12 flex middle p1">
									<p className='t0 m0 mr1' style={{width:'20px'}}>16.</p>
									<input type="text" style={{width:'80%'}} value = {state.word16} onChange={(e) => {updateStatus({word16: e.target.value})}}/>
								</div>
								<div className="col-lg-4 col-sm-12 flex middle p1">
									<p className='t0 m0 mr1' style={{width:'20px'}}>17.</p>
									<input type="text" style={{width:'80%'}} value = {state.word17} onChange={(e) => {updateStatus({word17: e.target.value})}}/>
								</div>
								<div className="col-lg-4 col-sm-12 flex middle p1">
									<p className='t0 m0 mr1' style={{width:'20px'}}>18.</p>
									<input type="text" style={{width:'80%'}} value = {state.word18} onChange={(e) => {updateStatus({word18: e.target.value})}}/>
								</div>
							</>}
							{state.keyType > 18 && <>
								<div className="col-lg-4 col-sm-12 flex middle p1">
									<p className='t0 m0 mr1' style={{width:'20px'}}>19.</p>
									<input type="text" style={{width:'80%'}} value = {state.word19} onChange={(e) => {updateStatus({word19: e.target.value})}}/>
								</div>
								<div className="col-lg-4 col-sm-12 flex middle p1">
									<p className='t0 m0 mr1' style={{width:'20px'}}>20.</p>
									<input type="text" style={{width:'80%'}} value = {state.word20} onChange={(e) => {updateStatus({word20: e.target.value})}}/>
								</div>
								<div className="col-lg-4 col-sm-12 flex middle p1">
									<p className='t0 m0 mr1' style={{width:'20px'}}>21.</p>
									<input type="text" style={{width:'80%'}} value = {state.word21} onChange={(e) => {updateStatus({word21: e.target.value})}}/>
								</div>
							</>}
							{state.keyType > 21 && <>
								<div className="col-lg-4 col-sm-12 flex middle p1">
									<p className='t0 m0 mr1' style={{width:'20px'}}>22.</p>
									<input type="text" style={{width:'80%'}} value = {state.word22} onChange={(e) => {updateStatus({word22: e.target.value})}}/>
								</div>
								<div className="col-lg-4 col-sm-12 flex middle p1">
									<p className='t0 m0 mr1' style={{width:'20px'}}>23.</p>
									<input type="text" style={{width:'80%'}} value = {state.word23} onChange={(e) => {updateStatus({word23: e.target.value})}}/>
								</div>
								<div className="col-lg-4 col-sm-12 flex middle p1">
									<p className='t0 m0 mr1' style={{width:'20px'}}>24.</p>
									<input type="text" style={{width:'80%'}} value = {state.word24} onChange={(e) => {updateStatus({word24: e.target.value})}}/>
								</div>
							</>}
						</div>

						<div className="justify mt1" style={{margin:0}}>
							<p className='t0 mb0'>New password (8 characters min)</p>
						</div>	
						<input type="password" placeholder='New password'  style={{width:'300px'}} value={state.password1} onChange={(e) => {updateStatus({password1: e.target.value})}}/>
						<div className="justify mt1" style={{margin:0}}>
							<p className='t0 mb0'>Confirm password</p>
						</div>
						<input type="password" placeholder='Confirm password'   style={{width:'300px'}} value={state.password2} onChange={(e) => {updateStatus({password2: e.target.value})}}/>
						
						<div className="flex middle">
							<div className='checkbox pointer' onClick={() => {updateStatus({remember: !state.remember})}}>
								{state.remember && <Icon icon="Check" size={8} height={20} fill="var(--color-pink)" />}
							</div>
							<p className='t0 ml1 pointer' style={{textAlign:'left', width:'90%' }} onClick={() => {updateStatus({remember: !state.remember})}}>I have read and agree to the 
								<a href={config.links.termsOfUse} target="_blank" className='text-yellow'> Terms of Use</a>
							</p>	
						</div>	
						<div className="btn-primary  mt1 mb1" style={{width:'250px'}} onClick={() => {importSeed()}}>
							IMPORT
						</div>
						<div className="hr mt3"></div>
						<a href={config.links.termsOfUse} target="_blank" className='t0 mt1'>By processing, you agree to these <i className='text-yellow'>Terms &amp; Conditions</i></a>
					</div>
				</div>
			</div>
		</div>
	);
}
