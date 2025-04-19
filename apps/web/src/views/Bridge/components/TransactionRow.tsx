import { useTranslation } from '@pancakeswap/localization'
import {
  AutoColumn,
  Flex,
  FlexGap,
  Grid,
  InjectedModalProps,
  Modal,
  Text,
  useModal,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { formatUnits } from '@pancakeswap/utils/viem/formatUnits'
import { CurrencyLogo } from '@pancakeswap/widgets-internal'
import { useCurrency } from 'hooks/Tokens'
import useNativeCurrency from 'hooks/useNativeCurrency'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getBlockExploreLink } from 'utils'
import { getToTokenDecimal } from '../hooks'

const Row = styled(Grid)`
  grid-template-columns: 1fr 100px 80px;
  padding: 6px 0;
  align-items: center;
`

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

interface Props extends InjectedModalProps {
  data: any
}

const TransactionModal: React.FC<React.PropsWithChildren<Props>> = ({ data, onDismiss }) => {
  const { t } = useTranslation()

  const currency = useCurrency(data.token)
  const nativeCurrency = useNativeCurrency()
  const [depositAmount, setDepositAmount] = useState(0)
  const [withdrawAmount, setWithdrawAmount] = useState(0)

  const [time, setTime] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
  })

  useEffect(() => {
    if (!data) return
    const decimals = (data.token === ZERO_ADDRESS ? nativeCurrency.decimals : currency?.decimals) || 18

    setDepositAmount(parseFloat(formatUnits(data.deposit_amount, decimals)))

    let date = new Date(data.createdAt)
    if (data.status === 1) {
      setWithdrawAmount(
        parseFloat(formatUnits(data.withdraw_amount, getToTokenDecimal(data.token, data.from_chain, data.to_chain))),
      )
      date = new Date(data.updatedAt)
    }

    const current = Date.now()
    const period = getTimePeriods(Math.floor((current - date.getTime()) / 1000))
    setTime(period)
  }, [data])

  return (
    <Modal title={t('Transaction Info')} onDismiss={onDismiss}>
      <AutoColumn gap="lg">
        <AutoColumn gap="md">
          <Flex justifyContent="space-between">
            <Text>Deposit Amount:</Text>
            <Text>
              {Number(depositAmount.toFixed(4))}
              {data.token === ZERO_ADDRESS ? nativeCurrency.symbol : currency?.symbol}
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Bridge Fee:</Text>
            <Text>
              {data.status === 0 ? '-' : Number((depositAmount - withdrawAmount).toFixed(4))}
              {data.token === ZERO_ADDRESS ? nativeCurrency.symbol : currency?.symbol}
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Transfer Amount:</Text>
            <Text>
              {data.status === 0 ? '-' : Number(withdrawAmount.toFixed(4))}
              {data.token === ZERO_ADDRESS ? nativeCurrency.symbol : currency?.symbol}
            </Text>
          </Flex>
        </AutoColumn>
        <AutoColumn gap="lg">
          <Link
            href={
              data.status === 0
                ? getBlockExploreLink(data.deposit_tx, 'transaction', data.from_chain)
                : getBlockExploreLink(data.withdraw_tx, 'transaction', data.to_chain)
            }
            target="_blank"
          >
            <Text textAlign="right" fontSize="12px">
              {'View On Explorer ->'}
            </Text>
          </Link>
        </AutoColumn>
      </AutoColumn>
    </Modal>
  )
}

export default function TransactionRow({ data }) {
  const { isMobile } = useMatchBreakpoints()
  const currency = useCurrency(data.token)
  const nativeCurrency = useNativeCurrency()
  const receiverEllipsis = data.receiver
    ? `${data.receiver.substring(0, 4)}...${data.receiver.substring(data.receiver.length - 4)}`
    : null

  const [amount, setAmount] = useState(0)
  const [time, setTime] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
  })

  const [onDetailModal] = useModal(<TransactionModal data={data} />)

  useEffect(() => {
    if (!data) return
    const decimals = (data.token === ZERO_ADDRESS ? nativeCurrency.decimals : currency?.decimals) || 18
    if (data.status === 0) {
      setAmount(parseFloat(formatUnits(data.deposit_amount, decimals)))
      const date = new Date(data.createdAt)
      const current = Date.now()
      const period = getTimePeriods(Math.floor((current - date.getTime()) / 1000))
      setTime(period)
    } else {
      setAmount(
        parseFloat(formatUnits(data.withdraw_amount, getToTokenDecimal(data.token, data.from_chain, data.to_chain))),
      )
      const date = new Date(data.updatedAt)
      const current = Date.now()
      const period = getTimePeriods(Math.floor((current - date.getTime()) / 1000))
      setTime(period)
    }
  }, [data])

  return (
    <Row>
      <FlexGap alignItems="center" gap="4px">
        <CurrencyLogo currency={data.token === ZERO_ADDRESS ? nativeCurrency : currency} size="32px" />
        <Flex flexDirection="column">
          <Text fontSize={isMobile ? 14 : 16}>WITHDRAW {!isMobile && `to ${receiverEllipsis}`}</Text>
          <Text color="secondary" fontSize={isMobile ? 10 : 12}>
            {data.status === 0 ? 'In Progress' : 'Completed'}
          </Text>
        </Flex>
      </FlexGap>
      <Flex flexDirection="column">
        <Text fontSize={isMobile ? 14 : 16} textAlign={isMobile ? 'right' : 'left'}>
          {Number(amount.toFixed(3))}
          {data.token === ZERO_ADDRESS ? nativeCurrency.symbol : currency?.symbol}
        </Text>
        <Text color="secondary" fontSize="12px" textAlign={isMobile ? 'right' : 'left'}>
          {time.years > 0
            ? `${time.years} years ago`
            : time.months > 0
            ? `${time.months} months ago`
            : time.days > 0
            ? `${time.days} days ago`
            : time.hours > 0
            ? `${time.hours} hours ago`
            : time.minutes > 0
            ? `${time.minutes} minutes ago`
            : `${time.seconds} seconds ago`}
        </Text>
      </Flex>
      <Flex justifyContent="center">
        <Text color="primary" style={{ cursor: 'pointer' }} onClick={onDetailModal}>
          {'Info ->'}
        </Text>
      </Flex>
    </Row>
  )
}
