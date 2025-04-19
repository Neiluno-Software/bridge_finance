import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

import { Address, erc20ABI, useAccount, useBalance, useContractRead } from 'wagmi'

export const useTokenBalance = (tokenAddress: Address, chainId: number) => {
  const { address: account } = useAccount()

  const { data, status, ...rest } = useContractRead({
    chainId,
    abi: erc20ABI,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [account],
    enabled: !!account,
    watch: true,
  })

  return {
    ...rest,
    fetchStatus: status,
    balance: useMemo(() => (typeof data !== 'undefined' ? data : 0n), [data]),
  }
}

export const useGetEthBalance = (address, chainId) => {
  const { status, refetch, data } = useBalance({
    chainId,
    address,
    watch: true,
    enabled: !!address,
  })

  return { balance: data?.value ? BigInt(data.value) : 0n, fetchStatus: status, refresh: refetch }
}