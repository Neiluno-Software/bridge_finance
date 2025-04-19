import { Button, ChevronRightIcon, Flex, Grid, Heading, Text, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Collection } from 'state/nftMarket/types'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { CollectionCard } from '../components/CollectibleCard'
import { ETHAmountLabel } from '../components/CollectibleCard/styles'

const Collections: React.FC<React.PropsWithChildren<{ title: string; testId: string; collections: Collection[] }>> = ({
  title,
  testId,
  collections,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" mb="32px">
        <Heading as="h3" scale="lg" data-test={testId}>
          {title}
        </Heading>
        <Button
          as={NextLinkFromReactRouter}
          to={`${nftsBaseUrl}/collections/`}
          variant="secondary"
          minWidth="132px"
          scale="sm"
          endIcon={<ChevronRightIcon color="primary" width="24px" />}
        >
          {t('View All')}
        </Button>
      </Flex>
      <Grid gridGap="16px" gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}>
        {collections.slice(0, 6).map((collection) => {
          return (
            <CollectionCard
              key={collection.address}
              bgSrc={collection.banner.small}
              avatarSrc={collection.avatar}
              collectionName={collection.name}
              url={`${nftsBaseUrl}/collections/${collection.address}`}
            >
              <Flex alignItems="center">
                <Text fontSize="12px" color="textSubtle">
                  {t('Volume')}
                </Text>
                <ETHAmountLabel amount={collection.totalVolumeETH ? parseFloat(collection.totalVolumeETH) : 0} />
              </Flex>
            </CollectionCard>
          )
        })}
      </Grid>
    </>
  )
}

export default Collections
