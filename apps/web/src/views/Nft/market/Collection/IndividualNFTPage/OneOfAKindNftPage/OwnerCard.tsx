import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Card, EthChainIcon, Flex, Grid, SellIcon, Skeleton, Text, useModal } from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { useETHPrice } from 'hooks/useETHPrice'
import useTheme from 'hooks/useTheme'
import { NftToken } from 'state/nftMarket/types'
import { styled } from 'styled-components'
import useNftOwner from 'views/Nft/market/hooks/useNftOwner'
import BuyModal from '../../../components/BuySellModals/BuyModal'
import SellModal from '../../../components/BuySellModals/SellModal'
import { ButtonContainer, TableHeading } from '../shared/styles'

const StyledCard = styled(Card)`
  width: 100%;
  & > div:first-child {
    display: flex;
    flex-direction: column;
  }
`

const OwnerRow = styled(Grid)`
  grid-template-columns: 2fr 2fr 1fr;
  grid-row-gap: 16px;
  margin-top: 16px;
  margin-bottom: 8px;
  align-items: center;
`

interface OwnerCardProps {
  nft: NftToken
  isOwnNft: boolean
  onSuccess: () => void
}

const OwnerCard: React.FC<React.PropsWithChildren<OwnerCardProps>> = ({
  nft,
  isOwnNft,
  onSuccess,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const ethBusdPrice = useETHPrice()

  const { owner, isLoadingOwner } = useNftOwner(nft, isOwnNft)

  const priceInUsd = ethBusdPrice.multipliedBy(parseFloat(nft?.marketData?.currentAskPrice)).toNumber()

  const [onPresentBuyModal] = useModal(<BuyModal nftToBuy={nft} />)
  const [onPresentAdjustPriceModal] = useModal(
    <SellModal variant={nft.marketData?.isTradable ? 'edit' : 'sell'} nftToSell={nft} onSuccessSale={onSuccess} />,
  )

  return (
    <StyledCard>
      <Grid
        flex="0 1 auto"
        gridTemplateColumns="34px 1fr"
        alignItems="center"
        height="72px"
        px="24px"
        borderBottom={`1px solid ${theme.colors.cardBorder}`}
      >
        <SellIcon width="24px" height="24px" />
        <Text bold>{t('Owner')}</Text>
      </Grid>
      {owner && (
        <>
          <TableHeading flex="0 1 auto" gridTemplateColumns="2fr 2fr 1fr" py="12px">
            <Flex alignItems="center">
              <Text textTransform="uppercase" color="textSubtle" bold fontSize="12px" px="24px">
                {t('Price')}
              </Text>
            </Flex>
            <Text textTransform="uppercase" color="textSubtle" bold fontSize="12px">
              {t('Owner')}
            </Text>
          </TableHeading>
          <OwnerRow>
            <Box pl="24px">
              {nft.marketData?.isTradable ? (
                <>
                  <Flex justifySelf="flex-start" alignItems="center" width="max-content">
                    <EthChainIcon width="24px" height="24px" mr="8px" />
                    <Text bold>{formatNumber(parseFloat(nft?.marketData?.currentAskPrice), 0, 5)}</Text>
                  </Flex>
                  {ethBusdPrice ? (
                    <Text fontSize="12px" color="textSubtle">
                      {`(~${formatNumber(priceInUsd, 2, 2)} USD)`}
                    </Text>
                  ) : (
                    <Skeleton width="86px" height="12px" mt="4px" />
                  )}
                </>
              ) : (
                <Flex alignItems="center" height="100%">
                  <Text>{t('Not for sale')}</Text>
                </Flex>
              )}
            </Box>
            <ButtonContainer>
              {isOwnNft ? (
                <Button
                  scale="sm"
                  variant="secondary"
                  maxWidth="128px"
                  onClick={onPresentAdjustPriceModal}
                >
                  {nft.marketData?.isTradable ? t('Manage') : t('Sell')}
                </Button>
              ) : (
                <Button
                  disabled={!nft.marketData?.isTradable}
                  scale="sm"
                  variant="secondary"
                  maxWidth="128px"
                  onClick={onPresentBuyModal}
                >
                  {t('Buy')}
                </Button>
              )}
            </ButtonContainer>
          </OwnerRow>
        </>
      )}
      {isLoadingOwner && <Skeleton />}
      {!isLoadingOwner && !owner && (
        <Flex justifyContent="center" alignItems="center" padding="24px">
          <Text>{t('Owner information is not available for this item')}</Text>
        </Flex>
      )}
    </StyledCard>
  )
}

export default OwnerCard
