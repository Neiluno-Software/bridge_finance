import { use, useCallback, useEffect, useState } from 'react'
import {
  Button,
  Card,
  Dots,
  Flex,
  FlexGap,
  Grid,
  IconButton,
  OpenNewIcon,
  Text,
  useToast,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import BlockBox from 'components/BlockBox'
import { Wrapper } from './styles'
import CurrencySelect from './CurrencySelect'
import { BRIDGE_CONTRACT, BRIDGE_FEE, MIN_DEPOSIT_AMOUNT, SUPPORT_NETWORKS, SUPPORT_TOKENS } from '../config'
import { useActiveChainId } from 'hooks/useActiveChainId'
import NetworkSelect from './NetworkSelect'
import { useAccount } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { addTransaction } from 'state/transactions/actions'
import { ChainId } from '@pancakeswap/chains'
import { parseUnits } from '@pancakeswap/utils/viem/parseUnits'
import { formatUnits, isAddress } from 'viem'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import BigNumber from 'bignumber.js'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useBridgeContract } from '../hooks/useBridgeContract'
import { formatAmount } from '../utils'
import { useGetEthBalance, useTokenBalance } from '../hooks/useTokenBalance'
import { formatEther } from 'ethers/lib/utils'
import { getBlockExploreLink } from 'utils'
import Link from 'next/link'

const InputAmount = styled.input`
  outline: none;
  border: none;
  background: transparent;
  text-align: right;
  font-size: 20px;
  margin: 4px 0;
  width: 100%;
`
const InputReceiver = styled.input`
  outline: none;
  border: none;
  background: transparent;
  text-align: left;
  font-size: 14px;
  margin: 4px 0;
  width: 100%;

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary};
  }
`
const Max = styled(Text)`
  cursor: pointer;
  font-size: 14px;
  text-align: right;
  padding: 2px 8px;
  border-radius: 2px;
  background: transparent; //${({ theme }) => theme.colors.backgroundAlt3};
  color: ${({ theme }) => theme.colors.primary};
  transition: 0.3s background;
  &:hover {
    background: #2f2f2f; // ${({ theme }) => theme.colors.backgroundAlt2};
  }
`
const SwitchIconButton = styled(IconButton)`
  background: transparent;
  height: 32px;
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  .icon-up-down {
    display: none;
  }
  &:hover {
    .icon-down {
      display: none;
      fill: white;
    }
    .icon-up-down {
      display: block;
      fill: white;
    }
  }
`

