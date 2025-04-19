import {
  BLOCKS_CLIENT,
  BLOCKS_CLIENT_ETH,
  BLOCKS_CLIENT_ZKSYNC,
  BLOCKS_CLIENT_LINEA,
  BLOCKS_CLIENT_BASE,
  BLOCKS_CLIENT_OPBNB,
  BLOCKS_CLIENT_ORB3,
} from 'config/constants/endpoints'
import { infoClientETH, infoClient, infoStableSwapClient, v2Clients } from 'utils/graphql'
import { GraphQLClient } from 'graphql-request'

import { ChainId } from '@pancakeswap/chains'
import {
  ETH_TOKEN_BLACKLIST,
  PCS_ETH_START,
  PCS_V2_START,
  TOKEN_BLACKLIST,
  BSC_TOKEN_WHITELIST,
  ETH_TOKEN_WHITELIST,
} from 'config/constants/info'
import { arbitrum, bsc, mainnet, polygonZkEvm, zkSync, linea, base, opBNB } from 'wagmi/chains'
import mapValues from 'lodash/mapValues'
import { ManipulateType } from 'dayjs'
import { orb3 } from 'config/chains'

export type MultiChainName =
  | 'BSC'
  | 'ETH'
  | 'POLYGON_ZKEVM'
  | 'ZKSYNC'
  | 'ARB'
  | 'LINEA'
  | 'BASE'
  | 'OPBNB'
  | 'ORB3'

export type MultiChainNameExtend = MultiChainName | 'BSC_TESTNET' | 'ZKSYNC_TESTNET'

export const multiChainName: Record<number | string, MultiChainNameExtend> = {
  [ChainId.BSC]: 'BSC',
  [ChainId.ETHEREUM]: 'ETH',
  [ChainId.BSC_TESTNET]: 'BSC_TESTNET',
  [ChainId.POLYGON_ZKEVM]: 'POLYGON_ZKEVM',
  [ChainId.ZKSYNC]: 'ZKSYNC',
  [ChainId.LINEA]: 'LINEA',
  [ChainId.BASE]: 'BASE',
  [ChainId.OPBNB]: 'OPBNB',
  [ChainId.ORB3]: 'ORB3',
}

export const multiChainShortName: Record<number, string> = {
  [ChainId.POLYGON_ZKEVM]: 'zkEVM',
}

export const multiChainQueryMainToken: Record<MultiChainName, string> = {
  BSC: 'BNB',
  ETH: 'ETH',
  POLYGON_ZKEVM: 'ETH',
  ZKSYNC: 'ETH',
  ARB: 'ARB',
  LINEA: 'ETH',
  BASE: 'ETH',
  OPBNB: 'BNB',
  ORB3: 'ETH',
}

export const multiChainBlocksClient: Record<MultiChainNameExtend, string> = {
  BSC: BLOCKS_CLIENT,
  ETH: BLOCKS_CLIENT_ETH,
  BSC_TESTNET: 'https://api.thegraph.com/subgraphs/name/lengocphuc99/bsc_testnet-blocks',
  POLYGON_ZKEVM: 'https://api.studio.thegraph.com/query/45376/polygon-zkevm-block/version/latest',
  ZKSYNC_TESTNET: 'https://api.studio.thegraph.com/query/45376/blocks-zksync-testnet/version/latest',
  ZKSYNC: BLOCKS_CLIENT_ZKSYNC,
  ARB: 'https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-one-blocks',
  LINEA: BLOCKS_CLIENT_LINEA,
  BASE: BLOCKS_CLIENT_BASE,
  OPBNB: BLOCKS_CLIENT_OPBNB,
  ORB3: BLOCKS_CLIENT_ORB3,
}

export const multiChainStartTime = {
  BSC: PCS_V2_START,
  ETH: PCS_ETH_START,
  POLYGON_ZKEVM: 1686236845,
  ZKSYNC: 1690462800, // Thu Jul 27 2023 13:00:00 UTC+0000
  ARB: 1686732526,
  LINEA: 1692878400,
  BASE: 1693483200,
  OPBNB: 1695945600,
  ORB3: 1739317,
}

