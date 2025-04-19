import { Activity, NftToken, TokenIdWithCollectionAddress } from 'state/nftMarket/types'
import { getNftsFromDifferentCollectionsApi } from 'state/nftMarket/helpers'
import uniqBy from 'lodash/uniqBy'
import { Address } from 'wagmi'

export const fetchActivityNftMetadata = async (activities: Activity[]): Promise<NftToken[]> => {
  const activityNftTokenIds = uniqBy(
    activities.map((activity): TokenIdWithCollectionAddress => {
      return { tokenId: activity.nft.tokenId, collectionAddress: activity.nft.collection.id as Address }
    }),
    (tokenWithCollectionAddress) =>
      `${tokenWithCollectionAddress.tokenId}#${tokenWithCollectionAddress.collectionAddress}`,
  )

  const nfts = await getNftsFromDifferentCollectionsApi(activityNftTokenIds)

  return nfts
}
