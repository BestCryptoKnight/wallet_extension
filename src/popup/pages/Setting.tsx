// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import '../assets/css/setting.scss'
import Icon from '../components/Icon';;
import { Setting_Advanced, SideMenu_Advanced } from './setting/Advanced';
import { SideMenu_General, Setting_General } from './setting/General';
import { SideMenu_Security, Setting_Security } from './setting/Security';
import { SideMenu_Alert, Setting_Alert } from './setting/Alert';
import { SideMenu_Network, Setting_Network } from './setting/Network';
import { SideMenu_Experimental, Setting_Experimental } from './setting/Experimental';
import { Setting_About, SideMenu_About } from './setting/About';
import useStore from '../useStore';

interface ConnectDialogProps {
	onClose: Function
}

export default function ({ onClose }: ConnectDialogProps) {
	
	const [status, setStatus] = React.useState({ 
		showSideMenu: false,
		settingPage: 'general'
	});
	const updateStatus = (params:{[key:string]:string|number|boolean}) => setStatus({...status, ...params});
	const {update} = useStore()

	React.useEffect(()=> {
		// window.innerWidth > 360  ? updateStatus({showSideMenu: true, settingPage:status.settingPage}): updateStatus({showSideMenu:false, settingPage:status.settingPage});
		const type = window.location.pathname.split("/")[2];
		if(type) {
			updateStatus({settingPage: type==="network"?type:"general", showSideMenu: window.innerWidth > 360 ? true: false})
		}else{
			updateStatus({settingPage: "general", showSideMenu: true})
		}
		update({lastAccessTime: +new Date()})
	}, [])

	const close = () => {		
		onClose()
		window.innerWidth > 360 ? onClose() : updateStatus({showSideMenu: false});
	}

	return (
		<div className='setting-modal'>
			<div className="container inner-panel " style={{padding: 0}}>
				<div className={`side-menu justify ${status.showSideMenu ? 'hide': 'show'}` } onClick={() => {updateStatus({showSideMenu: true})}}>
					<Icon icon="Account" />
					<div className="close-btn" style={{right: 0}} onClick={() => {onClose()}}>
						<Icon icon="Close" fill='var(--color-pink)' size={15} />
					</div>
				</div>
				<div className="flex">
					<div className={`menu-panel ${status.showSideMenu ? 'show': 'hide'}` }>
						{
							status.showSideMenu==true && status.settingPage === 'general' && (
								<SideMenu_General onClickMenu={(page: string) => {updateStatus({settingPage: page, showSideMenu: window.innerWidth>360 ? true: false})}} onClose={() => {close() }}/>
							)
						}
						{
							status.showSideMenu==true && status.settingPage === 'advanced' && (
								<SideMenu_Advanced onClickMenu={(page: string) => {updateStatus({settingPage: page, showSideMenu: window.innerWidth>360 ? true: false})}} onClose={() => {close() }}/>
							)
						}
						{
							status.showSideMenu==true && status.settingPage === 'security' && (
								<SideMenu_Security onClickMenu={(page: string) => {updateStatus({settingPage: page, showSideMenu: window.innerWidth>360 ? true: false})}} onClose={() => {close() }}/>
							)
						}
						{
							status.showSideMenu==true && status.settingPage === 'alert' && (
								<SideMenu_Alert onClickMenu={(page: string) => {updateStatus({settingPage: page, showSideMenu: window.innerWidth>360 ? true: false})}} onClose={() => {close() }}/>
							)
						}
						{
							status.showSideMenu==true && status.settingPage === 'network' && (
								<SideMenu_Network onClickMenu={(page: string) => {updateStatus({settingPage: page, showSideMenu: window.innerWidth>360 ? true: false})}} onClose={() => {close() }}/>
							)
						}
						{
							status.showSideMenu==true && status.settingPage === 'experimental' && (
								<SideMenu_Experimental onClickMenu={(page: string) => {updateStatus({settingPage: page, showSideMenu: window.innerWidth>360 ? true: false})}} onClose={() => {close() }}/>
							)
						}
						{
							status.showSideMenu==true && status.settingPage === 'about' && (
								<SideMenu_About onClickMenu={(page: string) => {updateStatus({settingPage: page, showSideMenu: window.innerWidth>360 ? true: false})}} onClose={() => {close() }}/>
							)
						}
					</div>
					<div className="setting-container">
						{
							status.settingPage === 'general' && (
								<Setting_General />
							)
						}
						{
							status.settingPage === 'advanced' && (
								<Setting_Advanced />
							)
						}
						{
							status.settingPage === 'security' && (
								<Setting_Security />
							)
						}
						{
							status.settingPage === 'alert' && (
								<Setting_Alert />
							)
						}
						{
							status.settingPage === 'network' && (
								<Setting_Network />
							)
						}
						{
							status.settingPage === 'experimental' && (
								<Setting_Experimental />
							)
						}
						{
							status.settingPage === 'about' && (
								<Setting_About />
							)
						}
					</div>
				</div>
			</div>
		</div>
	);
}