export const multiChainId: Record<MultiChainName, ChainId> = {
  BSC: ChainId.BSC,
  ETH: ChainId.ETHEREUM,
  POLYGON_ZKEVM: ChainId.POLYGON_ZKEVM,
  ZKSYNC: ChainId.ZKSYNC,
  ARB: ChainId.ARBITRUM_ONE,
  LINEA: ChainId.LINEA,
  BASE: ChainId.BASE,
  OPBNB: ChainId.OPBNB,
  ORB3: ChainId.ORB3,
}

export const multiChainPaths = {
  [ChainId.BSC]: '',
  [ChainId.ETHEREUM]: '/eth',
  [ChainId.POLYGON_ZKEVM]: '/polygon-zkevm',
  [ChainId.ZKSYNC]: '/zksync',
  [ChainId.ARBITRUM_ONE]: '/arb',
  [ChainId.LINEA]: '/linea',
  [ChainId.BASE]: '/base',
  [ChainId.OPBNB]: '/opbnb',
  [ChainId.ORB3]: '/blockspot',
}

export const multiChainQueryClient = {
  BSC: infoClient,
  ETH: infoClientETH,
  POLYGON_ZKEVM: v2Clients[ChainId.POLYGON_ZKEVM],
  ZKSYNC: v2Clients[ChainId.ZKSYNC],
  ARB: v2Clients[ChainId.ARBITRUM_ONE],
  LINEA: v2Clients[ChainId.LINEA],
  BASE: v2Clients[ChainId.BASE],
  OPBNB: v2Clients[ChainId.OPBNB],
  ORB3: v2Clients[ChainId.ORB3],
}

export const multiChainScan: Record<MultiChainName, string> = {
  BSC: bsc.blockExplorers.etherscan.name,
  ETH: mainnet.blockExplorers.etherscan.name,
  POLYGON_ZKEVM: polygonZkEvm.blockExplorers.default.name,
  ZKSYNC: zkSync.blockExplorers.default.name,
  ARB: arbitrum.blockExplorers.default.name,
  LINEA: linea.blockExplorers.default.name,
  BASE: base.blockExplorers.default.name,
  OPBNB: opBNB.blockExplorers.default.name,
  ORB3: orb3.blockExplorers.default.name,
}

export const multiChainTokenBlackList: Record<MultiChainName, string[]> = mapValues(
  {
    BSC: TOKEN_BLACKLIST,
    ETH: ETH_TOKEN_BLACKLIST,
    POLYGON_ZKEVM: ['0x'],
    ZKSYNC: ['0x'],
    ARB: ['0x'],
    LINEA: ['0x'],
    BASE: ['0x'],
    OPBNB: ['0x'],
    ORB3: [],
  },
  (val) => val.map((address) => address.toLowerCase()),
)

export const multiChainTokenWhiteList: Record<MultiChainName, string[]> = mapValues(
  {
    BSC: BSC_TOKEN_WHITELIST,
    ETH: ETH_TOKEN_WHITELIST,
    POLYGON_ZKEVM: [],
    ZKSYNC: [],
    ARB: [],
    LINEA: [],
    BASE: [],
    OPBNB: [],
    ORB3: [],
  },
  (val) => val.map((address) => address.toLowerCase()),
)

export const getMultiChainQueryEndPointWithStableSwap = (chainName: MultiChainNameExtend): GraphQLClient => {
  const isStableSwap = checkIsStableSwap()
  if (isStableSwap) return infoStableSwapClient
  return multiChainQueryClient[chainName]
}

// FIXME: this should be per chain
export const subgraphTokenName = {
  '0x738d96Caf7096659DB4C1aFbf1E1BDFD281f388C': 'Ankr Staked MATIC',
  '0x14016E85a25aeb13065688cAFB43044C2ef86784': 'True USD Old',
}

// FIXME: this should be per chain
export const subgraphTokenSymbol = {
  '0x14016E85a25aeb13065688cAFB43044C2ef86784': 'TUSDOLD',
}

