import { useTranslation } from '@pancakeswap/localization'
import { getLeastMostPriceInCollection } from 'state/nftMarket/helpers'
import useSWR from 'swr'
import { StatBoxItem, StatBoxItemProps } from '../components/StatBox'

interface LowestPriceStatBoxItemProps extends Omit<StatBoxItemProps, 'title' | 'stat'> {
  collectionAddress: string
}

const LowestPriceStatBoxItem: React.FC<React.PropsWithChildren<LowestPriceStatBoxItemProps>> = ({
  collectionAddress,
  ...props
}) => {
  const { t } = useTranslation()
  const { data: lowestCollectionPrice = null } = useSWR(
    collectionAddress ? [collectionAddress, 'lowestPrice'] : null,
    () => getLeastMostPriceInCollection(collectionAddress),
  )

  const formattedLowestPrice =
    lowestCollectionPrice !== null
      ? lowestCollectionPrice
        ? lowestCollectionPrice.toLocaleString(undefined, {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          })
        : '-'
      : null

  return <StatBoxItem title={t('Lowest (%symbol%)', { symbol: 'ETH' })} stat={formattedLowestPrice} {...props} />
}

export default LowestPriceStatBoxItem
