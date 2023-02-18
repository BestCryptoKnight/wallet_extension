// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

export const WalletName = 'metamask';
export const TARGET = WalletName;
export const SENDER = {extension: 'extension', webpage: 'webpage', background:'background' };
export const communicationKey = WalletName +"-background-popup-via"

export const EVENT_NAME = {
	accountsChanged: 'accountsChanged',
	chainChanged: 'chainChanged',
	unlockChange: 'unlockChange',
	message: 'message',
	connect: 'connect',
	disconnect: 'disconnect'
};

export const EVENT = {
	accountsChanged: ['accountsChanged'],
	chainChanged: ['chainChanged', 'chainIdChanged', 'networkChanged'],
	unlockChange: ['unlockChanged'],
	message: ['message', 'notification '],
	connect: ['connect'],
	disconnect: ['disconnect', 'close']
};

export const METHOD_TYPE = {
	ADD_ETHEREUM_CHAIN: 'wallet_addEthereumChain',
	ETH_ACCOUNTS: 'eth_accounts',
	ETH_REQUEST_ACCOUNTS: 'eth_requestAccounts',
	ETH_SIGN: 'eth_sign',
	WATCH_ASSET: 'wallet_watchAsset',
	SWITCH_ETHEREUM_CHAIN: 'wallet_switchEthereumChain',
	WALLET_SCAN_QRCODE: 'wallet_scanQRCode',
	WALLET_REQUEST_PERMISSION: 'wallet_requestPermissions',
	WALLET_GET_PERMISSION: 'wallet_getPermissions',
	WALLET_REGISTER_ONBOARDING: 'wallet_registerOnboarding',
	ETH_SEND_TRANSACTION: 'eth_sendTransaction',
	ETH_CHAIN_ID: 'eth_chainId',
	ETH_SIGN_DATA_V4: "eth_signTypedData_v4",
	ETH_SIGN_DATA_V3: "eth_signTypedData_v3",
	ETH_SIGN_DATA: "eth_signTypedData",
	PERSONAL_SIGN: "personal_sign",
	RECOVER_PERSONAL: "personal_ecRecover",
	GET_ENCRYPT_KEY:"eth_getEncryptionPublicKey"
};


export const rpcMethods = Object.freeze([
	'eth_blockNumber',
	'eth_call',
	'eth_coinbase',
	'eth_decrypt',
	'eth_estimateGas',
	'eth_feeHistory',
	'eth_gasPrice',
	'eth_getBalance',
	'eth_getBlockByHash',
	'eth_getBlockByNumber',
	'eth_getBlockTransactionCountByHash',
	'eth_getBlockTransactionCountByNumber',
	'eth_getCode',
	'eth_getEncryptionPublicKey',
	'eth_getFilterChanges',
	'eth_getFilterLogs',
	'eth_getLogs',
	'eth_getProof',
	'eth_getStorageAt',
	'eth_getTransactionByBlockHashAndIndex',
	'eth_getTransactionByBlockNumberAndIndex',
	'eth_getTransactionByHash',
	'eth_getTransactionCount',
	'eth_getTransactionReceipt',
	'eth_getUncleByBlockHashAndIndex',
	'eth_getUncleByBlockNumberAndIndex',
	'eth_getUncleCountByBlockHash',
	'eth_getUncleCountByBlockNumber',
	'eth_getWork',
	'eth_hashrate',
	'eth_mining',
	'eth_newBlockFilter',
	'eth_newFilter',
	'eth_newPendingTransactionFilter',
	'eth_protocolVersion',
	'eth_sendRawTransaction',
	'eth_submitHashrate',
	'eth_submitWork',
	'eth_syncing',
	'eth_uninstallFilter',
	'net_listening',
	'net_peerCount',
	'net_version',
	'web3_clientVersion',
	'web3_sha3',
]);
  
export const REQUEST_KEY = {
	ADD_ETHEREUM_CHAIN: 'wallet_addEthereumChain_neon',
	ETH_ACCOUNTS: 'eth_accounts_neon', //
	ETH_REQUEST_ACCOUNTS: 'eth_requestAccounts_neon',
	ETH_SIGN: 'eth_sign_neon', //
	WATCH_ASSET: 'wallet_watchAsset_neon',
	SWITCH_ETHEREUM_CHAIN: 'wallet_switchEthereumChain_neon',
	WALLET_SCAN_QRCODE: 'wallet_scanQRCode_neon', //
	WALLET_REQUEST_PERMISSION: 'wallet_requestPermissions_neon', //
	WALLET_GET_PERMISSION: 'wallet_getPermissions_neon', //
	WALLET_REGISTER_ONBOARDING: 'wallet_registerOnboarding_neon',
	ETH_SEND_TRANSACTION: 'eth_sendTransaction_neon',
	ETH_CHAIN_ID: 'eth_chainId_neon',
	ETH_SIGN_DATA_V4: "eth_signTypedData_v4_neon",
	ETH_SIGN_DATA_V3: "eth_signTypedData_v3_neon",
	ETH_SIGN_DATA: "eth_signTypedData_neon",
	PERSONAL_SIGN: "personal_sign_neon",
	RECOVER_PERSONAL: "personal_ecRecover_neon",
	GET_ENCRYPT_KEY:"eth_getEncryptionPublicKey_neon"
}

export const MESSAGE_TYPE = {
	getPassHash : "getPasswordHash",
	setPassHash : "setPasswordHash",
	getMethodName: "getMethodName"
}

export const POPUP_WINDOW = {
	top: 0,
	right: 0,
	width: 357,
	height: 600	
};

export const DEFAULT_NETWORKS = [
	
	{
		chainKey:			"neon",
		testnet:			false,
		label: 				"Neon Mainnet",
		rpc: 				"https://mainnet.neonlink.io",
		chainId: 			259,
		symbol: 			"NEON",
		url: 				"https://scan.neonlink.io/",
		imported:			false
	},
	{
		chainKey:			"neontestnet",
		testnet:			true,
		label: 				"Neon Testnet",
		rpc: 				"https://testnet.neonlink.io/",
		chainId: 			9559,
		symbol: 			"NEON",
		url: 				"https://testnet-scan.neonlink.io/",
		imported:			false
	},{
		chainKey:			"ethereum",
		testnet:			false,
		label: 				"Ethereum Mainnet",
		rpc: 				"https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7",
		chainId: 			1,
		symbol: 			"ETH",
		url: 				"https://etherscan.io/",
		imported:			true,
	},
	{	
		chainKey:			"binancemainnet",
		testnet:			false,
		label: 				"Binance Smart Chain Mainnet",
		rpc: 				"https://bsc.mytokenpocket.vip",
		chainId: 			56,
		symbol: 			"BNB",
		url: 				"https://bscscan.com/",
		imported:			true,
	},
	{
		chainKey:			"goerli",
		testnet:			true,
		label: 				"Goerli Testnet",
		rpc: 				"https://goerli.infura.io/v3/7ae81e2a2ece4ee4a36e00d333f13461",
		chainId: 			5,
		symbol: 			"gETH",
		url: 				"https://goerli.etherscan.io/",
		imported:			true,
	},
	{
		chainKey:			"sepolia",
		testnet:			true,
		label: 				"Sepolia Testnet",
		rpc: 				"https://rpc.sepolia.org",
		chainId: 			11155111,
		symbol: 			"sETH",
		url: 				"https://sepolia.etherscan.io/",
		imported:			true,
	}
] as NetworkObject[]

