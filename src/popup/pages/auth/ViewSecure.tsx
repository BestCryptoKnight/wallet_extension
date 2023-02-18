// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import { CSVLink } from 'react-csv';
import { Link, useHistory} from 'react-router-dom'
import Icon from '../../components/Icon'
import Loading from '../../components/Loading'
import { createMnemonic } from '../../../lib/wallet';
import { decrypt, encrypt } from '../../../lib/utils';
import '../../assets/css/auth/auth.scss'

export default function () {
	const [status, setStatus] = React.useState({ 
		password:		'',
		phrase:			'',
		hideOverflow:  false,
		loading:		true
	});
	const updateStatus = (params:{[key:string]:string|number|boolean}) => setStatus({...status, ...params});
	const history = useHistory();
	React.useEffect(()=> {
		const address = window.location.pathname.split("/")[2];
		updateStatus({loading: true})
		let phrase =  createMnemonic();
		let flag = true;
		while(flag) {
			const arr =phrase.split(" ");
			const set = new Set(arr)
			if(set.size !== arr.length) {
				phrase = createMnemonic()
			} else {
				flag = false;
				break;
			}
		}
		updateStatus({password: address, phrase: phrase, loading: false})
	}, [])

	const confirmPhrase  =  () => {
		const phraseHash = encrypt(status.phrase, status.password) || '';
		history.push( "/auth_confirmsecure/" + status.password +"/" + phraseHash)
	}

	return (
		<div className='back-panel'>
			<div className='container inner-panel'>
				<div className='row mt3'>
					<div className="col-lg-8 col-sm-12">	
						<div className="justify" style={{alignItems:'start'}}>
							<Link className='back-btn' style={{position:'relative'}} to="/auth_selectwallet">
								<Icon icon="ArrowLeft"  size={20}/>
							</Link>
							<Icon icon="Neon" size={100} height={50}/>
							<div></div>
						</div>
						<div style={{textAlign: 'center'}}>
							<h5 >WRITE DOWN YOUR SECRET RECOVERY PHRASE</h5>
							<p className='t0 mt5'>This is your Secret Recovery Phrase. Write it down on a paper and keep it in a safe place. You’ll be asked to re-enter this phrase (in order) on the next step.</p>
							<div className="mt3">
								<div style={{backgroundColor:'#471189', display:'none', padding:'1em', border:'1px solid var(--color-pink)'}} >
									<h5 className='m0'>Tap to reveal your Secret Recovery Phrase</h5>
									<p>Make sure no one is watching your screen.</p>
									<button className="btn-primary  mt1" style={{width:'200px'}} >
										View
									</button>
								</div>
								<div style={{backgroundColor:'#170330', padding:'1em', minHeight:'100px', position:'relative'}}>
									{!status.hideOverflow && <div style={{width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.95)', position:'absolute', top:0, left:0, cursor:'pointer', display:'flex', alignItems:'center	', justifyContent:'center'}} onClick={(e) => {updateStatus({hideOverflow: true})}}>
										<p>CLICK HERE TO REVEAL SECRET WORDS</p>
									</div>}
									<h5>{status.phrase}</h5>
								</div>
							</div>
							{status.hideOverflow && <button className="btn-primary  mt3" style={{width:'200px'}} onClick={() => {confirmPhrase()}}>
								CONTINUE
							</button>}
						</div>
					</div>
					<div className="col-lg-4 col-sm-12">
						<p>Tips:</p>
						<p>Store this phrase in a password manager like Password.</p>
						<p>Write this phrase on a piece of paper and store in a secure location. If you want even more security, write it down on multiple pieces of paper and store each in 2 - 3 different locations.</p>
						<p>Memorize this phrase.</p>
						
						<CSVLink filename='neonwallet.csv' data={[{mnemonic: status.phrase}]}><p className='text-yellow pointer' >Download this Secret Recovery Phrase and keep it stored safely on an external encrypted hard drive or storage medium.
						</p></CSVLink>
					</div>
				</div>
			</div>
			{status.loading && <Loading />}
		</div>
	);
}
