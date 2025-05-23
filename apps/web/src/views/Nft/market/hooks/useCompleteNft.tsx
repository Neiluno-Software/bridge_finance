import { Address, useAccount } from 'wagmi'
import { FetchStatus } from 'config/constants/types'
import { useCallback } from 'react'
import { useErc721CollectionContract } from 'hooks/useContract'
import { getNftApi, getNftsMarketData, getNftsOnChainMarketData } from 'state/nftMarket/helpers'
import { NftLocation, NftToken, TokenMarketData } from 'state/nftMarket/types'
import useSWR from 'swr'
import { NOT_ON_SALE_SELLER } from 'config/constants'
import { safeGetAddress } from 'utils'

const useNftOwn = (collectionAddress: Address | undefined, tokenId: string, marketData?: TokenMarketData) => {
  const { address: account } = useAccount()
  const collectionContract = useErc721CollectionContract(collectionAddress)

  const { data: tokenOwner } = useSWR(
    collectionContract ? ['nft', 'ownerOf', collectionAddress, tokenId] : null,
    async () => collectionContract.read.ownerOf([BigInt(tokenId)]),
  )

  return useSWR(
    account && tokenOwner
      ? ['nft', 'own', collectionAddress, tokenId, marketData?.currentSeller]
      : null,
    async () => {
      const nftIsOnSale = marketData ? marketData?.currentSeller !== NOT_ON_SALE_SELLER : false
      if (nftIsOnSale) {
        return {
          isOwn: safeGetAddress(marketData?.currentSeller) === safeGetAddress(account),
          location: NftLocation.FORSALE,
        }
      }
      return {
        isOwn: safeGetAddress(tokenOwner) === safeGetAddress(account),
        location: NftLocation.WALLET,
      }
    },
  )
}

export const useCompleteNft = (collectionAddress: Address | undefined, tokenId: string) => {
  const { data: nft, mutate } = useSWR(
    collectionAddress && tokenId ? ['nft', collectionAddress, tokenId] : null,
    async () => {
      const metadata = await getNftApi(collectionAddress, tokenId)
      if (metadata) {
        const basicNft: NftToken = {
          tokenId,
          collectionAddress,
          collectionName: metadata.collection.name,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          attributes: metadata.attributes,
        }
        return basicNft
      }
      return null
    },
  )

  const { data: marketData, mutate: refetchNftMarketData } = useSWR(
    collectionAddress && tokenId ? ['nft', 'marketData', collectionAddress, tokenId] : null,
    async () => {
      const [onChainMarketDatas, marketDatas] = await Promise.all([
        getNftsOnChainMarketData(collectionAddress, [tokenId]),
        getNftsMarketData({ collection: collectionAddress?.toLowerCase(), tokenId }, 1),
      ])
      const onChainMarketData = onChainMarketDatas[0]

      if (!marketDatas[0] && !onChainMarketData) return null

      if (!onChainMarketData) return marketDatas[0]

      return { ...marketDatas[0], ...onChainMarketData }
    },
  )

  const { data: nftOwn, mutate: refetchNftOwn, status } = useNftOwn(collectionAddress, tokenId, marketData)

  const refetch = useCallback(async () => {
    await mutate()
    await refetchNftMarketData()
    await refetchNftOwn()
  }, [mutate, refetchNftMarketData, refetchNftOwn])

  return {
    combinedNft: nft ? { ...nft, marketData, location: nftOwn?.location ?? NftLocation.WALLET } : undefined,
    isOwn: nftOwn?.isOwn || false,
    isLoading: status !== FetchStatus.Fetched,
    refetch,
  }
}
