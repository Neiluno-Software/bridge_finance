import { getCollectionDistributionApi } from 'state/nftMarket/helpers'
import { ApiCollectionDistribution, ApiSingleTokenData } from 'state/nftMarket/types'
import useSWRImmutable from 'swr/immutable'
import { FetchStatus } from 'config/constants/types'

const useGetCollectionDistribution = (collectionAddress: string | undefined) => {
  const { data, status } = useSWRImmutable(
    collectionAddress ? ['distribution', collectionAddress] : null,
    async () => (await getCollectionDistributionApi<ApiCollectionDistribution>(collectionAddress)).data,
  )

  return {
    data,
    isFetching: status !== FetchStatus.Fetched,
  }
}

export default useGetCollectionDistribution
