// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022


import React from "react"
import '../assets/css/auth/auth.scss'

export const IconViewer = () => {
	return (
		<>
			<div style={{position: 'fixed', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'white'}}>
				<div style={{display: 'flex', flexWrap: 'wrap', gap: 10, padding: 30}}>
					{Object.keys(icons).map(i=>(
						<div className='d-center' style={{width: 120, height:80}}>
							<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5}}>
								<Icon icon={i} size={48} fill="var(--color-secondary)" />
								<span>{i}</span>
							</div>
							
						</div>
					))}	
				</div>
			</div>
		</>
	)
}

interface IconProps {
	className?: string
	fill?: string
	size?: number
	height?: number
	marginLeft?: number
	margin?: number
	icon: string
}

export const Icon = ({className, fill, size, height, icon, marginLeft, margin}: IconProps) => (
	<div className={className} style={{color: fill, width: size || 16, height: height || size || 16, marginLeft: marginLeft || 0, marginRight: margin || 0}}>
		{icons[icon]}
	</div>
)

const icons = {
	Neon: (
		<svg fill="currentColor" viewBox="0 0 132 53" width="100%" height="100%"> 
			<path d="M23.9654 28.2217L19.5119 29.0113L23.6745 29.3542L21.2261 38.9295L12.2949 40.5122L16.7207 23.2384L18.9613 22.8401L0.149902 21.1398L26.0467 16.5512C26.5731 16.4577 27.0475 16.7694 27.0995 17.3131L28.1799 26.3932L30.9192 15.6855L39.8504 14.1028L32.9209 41.1701L25.3333 39.6706L23.9619 28.2183L23.9654 28.2217Z" fill="white"/>
			<path d="M59.5276 32.1419L37.2151 36.0933L42.9846 13.5245L65.2971 9.57317L63.5587 16.3608L45.7239 19.5191L49.8865 19.8619L49.5956 20.9943L60.7397 19.0204L59.6073 23.5155L48.4389 25.4929L47.8606 27.7542L61.2419 25.3821L59.5311 32.1385L59.5276 32.1419Z" fill="white"/>
			<path d="M89.265 5.32757C89.871 5.22022 90.3455 5.63579 90.3455 6.21758C90.3455 6.32147 90.3177 6.40804 90.2935 6.5154L85.1024 26.8228C84.9708 27.3215 84.5483 27.7128 84.0738 27.7959L63.9985 31.3525C63.3924 31.4598 62.918 31.0443 62.918 30.4902C62.918 30.3863 62.918 30.3066 62.9457 30.1958L68.1368 9.88842C68.2684 9.38974 68.6909 8.97418 69.1896 8.88414L89.265 5.32757ZM80.0186 13.445L71.0874 15.0276L75.2777 15.3635L73.2483 23.2558L77.7018 22.4663L80.0186 13.4415V13.445Z" fill="white"/>
			<path d="M109.759 23.2455L100.828 24.8281L99.6438 14.7922L95.1903 15.5818L99.3529 15.9246L96.9011 25.5242L87.9698 27.1068L93.7393 4.53808L101.694 3.12861C102.248 3.03165 102.722 3.36757 102.774 3.91127L103.855 12.9914L106.594 2.25938L115.525 0.676758L109.756 23.2455H109.759Z" fill="white"/>
			<path d="M34.1674 52.0965C33.8073 52.1588 33.5233 51.9129 33.5233 51.5666C33.5233 51.5181 33.5233 51.4558 33.5406 51.4073L36.7751 38.7879L42.084 37.846L39.8538 46.5971L37.1838 47.0716L39.6806 47.2724L40.1828 47.1824L42.9013 44.6266L44.754 37.3715L50.0629 36.4296L47.6595 45.8526L48.1617 45.7625L50.8802 43.2068L52.7191 35.9551L58.0453 35.0132L55.9882 43.0717C55.957 43.2172 55.8774 43.3418 55.7527 43.4596L49.4707 49.378L44.1445 50.3199L43.1714 49.2048L41.4918 50.7909L34.1709 52.0895L34.1674 52.0965Z" fill="#FF0677"/>
			<path d="M61.7959 47.203L56.4697 48.145L59.7838 35.2001C59.8635 34.9022 60.1128 34.6529 60.4106 34.601L72.3651 32.4816C72.7253 32.4192 73.0093 32.6651 73.0093 33.0114C73.0093 33.0737 73.0093 33.1222 72.9954 33.188L69.7748 45.7866L64.4486 46.7286L65.484 42.6976L62.814 43.172L61.7924 47.1996L61.7959 47.203ZM61.5431 38.2649L64.0261 38.4692L63.5066 40.4778L66.1767 40.0033L66.8519 37.3229L61.5431 38.2649Z" fill="#FF0677"/>
			<path d="M78.1172 39.8199L75.461 40.2909L77.944 40.4952L84.6035 39.3143L83.568 43.3453L71.5997 45.4647L75.0385 32.0073L80.3647 31.0653L78.1172 39.8199Z" fill="#FF0677"/>
			<path d="M91.9832 37.3645L89.327 37.8355L91.81 38.0398L98.4695 36.8589L97.434 40.8899L85.4657 43.0093L88.9045 29.5518L94.2307 28.6099L91.9832 37.361V37.3645Z" fill="#FF0677"/>
			<path d="M112.64 38.1958L99.3354 40.5542L102.774 27.0967L116.079 24.7384L115.044 28.7867L104.409 30.6706L106.892 30.8749L106.719 31.5502L113.364 30.3728L112.689 33.0532L106.029 34.2341L105.683 35.5847L113.662 34.1718L112.64 38.1993V38.1958Z" fill="#FF0677"/>
			<path d="M120.931 27.7441L116.942 28.4506L117.977 24.4022L131.268 22.0474L130.247 26.0922L123.587 27.2731L126.084 27.4601L123.837 36.2147L118.528 37.1567L120.931 27.7476V27.7441Z" fill="#FF0677"/>
		</svg>
	),
	Logo: (
		<svg fill="currentColor" viewBox="0 0 61 49" width="100%" height="100%"> 
			<path d="M54.9645 24.7373C54.9645 30.9266 52.6631 36.5736 48.874 40.8831L56.4266 39.1535C58.8049 34.8843 60.1644 29.9702 60.1644 24.7373C60.1644 14.5683 55.0487 5.60122 47.2507 0.2547L39.5699 2.01366C48.5882 5.61954 54.9645 14.429 54.9645 24.7373Z" fill="url(#paint0_linear_196_33)"/>
			<path d="M13.4309 49L20.9578 47.2777C12.185 43.5582 6.02861 34.8697 6.02861 24.7373C6.02861 18.372 8.45818 12.5784 12.4415 8.22501L4.76068 9.98397C2.26516 14.3301 0.828667 19.3651 0.828667 24.7373C0.828667 34.767 5.8124 43.6315 13.4309 49Z" fill="url(#paint1_linear_196_33)"/>
			<path d="M30.4963 3.21937C18.6123 3.21937 8.97835 12.8533 8.97835 24.7374C8.97835 36.6214 18.6123 46.2554 30.4963 46.2554C42.3804 46.2554 52.0143 36.6214 52.0143 24.7374C52.0143 12.8533 42.3804 3.21937 30.4963 3.21937Z" fill="url(#paint2_linear_196_33)"/>
			<path d="M18.1103 11.0099L31.6067 7.93171L34.1865 22.9672L40.9146 21.4318L34.542 21.2412L37.5396 6.57951L51.0359 3.50132L43.9744 37.9624L31.9512 40.7071C31.1157 40.8976 30.3645 40.4249 30.2435 39.6114L27.8982 26.0087L24.5452 42.3964L11.0488 45.4746L18.114 11.0099H18.1103Z" fill="#D3FF00"/>
			<defs>
			<linearGradient id="paint0_linear_196_33" x1="30.4965" y1="0.2547" x2="30.4965" y2="49" gradientUnits="userSpaceOnUse">
			<stop stop-color="#490A8C"/>
			<stop offset="0.78" stop-color="#881FDE"/>
			</linearGradient>
			<linearGradient id="paint1_linear_196_33" x1="10.8913" y1="8.22867" x2="10.8913" y2="49" gradientUnits="userSpaceOnUse">
			<stop stop-color="#490A8C"/>
			<stop offset="0.78" stop-color="#881FDE"/>
			</linearGradient>
			<linearGradient id="paint2_linear_196_33" x1="30.4963" y1="3.22303" x2="30.4963" y2="46.2554" gradientUnits="userSpaceOnUse">
			<stop stop-color="#DB00A7"/>
			<stop offset="0.78" stop-color="#FF0677"/>
			</linearGradient>
			</defs>
		</svg>
	),
	Deposit: ( 
		<svg fill="var(--color-yellow)" viewBox="0 0 24 24" width="100%" height="100%">
			<path d="M25.5085 15.4269V18.0071L21.7381 21.656H7.34697L3.57581 18.0071V15.4247L0.574463 12.5542V19.8767L5.53659 24.678H23.5477L28.5107 19.8767V12.5557L25.5085 15.4269Z"/>
			<path d="M21.8511 12.4397L19.5239 10.1887L16.1886 13.4167V0.733154H12.8949L12.8972 13.4167L9.56109 10.1887L7.23468 12.4397L14.5425 19.5017L21.8511 12.4397Z"/>
		</svg>
	),
	Send: (
		<svg fill="var(--color-yellow)" viewBox="0 0 20 20" width="100%" height="100%"> 
			<path d="M8.60664 0.876516L8.60664 4.22465L13.4058 4.22409L0.286248 17.3436L2.65558 19.7129L15.7734 6.59176L15.7734 11.3914L19.121 11.3909L19.1138 0.884284L8.60664 0.876516Z"/>
		</svg>
	),
	Receive:(
		<svg stroke="var(--color-yellow)" fill="var(--color-yellow)" stroke-width="0" viewBox="0 0 20 20" height="100%" width="100%" ><path fill="none" d="M0 0h24v24H0z"></path><path d="M20 5.41L18.59 4 7 15.59V9H5v10h10v-2H8.41z"></path></svg>
	),
	Swap: (
		<svg fill="var(--color-yellow)" viewBox="0 0 30 25" width="100%" height="100%"> 
			<path d="M12.4741 12.1432L9.11815 8.79438H22.2999L27.5163 14.0004L29.588 11.933L23.5909 5.95144V5.87134L9.11815 5.8734L12.4741 2.52525L10.4051 0.459961L3.5251 7.33423L10.4051 14.2078L12.4741 12.1432Z"/>
			<path d="M17.6456 13.2681L21.0008 16.6169H7.74572L2.56428 11.4486L0.493896 13.5146L6.52805 19.5359V19.54H6.53217L6.53766 19.5455L6.54314 19.54L21.0008 19.5379L17.6456 22.8861L19.7146 24.9514L26.5939 18.0771L19.7146 11.2035L17.6456 13.2681Z"/>
		</svg>
	),
	Copy: (
		<svg fill="currentColor" viewBox="0 0 15 17" width="100%" height="100%"> 
			<path d="M3.5455 15.1104C3.5455 15.6274 3.96467 16.0466 4.48175 16.0466H12.9693C13.4864 16.0466 13.9056 15.6274 13.9056 15.1104V4.44745C13.9056 3.93037 13.4864 3.5112 12.9693 3.5112V2.57495C14.0035 2.57495 14.8418 3.4133 14.8418 4.44745V15.1104C14.8418 16.1445 14.0035 16.9829 12.9693 16.9829H4.48175C3.4476 16.9829 2.60925 16.1445 2.60925 15.1104H3.5455Z"/>
			<path fillRule="evenodd" clipRule="evenodd" d="M11.1818 1.76462H2.69427C2.1772 1.76462 1.75802 2.18379 1.75802 2.70086V13.3638C1.75802 13.8809 2.1772 14.3 2.69427 14.3H11.1818C11.6989 14.3 12.1181 13.8809 12.1181 13.3638V2.70086C12.1181 2.18379 11.6989 1.76462 11.1818 1.76462ZM2.69427 0.828369C1.66012 0.828369 0.821777 1.66671 0.821777 2.70086V13.3638C0.821777 14.3979 1.66012 15.2363 2.69427 15.2363H11.1818C12.216 15.2363 13.0543 14.3979 13.0543 13.3638V2.70086C13.0543 1.66671 12.216 0.828369 11.1818 0.828369H2.69427Z"/>
		</svg>
	),
	Menu: (
		<svg fill="currentColor" viewBox="0 0 7 24" width="100%" height="100%"> 
			<path d="M0.701172 2.97585L3.67702 0L6.65288 2.97585L3.67702 5.95171L0.701172 2.97585Z"/>
			<path d="M0.701172 11.7297L3.67702 8.75389L6.65288 11.7297L3.67702 14.7056L0.701172 11.7297Z"/>
			<path d="M0.701172 20.4837L3.67702 17.5079L6.65288 20.4837L3.67702 23.4596L0.701172 20.4837Z"/>
		</svg>
	),
	AllowRight: (
		<svg fill="currentColor" viewBox="0 0 12 17" width="100%" height="100%"> 
			<path d="M5.87268 8.14479L0.376465 13.6564L2.95132 16.2304L11.0258 8.14479L2.95132 0.0583496L0.376465 2.63321L5.87268 8.14479Z"/>
		</svg>
	),
	ArrowLeft: (
		<svg fill="currentColor" viewBox="0 0 8 13" width="100%" height="100%"> 
			<path d="M6.07966 12.3054L0.00713974 6.2329L1.60195 4.63809L7.67447 10.7106L6.07966 12.3054Z"/>
			<path d="M7.67446 1.69858L1.60194 7.77111L0.00713068 6.1763L6.07966 0.103776L7.67446 1.69858Z"/>
		</svg>
	),
	Check: (
		<svg fill="currentColor" viewBox="0 0 13 11" width="100%" height="100%"> 
			<path d="M12.9531 2.319L5.19772 10.0744L3.16095 8.03763L10.9164 0.282226L12.9531 2.319Z"/>
			<path d="M2.24871 3.12413L7.16221 8.03764L5.12544 10.0744L0.21193 5.16091L2.24871 3.12413Z"/>
		</svg>
	),
	Dot: (
		<svg width="10" height="9" viewBox="0 0 10 9" fill="currentColor" >
			<rect opacity="0.5" x="5.0625" y="0.150879" width="5.81014" height="5.81014" transform="rotate(45 5.0625 0.150879)" />
		</svg>
		
	),
	View: (
		<svg fill="currentColor" viewBox="0 0 16 17" width="100%" height="100%"> 
			<path d="M15.9468 10.8069V16.1337H0.118652V0.306641H5.55786L7.84258 2.68905H2.50106V13.7524H13.5644V8.32575L15.9468 10.8069ZM15.9436 0.306641H8.5905L11.0328 2.688H13.5444L13.5644 5.29206L15.9468 7.65556V0.306641H15.9436ZM10.3185 4.38868L4.75322 9.95394L6.29948 11.5002L11.8521 5.94754L10.3185 4.38973V4.38868Z"/>
		</svg>
	),
	Expand: (
		<svg fill="currentColor" viewBox="0 0 16 17" width="100%" height="100%"> 
			<path d="M9.18994 0.460449L11.4333 2.64878H13.7403L13.7586 5.03973L15.9469 7.21069V0.460449H9.18994Z"/>
			<path d="M0.165492 16.238V16.239H6.9196L4.67627 14.0507H2.36926L2.35093 11.6588L0.162598 9.48779V16.238H0.165492Z"/>
			<path d="M12.1494 5.79321L10.6115 4.25538L3.96012 10.9068L5.49795 12.4446L12.1494 5.79321Z"/>
		</svg>
	),
	Details: (
		<svg fill="currentColor" viewBox="0 0 16 17" width="100%" height="100%"> 
			<path d="M3.89093 6.50127V4.81178H12.7877L11.1003 6.50127H3.89093ZM11.0993 9.60113L12.7866 7.91164H3.89093V9.60113H11.1003H11.0993ZM8.0417 12.701L9.72908 11.0115H3.89093V12.701H8.0417ZM0.118652 0.841797V16.6699H15.9468V0.841797H0.118652ZM13.7181 14.4412H2.34734V3.07048H13.7181V14.4412Z"/>
		</svg>
	),
	Connected: (
		<svg fill="currentColor" viewBox="0 0 16 16" width="100%" height="100%"> 
			<path d="M6.89269 15.8859C3.09038 15.3228 0.162598 12.0372 0.162598 8.08018C0.162598 4.12318 3.09038 0.837544 6.89269 0.273438V2.78253C4.45888 3.31569 2.63043 5.48859 2.63043 8.08018C2.63043 10.6718 4.45888 12.8447 6.89269 13.3778V15.8869V15.8859ZM10.466 8.07915C10.466 6.74777 9.3863 5.66803 8.05493 5.66803C6.72356 5.66803 5.64382 6.74777 5.64382 8.07915C5.64382 9.41052 6.72356 10.4903 8.05493 10.4903C9.3863 10.4903 10.466 9.41052 10.466 8.07915ZM9.21718 0.273438V2.78253C11.651 3.31569 13.4794 5.48859 13.4794 8.08018C13.4794 10.6718 11.651 12.8447 9.21718 13.3778V15.8869C13.0205 15.3228 15.9473 12.0372 15.9473 8.08018C15.9473 4.12318 13.0205 0.837544 9.21718 0.273438Z"/>
		</svg>
	),
	Close: (
		<svg fill="currentColor" viewBox="0 0 17 17" width="100%" height="100%"> 
			<path d="M5.79969 8.11623L0.303467 13.6278L2.87833 16.2018L10.9528 8.11623L2.87833 0.0297852L0.303467 2.60465L5.79969 8.11623Z"/>
			<path d="M11.1207 8.11546L16.6169 2.60388L14.0421 0.0298725L5.96759 8.11546L14.0421 16.2019L16.6169 13.627L11.1207 8.11546Z"/>
		</svg>
	),
	Remove: (
		<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="100%" width="100%"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M20 7v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7H2V5h20v2h-2zM6 7v13h12V7H6zm5 2h2v2h-2V9zm0 3h2v2h-2v-2zm0 3h2v2h-2v-2zM7 2h10v2H7V2z"></path></g></svg>
	),
	ArrowRightLong: (
		<svg fill="currentColor" viewBox="0 0 21 13" width="100%" height="100%"> 
			<path d="M14.9193 0.015625L12.9942 1.94074L15.754 4.69984L0.666992 4.69984L0.666992 7.42447L15.754 7.42256L12.9942 10.1823L14.9193 12.1068L20.9563 6.06152L14.9193 0.015625Z"/>
		</svg>
	),
	ArrowRight: (
		<svg fill="currentColor" viewBox="0 0 12 17" width="100%" height="100%"> 
			<path d="M5.87268 8.14479L0.376465 13.6564L2.95132 16.2304L11.0258 8.14479L2.95132 0.0583496L0.376465 2.63321L5.87268 8.14479Z" fill="currentColor"/>
		</svg>
	),
	ArrowDown: (
		<svg fill="currentColor" viewBox="0 0 13 9" width="100%" height="100%"> 
			<path d="M12.9781 2.54018L6.90563 8.6127L5.31082 7.0179L11.3833 0.945373L12.9781 2.54018Z"/>
			<path d="M2.37131 0.945382L8.44383 7.01791L6.84903 8.61271L0.776505 2.54019L2.37131 0.945382Z"/>	
		</svg>
	),
	Search: (
		<svg fill="currentColor" viewBox="0 0 17 20" width="100%" height="100%"> 
			<path d="M0.745713 8.16703L0.74571 8.16691C0.678484 4.1785 3.55633 1.04012 6.96446 1.11269L6.96451 1.11269C10.1505 1.1802 12.8509 4.1027 12.9476 7.8244L12.9476 7.82454C12.9857 9.27539 12.6293 10.625 11.9957 11.7504L11.8206 12.0614L12.0578 12.328L16.158 16.9369L16.5316 16.6046L16.158 16.9369C16.3175 17.1161 16.3175 17.4274 16.158 17.6066L16.5316 17.939L16.158 17.6066L15.2713 18.6034C15.1421 18.7486 14.9604 18.7486 14.8313 18.6034L10.7268 13.9898L10.4297 13.6558L10.0647 13.9138C9.07699 14.6117 7.90534 14.9955 6.65464 14.9517L6.65459 14.9517C3.47336 14.8406 0.807484 11.8856 0.745713 8.16703ZM12.2284 7.64491L12.2284 7.64489C12.0606 4.7007 9.93458 2.24212 7.20256 2.04621C3.88887 1.80774 1.26407 4.87195 1.4662 8.42005L1.4662 8.42007C1.63405 11.3643 3.76003 13.8228 6.49204 14.0187C9.80573 14.2572 12.4305 11.193 12.2284 7.64491Z" fill="#6E3D9E" stroke="#6E3D9E"/>
			<path d="M5.85227 11.7174C4.39082 11.1009 3.36879 9.46816 3.42922 7.58316L3.42923 7.58305C3.4477 7.00277 3.57078 6.43709 3.78643 5.92011L4.11419 6.15865C3.92121 6.61144 3.81308 7.10456 3.79649 7.60648L3.79649 7.60652C3.74445 9.18402 4.60195 10.6396 5.95293 11.2025L5.85227 11.7174ZM3.51921 5.72564C3.51921 5.72563 3.5192 5.72563 3.5192 5.72563L3.51921 5.72564ZM6.28846 12.0922L6.47803 11.1225L6.28846 12.093L6.28846 12.0922Z" fill="#6E3D9E" stroke="#6E3D9E"/>
		</svg>	
	),
	ArrowTop: (
		<svg fill="currentColor" viewBox="0 0 14 9" width="100%" height="100%"> 
			<path d="M0.861084 6.5244L6.93361 0.451872L8.52841 2.04668L2.45589 8.1192L0.861084 6.5244Z"/>
			<path d="M11.4679 8.11919L5.3954 2.04667L6.9902 0.451863L13.0627 6.52439L11.4679 8.11919Z"/>
		</svg>
	),
	Account: (
		<svg fill="currentColor" viewBox="0 0 28 18" width="100%" height="100%"> 
			<path d="M2.8783 1.03708L27.8032 0.989258L24.8386 4.60668L0.0810547 4.60664L2.8783 1.03708Z"/>
			<path d="M2.8783 7.40137L22.6137 7.35352L19.6491 10.9709L0.0810547 10.9709L2.8783 7.40137Z"/>
			<path d="M2.8783 14.2622L17.0037 14.2144L14.0392 17.8318L0.0810547 17.8318L2.8783 14.2622Z"/>
		</svg>
	),
	Key: (
		<svg stroke={"currentColor"} fill={"currentColor"} stroke-width="0" viewBox="0 0 16 16" width="100%" height="100%"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path></svg>
	),
	Add: (
		<svg fill="currentColor" viewBox="0 0 16 16" width="100%" height="100%"> 
			<rect x="6.883" y="0.172852" width="2.62246" height="15"  />
			<rect x="15.6942" y="6.36133" width="2.62246" height="15" transform="rotate(90 15.6942 6.36133)"/>
		</svg>
	),
	Connect: (
		<svg fill="currentColor" viewBox="0 0 18 17" width="100%" height="100%"> 
			<path d="M5.89153 16.9575C3.09594 16.9588 0.828519 14.6934 0.82721 11.8975C0.826556 10.5534 1.36028 9.26426 2.3109 8.31418L5.15001 5.47245L6.63141 6.95272L3.7923 9.7951C2.6329 10.955 2.63323 12.8352 3.79296 13.9947C4.95268 15.1542 6.83266 15.1539 7.99206 13.994L10.8318 11.1539L12.3126 12.6349L9.47281 15.475C8.52415 16.4264 7.23516 16.9601 5.89153 16.9578V16.9575ZM13.2599 11.6877L11.7792 10.2068L14.6189 7.36672C15.7734 6.20162 15.7652 4.3211 14.6003 3.16647C13.4428 2.01938 11.5776 2.01905 10.4198 3.16582L7.57778 6.00591L6.09703 4.52434L8.93941 1.68392C10.9297 -0.281041 14.1363 -0.260423 16.101 1.73039C18.0484 3.70321 18.0477 6.87515 16.1 8.84731L13.2602 11.6874L13.2599 11.6877ZM6.09768 10.2071L10.8321 5.47213L12.3129 6.95305L7.57843 11.6881L6.09768 10.2071Z"/>
		</svg>
	),
	Support: (
		<svg fill="currentColor" viewBox="0 0 21 22" width="100%" height="100%"> 
			<path d="M7.69049 0.2146C3.55033 0.2146 0.194153 3.57767 0.194153 7.72634V15.2381H7.69049C11.8287 15.2334 15.1821 11.8731 15.1868 7.72634C15.1868 3.57767 11.8307 0.2146 7.69049 0.2146ZM7.69049 13.1841H2.24393V7.72634C2.24393 4.71225 4.68259 2.26859 7.69049 2.26859C10.6984 2.26859 13.1371 4.71225 13.1371 7.72634C13.1371 10.7404 10.6984 13.1841 7.69049 13.1841Z" />
			<path d="M16.6545 7.15552C16.6662 7.34449 16.6728 7.53463 16.6728 7.72634C16.672 8.37031 16.6033 8.99825 16.4745 9.60427C17.5037 10.5972 18.1444 11.9916 18.1444 13.5362V18.9939H12.6978C10.8702 18.9939 9.25301 18.0918 8.26482 16.7079C8.07468 16.7201 7.88337 16.7271 7.69049 16.7275H5.91324C7.11187 19.2784 9.6985 21.0448 12.6978 21.0483H20.1942V13.5366C20.1942 10.8433 18.7796 8.48142 16.6545 7.15552Z"/>
		</svg>
	),
	Setting: (
		<svg fill="currentColor" viewBox="0 0 21 22" width="100%" height="100%"> 
			<path d="M10.1941 6.26792C7.59231 6.26792 5.48346 8.34173 5.48346 10.9003C5.48346 13.4588 7.59231 15.5326 10.1941 15.5326C12.7959 15.5326 14.9047 13.4588 14.9047 10.9003C14.9018 8.34297 12.7946 6.27082 10.1941 6.26792ZM10.1941 13.6714C8.6379 13.6714 7.37612 12.4306 7.37612 10.9003C7.37612 9.36994 8.6379 8.12913 10.1941 8.12913C11.7503 8.12913 13.0121 9.36994 13.0121 10.9003C13.0108 12.4302 11.7499 13.6702 10.1941 13.6714Z"/>
			<path d="M19.1666 10.9002C19.1637 9.80172 18.9509 8.71311 18.5387 7.69193L20.1942 6.75305L18.8483 4.45879L17.1983 5.39933C15.7901 3.66675 13.77 2.51982 11.54 2.18687V0.312012H8.84826V2.18687C6.6208 2.52024 4.6028 3.66592 3.1955 5.39602L1.54257 4.45879L0.196676 6.75305L1.8496 7.68738C1.01767 9.7496 1.01767 12.0463 1.8496 14.1082L0.194153 15.0474L1.54005 17.3417L3.19003 16.4057C4.59902 18.1366 6.61912 19.2819 8.84826 19.614V21.4889H11.54V19.614C13.7675 19.2807 15.7855 18.135 17.1928 16.4049L18.8436 17.3429L20.1895 15.0487L18.5387 14.1135C18.9509 13.0907 19.1641 12 19.1666 10.9002ZM10.1942 18.0142C6.19895 18.0142 2.95997 14.8291 2.95997 10.9002C2.95997 6.97143 6.19895 3.78628 10.1942 3.78628C14.1894 3.78628 17.4283 6.97143 17.4283 10.9002C17.4233 14.827 14.1873 18.0093 10.1942 18.0142Z"/>
		</svg>
	),
	Warning: (
		<svg fill="currentColor" viewBox="0 0 21 21" width="100%" height="100%"> 
			<circle cx="10.1442" cy="10.0994" r="10" fill="#FF30EC"/>
			<path d="M7.64089 8.80163V6.75182H11.4983V14.0193H13.1195V16.0691H7.62225V14.0193H9.07575V8.80163H7.64089ZM10.287 5.83873C9.90189 5.83873 9.5851 5.70207 9.33664 5.42877C9.1006 5.15546 8.98258 4.82625 8.98258 4.44113C8.98258 4.05602 9.11302 3.72681 9.37391 3.4535C9.63479 3.16777 9.95779 3.0249 10.3429 3.0249C10.7404 3.0249 11.0572 3.16156 11.2933 3.43486C11.5293 3.70817 11.6473 4.03738 11.6473 4.4225C11.6473 4.80761 11.5169 5.14304 11.256 5.42877C10.9951 5.70207 10.6721 5.83873 10.287 5.83873Z"/>
		</svg>
	),
	Edit: (
		<svg fill="currentColor" viewBox="0 0 16 18" width="100%" height="100%"> 
			<path d="M12.9336 0.847448L2.63169 0.847412C1.38098 0.847412 0.363464 1.86363 0.363464 3.11275V15.9498L3.86069 15.9498V14.4395L1.87573 14.4394V3.11275C1.87573 2.69685 2.21455 2.35775 2.63169 2.35775L12.9336 2.35779C13.3511 2.35779 13.6895 2.69688 13.6895 3.11278V6.21417C14.2293 6.32354 14.7428 6.56317 15.2018 6.9097V3.11278C15.2018 1.86366 14.1843 0.847448 12.9336 0.847448ZM14.5373 8.30713C14.9651 8.73436 15.2018 9.30388 15.2018 9.90879C15.2018 10.5137 14.9651 11.0829 14.5373 11.5112L8.58001 17.4598H5.3726V14.2558L11.3299 8.30713C12.2145 7.42365 13.6527 7.42365 14.5373 8.30713ZM13.6899 9.90879C13.6899 9.70704 13.6112 9.51767 13.4684 9.37502C13.1728 9.07982 12.6951 9.08053 12.3991 9.37502L6.88522 14.8812V15.9498H7.95448L13.4684 10.4429C13.6112 10.3003 13.6899 10.1102 13.6899 9.90879Z"/>
		</svg>
	),
} as {[key: string]: JSX.Element}


export default Icon