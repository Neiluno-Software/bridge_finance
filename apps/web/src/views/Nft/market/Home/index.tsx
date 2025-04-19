import { Button, Card, Flex, PageHeader, Text, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import PageLoader from 'components/Loader/PageLoader'
import Page from 'components/Layout/Page'
import BlockBox from 'components/BlockBox'
import { FetchStatus } from 'config/constants/types'
import useTheme from 'hooks/useTheme'
import orderBy from 'lodash/orderBy'
import { useGetCollections } from 'state/nftMarket/hooks'
import { useAccount } from 'wagmi'
import Collections from './Collections'
import Newest from './Newest'

const StyledPageHeader = styled(PageHeader)`
  padding-bottom: 24px;
`

const StyledHeaderInner = styled(Flex)`
  flex-direction: column;
  justify-content: space-between;
  align-items: end;
  padding-bottom: 24px;
  & div:nth-child(1) {
    order: 0;
  }
  & div:nth-child(2) {
    order: 1;
    margin-bottom: 32px;
    align-self: end;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    & div:nth-child(1) {
      order: 0;
    }
    & div:nth-child(2) {
      order: 1;
      margin-bottom: 0;
      align-self: auto;
    }
  }
`

const Home = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { theme } = useTheme()
  const { data: collections, status } = useGetCollections()

  /* const hotCollections = orderBy(
    collections,
    (collection) => (collection.totalVolumeETH ? parseFloat(collection.totalVolumeETH) : 0),
    'desc',
  ) */

  const newestCollections = orderBy(
    collections,
    (collection) => (collection.createdAt ? Date.parse(collection.createdAt) : 0),
    'desc',
  )

  return (
    <Page>
      {/* <StyledPageHeader> */}
        <StyledHeaderInner>
          <div>
            <Text fontSize={32} bold mb={12}>
              {t('NFT Marketplace')}
            </Text>
            <Text fontSize={18} mb={12} color='primary'>
              {t('Buy and Sell NFTs on Orb3 Chain')}
            </Text>
          </div>
          {account && (
            <Button as={NextLinkFromReactRouter} to={`/nfts/profile/${account.toLowerCase()}`}>
              {t('Manage/Sell')}
            </Button>
          )}
        </StyledHeaderInner>
      {/* </StyledPageHeader> */}
      {status !== FetchStatus.Fetched ? (
        <PageLoader />
      ) : (
        <Card p={24}>
          <BlockBox>
            <Collections
              key="newest-collections"
              title={t('NFT Collections')}
              testId="nfts-newest-collections"
              collections={newestCollections}
            />
          </BlockBox>
          <BlockBox mt={24}>
            <Newest />
          </BlockBox>
        </Card>
      )}
    </Page>
  )
}

export default Home
