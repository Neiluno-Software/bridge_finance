import { useEffect, useState } from 'react'
import { Button, FlexGap, Box, Text, Card, Grid, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { formatAmount } from 'utils/numbers'
import { useEthPrice } from 'views/Staking/utils/getEthPrices'
import { useBridgeTvl, useMarketTvl } from '../hooks/useInfoData'
import { formatEther } from 'viem'

const RoundBox = styled(Box)`
  background: linear-gradient(180deg, #FF0006 0%, #000 100%);
  border-radius: 50%;
  height: 108px;
  min-width: 108px;
  width: 108px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Hero = () => {
  const { t } = useTranslation()
  const ethPrice = useEthPrice()
  const [claimableEth, setClaimableEth] = useState(0)

  const { tvl: bridgeTvl } = useBridgeTvl()
  const { tvl: marketTvl } = useMarketTvl()

  return (
    <Box>
      <Grid gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" style={{ gap: '1.5rem' }}>
        <Card background="url('/images/card-bg2.jpg')">
          <FlexGap p={24} alignItems="center" gap="24px" justifyContent="space-between" height="100%">
            <FlexGap flexDirection="column" gap="8px" justifyContent="space-between">
              <Text fontSize={22}>NFT Marketplace</Text>
              <Text color="primary">
                Buy and Sell NFTs on Orb3 Chain.
                You can create sell orders with your NFTs and purchase ETH to buy NFTs.
              </Text>
              <FlexGap alignItems="center" gap="12px" mt={2}>
                <NextLinkFromReactRouter to="/nfts">
                  <Button>Trading Now</Button>
                </NextLinkFromReactRouter>
                {/* <Box>{t('Calculate Rewards ->')}</Box> */}
              </FlexGap>
            </FlexGap>
            <RoundBox>
              {/* <Text fontSize={12} color="secondary">
                TVL
              </Text> */}
              <Text fontSize={18}>${formatAmount(marketTvl * (ethPrice?.current || 0))}</Text>
            </RoundBox>
          </FlexGap>
        </Card>
        <Card background="url('/images/card-bg2.jpg')">
          <FlexGap p={24} alignItems="center" gap="24px" justifyContent="space-between">
            <FlexGap flexDirection="column" gap="8px">
              <Text fontSize={22}>Orb3 Bridge</Text>
              <Text color="primary">
                The lightning fast, low cost, safe and most secure bridge to transfer cross-chain assets to Orb3 Chain.
              </Text>
              <FlexGap alignItems="center" gap="12px" mt={2}>
                <NextLinkFromReactRouter to="/bridge">
                  <Button>Transfer Now</Button>
                </NextLinkFromReactRouter>
              </FlexGap>
            </FlexGap>
            <RoundBox>
              {/* <Text fontSize={12} color="secondary">
                TVL
              </Text> */}
              <Text fontSize={18}>${formatAmount(parseFloat(formatEther(bridgeTvl)) * (ethPrice?.current || 0))}</Text>
            </RoundBox>
          </FlexGap>
        </Card>
      </Grid>
    </Box>
  )
}

export default Hero
