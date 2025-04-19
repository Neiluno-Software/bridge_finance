import { useMemo } from 'react'
import { multiChainId } from 'state/info/constant'
import { useChainNameByQuery } from 'state/info/hooks'
import useSWRImmutable from 'swr/immutable'
import { useAccount } from 'wagmi'
import { BRIDGE_API_URL, SUPPORT_TOKENS } from '../config'
import { useActiveChainId } from 'hooks/useActiveChainId'

const SWR_SETTINGS_WITHOUT_REFETCH = {
  errorRetryCount: 3,
  errorRetryInterval: 3000,
  refreshInterval: 3000,
}

export async function fetchTransactions(address, chainId) {
  const response = await fetch(`${BRIDGE_API_URL}?address=${address}&chainId=${chainId}`)
  if (!response.ok) {
    return { data: [] }
  }

  const result = await response.json()

  return { data: result }
}

export const useBridgeHistory = () => {
  const { address } = useAccount()
  const { chainId } = useActiveChainId()

  const { data } = useSWRImmutable(
    [`bridge/account/transactions`, address, chainId],
    () => fetchTransactions(address, chainId),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )

  return useMemo(() => ({ data: data?.data }), [data])
}

export const getToTokenDecimal = (address, fromChainId, toChainId) => {
  const tokens = SUPPORT_TOKENS.filter((item) => item[fromChainId].address?.toLowerCase() === address.toLowerCase())
  if (!tokens || !tokens.length) return 18
  return tokens[0][toChainId].decimals
}