export default function BridgeForm() {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const { chainId } = useActiveChainId()
  const { address } = useAccount()
  const { isMobile } = useMatchBreakpoints()
  const { onDeposit, onDepositToken } = useBridgeContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { toastError, toastSuccess } = useToast()

  const [currency, setCurrency] = useState(SUPPORT_TOKENS[0])
  const [fromNetwork, setFromNetwork] = useState(SUPPORT_NETWORKS[0])
  const [toNetwork, setToNetwork] = useState(SUPPORT_NETWORKS[1])
  const [minAmount, setMinAmount] = useState(0)

  const { balance: fromEthMax } = useGetEthBalance(BRIDGE_CONTRACT[fromNetwork.chainId].address, fromNetwork.chainId)
  const { balance: toEthMax } = useGetEthBalance(BRIDGE_CONTRACT[toNetwork.chainId].address, toNetwork.chainId)

  const { balance: fromMax } = useTokenBalance(currency[fromNetwork.chainId].address, fromNetwork.chainId)
  const { balance: toMax } = useTokenBalance(currency[toNetwork.chainId].address, toNetwork.chainId)

  const { balance: fromEthBalance, refresh: refetchFromEth } = useGetEthBalance(address, fromNetwork.chainId)
  const formattedFromEth = parseFloat(formatEther(fromEthBalance))

  const { balance: toEthBalance, refresh: refetchToEth } = useGetEthBalance(address, toNetwork.chainId)
  const formattedToEth = parseFloat(formatEther(toEthBalance))

  const { balance: fromBalance, refetch: refetchFromBalance } = useTokenBalance(
    currency[fromNetwork.chainId].address,
    fromNetwork.chainId,
  )
  const formattedFrom = parseFloat(formatUnits(fromBalance, currency[fromNetwork.chainId].decimals))

  const { balance: toBalance, refetch: refetchToBalance } = useTokenBalance(
    currency[toNetwork.chainId].address,
    toNetwork.chainId,
  )
  const formattedTo = parseFloat(formatUnits(toBalance, currency[toNetwork.chainId].decimals))

  const [inputAmount, setInputAmount] = useState('')
  const [outputAmount, setOutputAmount] = useState('')
  const [receiver, setReceiver] = useState<`0x${string}` | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const { approvalState: approvalToken, approveCallback: approveTokenCallback } = useApproveCallback(
    !currency[fromNetwork.chainId].isNative
      ? CurrencyAmount.fromRawAmount(
          currency[fromNetwork.chainId],
          parseUnits(inputAmount.toString(), currency[fromNetwork.chainId].decimals),
        )
      : undefined,
    BRIDGE_CONTRACT[fromNetwork.chainId].address,
  )

  const handleMax = useCallback(() => {
    if (currency[fromNetwork.chainId].isNative) {
      if (!fromEthBalance) setInputAmount('0')
      const tmp = Number(formattedFromEth?.toFixed(6))
      if (tmp > 0) setInputAmount(tmp.toString())
      else setInputAmount('0')
    } else {
      if (!fromBalance) setInputAmount('0')
      const tmp = Number(formattedFrom?.toFixed(6))
      if (tmp > 0) setInputAmount(tmp.toString())
      else setInputAmount('0')
    }
  }, [formattedFrom, formattedFromEth, currency, fromEthBalance, fromBalance, fromNetwork])

  const handleDeposit = useCallback(async () => {
    if (!onDeposit || !onDepositToken || !receiver) return

    if (!isAddress(receiver)) {
      toastError('Invalid Receiver Address')
      return
    }

    setLoading(true)
    try {
      if (currency[fromNetwork.chainId].isNative) {
        const receipt = await fetchWithCatchTxError(() => {
          return onDeposit(parseUnits(inputAmount, currency[fromNetwork.chainId].decimals), receiver, toNetwork.code)
        })
        if (receipt?.status) {
          toastSuccess(
            'Deposit ETH To Bridge',
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>Deposit ETH Success</ToastDescriptionWithTx>,
          )
          refetchFromEth()
          addTransaction({
            chainId: chainId || ChainId.ETHEREUM,
            hash: receipt.transactionHash,
            from: receipt.from,
            summary: `Deposit ETH To Bridge`,
            type: 'deposit',
          })
        }
      } else if (approvalToken === ApprovalState.NOT_APPROVED) {
        await approveTokenCallback()
      } else {
        const receipt = await fetchWithCatchTxError(() => {
          return onDepositToken(
            parseUnits(inputAmount, currency[fromNetwork.chainId].decimals),
            currency[fromNetwork.chainId].address,
            receiver,
            toNetwork.code,
          )
        })
        if (receipt?.status) {
          refetchFromBalance()
          toastSuccess(
            'Deposit Token To Bridge',
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>Deposit Token Success</ToastDescriptionWithTx>,
          )
          addTransaction({
            chainId: chainId || ChainId.ETHEREUM,
            hash: receipt.transactionHash,
            from: receipt.from,
            summary: `Deposit Token To Bridge`,
            type: 'deposit',
          })
        }
      }
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }, [
    chainId,
    inputAmount,
    fromNetwork,
    toNetwork,
    currency,
    receiver,
    address,
    approvalToken,
    toastError,
    refetchFromEth,
    refetchFromBalance,
    toastSuccess,
    fetchWithCatchTxError,
    onDeposit,
    onDepositToken,
    approveTokenCallback,
  ])

  useEffect(() => {
    setReceiver(address)
  }, [address])

  useEffect(() => {
    if (!chainId) return
    const index = SUPPORT_NETWORKS.findIndex((network) => network.chainId === chainId)
    if (index >= 0) {
      setFromNetwork(SUPPORT_NETWORKS[index])
    }
  }, [chainId])

  useEffect(() => {
    setInputAmount('')
    if (currency[ChainId.ETHEREUM].isNative) setMinAmount(MIN_DEPOSIT_AMOUNT.NATIVE)
    else setMinAmount(MIN_DEPOSIT_AMOUNT[currency[ChainId.ETHEREUM].symbol])
  }, [currency])

  useEffect(() => {
    if (fromNetwork === toNetwork) {
      const index = SUPPORT_NETWORKS.findIndex((network) => network.chainId !== fromNetwork.chainId)
      if (index >= 0) {
        setToNetwork(SUPPORT_NETWORKS[index])
      } else {
        setToNetwork(undefined)
      }
    }
  }, [fromNetwork, toNetwork])

  /* useEffect(() => {
    if (fromNetwork === toNetwork) {
      const index = SUPPORT_NETWORKS.findIndex((network) => network.chainId !== toNetwork.chainId)
      if (index >= 0) {
        setFromNetwork(SUPPORT_NETWORKS[index])
      } else {
        setFromNetwork(undefined)
      }
    }
  }, [toNetwork]) */

  useEffect(() => {
    if (!inputAmount || !parseFloat(inputAmount)) {
      setOutputAmount('')
      return
    }
    let amount = new BigNumber(parseFloat(inputAmount))
    amount = amount.minus(amount.multipliedBy(BRIDGE_FEE))
    setOutputAmount(amount.toString())
  }, [inputAmount])

  return (
    <Wrapper style={{ minHeight: '412px', width: '100%' }}>
      <Card style={{ width: '100%', height: '100%' }}>
        <FlexGap flexDirection="column" p={isMobile ? 10 : 24} height="100%" gap="12px">
          <FlexGap gap="8px" alignItems="center">
            <Text fontSize={isMobile ? 16 : 20}>Select Token: </Text>
            <CurrencySelect currency={currency} setCurrency={setCurrency} />

            {/* <Flex justifyContent="end" flexDirection="column" flexGrow={1}>
              <Text textAlign="right" color="secondary" fontSize="12px">
                Bridge Contract
              </Text>
              <Flex justifyContent="end" alignItems="center">
                {formatAmount(formatEther(toEthMax))} ETH
                <Text textAlign="right" color="secondary" fontSize="12px">
                  Bridge Contract
                </Text>
                <IconButton
                  href={getBlockExploreLink(BRIDGE_CONTRACT[toNetwork.chainId].address, 'address', toNetwork.chainId)}
                  as={Link}
                  target="_blank"
                  scale="xs"
                >
                  <OpenNewIcon color="textSubtle" width="18px" />
                </IconButton>
              </Flex>
            </Flex> */}
          </FlexGap>

          <BlockBox mt={12}>
            <Flex justifyContent="space-between">
              <Text fontSize={14} color="secondary">
                From
              </Text>
              <Text fontSize={14} color="secondary">
                Balance:{' '}
                {currency[fromNetwork.chainId].isNative
                  ? Number(formattedFromEth.toFixed(6))
                  : Number(formattedFrom.toFixed(6))}
              </Text>
            </Flex>
            <Flex justifyContent="space-between" mt="12px">
              <NetworkSelect network={fromNetwork} setNetwork={setFromNetwork} />
              <Flex alignItems="center">
                <InputAmount
                  placeholder={`at least ${minAmount}`}
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                />
                <Max ml={1} onClick={handleMax}>
                  Max
                </Max>
              </Flex>
            </Flex>
          </BlockBox>
          <BlockBox>
            <Flex justifyContent="space-between">
              <Text fontSize={14} color="secondary">
                To
              </Text>
              <Text fontSize={14} color="secondary">
                Balance:{' '}
                {currency[toNetwork.chainId].isNative
                  ? Number(formattedToEth.toFixed(6))
                  : Number(formattedTo.toFixed(6))}
              </Text>
            </Flex>
            <Flex justifyContent="space-between" mt="12px">
              <NetworkSelect network={toNetwork} setNetwork={setToNetwork} />
              <InputAmount placeholder="0" value={outputAmount} readOnly />
            </Flex>
          </BlockBox>
          <BlockBox>
            <Flex justifyContent="space-between" alignItems="center">
              <InputReceiver
                placeholder="Receiver"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value as `0x${string}`)}
              />
            </Flex>
          </BlockBox>

          <Button
            mt={12}
            onClick={handleDeposit}
            disabled={loading || Number(inputAmount) < minAmount || approvalToken === ApprovalState.PENDING}
          >
            {approvalToken === ApprovalState.NOT_APPROVED || approvalToken === ApprovalState.PENDING
              ? 'Approve'
              : 'Deposit '}
            {(loading || approvalToken === ApprovalState.PENDING) && <Dots />}
          </Button>
        </FlexGap>
      </Card>
    </Wrapper>
  )
}
