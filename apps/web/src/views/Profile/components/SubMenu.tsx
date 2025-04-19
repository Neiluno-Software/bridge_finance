import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import BaseSubMenu from '../../Nft/market/components/BaseSubMenu'
import { NextLinkFromReactRouter, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

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

const SubMenuComponent: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const accountAddress = router.query.accountAddress as string
  const { asPath } = router

  const ItemsConfig = [
    {
      label: t('Items'),
      href: `/nfts/profile/${accountAddress}`,
    },
    {
      label: t('Activity'),
      href: `/nfts/profile/${accountAddress}/activity`,
    },
  ]

  return (
    <BaseSubMenu justifyContent="flex-start" mb="18px">
      <NextLinkFromReactRouter to={`/nfts/profile/${accountAddress}`}>
        <SubMenuItem className={asPath.includes('activity') ? '' : 'active'}>Items</SubMenuItem>
      </NextLinkFromReactRouter>
      <NextLinkFromReactRouter to={`/nfts/profile/${accountAddress}/activity`}>
        <SubMenuItem className={asPath.includes('activity') ? 'active' : ''}>Activity</SubMenuItem>
      </NextLinkFromReactRouter>
    </BaseSubMenu>
  )
}

export default SubMenuComponent
