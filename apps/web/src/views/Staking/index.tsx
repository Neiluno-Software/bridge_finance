import React from 'react'
import { Grid } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useSpotStaking } from 'hooks/useSpotStaking'
import { usePoolDatasSWR, useTokenDataSWR } from 'state/info/hooks'
import { SPOT_ADDRESS, SPOT_LP_ADDRESS } from 'config/constants/blockspot'
import { useEthPrice } from './utils/getEthPrices'

import StakeInfos from './components/StakeInfos'
import Statistics from './components/Statistics'
import StakePanel from './components/StakePanel'

const Staking: React.FC<React.PropsWithChildren> = () => {
  const address = SPOT_ADDRESS
  const pool = SPOT_LP_ADDRESS
  const ethPrice = useEthPrice()
  const tokenData = useTokenDataSWR(address.toLowerCase())
  const poolsData = usePoolDatasSWR([pool.toLowerCase()])

  const {
    accountInfo,
    totalInfo,
    refetchAccounts,
    refetchContracts,
    onStaking,
    onUnstaking,
    onPerpSwitch,
    onRequestUnlock,
    onCompound,
    onClaim,
    onClaimLp,
  } = useSpotStaking()

  return (
    <Page>
      <StakeInfos totalInfo={totalInfo} tokenData={tokenData} poolData={poolsData[0]} />
      <Grid gridTemplateColumns="repeat(auto-fit, minmax(400px, 1fr))" gridGap={24}>
        <Statistics
          accountInfo={accountInfo}
          totalInfo={totalInfo}
          tokenData={tokenData}
          poolData={poolsData[0]}
          ethPrice={ethPrice?.current || 0}
          onCompound={onCompound}
          onClaim={onClaim}
          onClaimLp={onClaimLp}
          refetchAccounts={refetchAccounts}
          refetchContracts={refetchContracts}
        />
        <StakePanel
          accountInfo={accountInfo}
          totalInfo={totalInfo}
          tokenData={tokenData}
          poolData={poolsData[0]}
          ethPrice={ethPrice?.current || 0}
          onStaking={onStaking}
          onUnstaking={onUnstaking}
          onPerpSwitch={onPerpSwitch}
          onRequestUnlock={onRequestUnlock}
          refetchAccounts={refetchAccounts}
          refetchContracts={refetchContracts}
        />
      </Grid>
      {/* <StakerList /> */}
    </Page>
  )
}

export default Staking