export const checkIsStableSwap = () => window.location.href.includes('stableSwap')

export const ChainLinkSupportChains = [ChainId.BSC, ChainId.BSC_TESTNET, ChainId.ORB3]

export const v3InfoPath = `info/v3`

export const POOL_HIDE: { [key: string]: string[] } = {
  // TODO: update to our own
  [ChainId.ETHEREUM]: [
    '0x86d257cDB7bC9c0dF10E84C8709697F92770b335',
    '0xf8DBD52488978a79DfE6ffBd81A01Fc5948bF9eE',
    '0x8Fe8D9bb8Eeba3Ed688069c3D6b556C9ca258248',
    '0xA850478aDAACe4c08fc61DE44d8CF3b64f359bEc',
    '0x277667eB3e34f134adf870be9550E9f323d0dc24',
    '0x8c0411F2ad5470A66cb2E9C64536CFb8dcD54d51',
    '0x055284A4CA6532ECc219Ac06b577D540C686669d',
    '0xB078BF211E330b5F95B7114AE845188CC36B795D',
    '0x7778797342652bd27B365962Ffc7f6eCE356EB57',
    '0xe9825d867e3BeF05223bDA609fA8aB89AeF93797',
  ],
  [ChainId.BSC]: [
    '0x87196a3BCeC98116307bdc8B887c3074E8b5bc96',
    '0x4b2C510Fe0b6a50D117220cd6D66a9C714C83dFb',
    '0xf0b579380cA08e75441DC73c2Da9f27CE23725F2',
    '0x9829f916C617e1b269b410dfD84c7F22ad479417',
    '0x9829f916C617e1b269b410dfD84c7F22ad479417',
    '0xA0E4442DC4aDDba0A57be757fbb802b48BA8051C',
    '0xBAdBEdaFe2cA7318a25B665bfA307e91A3EEb88d',
    '0xa7619D726F619062d2d2BCAdbb2ee1FB1952d6d7',
    '0x5FB5EB2c8Ecbf712115007990C70B79F6B256f9b',
  ],
}

export const TOKEN_HIDE: { [key: string]: string[] } = {
  [ChainId.ETHEREUM]: [
    '0xD46bA6D942050d489DBd938a2C909A5d5039A161',
    '0x7dFB72A2AAd08C937706f21421B15bFC34Cba9ca',
    '0x12B32f10A499Bf40Db334Efe04226Cca00Bf2D9B',
    '0x160dE4468586B6B2F8a92FEB0c260Fc6cFC743B1',
    '0xD84787a01B0cad89fBCa231E6960cC0f3f18df34',
    '0xdb19f2052D2B1aD46Ed98C66336A5dAADEB13005',
  ],
  [ChainId.BSC]: ['0xdb19f2052D2B1aD46Ed98C66336A5dAADEB13005', '0x57a63C32CC2aD6CE4FBE5423d548D12d0EEDdfc1'],
}

export const TimeWindow: {
  [key: string]: ManipulateType
} = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
}

export const ONE_HOUR_SECONDS = 3600
export const ONE_DAY_SECONDS = 86400
export const MAX_UINT128 = 2n ** 128n - 1n

export const SUBGRAPH_START_BLOCK = {
  [ChainId.BSC]: 26956207,
  [ChainId.ETHEREUM]: 18543541,
  [ChainId.POLYGON_ZKEVM]: 750149,
  [ChainId.ZKSYNC]: 8639214,
  [ChainId.ARBITRUM_ONE]: 101028949,
  [ChainId.LINEA]: 1444,
  [ChainId.BASE]: 2912007,
  [ChainId.OPBNB]: 1721753,

  [ChainId.ORB3]: 300,
}

export const NODE_REAL_ADDRESS_LIMIT = 50

export const DURATION_INTERVAL = {
  day: ONE_HOUR_SECONDS,
  week: ONE_DAY_SECONDS,
  month: ONE_DAY_SECONDS,
  year: ONE_DAY_SECONDS,
}
