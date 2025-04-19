import { ChainId } from '@pancakeswap/chains'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
import contracts from 'config/constants/contracts'
import { useEffect, useState } from 'react'
import { publicClient } from 'utils/wagmi'
import { formatUnits } from 'viem'

export const getEthPrice = async () => {
  const data = await publicClient({ chainId: ChainId.ETHEREUM }).readContract({
    abi: chainlinkOracleABI,
    address: contracts.chainlinkOracleETH[ChainId.ETHEREUM],
    functionName: 'latestAnswer',
  })
  return formatUnits(data, 8)
}

export const useETHPrice = () => {
  const [ethPrice, setEthPrice] = useState<string | undefined>(undefined)

  useEffect(() => {
    const getETHPriceFromOracle = async () => {
      const _ethPrice = await getEthPrice()
      setEthPrice(_ethPrice)
    }
    getETHPriceFromOracle()
  }, [])

  return new BigNumber(ethPrice || '0') ?? BIG_ZERO
}
