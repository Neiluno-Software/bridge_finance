import React, { useEffect, useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Card, Flex, Grid, Text } from '@pancakeswap/uikit'
import BlockBox from 'components/BlockBox'
import styled from 'styled-components'
import { formatAmount } from 'utils/numbers'

const StatisticCard = styled(Card)`
  position: relative;
  padding-right: 260px;
  @media screen and (max-width: 1460px) {
    padding-right: 0px;
  }
`
const Img = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  z-index: 1;

  @media screen and (max-width: 1460px) {
    display: none;
  }
`

export default function StakeInfos({
  totalInfo,
  tokenData,
  poolData,
}: {
  totalInfo: any
  tokenData: any
  poolData: any
}) {
  const { t } = useTranslation()

  const [lpPrice, setLpPrice] = useState(0)

  useEffect(() => {
    if (!poolData) return
    if (poolData.totalSupply) setLpPrice(poolData.liquidityUSD / poolData.totalSupply)
  }, [poolData])

  return (
    <>
      <StatisticCard my={12}>
        <Flex p={24} flexDirection="column" zIndex={2}>
          <Text fontSize={22} bold>
            {t('Total Staking Statistics')}
          </Text>
          <Grid mt={24} gridGap={12} gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))">
            <BlockBox style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Text color="secondary">Total SPOT Stakers</Text>
              <Text fontSize={22}> {totalInfo?.spotStakers || 0} </Text>
            </BlockBox>
            <BlockBox style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Text color="secondary">Total Staked SPOT</Text>
              <Text fontSize={22}>{formatAmount(totalInfo?.totalSpotStaked || 0)}</Text>
              <Text color="secondary">${formatAmount(totalInfo?.totalSpotStaked * tokenData?.priceUSD || 0)}</Text>
            </BlockBox>
            <BlockBox style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Text color="secondary">Total LP Stakers</Text>
              <Text fontSize={22}>{totalInfo?.lpStakers || 0}</Text>
            </BlockBox>
            <BlockBox style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Text color="secondary">Total Staked LP</Text>
              <Text fontSize={22}>{formatAmount(totalInfo?.totalLpStaked || 0)}</Text>
              <Text color="secondary">${formatAmount(totalInfo?.totalLpStaked * lpPrice || 0)}</Text>
            </BlockBox>
          </Grid>
        </Flex>
        <Img src="/images/card-bg.png" />
      </StatisticCard>
    </>
  )
}
