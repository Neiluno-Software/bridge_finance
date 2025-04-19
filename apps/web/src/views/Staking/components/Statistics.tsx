import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Button, Card, Dots, Flex, Grid, Text, useToast } from '@pancakeswap/uikit'
import { DAY_IN_SECONDS } from '@pancakeswap/utils/getTimePeriods'
import BlockBox from 'components/BlockBox'
import { formatAmount } from 'utils/numbers'
import { formatEther } from 'viem'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { addTransaction } from 'state/transactions/actions'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ChainId } from '@pancakeswap/chains'

export default function Overview({
  accountInfo,
  totalInfo,
  tokenData,
  poolData,
  ethPrice,
  onCompound,
  onClaim,
  onClaimLp,
  refetchAccounts,
  refetchContracts,
}: {
  accountInfo: any
  totalInfo: any
  tokenData: any
  poolData: any
  ethPrice: any
  onCompound: () => Promise<any>
  onClaim: () => Promise<any>
  onClaimLp: () => Promise<any>
  refetchAccounts: () => void
  refetchContracts: () => void
}) {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { toastError, toastSuccess } = useToast()

  const [ethPer24Hour, setEthPer24Hour] = useState(0)
  const [ethPer24HourLp, setEthPer24HourLp] = useState(0)
  const [claimableEth, setClaimableEth] = useState(0)
  const [lpPrice, setLpPrice] = useState(0)

  const [isClaiming, setClaiming] = useState(false)
  const [isCompounding, setCompounding] = useState(false)
  const [isClaimingLp, setClaimingLp] = useState(false)

  const handleCompound = useCallback(async () => {
    if (!onCompound) return

    setCompounding(true)
    try {
      const receipt = await fetchWithCatchTxError(() => {
        return onCompound()
      })
      if (receipt?.status) {
        refetchAccounts()
        refetchContracts()
        toastSuccess(
          'Compound',
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>Compound Success</ToastDescriptionWithTx>,
        )
        addTransaction({
          chainId: chainId || ChainId.ETHEREUM,
          hash: receipt.transactionHash,
          from: receipt.from,
          summary: `Compound`,
          type: 'compound',
        })
      }
    } catch (error) {
      console.error(error)
    }
    setCompounding(false)
  }, [chainId, onCompound, fetchWithCatchTxError, refetchAccounts, refetchContracts, toastSuccess])

  const handleClaim = useCallback(async () => {
    if (!onClaim) return

    setClaiming(true)
    try {
      const receipt = await fetchWithCatchTxError(() => {
        return onClaim()
      })
      if (receipt?.status) {
        refetchAccounts()
        refetchContracts()
        toastSuccess(
          'Claim',
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>Claim Success</ToastDescriptionWithTx>,
        )
        addTransaction({
          chainId: chainId || ChainId.ETHEREUM,
          hash: receipt.transactionHash,
          from: receipt.from,
          summary: `Claim`,
          type: 'claim',
        })
      }
    } catch (error) {
      console.error(error)
    }
    setClaiming(false)
  }, [chainId, onClaim, fetchWithCatchTxError, refetchAccounts, refetchContracts, toastSuccess])

  const handleClaimLp = useCallback(async () => {
    if (!onClaimLp) return

    setClaimingLp(true)
    try {
      const receipt = await fetchWithCatchTxError(() => {
        return onClaimLp()
      })
      if (receipt?.status) {
        refetchAccounts()
        refetchContracts()
        toastSuccess(
          'ClaimLp',
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>ClaimLp Success</ToastDescriptionWithTx>,
        )
        addTransaction({
          chainId: chainId || ChainId.ETHEREUM,
          hash: receipt.transactionHash,
          from: receipt.from,
          summary: `Claim`,
          type: 'claim',
        })
      }
    } catch (error) {
      console.error(error)
    }
    setClaimingLp(false)
  }, [chainId, onClaimLp, fetchWithCatchTxError, refetchAccounts, refetchContracts, toastSuccess])

  useEffect(() => {
    if (!accountInfo || !totalInfo || !tokenData || !poolData) return
    setEthPer24Hour((totalInfo.spotApr * Number(formatEther(accountInfo?.stakedSpot))) / DAY_IN_SECONDS)
    setEthPer24HourLp((totalInfo.lpApr * Number(formatEther(accountInfo?.stakedLp))) / DAY_IN_SECONDS)
    setClaimableEth(
      accountInfo?.pendingReward +
        Number(formatEther(accountInfo?.spotRewardAddon)) +
        Number(formatEther(accountInfo?.lpRewardAddon)),
    )
    if (poolData.totalSupply) setLpPrice(poolData.liquidityUSD / poolData.totalSupply)
  }, [accountInfo, totalInfo, tokenData, poolData])

  return (
    <Card mt={12}>
      <Flex p={24} flexDirection="column">
        <Text fontSize={22} bold>
          {t('Your Statistics')}
        </Text>
        <Grid mt={24} gridGap={12} gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))">
          <BlockBox style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Text color="secondary">LP In Wallet</Text>
            <Text fontSize={22}>{formatAmount(accountInfo?.lpBalance)} SPOT-ETH</Text>
            <Text color="secondary">$0</Text>
          </BlockBox>
          <BlockBox style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Text color="secondary">SPOT In Wallet</Text>
            <Text fontSize={22}>{formatAmount(accountInfo?.spotBalance)} SPOT</Text>
            <Text color="secondary">${formatAmount(accountInfo?.spotBalance * tokenData?.priceUSD)}</Text>
          </BlockBox>
          <BlockBox style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Text color="secondary">ETH Per 24Hours</Text>
            <Text fontSize={22}> {formatAmount(ethPer24Hour)}ETH</Text>
            <Text color="secondary">${formatAmount(ethPer24Hour * ethPrice)}</Text>
          </BlockBox>
          <BlockBox style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Text color="secondary">Claimable ETH</Text>
            <Text fontSize={22}>{formatAmount(claimableEth)}ETH</Text>
            <Text color="secondary">${formatAmount(claimableEth * ethPrice)}</Text>
          </BlockBox>
          <BlockBox style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Text color="secondary">ETH Per Day LP Staking</Text>
            <Text fontSize={22}> {formatAmount(ethPer24HourLp)}ETH</Text>
            <Text color="secondary">${ethPer24HourLp * ethPrice}</Text>
          </BlockBox>
          <BlockBox style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Text color="secondary">Claimable LP</Text>
            <Text fontSize={22}>{formatAmount(accountInfo?.pendingLpReward)} SPOT-ETH</Text>
            <Text color="secondary">${formatAmount(accountInfo?.pendingLpReward * lpPrice)}</Text>
          </BlockBox>
        </Grid>
        <Grid mt={24} gridGap={12} gridTemplateColumns="repeat(auto-fit, minmax(100px, 1fr))">
          <Button onClick={handleClaim} disabled={isClaiming}>
            Claim My ETH
            {isClaiming && <Dots />}
          </Button>
          <Button onClick={handleCompound} disabled={isCompounding}>
            Compound
            {isCompounding && <Dots />}
          </Button>
          <Button onClick={handleClaimLp} disabled={isClaimingLp}>
            Claim My LP
            {isClaimingLp && <Dots />}
          </Button>
        </Grid>
      </Flex>
    </Card>
  )
}
