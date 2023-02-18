// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React from 'react';
import Icon from './Icon';

interface DropdownStatus {
	onOpen: boolean
	value: string
}

interface dropItem {
	label: string
	key:  string
}
interface ItemProps {
	items: dropItem []
	value: string
	style?: object
	placeholder: string
	onValueChange : Function
}

const Dropdown = ({items, value, style={}, placeholder, onValueChange} : ItemProps) => {
	const [status, setStatus] = React.useState<DropdownStatus>({ 
		onOpen: false,
		value: value
	});
	const updateStatus = (params : Partial<DropdownStatus>) => setStatus({ ...status, ...params });

	return (
		<div className='dropdown' onBlur={() => {updateStatus({onOpen: false})}} style={{...style}}>
			<input type="text" placeholder={placeholder} value = {status.value}  onBlur={() => {updateStatus({onOpen: false})}} className="drop-value"   onClick = {() => {updateStatus({onOpen: true})}} readOnly/>
			<div className="drop-icon" onClick = {() => {updateStatus({onOpen: !status.onOpen})}} onBlur={() => {updateStatus({onOpen: false})}}>
				{
					!status.onOpen && (<Icon icon="ArrowDown" />)
				}
				{
					status.onOpen && (<Icon icon="Close" size= {12} fill="var(--color-pink)"/>)
				}
			</div>
				
			<div className={`drop-list ${status.onOpen? 'active':''}`}   onBlur = {() => {updateStatus({onOpen: false})}}>
			{
				items.map((value, index) => {
					return <div className='drop-item' onClick={() => {updateStatus({onOpen: false, value: value['label']}); onValueChange(value['label'])}}>
					 	{value['label']}
					 </div>
				})
			}
			</div>
		</div>
	)
}

export default Dropdown