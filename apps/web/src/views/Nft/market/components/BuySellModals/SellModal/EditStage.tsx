import { useTranslation } from '@pancakeswap/localization'
import { Button, EthChainIcon, Flex, Grid, LinkExternal, ScanLink, Text } from '@pancakeswap/uikit'
import DELIST_COLLECTIONS from 'config/constants/nftsCollections/delist'
import { NftToken } from 'state/nftMarket/types'
import { getBscScanLinkForNft } from 'utils'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { Divider, HorizontalDivider, RoundedImage } from '../shared/styles'

interface EditStageProps {
  nftToSell: NftToken
  lowestPrice: number
  continueToAdjustPriceStage: () => void
  continueToRemoveFromMarketStage: () => void
}

// Initial stage when user wants to edit already listed NFT (i.e. adjust price or remove from sale)
const EditStage: React.FC<React.PropsWithChildren<EditStageProps>> = ({
  nftToSell,
  lowestPrice,
  continueToAdjustPriceStage,
  continueToRemoveFromMarketStage,
}) => {
  const isDelist = Boolean(DELIST_COLLECTIONS[nftToSell?.collectionAddress])

  const { t } = useTranslation()
  const itemPageUrlId = nftToSell.tokenId

  return (
    <>
      <Flex p="16px">
        <RoundedImage src={nftToSell.image.thumbnail} height={68} width={68} mr="8px" />
        <Grid flex="1" gridTemplateColumns="1fr 1fr" alignItems="center">
          <Text bold>{nftToSell.name}</Text>
          <Text fontSize="12px" color="textSubtle" textAlign="right">
            {nftToSell?.collectionName}
          </Text>
          {lowestPrice && (
            <>
              <Text small color="textSubtle">
                {t('Lowest price')}
              </Text>

              <Flex alignItems="center" justifyContent="flex-end">
                <EthChainIcon width={16} height={16} mr="4px" />
                <Text small>{lowestPrice}</Text>
              </Flex>
            </>
          )}
          <Text small color="textSubtle">
            {t('Your price')}
          </Text>
          <Flex alignItems="center" justifyContent="flex-end">
            <EthChainIcon width={16} height={16} mr="4px" />
            <Text small>{nftToSell?.marketData?.currentAskPrice}</Text>
          </Flex>
        </Grid>
      </Flex>
      <Flex justifyContent="space-between" px="16px" mt="8px">
        <Flex flex="2">
          <Text small color="textSubtle">
            {t('Token ID: %id%', { id: nftToSell.tokenId })}
          </Text>
        </Flex>
        <Flex justifyContent="space-between" flex="3">
          <LinkExternal
            p="0px"
            height="16px"
            href={`${nftsBaseUrl}/collections/${nftToSell.collectionAddress}/${itemPageUrlId}`}
          >
            {t('View Item')}
          </LinkExternal>
          <HorizontalDivider />
          <ScanLink p="0px" height="16px" href={getBscScanLinkForNft(nftToSell.collectionAddress, nftToSell.tokenId)}>
            BscScan
          </ScanLink>
        </Flex>
      </Flex>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button disabled={isDelist} mb="8px" onClick={continueToAdjustPriceStage}>
          {t('Adjust Sale Price')}
        </Button>
        <Button variant="danger" onClick={continueToRemoveFromMarketStage}>
          {t('Remove from Market')}
        </Button>
      </Flex>
    </>
  )
}

export default EditStage
