// by: Leo Pawel 	<https://github.com/galaxy126>
// at 28/6/2022

declare interface RpcRequestType {
	jsonrpc: 			"2.0"
	method: 			string
	params: 			Array<any>
	id: 				string|number
}

declare interface RpcResponseType {
	jsonrpc: 			"2.0"
	id: 				string|number
	result?: 			any
	error?: 			number
}

declare interface WalletObject {
	mnemonic:			string,
	keys:				{[address: string]: string}		// lowercased address
}

declare interface TransactionResult {
	hash: 			string
    blockHash:		string
    blockNumber: 	string
    from:			string
    gas:			string
    gasPrice: 		string
    input:			string
    nonce:			string
    r:				string
    s:				string
    to:				string
    transactionIndex:string
    v:				string
    value:			string
}

declare interface NetworkObject {
	chainKey:			string
	testnet:			boolean		// is testnet
	label: 				string
	rpc: 				string
	chainId: 			number
	symbol: 			string
	url: 				string		// explorer url
	imported?:			boolean
}

declare interface TokenInfoObject {
	name:				string
	symbol:				string
	decimals:			string
	type:				'ERC20'|'ERC721'|'ERC1155'
	icon:				string
}

declare interface NftBalanceObject {
	tokenId: 			string
	value?: 			number
}

declare type SettingObjectKeyType = 'currency' | 'isFiat' | 'identicon' | 'hideToken' | 'hideToken'| 'gasControls'| 'showHexData'| 'showFiatOnTestnet'| 'showTestnet'| 'showTxNonce'| 'autoLockTimer'| 'backup3Box'| 'ipfsGateWay'| 'ShowIncomingTxs'| 'phishingDetection'| 'joinMetaMetrics'| 'unconnectedAccount'| 'tryOldWeb3Api'| 'useTokenDetection'| 'enhancedGasFeeUI'

declare interface SettingObject {
	//general
	currency:			string
	isFiat?:			boolean	// primaryCurrency
	identicon?:			'jazzicons'|'blokies'		// account identicon
	hideToken?:			boolean		// Hide Tokens Without Balance
	//advanced
	gasControls?:		boolean		// Advanced gas controls
	showHexData?:		boolean		// Show Hex Data
	showFiatOnTestnet?:	boolean		// Show Conversion on test networks
	showTestnet?:		boolean		// Show test networks
	showTxNonce?:		boolean		// Customize transaction nonce
	autoLockTimer?:		number		// Auto-Lock Timer (minutes)
	backup3Box?:		boolean		// Sync data with 3Box
	ipfsGateWay?:		string		// IPFS Gateway
	//contact-list
	ShowIncomingTxs?:	boolean		// Show Incoming Transactions
	phishingDetection?:	boolean		// Use Phishing Detection
	joinMetaMetrics?:	boolean 	// Participate in MetaMetrics
	//alerts
	unconnectedAccount?:boolean		// Browsing a website with an unconnected account selected
	tryOldWeb3Api?:		boolean		// When a website tries to use the removed window.web3 API
	useTokenDetection?:	boolean		// Use Token Detection
	enhancedGasFeeUI?:	boolean		// Enable Enhanced Gas Fee UI
}


declare interface AccountObject {
	address:			string		// address with checksum
	index?:				number		// if imported address, always be undefined
	label:				string
	imported:			boolean
	value:				{[chainKey:string]: string}		// balance (wei as hex string format)
	tokens:				{[chainKey:string]: {
		[token: string]: string // token: lower case token contract address
	}}
}
declare interface RequestTransactionParam {
	nonce?: 		string
	gasPrice?:	string
	gas?:		string
	to:			string
	from:		string
	value?:		string
	data?:		string
	chainId?:	string
}

declare interface Transaction {
	from:				string
	transactionId:		string
	to:					string
	status:				string
	nonce:				string
	amount:				string
	gasPrice:			string
	gasLimit:			string
	gasUsed:			string
	baseFee?:			string
	priorityFee?:		string
	totalGasFee?:		string
	totalFeePerGas?:	string
	total:				string
	hexData:			string
	rpc:				string
	chainId:			number
	tokenAddress:		string
	explorer:			string
	symbol:				string
	decimals:			number
	log:				string[]
	created:			string
	time:				number
	method?:			string | null
}

interface TokenInterface {
	address:	string
	name:		string
	symbol:		string
	decimals:	number
}


declare interface AddEthereumChainParameter{
	chainId: string; 
	chainName: string;
	nativeCurrency: {
	  name: string;
	  symbol: string; 
	  decimals: number | 18;
	};
	rpcUrls: string[]
	blockExplorerUrls?: string[]
	iconUrls?: string[]
}


declare interface WatchAssetParams {
	type: 'ERC20'; 
	options: {
	  address: string; 
	  symbol: string;
	  decimals: number; 
	  image: string; 
	};
}

declare interface SwitchEthereumChainParameter {
	chainId: string; // A 0x-prefixed hexadecimal string
}

declare interface ConnectedAppObject {
	[url:string]: string[]
}

declare interface ContactObject {
	label:				string
	address:			string
	memo:				string
}


declare type StoreObjectKeyType = 'inited'|'lang'|'theme'|'loading'|'password'|'vault'|'networks'|'tokens'|'accounts'|'apps'|'currentNetwork'|'currentAccount'|'sessionId'|'createdAccountLayer'|'lastAccessTime'

declare interface StoreObject {
	inited:				boolean
	lang:				string
	theme:				string
	loading:			boolean
	lastAccessTime:		number

	networks:			NetworkObject[]
	tokens:				{[chainKey: string]: {[token: string]: TokenInfoObject}} // token: lower case token contract address
	accounts:			AccountObject[]
	apps:				ConnectedAppObject // connected app
	contacts:			ContactObject[]
	transactions:		{[chainKey: string] : {[hash: string]: Transaction}}
	currentNetwork:		string		// current network
	currentAccount:		string		// current address
	createdAccountLayer: number
	vault:				string  //encrypted wallet address & key info 
	setting:			SettingObject
}