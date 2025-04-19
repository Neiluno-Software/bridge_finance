import React, { useEffect, useMemo, useState } from 'react'
import { PageSection, Box, Card, Flex, Grid, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import BlockBox from 'components/BlockBox'
import ChartCard from 'views/Info/components/InfoCharts/ChartCard'
import { ONE_HOUR_SECONDS } from 'config/constants/info'
import { useActiveChainId } from 'hooks/useActiveChainId'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { formatAmount } from 'utils/formatInfoNumbers'
import Page from 'components/Layout/Page'
import { useTokenChartDataSWR, useTokenDataSWR, useTokenPriceDataSWR } from 'state/info/hooks'
import useTotalSupply from 'hooks/useTotalSupply'
import { formatEther } from 'viem'
import Hero from './components/Hero'
import { ChainId, WETH9 } from '@pancakeswap/sdk'
import { useInfoData } from './hooks/useInfoData'
import styled from 'styled-components'

dayjs.extend(duration)
const DEFAULT_TIME_WINDOW = dayjs.duration(1, 'weeks')

const InfoCard1 = styled(Box)`
  background-image: url('/images/card-bg1.png');
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`
const InfoCard2 = styled(Box)`
  background-image: url('/images/card-bg3.png');
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`

const Home: React.FC<React.PropsWithChildren> = () => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const { chainId } = useActiveChainId()

  const [tokenHolders, setTokenHolders] = useState(0)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [currentPriceChange, setCurrentPriceChange] = useState(0)
  const [volume24Hour, setVolume24Hour] = useState(0)
  const [volume24HourChange, setVolume24HourChange] = useState(0)
  const [totalMarketCap, setTotalMarketCap] = useState(0)

  const { data } = useInfoData()

  const totalSupply = useTotalSupply(WETH9[chainId || ChainId.ORB3])
  const tokenData = useTokenDataSWR(WETH9[chainId || ChainId.ORB3].address.toLocaleLowerCase())
  const chartData = useTokenChartDataSWR(WETH9[chainId || ChainId.ORB3].address.toLocaleLowerCase())
  const priceData = useTokenPriceDataSWR(WETH9[chainId || ChainId.ORB3].address, ONE_HOUR_SECONDS, DEFAULT_TIME_WINDOW)
  
  const adjustedPriceData = useMemo(() => {
    // Include latest available price
    if (priceData && tokenData && priceData.length > 0) {
      return [
        ...priceData,
        {
          time: new Date().getTime() / 1000,
          open: priceData[priceData.length - 1].close,
          close: tokenData?.priceUSD,
          high: tokenData?.priceUSD,
          low: priceData[priceData.length - 1].close,
        },
      ]
    }
    return undefined
  }, [priceData, tokenData])


  useEffect(() => {
    if (!tokenData) {
      setVolume24Hour(0)
      setCurrentPriceChange(0)
      setCurrentPrice(0)
      return
    }

    setVolume24Hour(tokenData.volumeUSD)
    setVolume24HourChange(tokenData.volumeUSDChange)
    setCurrentPriceChange(tokenData.priceUSDChange)
    setCurrentPrice(tokenData.priceUSD)
  }, [tokenData])

  useEffect(() => {
    if (!totalSupply || !currentPrice) {
      return
    }
    setTotalMarketCap(parseFloat(formatEther(totalSupply.quotient)) * currentPrice)
  }, [, currentPrice, totalSupply])

  return (
    <Page>
      <PageSection innerProps={{ style: { width: '100%' } }} index={1}>
        <Hero />
      </PageSection>
      <PageSection innerProps={{ style: { width: '100%' } }} index={1}>
        <Card style={{ flexGrow: 1 }}>
          <Grid
            gridTemplateColumns="repeat(auto-fit, minmax(160px, 1fr))"
            justifyContent="space-between"
            style={{ margin: '24px' }}
          >
            <InfoCard1>
              <Flex flexDirection="column" alignItems="center" height="100px">
                <Text fontSize={22}>${formatAmount(currentPrice)}</Text>
                <Text fontSize={16} color={currentPriceChange > 0 ? 'success' : 'warning'}>
                  {Number(currentPriceChange.toFixed(2))}%
                </Text>
                <Box style={{ flexGrow: 1 }} />
                <Text fontSize={12} textTransform="uppercase" color="primary">
                  eth price
                </Text>
              </Flex>
            </InfoCard1>
            <InfoCard2>
              <Flex flexDirection="column" alignItems="center" height="100px">
                <Text fontSize={22}>${formatAmount(volume24Hour)}</Text>
                <Text fontSize={16} color={volume24HourChange > 0 ? 'primary' : 'warning'}>
                  {Number(volume24HourChange.toFixed(2))}%
                </Text>
                <Box style={{ flexGrow: 1 }} />
                <Text fontSize={12} textTransform="uppercase" color="primary">
                  volume 24h
                </Text>
              </Flex>
            </InfoCard2>
            <InfoCard1>
              <Flex flexDirection="column" alignItems="center" height="100px">
                <Text fontSize={22}>{data?.total_blocks || 0}</Text>
                <Box style={{ flexGrow: 1 }} />
                <Text fontSize={12} textTransform="uppercase" color="primary">
                  total blocks
                </Text>
              </Flex>
            </InfoCard1>
            <InfoCard2>
              <Flex flexDirection="column" alignItems="center" height="100px">
                <Text fontSize={22}>{data?.total_addresses || 0}</Text>
                <Box style={{ flexGrow: 1 }} />
                <Text fontSize={12} textTransform="uppercase" color="primary">
                  total addresses
                </Text>
              </Flex>
            </InfoCard2>
          </Grid>

          <BlockBox
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              margin: '24px'
            }}
          >
            <ChartCard
              variant="token"
              chartData={chartData}
              tokenData={tokenData}
              tokenPriceData={adjustedPriceData}
            />
          </BlockBox>
        </Card>
      </PageSection>
    </Page>
  )
}

export default Home
