import { ChainId } from '@pancakeswap/chains'
import { Native } from '@pancakeswap/sdk'
import { USDC, USDT } from '@pancakeswap/tokens'

export const BRIDGE_API_URL = 'https://api-bridge.orb3.tech/api/transaction'

export const BRIDGE_FEE = 0.02

export const SUPPORT_TOKENS = [
  {
    [ChainId.ETHEREUM]: Native.onChain(ChainId.ETHEREUM),
    [ChainId.ORB3]: Native.onChain(ChainId.ORB3),
  },
  {
    [ChainId.ETHEREUM]: USDC[ChainId.ETHEREUM],
    [ChainId.ORB3]: USDC[ChainId.ORB3],
  },
  {
    [ChainId.ETHEREUM]: USDT[ChainId.ETHEREUM],
    [ChainId.ORB3]: USDT[ChainId.ORB3],
  },
]

export const SUPPORT_NETWORKS = [
  {
    chainId: ChainId.ETHEREUM,
    chainName: 'Ethereum',
    code: 9001n,
  },
  {
    chainId: ChainId.ORB3,
    chainName: 'Orb3',
    code: 9003n,
  },
]

export const BRIDGE_CONTRACT = {
  [ChainId.ETHEREUM]: {
    address: '0xD5AaC30d167B721Afc53EDb33e741CA350306679',
  },
  [ChainId.ORB3]: {
    address: '0xd3cDEA2FEdFfc025EE14ed7147910876CCabbe8C',
  },
}

export const MIN_DEPOSIT_AMOUNT = {
  NATIVE: 0.01,
  USDT: 100,
  USDC: 100,
  SPOT: 100000,
  FLACK: 100000,
}
