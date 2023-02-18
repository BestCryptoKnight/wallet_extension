// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import config from '../../../config.json'

interface DialogProps {
	onClose: Function
	onClickMenu: Function
}

export const Setting_About = () => (
	<>
		<div className="justify">
			<h4>ABOUT</h4>
		</div>
		
		<div className="hr mt1 mb3 yellow"></div>
		<h5 className='m0'>NEON WALLET VERSION</h5>
		<p className=''>1.0.0</p>
		<p className=''>NEON WALLET is designed and built around the world.</p>

		<div className="hr mt3 mb3"></div>
		<h5 className='m0'>LINKS </h5>
		{/* <a href={config.links.privacyPolicy} target="_blank" className='pointer text-yellow block mt3 mb1'>Privacy Policy</a>
		<a href={config.links.termsOfUse} target="_blank" className='pointer text-yellow block mt3 mb1'>Terms of Use</a>
		<a href={config.links.attributions} target="_blank" className='pointer text-yellow block mt3 mb1'>Attributions</a>
		<br /> */}
		<a href={config.links.support} target="_blank" className='pointer text-yellow block mt3 mb1'>Visit our Support Center</a>
		<a href={config.links.contactUs} target="_blank" className='pointer text-yellow block mt3 mb1'>Contact us</a>
	</>
)

export const SideMenu_About = ({onClickMenu, onClose}: DialogProps)=>(
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
		<div onClick={() => {onClickMenu("experimental")}} className="setting-menu "> <span className = "line" style={{height: '700%',  zIndex:8, transform: 'translateY(calc(-94% - 0.7em))'}}></span>EXPERIMENTAL</div>
		<div onClick={() => {onClickMenu("about")}} className="setting-menu active" > <span className = "line" style={{height: '800%',  zIndex:9, transform: 'translateY(calc(-94% - 0.7em))'}}></span>ABOUT</div>
	</>
)

export default {
	SideMenu_About, Setting_About
}