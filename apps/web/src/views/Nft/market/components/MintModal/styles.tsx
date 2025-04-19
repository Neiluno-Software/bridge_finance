import { Box, EthChainIcon, Flex, Grid, Input, Modal, Text } from '@pancakeswap/uikit'
import { useETHPrice } from 'hooks/useETHPrice'
import { styled } from 'styled-components'

export const StyledModal = styled(Modal)`
  min-width: 380px;
  & > div:last-child {
    padding: 0;
  }
`

export const GreyedOutContainer = styled(Box)`
  background-color: ${({ theme }) => theme.colors.cardBorder};
  padding: 16px;
`

export const BorderedBox = styled(Grid)`
  margin: 16px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.default};
  grid-template-columns: 1fr;
  grid-row-gap: 8px;
`

export const RightAlignedInput = styled(Input)`
  text-align: right;
  border-bottom: 1px solid;
  border-color: ${({ theme }) => theme.colors.primary};
  width: 120px;
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
