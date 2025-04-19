import { FetchStatus } from 'config/constants/types'
import { getNftsMarketData, getNftsUpdatedMarketData } from 'state/nftMarket/helpers'
import { formatBigInt } from '@pancakeswap/utils/formatBalance'
import { NftToken } from 'state/nftMarket/types'
import { Address } from 'wagmi'
import useSWR from 'swr'
import { safeGetAddress } from 'utils'

export interface LowestNftPrice {
  isFetching: boolean
  lowestPrice: number
}

export const getLowestUpdatedToken = async (collectionAddress: Address, nftsMarketTokenIds: string[]) => {
  const updatedMarketData = await getNftsUpdatedMarketData(collectionAddress, nftsMarketTokenIds)

  if (!updatedMarketData) return null

  return updatedMarketData
    .filter((tokenUpdatedPrice) => {
      return tokenUpdatedPrice && tokenUpdatedPrice.currentAskPrice > 0 && tokenUpdatedPrice.isTradable
    })
    .sort((askInfoA, askInfoB) => {
      return askInfoA.currentAskPrice > askInfoB.currentAskPrice
        ? 1
        : askInfoA.currentAskPrice > askInfoB.currentAskPrice
        ? 0
        : -1
    })[0]
}

export const useGetLowestPriceFromBunnyId = (collectionAddress: Address, tokenId: string): LowestNftPrice => {
  const { data, status } = useSWR([collectionAddress, tokenId], async () => {
    const lowestPrice = await getLowestUpdatedToken(collectionAddress, [tokenId])

    if (lowestPrice) {
      return parseFloat(formatBigInt(lowestPrice.currentAskPrice))
    }

    return 0
  })

  return { isFetching: status !== FetchStatus.Fetched, lowestPrice: data || 0 }
}

export const useGetLowestPriceFromNft = (nft: NftToken): LowestNftPrice => {
  return useGetLowestPriceFromBunnyId(nft.collectionAddress, nft.tokenId)
}
