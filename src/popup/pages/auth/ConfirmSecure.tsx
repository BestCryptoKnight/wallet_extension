// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import { Link, useHistory} from 'react-router-dom'
import Icon from '../../components/Icon'
import Loading from '../../components/Loading'
import { decrypt, encrypt } from '../../../lib/utils';
import { getAddressFromMnemonic } from '../../../lib/wallet';
import useStore, {showAlert } from '../../useStore';
import {DEFAULT_NETWORKS} from '../../../constants'
import {setPassHash} from '../../../lib/api'
import '../../assets/css/auth/auth.scss'

interface StateInterface {
		password:		string
		phrase:			string
		selectWords:   string[]
		selectIndex:   number
		word1:			string
		word2:			string
		word3:			string
		word4:			string
		word5:			string
		word6:			string
		word7:			string
		word8:			string
		word9:			string
		word10:			string
		word11:			string
		word12:			string
		tmpMnem:		string[]
		loading:		boolean
}
export default function () {
	const [status, setStatus] = React.useState<StateInterface>({ 
		password:		'',
		phrase:			'',
		selectWords:   [],
		selectIndex:   0,
		word1:			'',
		word2:			'',
		word3:			'',
		word4:			'',
		word5:			'',
		word6:			'',
		word7:			'',
		word8:			'',
		word9:			'',
		word10:			'',
		word11:			'',
		word12:			'',
		tmpMnem:		[],
		loading:		true
	});
	const updateStatus = (params:{[key:string]:string|number|boolean|string[]}) => setStatus({...status, ...params});
	const history = useHistory();
	const {update} = useStore()

	const selectWord = (word: string) => {
		const key = "word"+(status.selectIndex+1)
		const selectWords = status.selectWords;
		selectWords.push(word)
		updateStatus({ [key]: word, selectIndex: status.selectIndex+1})
	}

	const completeBackup =  async () => {
		const phrase = status.word1 + " "+status.word2 +" "+ status.word3+" "+status.word4 +" "+status.word5 + " "+ status.word6 +" "+status.word7 +" "+status.word8 +" "+status.word9 +" "+status.word10 + " "+status.word11 +" "+status.word12
		if(status.phrase !== phrase) return showAlert("Incorrect SECRET RECOVERY PHRASE", "warning")
		const walletInfo = getAddressFromMnemonic(phrase, 0);
		const newWallet = {
			"mnemonic": phrase,
			"keys": {
				[walletInfo.publickey] : walletInfo.privatekey
			}
		}
		const w = await encrypt(JSON.stringify(newWallet), status.password) 
		if (w===null) return showAlert("browser crypto library is wrong", "warning")
		const info:AccountObject = {
			"address": walletInfo.publickey,
			"imported":	false,
			"index": 0,
			"label": "Account 1",
			"value":{},
			"tokens":{}
		}
		var accs:AccountObject[] = [];
		accs.push(info)
		update({
				vault: w, accounts: {...accs}, apps:{}, networks:[...DEFAULT_NETWORKS],  contacts:[], createdAccountLayer:1, currentAccount:walletInfo.publickey, currentNetwork:"neon", setting: {
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
		if(await setPassHash(status.password) === true) {history.push("/auth_congration")}
	}


	const reset = () => {
		updateStatus({
			word1: '',
			word2: '',
			word3: '',
			word4: '',
			word5: '',
			word6: '',
			word7: '',
			word8: '',
			word9: '',
			word10: '',
			word11: '',
			word12: '',
			selectWords: [],
			selectIndex: 0
		})
	}

	React.useEffect(()=> {
		const pathname = window.location.pathname
		const passHash = pathname.split("/")[2];
		const ind = pathname.indexOf(passHash);
		const phraseHash = pathname.substring(ind+passHash.length+1)
		const mnemonic = decrypt(phraseHash, passHash) || ''
		updateStatus({password: passHash, phrase: mnemonic, tmpMnem : mnemonic.split(" ").sort(), loading: false})
	}, [])

	return (
		<>
			<div className='back-panel'>
				<div className='container inner-panel'>
					<div className="justify" style={{alignItems:'start'}}>
						<Link className='back-btn' style={{position:'relative'}} to="/auth_selectwallet">
							<Icon icon="ArrowLeft"  size={20}/>
						</Link>
						<Icon icon="Neon" size={100} height={50}/>
						<div></div>
					</div>
					<div>
						<div style={{textAlign: 'center'}}>
							<h3 className='m0 p0' >CONFIRM SECRET RECOVERY PHRASE </h3>
							<p>Please select each phrase in order to make sure it is correct.	</p>
							<div className="mt1">
								<div style={{backgroundColor:'#170330', padding:'1em'}}>
									<div className='flex center'>
										<div className='p1 m1'>
											<div className="justify">
												<p className="m0" style={{width:'20px'}}>1</p>
												<div className='input-phrase'>{status.word1}</div>
											</div>
											<div className="justify">
												<p className="m0" style={{width:'20px'}}>5</p>
												<div className='input-phrase'>{status.word5}</div>
											</div>
											<div className="justify">
												<p className="m0" style={{width:'20px'}}>9</p>
												<div className='input-phrase'>{status.word9}</div>
											</div>
										</div>
										<div className="p1 m1">
											<div className="justify">
												<p className="m0" style={{width:'20px'}}>2</p>
												<div className='input-phrase'>{status.word2}</div>
											</div>
											<div className="justify">
												<p className="m0" style={{width:'20px'}}>6</p>
												<div className='input-phrase'>{status.word6}</div>
											</div>
											
											<div className="justify">
												<p className="m0" style={{width:'20px'}}>10</p>
												<div className='input-phrase'>{status.word10}</div>
											</div>
										</div>
										<div className="p1 m1">
											<div className="justify">
												<p className="m0" style={{width:'20px'}}>3</p>
												<div className='input-phrase'>{status.word3}</div>
											</div>
											<div className="justify">
												<p className="m0" style={{width:'20px'}}>7</p>
												<div className='input-phrase'>{status.word7}</div>
											</div>
											<div className="justify">
												<p className="m0" style={{width:'20px'}}>11</p>
												<div className='input-phrase'>{status.word11}</div>
											</div>
										</div>
										<div className='p1 m1'>
											<div className="justify">
												<p className="m0" style={{width:'20px'}}>4</p>
												<div className='input-phrase'>{status.word4}</div>
											</div>
											<div className="justify">
												<p className="m0" style={{width:'20px'}}>8</p>
												<div className='input-phrase'>{status.word8}</div>
											</div>
											<div className="justify">
												<p className="m0" style={{width:'20px'}}>12</p>
												<div className='input-phrase'>{status.word12}</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="mt1">
								<div className="row center">
									<button className={`btn-phrase ${status.selectWords.indexOf(status.tmpMnem[0]) > -1 ? 'active' : ''}`}  disabled={status.selectWords.indexOf(status.tmpMnem[0]) > -1 ? true:false} onClick={() => {selectWord(status.tmpMnem[0])}}>
										{status.tmpMnem[0]}
									</button>
									<button className={`btn-phrase ${status.selectWords.indexOf(status.tmpMnem[1]) > -1 ? 'active' : ''}`}  disabled={status.selectWords.indexOf(status.tmpMnem[1]) > -1 ? true:false} onClick={() => {selectWord(status.tmpMnem[1])}}>
										{status.tmpMnem[1]}
									</button>
									<button className={`btn-phrase ${status.selectWords.indexOf(status.tmpMnem[2]) > -1 ? 'active' : ''}`}  disabled={status.selectWords.indexOf(status.tmpMnem[2]) > -1 ? true:false} onClick={() => {selectWord(status.tmpMnem[2])}}>
										{status.tmpMnem[2]}
									</button>
									<button className={`btn-phrase ${status.selectWords.indexOf(status.tmpMnem[3]) > -1 ? 'active' : ''}`}  disabled={status.selectWords.indexOf(status.tmpMnem[3]) > -1 ? true:false} onClick={() => {selectWord(status.tmpMnem[3])}}>
										{status.tmpMnem[3]}
									</button>
								</div>
								<div className="row center">
									<button className={`btn-phrase ${status.selectWords.indexOf(status.tmpMnem[4]) > -1 ? 'active' : ''}`}  disabled={status.selectWords.indexOf(status.tmpMnem[4]) > -1 ? true:false} onClick={() => {selectWord(status.tmpMnem[4])}}>
										{status.tmpMnem[4]}
									</button>
									<button className={`btn-phrase ${status.selectWords.indexOf(status.tmpMnem[5]) > -1 ? 'active' : ''}`}  disabled={status.selectWords.indexOf(status.tmpMnem[5]) > -1 ? true:false} onClick={() => {selectWord(status.tmpMnem[5])}}>
										{status.tmpMnem[5]}
									</button>
									<button className={`btn-phrase ${status.selectWords.indexOf(status.tmpMnem[6]) > -1 ? 'active' : ''}`}  disabled={status.selectWords.indexOf(status.tmpMnem[6]) > -1 ? true:false} onClick={() => {selectWord(status.tmpMnem[6])}}>
										{status.tmpMnem[6]}
									</button>
									<button className={`btn-phrase ${status.selectWords.indexOf(status.tmpMnem[7]) > -1 ? 'active' : ''}`}  disabled={status.selectWords.indexOf(status.tmpMnem[7]) > -1 ? true:false} onClick={() => {selectWord(status.tmpMnem[7])}}>
										{status.tmpMnem[7]}
									</button>
								</div>
								<div className="row center">
									<button className={`btn-phrase ${status.selectWords.indexOf(status.tmpMnem[8]) > -1 ? 'active' : ''}`}  disabled={status.selectWords.indexOf(status.tmpMnem[8]) > -1 ? true:false} onClick={() => {selectWord(status.tmpMnem[8])}}>
										{status.tmpMnem[8]}
									</button>
									<button className={`btn-phrase ${status.selectWords.indexOf(status.tmpMnem[9]) > -1 ? 'active' : ''}`}  disabled={status.selectWords.indexOf(status.tmpMnem[9]) > -1 ? true:false} onClick={() => {selectWord(status.tmpMnem[9])}}>
										{status.tmpMnem[9]}
									</button>
									<button className={`btn-phrase ${status.selectWords.indexOf(status.tmpMnem[10]) > -1 ? 'active' : ''}`}  disabled={status.selectWords.indexOf(status.tmpMnem[10]) > -1 ? true:false} onClick={() => {selectWord(status.tmpMnem[10])}}>
										{status.tmpMnem[10]}
									</button>
									<button className={`btn-phrase ${status.selectWords.indexOf(status.tmpMnem[11]) > -1 ? 'active' : ''}`}  disabled={status.selectWords.indexOf(status.tmpMnem[11]) > -1 ? true:false} onClick={() => {selectWord(status.tmpMnem[11])}}>
										{status.tmpMnem[11]}
									</button>
								</div>	
							</div>
							<div className="row center text-align">
								<button className="btn-cancel mt1" style={{width:'200px', padding:'1.2em 1.6em', margin:'1em'}} onClick = {() => {reset()}}>
									RESET
								</button>
								{
									status.selectIndex === 12 && 
									<button className="btn-special mt1" style={{width:'200px',padding:'1.2em 1.6em', margin:'1em' }} onClick = {() => {completeBackup()}}>
										COMPLETE BACKUP
									</button>
								}
							</div>
						</div>
					</div>
				</div>
			</div>
			{status.loading && <Loading />}
		</>
	);
}
