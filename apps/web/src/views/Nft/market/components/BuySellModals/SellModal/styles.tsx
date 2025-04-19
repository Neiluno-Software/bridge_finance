import { Box, EthChainIcon, Flex, Input, Modal, Text } from '@pancakeswap/uikit'
import { useETHPrice } from 'hooks/useETHPrice'
import { styled } from 'styled-components'
import { SellingStage } from './types'

export const stagesWithBackButton = [
  SellingStage.SET_PRICE,
  SellingStage.ADJUST_PRICE,
  SellingStage.APPROVE_AND_CONFIRM_SELL,
  SellingStage.CONFIRM_ADJUST_PRICE,
  SellingStage.REMOVE_FROM_MARKET,
  SellingStage.CONFIRM_REMOVE_FROM_MARKET,
  SellingStage.TRANSFER,
  SellingStage.CONFIRM_TRANSFER,
]

export const StyledModal = styled(Modal)<{ stage: SellingStage }>`
  min-width: 380px;
  & > div:last-child {
    padding: 0;
  }
  & h2:first-of-type {
    ${({ stage, theme }) => (stagesWithBackButton.includes(stage) ? `color: ${theme.colors.textSubtle}` : null)};
  }
  & svg:first-of-type {
    ${({ stage, theme }) => (stagesWithBackButton.includes(stage) ? `fill: ${theme.colors.textSubtle}` : null)};
  }
`

export const GreyedOutContainer = styled(Box)`
  background-color: ${({ theme }) => theme.colors.cardBorder};
  padding: 16px;
`

export const RightAlignedInput = styled(Input)`
  text-align: right;
  border-bottom: 1px solid;
  border-color: ${({ theme }) => theme.colors.primary};
`

interface EthAmountCellProps {
  ethAmount: number
}

export const EthAmountCell: React.FC<React.PropsWithChildren<EthAmountCellProps>> = ({ ethAmount }) => {
  const ethPrice = useETHPrice()
  if (!ethAmount || ethAmount === 0) {
    return (
      <Flex alignItems="center" justifyContent="flex-end">
        <EthChainIcon width={16} height={16} mr="4px" />
        <Text bold mr="4px">
          -
        </Text>
      </Flex>
    )
  }
  const usdAmount = ethPrice.multipliedBy(ethAmount).toNumber()
  return (
    <Flex alignItems="center" justifyContent="flex-end">
      <EthChainIcon width={16} height={16} mr="4px" />
      <Text bold mr="4px">{`${ethAmount.toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })}`}</Text>
      <Text small color="textSubtle" textAlign="right">
        {`($${usdAmount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })})`}
      </Text>
    </Flex>
  )
}

interface FeeAmountCellProps {
  ethAmount: number
  creatorFee: number
  tradingFee: number
}

export const FeeAmountCell: React.FC<React.PropsWithChildren<FeeAmountCellProps>> = ({
  ethAmount,
  creatorFee,
  tradingFee,
}) => {
  if (!ethAmount || ethAmount === 0) {
    return (
      <Flex alignItems="center" justifyContent="flex-end">
        <EthChainIcon width={16} height={16} mr="4px" />
        <Text bold mr="4px">
          -
        </Text>
      </Flex>
    )
  }

  const totalFee = creatorFee + tradingFee
  const totalFeeAsDecimal = totalFee / 100
  const feeAmount = ethAmount * totalFeeAsDecimal
  return (
    <Flex alignItems="center" justifyContent="flex-end">
      <EthChainIcon width={16} height={16} mr="4px" />
      <Text bold mr="4px">{`${feeAmount.toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 6,
      })}`}</Text>
      <Text small color="textSubtle" textAlign="right">
        ({totalFee}%)
      </Text>
    </Flex>
  )
}
