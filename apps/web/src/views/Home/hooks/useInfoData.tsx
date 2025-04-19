import { ChainId } from '@pancakeswap/chains'
import { GRAPH_API_NFTMARKET } from 'config/constants/endpoints'
import request from 'graphql-request'
import useSWRImmutable from 'swr/immutable'
import { BRIDGE_CONTRACT } from 'views/Bridge/config'

import { useBalance } from 'wagmi'

const API_STATS_URL = "https://orb3scan.tech/api/v2/stats"
const API_COUNTER = "https://orb3scan.tech/api/v1/counters"

const NFT_COLLECTIONS = (skip: number) => {
  const queryString = `
    query dayDatas {
      collections(first: 100, skip: ${skip}) {
        id
        totalVolumeETH
      }
    }
  `
  return queryString
}

const fetchMarketVolume = async () => {
  let totalVolume = 0.0
  let skip = 0
  while (1) {
    const result = await request(GRAPH_API_NFTMARKET, NFT_COLLECTIONS(skip))
    if (result && result.collections.length > 0) {
      totalVolume += result.collections.reduce((sum: number, data: any) => sum + parseFloat(data.totalVolumeETH), 0)
      skip += 100
    } else {
      break
    }
  }
  return totalVolume
}

const fetchChainInfo = async () => {
  const res1 = await fetch(API_STATS_URL)
  const stats = await res1.json()

  /* const res2 = await fetch(API_COUNTER)
  const counter = await res2.json() */

  return {
    ...stats,
    // ...counter,
  }
}

export const useInfoData = () => {
  const { data } =  useSWRImmutable("ORB3-STATS", () => {
    return fetchChainInfo()
  })

  return {
    data
  }
}

export const useBridgeTvl = () => {
  const { balance: ethData } = useGetEthBalance(BRIDGE_CONTRACT[ChainId.ETHEREUM].address, ChainId.ETHEREUM)
  const { balance: orb3Data } = useGetEthBalance(BRIDGE_CONTRACT[ChainId.ORB3].address, ChainId.ORB3)

  return {
    tvl: ethData + orb3Data
  }
}

export const useMarketTvl = () => {
  const { data: marketVolume } =  useSWRImmutable("NFTMARKET-VOLUME", () => {
    return fetchMarketVolume()
  })

  return {
    tvl: marketVolume ?? 0
  }
}

const useGetEthBalance = (address, chainId) => {
  const { status, refetch, data } = useBalance({
    chainId,
    address,
    watch: true,
    enabled: true,
  })

  return { balance: data?.value ? BigInt(data.value) : 0n, fetchStatus: status, refresh: refetch }
}