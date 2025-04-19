import { gql } from 'graphql-request'
import { getMultiChainQueryEndPointWithStableSwap } from 'state/info/constant'
import { useChainNameByQuery } from 'state/info/hooks'
import useSWRImmutable from 'swr/immutable'

export interface EthPrice {
  current: number
}

export const ETH_PRICE = () => {
  const queryString = `
  query prices {
    current: bundles(first: 1) {
      ethPrice
    }
  }
`
  return gql`
    ${queryString}
  `
}

interface PricesResponse {
  current: {
    ethPrice: string
  }[]
}

export const fetchEthPrice = async (chainName): Promise<{ data: EthPrice | undefined; error: boolean }> => {
  try {
    const data = await getMultiChainQueryEndPointWithStableSwap(chainName).request<PricesResponse>(ETH_PRICE())
    if (data) {
      return {
        data: {
          current: parseFloat(data.current[0].ethPrice ?? '0'),
        },
        error: false,
      }
    }
    return {
      data: undefined,
      error: true,
    }
  } catch (e) {
    return {
      data: undefined,
      error: true,
    }
  }
}

export const useEthPrice = (): EthPrice | undefined => {
  const chainName = useChainNameByQuery()
  const { data } = useSWRImmutable(chainName && [`info/token/ethPrice`, chainName], () => fetchEthPrice(chainName))

  return data?.data ?? undefined
}
