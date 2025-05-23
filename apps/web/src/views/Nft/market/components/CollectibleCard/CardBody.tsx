import { useTranslation } from '@pancakeswap/localization'
import { Box, CardBody, Flex, Text } from '@pancakeswap/uikit'
import { useETHPrice } from 'hooks/useETHPrice'
import NFTMedia from '../NFTMedia'
import LocationTag from './LocationTag'
import PreviewImage from './PreviewImage'
import { CostLabel, MetaRow } from './styles'
import { CollectibleCardProps } from './types'

const CollectibleCardBody: React.FC<React.PropsWithChildren<CollectibleCardProps>> = ({
  nft,
  nftLocation,
  currentAskPrice,
  isUserNft,
}) => {
  const { t } = useTranslation()
  const { name } = nft
  const ethBusdPrice = useETHPrice()

  return (
    <CardBody p="8px">
      <NFTMedia as={PreviewImage} nft={nft} height={320} width={320} mb="8px" borderRadius="8px" />
      <Flex alignItems="center" justifyContent="space-between">
        {nft?.collectionName && (
          <Text fontSize="12px" color="textSubtle" mb="8px">
            {nft?.collectionName}
          </Text>
        )}
        {nftLocation && <LocationTag nftLocation={nftLocation} />}
      </Flex>
      <Text as="h4" fontWeight="600" mb="8px">
        {name}
      </Text>
      <Box borderTop="1px solid" borderTopColor="cardBorder" pt="8px">
        {currentAskPrice && (
          <MetaRow title={isUserNft ? t('Your price') : t('Asking price')}>
            <CostLabel cost={currentAskPrice} ethBusdPrice={ethBusdPrice} />
          </MetaRow>
        )}
      </Box>
    </CardBody>
  )
}

export default CollectibleCardBody
