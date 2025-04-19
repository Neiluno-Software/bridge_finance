import { usePreviousValue } from '@pancakeswap/hooks'
import { FetchStatus } from 'config/constants/types'
import isEmpty from 'lodash/isEmpty'
import { useRef } from 'react'
import { getCompleteAccountNftData } from 'state/nftMarket/helpers'
import { useGetCollections } from 'state/nftMarket/hooks'
import { ApiCollections } from 'state/nftMarket/types'
import useSWR from 'swr'
import { safeGetAddress } from 'utils'
import { isAddress } from 'viem'

export const useNftsForAddress = (account: string) => {
  const { data: collections } = useGetCollections()

  const { nfts, isLoading, refresh } = useCollectionsNftsForAddress(account, collections)
  return { nfts, isLoading, refresh }
}

export const useCollectionsNftsForAddress = (
  account: string,
  collections: ApiCollections,
) => {
  const resetLaggyRef = useRef(null)
  const previousAccount = usePreviousValue(account)

  if (resetLaggyRef.current && previousAccount !== account) {
    resetLaggyRef.current()
  }

  // @ts-ignore
  const { status, data, mutate, resetLaggy } = useSWR(
    !isEmpty(collections) && isAddress(account) ? [account, 'userNfts'] : null,
    async () => getCompleteAccountNftData(safeGetAddress(account), collections),
    {
      keepPreviousData: true,
    },
  )

  resetLaggyRef.current = resetLaggy

  return { nfts: data ?? [], isLoading: status !== FetchStatus.Fetched, refresh: mutate }
}
