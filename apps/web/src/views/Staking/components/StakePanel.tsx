import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  ButtonMenu,
  ButtonMenuItem,
  Card,
  Dots,
  Flex,
  FlexGap,
  Grid,
  NextLinkFromReactRouter,
  Text,
  useToast,
} from '@pancakeswap/uikit'
import BlockBox from 'components/BlockBox'
import { formatAmount } from 'utils/numbers'
import styled from 'styled-components'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ChainId } from '@pancakeswap/chains'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'
import { useCurrency } from 'hooks/Tokens'
import {
  MIN_STAKE_LP_AMOUNT,
  MIN_STAKE_SPOT_AMOUNT,
  SPOT_ADDRESS,
  SPOT_LP_ADDRESS,
  STAKING_CONTRACT,
} from 'config/constants/blockspot'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { parseEther } from 'viem'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { addTransaction } from 'state/transactions/actions'
import Link from 'next/link'

const InputPanel = styled.div`
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  outline: none;
  background: transparent;
  display: flex;
  padding: 4px 12px;
  align-items: center;
`
const InputAmount = styled.input`
  outline: none;
  border: none;
  background: transparent;
  text-align: right;
  font-size: 18px;
  margin: 4px 0;
`
const Max = styled(Text)`
  cursor: pointer;
  font-size: 12px;
  text-align: right;
  color: ${({ theme }) => theme.colors.secondary};
`
const BuyButton = styled(Text)`
  cursor: pointer;
  font-size: 12px;
  text-align: right;
  padding: 2px 8px;
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.backgroundAlt3};
  color: ${({ theme }) => theme.colors.primary};
  transition: 0.3s background;
  &:hover {
    background: ${({ theme }) => theme.colors.backgroundAlt2};
  }
`

enum StakeType {
  TOKEN,
  LP,
}

