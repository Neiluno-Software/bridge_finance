import { WETH9 } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { USDC, USDT, FLACK } from './common'

export const orb3Tokens = {
  weth: WETH9[ChainId.ORB3],
  usdc: USDC[ChainId.ORB3],
  usdt: USDT[ChainId.ORB3],
  flack: FLACK[ChainId.ORB3],
}
