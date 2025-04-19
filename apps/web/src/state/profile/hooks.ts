import { getAchievements } from 'state/achievements/helpers'
import { useTranslation } from '@pancakeswap/localization'
import { FetchStatus } from 'config/constants/types'
import useSWRImmutable from 'swr/immutable'

export const useAchievementsForAddress = (address: string) => {
  const { t } = useTranslation()

  const { data, status, mutate } = useSWRImmutable(address ? [address, 'achievements'] : null, () =>
    getAchievements(address, t),
  )

  return {
    achievements: data || [],
    isFetching: status === FetchStatus.Fetching,
    refresh: mutate,
  }
}