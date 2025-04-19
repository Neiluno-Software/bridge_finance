import { useTranslation } from '@pancakeswap/localization'
import { NextLinkFromReactRouter, Text } from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import Container from 'components/Layout/Container'
import { useRouter } from 'next/router'
import { Collection } from 'state/nftMarket/types'
import styled from 'styled-components'
import BannerHeader from '../components/BannerHeader'
import AvatarImage from '../components/BannerHeader/AvatarImage'
import BaseSubMenu from '../components/BaseSubMenu'
import MarketPageHeader from '../components/MarketPageHeader'
import MarketPageTitle from '../components/MarketPageTitle'
import StatBox, { StatBoxItem } from '../components/StatBox'
import { nftsBaseUrl } from '../constants'
import LowestPriceStatBoxItem from './LowestPriceStatBoxItem'
import TopBar from './TopBar'

const SubMenuItem = styled(Text)`
  cursor: pointer;
  color: ${({theme}) => theme.colors.primary};
  padding: 12px 24px;
  border-bottom: 2px solid;
  border-color: transparent;

  &.active {
    border-color: ${({theme}) => theme.colors.primary};
  }
`

interface HeaderProps {
  collection: Collection
}

const Header: React.FC<React.PropsWithChildren<HeaderProps>> = ({ collection }) => {
  const router = useRouter()
  const collectionAddress = router.query.collectionAddress as string
  const { totalSupply, numberTokensListed, totalVolumeETH, banner, avatar } = collection
  const { t } = useTranslation()

  const volume = totalVolumeETH
    ? parseFloat(totalVolumeETH).toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })
    : '0'

  const itemsConfig = [
    {
      label: t('Items'),
      href: `${nftsBaseUrl}/collections/${collectionAddress}`,
    },
    {
      label: t('Traits'),
      href: `${nftsBaseUrl}/collections/${collectionAddress}#traits`,
    },
    {
      label: t('Activity'),
      href: `${nftsBaseUrl}/collections/${collectionAddress}#activity`,
    },
  ]

  return (
    <>
      <MarketPageHeader>
        <TopBar collection={collection} />
        <BannerHeader bannerImage={banner.large} avatar={<AvatarImage src={avatar} />} />
        <MarketPageTitle
          address={collection.address}
          title={collection.name}
          description={collection.description ? <Text color="textSubtle">{t(collection.description)}</Text> : null}
        >
          <StatBox>
            <StatBoxItem title={t('Items')} stat={formatNumber(Number(totalSupply), 0, 0)} />
            <StatBoxItem
              title={t('Items listed')}
              stat={numberTokensListed ? formatNumber(Number(numberTokensListed), 0, 0) : '0'}
            />
            <LowestPriceStatBoxItem collectionAddress={collection.address} />
            <StatBoxItem title={t('Vol. (%symbol%)', { symbol: 'ETH' })} stat={volume} />
          </StatBox>
        </MarketPageTitle>
      </MarketPageHeader>
      <Container>
        <BaseSubMenu justifyContent="flex-start" mt="18px" mb="8px">
          <NextLinkFromReactRouter to={`${nftsBaseUrl}/collections/${collectionAddress}`}>
            <SubMenuItem className={(!router.asPath.includes('traits') && !router.asPath.includes('activity')) ? 'active' : ''}>Items</SubMenuItem>
          </NextLinkFromReactRouter>
          <NextLinkFromReactRouter to={`${nftsBaseUrl}/collections/${collectionAddress}#traits`}>
            <SubMenuItem className={router.asPath.includes('traits') ? 'active' : ''}>Traits</SubMenuItem>
          </NextLinkFromReactRouter>
          <NextLinkFromReactRouter to={`${nftsBaseUrl}/collections/${collectionAddress}#activity`}>
            <SubMenuItem className={router.asPath.includes('activity') ? 'active' : ''}>Activity</SubMenuItem>
          </NextLinkFromReactRouter>
        </BaseSubMenu>
      </Container>
    </>
  )
}

export default Header