export default function StakePanel({
  accountInfo,
  totalInfo,
  tokenData,
  poolData,
  ethPrice,
  onStaking,
  onUnstaking,
  onPerpSwitch,
  onRequestUnlock,
  refetchAccounts,
  refetchContracts,
}: {
  accountInfo: any
  totalInfo: any
  tokenData: any
  poolData: any
  ethPrice: any
  onStaking: (amount: any, type: number) => Promise<any>
  onUnstaking: (amount: any, type: number) => Promise<any>
  onPerpSwitch: (type: number) => Promise<any>
  onRequestUnlock: (type: number) => Promise<any>
  refetchAccounts: () => void
  refetchContracts: () => void
}) {
  const { t } = useTranslation()

  const { chainId } = useActiveChainId()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { toastError, toastSuccess } = useToast()

  const [view, setView] = useState(StakeType.TOKEN)

  const [inputAmount, setInputAmount] = useState('')
  const blockTimestamp = useCurrentBlockTimestamp()
  const [timer, setTimer] = useState(0)

  const [lpPrice, setLpPrice] = useState(0)
  const [spotStakedPercent, setSpotStakedPercent] = useState(0)
  const [lpStakedPercent, setLpStakedPercent] = useState(0)

  const [isStaking, setStaking] = useState(false)
  const [isUnstaking, setUnstaking] = useState(false)

  const spotToken = useCurrency(SPOT_ADDRESS)
  const lpToken = useCurrency(SPOT_LP_ADDRESS)

  const {
    approvalState: approvalSpot,
    approveCallback: approveSpotCallback,
    currentAllowance: currentSpotAllowance,
    isPendingError: isSpotPendingError,
  } = useApproveCallback(
    spotToken ? CurrencyAmount.fromRawAmount(spotToken, parseEther(inputAmount.toString())) : undefined,
    STAKING_CONTRACT,
  )

  const {
    approvalState: approvalLp,
    approveCallback: approveLpCallback,
    currentAllowance: currentLpAllowance,
    isPendingError: isLpPendingError,
  } = useApproveCallback(
    lpToken ? CurrencyAmount.fromRawAmount(lpToken, parseEther(inputAmount.toString())) : undefined,
    STAKING_CONTRACT,
  )

  const handleClickMax = useCallback(() => {
    setInputAmount(view === StakeType.TOKEN ? accountInfo.spotBalance : accountInfo.lpBalance)
  }, [accountInfo, view])

  const handleStakeSpot = useCallback(async () => {
    if (!onStaking || !Number(inputAmount)) return

    setStaking(true)
    try {
      if (approvalSpot === ApprovalState.NOT_APPROVED) {
        await approveSpotCallback()
      } else {
        const receipt = await fetchWithCatchTxError(() => {
          return onStaking(inputAmount, 0)
        })
        if (receipt?.status) {
          setInputAmount('')
          refetchAccounts()
          refetchContracts()
          toastSuccess(
            'Stake SPOT Token',
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>Stake Success</ToastDescriptionWithTx>,
          )
          addTransaction({
            chainId: chainId || ChainId.ETHEREUM,
            hash: receipt.transactionHash,
            from: receipt.from,
            summary: `Stake SPOT Token`,
            type: 'stake',
          })
        }
      }
    } catch (error) {
      console.error(error)
    }
    setStaking(false)
  }, [
    chainId,
    inputAmount,
    approvalSpot,
    onStaking,
    approveSpotCallback,
    fetchWithCatchTxError,
    refetchAccounts,
    refetchContracts,
    toastSuccess,
  ])

  const handleUnstakeSpot = useCallback(async () => {
    if (!onUnstaking || !Number(inputAmount)) return

    setUnstaking(true)
    try {
      const receipt = await fetchWithCatchTxError(() => {
        return onUnstaking(inputAmount, 0)
      })
      if (receipt?.status) {
        setInputAmount('')
        refetchAccounts()
        refetchContracts()
        toastSuccess(
          'Unstake SPOT Token',
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>Unstake Success</ToastDescriptionWithTx>,
        )
        addTransaction({
          chainId: chainId || ChainId.ETHEREUM,
          hash: receipt.transactionHash,
          from: receipt.from,
          summary: `Unstake SPOT Token`,
          type: 'unstake',
        })
      }
    } catch (error) {
      console.error(error)
    }
    setUnstaking(false)
  }, [chainId, inputAmount, onUnstaking, fetchWithCatchTxError, refetchAccounts, refetchContracts, toastSuccess])

  const handleStakeLp = useCallback(async () => {
    if (!onStaking || !Number(inputAmount)) return

    setStaking(true)
    try {
      if (approvalLp === ApprovalState.NOT_APPROVED) {
        await approveSpotCallback()
      } else {
        const receipt = await fetchWithCatchTxError(() => {
          return onStaking(inputAmount, 1)
        })
        if (receipt?.status) {
          setInputAmount('')
          refetchAccounts()
          refetchContracts()
          toastSuccess(
            'Stake LP Token',
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>Stake LP Success</ToastDescriptionWithTx>,
          )
          addTransaction({
            chainId: chainId || ChainId.ETHEREUM,
            hash: receipt.transactionHash,
            from: receipt.from,
            summary: `Stake LP Token`,
            type: 'stake',
          })
        }
      }
    } catch (error) {
      console.error(error)
    }
    setStaking(false)
  }, [
    chainId,
    inputAmount,
    approvalLp,
    approveSpotCallback,
    onStaking,
    fetchWithCatchTxError,
    refetchAccounts,
    refetchContracts,
    toastSuccess,
  ])

  const handleUnstakeLp = useCallback(async () => {
    if (!onUnstaking || !Number(inputAmount)) return

    setUnstaking(true)
    try {
      const receipt = await fetchWithCatchTxError(() => {
        return onUnstaking(inputAmount, 1)
      })
      if (receipt?.status) {
        setInputAmount('')
        refetchAccounts()
        refetchContracts()
        toastSuccess(
          'Unstake LP Token',
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>Unstake LP Success</ToastDescriptionWithTx>,
        )
        addTransaction({
          chainId: chainId || ChainId.ETHEREUM,
          hash: receipt.transactionHash,
          from: receipt.from,
          summary: `Unstake LP Token`,
          type: 'unstake',
        })
      }
    } catch (error) {
      console.error(error)
    }
    setUnstaking(false)
  }, [chainId, inputAmount, onUnstaking, fetchWithCatchTxError, refetchAccounts, refetchContracts, toastSuccess])

  const displayUnlockTime = useCallback(() => {
    if (!accountInfo || !blockTimestamp) return ''
    const leftTime =
      (view === StakeType.TOKEN ? accountInfo.spotUnlockTime : accountInfo.lpUnlockTime) -
      Math.floor(Number(blockTimestamp)) -
      timer
    if (leftTime < 0) return '00:00:00'
    const period = getTimePeriods(leftTime)
    if (period.days > 0) return `${period.days} Days`
    return `${(period.hours < 10 ? '0' : '') + period.hours}:${(period.minutes < 10 ? '0' : '') + period.minutes}:${
      (period.seconds < 10 ? '0' : '') + period.seconds
    }`
  }, [timer, accountInfo, view, blockTimestamp])

  useEffect(() => {
    if (!accountInfo || !poolData || !totalInfo) return

    if (poolData.totalSupply) setLpPrice(poolData.liquidityUSD / poolData.totalSupply)
    if (totalInfo.totalSpotStaked > 0) setSpotStakedPercent((accountInfo.stakedSpot * 100) / totalInfo.totalSpotStaked)
    if (totalInfo.totalLpStaked > 0) setLpStakedPercent((accountInfo.stakedLp * 100) / totalInfo.totalLpStaked)
  }, [accountInfo, totalInfo, poolData])

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimer((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timerId)
  }, [])

  return (
    <Card mt={12}>
      <FlexGap p={24} flexDirection="column" gap="12px">
        <Flex justifyContent="space-between">
          <Text fontSize={22} bold>
            {view === StakeType.TOKEN ? t('SPOT') : t('SPOT-ETH')} Staking
          </Text>
          <ButtonMenu scale="sm" variant="subtle" onItemClick={setView} activeIndex={view}>
            <ButtonMenuItem>SPOT Stake</ButtonMenuItem>
            <ButtonMenuItem>LP Stake</ButtonMenuItem>
          </ButtonMenu>
        </Flex>
        <Grid mt={12} gridGap={12} gridTemplateColumns="repeat(auto-fit, minmax(160px, 1fr))">
          <BlockBox
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <Text fontSize={22}>
              {view === StakeType.TOKEN ? formatAmount(accountInfo.stakedSpot) : formatAmount(accountInfo.stakedLp)}
            </Text>
            <Text color="secondary" style={{ flexGrow: 1 }}>
              $
              {view === StakeType.TOKEN
                ? formatAmount(accountInfo?.stakedSpot * tokenData?.priceUSD || 0)
                : formatAmount(accountInfo?.stakedLp * lpPrice || 0)}
            </Text>
            <Text color="secondary">Staked {view === StakeType.TOKEN ? t('SPOT') : t('LP')}</Text>
          </BlockBox>
          <BlockBox style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
            <Text fontSize={22}>{displayUnlockTime()}</Text>
            <Text style={{ flexGrow: 1 }} color="secondary" />
            <Text color="secondary">Until Unlock</Text>
          </BlockBox>
          <BlockBox style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
            <Text fontSize={22}>{formatAmount(view === StakeType.TOKEN ? spotStakedPercent : lpStakedPercent)}%</Text>
            <Box style={{ flexGrow: 1 }} />
            <Text color="secondary">Your Pool</Text>
          </BlockBox>
        </Grid>
        <BlockBox>
          <FlexGap flexDirection="column" alignItems="center" gap="12px">
            <Text fontSize="18px" textTransform="uppercase" textAlign="center">
              Please enter the amount of tokens
            </Text>
            <InputPanel>
              <Text color="primary">{view === StakeType.TOKEN ? t('SPOT') : t('SPOT-ETH')}</Text>
              <Flex flexDirection="column">
                <InputAmount
                  type="number"
                  placeholder="0.0"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.currentTarget.value)}
                />
                <FlexGap justifyContent="end" alignItems="center" gap="8px">
                  <Max onClick={handleClickMax}>
                    BALANCE: {formatAmount(view === StakeType.TOKEN ? accountInfo.spotBalance : accountInfo.lpBalance)}
                  </Max>
                  <NextLinkFromReactRouter to="/swap">
                    <BuyButton> BUY </BuyButton>
                  </NextLinkFromReactRouter>
                </FlexGap>
              </Flex>
            </InputPanel>
            {view === StakeType.TOKEN ? (
              <>
                <Button
                  width="100%"
                  maxWidth="200px"
                  disabled={
                    approvalSpot === ApprovalState.PENDING || isStaking || Number(inputAmount) < MIN_STAKE_SPOT_AMOUNT
                  }
                  onClick={handleStakeSpot}
                >
                  {approvalSpot === ApprovalState.NOT_APPROVED || approvalSpot === ApprovalState.PENDING
                    ? 'Approve'
                    : 'Stake'}
                  {(approvalSpot === ApprovalState.PENDING || isStaking) && <Dots />}
                </Button>
                <Button
                  width="100%"
                  maxWidth="200px"
                  disabled={isUnstaking || !Number(inputAmount) || Number(inputAmount) > accountInfo.stakedSpot}
                  onClick={handleUnstakeSpot}
                >
                  Unstake
                  {isUnstaking && <Dots />}
                </Button>
              </>
            ) : (
              <>
                <Button
                  width="100%"
                  maxWidth="200px"
                  disabled={
                    approvalLp === ApprovalState.PENDING || isStaking || Number(inputAmount) < MIN_STAKE_LP_AMOUNT
                  }
                  onClick={handleStakeLp}
                >
                  {approvalLp === ApprovalState.NOT_APPROVED || approvalLp === ApprovalState.PENDING
                    ? 'Approve'
                    : 'Stake'}
                  {(approvalLp === ApprovalState.PENDING || isStaking) && <Dots />}
                </Button>
                <Button
                  width="100%"
                  maxWidth="200px"
                  disabled={isUnstaking || !Number(inputAmount) || Number(inputAmount) > accountInfo.stakedLp}
                  onClick={handleUnstakeLp}
                >
                  Unstake
                  {isUnstaking && <Dots />}
                </Button>
              </>
            )}
          </FlexGap>
        </BlockBox>
      </FlexGap>
    </Card>
  )
}
