// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import Icon from '../components/Icon';;
import '../assets/css/swap.scss'
import Dropdown from '../components/Dropdown'

interface ConnectDialogProps {
	onClose: Function
}

export default function ({ onClose }: ConnectDialogProps) {
	const items = [
		{ key:'en', label: 'English'},
		{ key:'ch', label: 'Chine'},
		{ key:'ru', label: 'Russia'},
		{ key:'uk', label: 'Ukrine'},
		{ key:'ar', label: 'Arabic'},
	]
	return (
		<div className='swap-modal'>
			<div className=" token-panel">
				<div className="header">
					<h4 className='m0 text-center'>SWAP</h4>
					<span className="close-btn" onClick={()=>onClose()}>
						<div className="justify">
							<Icon icon="Close" size= {12} fill="var(--color-pink)"/>
						</div>
					</span>
				</div>
				<div className="content">
					<p className='text-center t0 mt3'>SWAP FROM</p>
					<Dropdown placeholder='Select a token' items={items} value={'English'} onValueChange = {(v: string) => {}}/>
					<p className='t0 t-small text-center'>4.1794 ETH  available to swap</p>
					{/* <input type="text" placeholder='0' />	

					<p className='text-center t0 mt3'>SWAP TO</p>	
					<input type="text" placeholder='Select Token' />	
					<div className="row center middle">
						<p className='text-yellow text-center pointer mr1'>
							Advanced Options
						</p>
						<Icon icon=ArrowDown color={"var(--color-yellow)"} width={15}  />
					</div>
					<div className='hide'>
						<div className="row center middle">
							<div>
								<p className='t0'>Slippage</p>
								<p className='t0'>Tolerance</p>
							</div>
							<div className="ml1 mr1"><Icon icon=Warning width={15} height={15} /></div>
							<div className='badge'>2%</div>
							<div style={{padding:'0.4em 0.8em', borderRadius:'5px', border:'1px solid rgba(150, 54, 245, 0.5)', color:'#6E3D9E', margin:'5px'}}>2%</div>
						</div>
						<div className="row center middle">
							<p>Smart transaction</p>
							<div className="ml1 mr1"><Icon icon=Warning width={15} height={15} /></div>
							<div className='switch checked'>
								<input type="checkbox" hidden />
								<div className='case checked'></div>
							</div>
							<p>ON</p>
						</div>
					</div>
					<div className="text-center">
						<Link className="btn-primary  mt1" style={{width:'200px'}} to="/assets">
							REVIEW SWAP
						</Link>
					</div>
					<div className='mt3'>
						<div className="hr"></div>
						<p className='text-center text-yellow pointer'>Terms of Service</p>
					</div> */}
				</div>
			</div>
		</div>
	);
}
