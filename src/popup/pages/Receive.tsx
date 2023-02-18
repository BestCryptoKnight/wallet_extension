// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import Icon from '../components/Icon';
import '../assets/css/receive.scss'
import Avartar from '../components/Avartar';
import useStore, {ellipsis,  copyToClipboard, roundNumber} from '../useStore';
import { formatUnit } from '../../lib/bigmath';

interface ConnectDialogProps {
	tx:	Transaction | null
	onClose: Function
}

export default function ({tx, onClose }: ConnectDialogProps) {	
	const {currentAccount, accounts, setting} = useStore()

	return (
		<div className='receive-modal'>
			<div className="overlay"></div>
			<div className=" token-panel">
				<div className="header">
					<h4 className='m0 text-center'>
						{
							tx?.method && tx.method !== null && tx.method !== ""  ? "Contract Transaction" : ((tx?.from  || '')=== currentAccount ? 'SEND' : 'RECEIVE')
						}
					</h4>
					<h5 className='m0 mt1 text-center'>STATUS: <span className='text-pink'>{tx?.status}</span></h5>
					<span className="close-btn" onClick={()=>onClose()}>
						<div className="justify">
							<Icon icon="Close" size= {12} fill="var(--color-pink)"/>
						</div>
					</span>
				</div>
				<div className="content">
					<div className="text-center"><a href={`${tx?.explorer}tx/${tx?.transactionId}`} target="_blank" className='text-center text-yellow t0 pointer'>View on block explorer</a></div>
					<p className='text-center text-yellow t0 pointer' onClick={() => {copyToClipboard(tx?.transactionId || '')}}>Copy to Transaction ID</p>
					<div className="justify justify-around middle">
						<div className='avartar-panel'>
							<div className = "avartar"> 
								<Avartar address={tx?.from || ''} size={30} type={setting.identicon === 'jazzicons'? 1: 2}/>
							</div>
							<p>
								{
                                    tx && (tx.from.toLowerCase() === currentAccount.toLowerCase() ? Object.values(accounts).find(i=>(i?.address.toLowerCase() === tx.from.toLowerCase()))?.label : ellipsis(tx.from))
                                }
							</p>
						</div>
						<div className='wallet-btn'>
							<Icon icon="ArrowRightLong" />
						</div>
						<div className='avartar-panel'>
						<div className = "avartar"> 
								<Avartar address={tx?.to || ''} size={30} type={setting.identicon === 'jazzicons'? 1: 2}/>
							</div>
							<p>
								{
                                    tx && (tx.to.toLowerCase() === currentAccount.toLowerCase() ? Object.values(accounts).find(i=>(i?.address.toLowerCase() === tx.to.toLowerCase()))?.label : ellipsis(tx.to))
                                }
							</p>
						</div>	
					</div>
					<div className="text-center">
						<div className="row center middle m0">
							<h3 className='mt1 mb1 text-yellow'>{` ${roundNumber(formatUnit(tx?.amount || '0', Number(tx?.decimals || 0)))} ${tx?.symbol}`}</h3>
						</div>
					</div>
					<div className="hr  mb1"></div>
					<div style={{padding: '0 1em'}}>
						<div className="justify">
							<h5 className='m0'>TRANSACTION</h5>
						</div>
						<div className="justify">
							<p className='t0'>Nance</p>
							<p className="t0">{Number(tx?.nonce)}</p>
						</div>
						<div className="justify">
							<p className="t0">Amount</p>
							<p className="t0">{` ${roundNumber(formatUnit(tx?.amount || '0', Number(tx?.decimals || 0)))} ${tx?.symbol}`}</p>
						</div>
						
						<div className="justify">
							<p className="t0">Gas Limit (Units)</p>
							<p className="t0">{Number(tx?.gasLimit || '0')}</p>
						</div>
						<div className="justify">
							<p className="t0">Gas Used (Units)</p>
							<p className="t0">{Number(tx?.gasUsed || '0')}</p>
						</div>
						<div className="justify">
							<p className="t0">Gas price</p>
							<p className="t0">{formatUnit(tx?.gasPrice || '0', 9)}</p>
						</div>
						<div className="hr "></div>
						<div className="justify">
							<p className="t0 text-pink">
								TOTAL
							</p>
							<div className='text-right'>
								<p className="t0" ><b>{roundNumber(formatUnit(tx?.amount || '0', Number(tx?.decimals || 0)))}  {tx?.symbol}</b></p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
