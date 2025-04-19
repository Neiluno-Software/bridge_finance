import { ChevronDownIcon, Flex, FlexGap, Text } from '@pancakeswap/uikit'
import { CurrencyLogo } from 'components/Logo'
import styled from 'styled-components'
import { ChainId } from '@pancakeswap/chains'
import { useState } from 'react'
import { SUPPORT_TOKENS } from '../config'

const CurrencyWrapper = styled(Flex)`
  background: #202020; //${({ theme }) => theme.colors.backgroundAlt};
  padding: 8px 12px;
  border-radius: 8px;
  gap: 8px;
  transition: 0.3s background;
  cursor: pointer;
  position: relative;
  &:hover {
    background: #2f2f2f;
  }
`
const DropdownMenu = styled(Flex)`
  flex-direction: column;
  position: absolute;
  top: 42px;
  left: 0px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  box-shadow: 0px 0px 4px #ffffff40;
  width: 200px;
  padding: 8px 0px;
  border-radius: 8px;
  z-index: 2;
`
const CurrencyItem = styled(Flex)`
  padding: 8px;
  gap: 4px;
  &:hover {
    background: ${({ theme }) => theme.colors.backgroundAlt3};
  }
  &.active {
    background: ${({ theme }) => theme.colors.backgroundAlt2};
  }
`
const Overlay = styled.div`
  background: transparent;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`

export default function CurrencySelect({ currency, setCurrency }) {
  const [open, setOpen] = useState(false)

  const handleChangeCurrency = (newCurrency) => {
    setCurrency(newCurrency)
    setOpen(false)
  }

  return (
    <CurrencyWrapper>
      <FlexGap gap="8px" onClick={() => setOpen(true)}>
        <CurrencyLogo currency={currency[ChainId.ORB3]} />
        <Text>{currency[ChainId.ORB3]?.symbol}</Text>
        <ChevronDownIcon />
      </FlexGap>

      {open && (
        <>
          <Overlay onClick={() => setOpen(false)} />
          <DropdownMenu>
            {SUPPORT_TOKENS.map((token) => (
              <CurrencyItem className={token === currency ? 'active' : ''} onClick={() => handleChangeCurrency(token)}>
                <CurrencyLogo currency={token[ChainId.ORB3]} />
                <Text>{token[ChainId.ORB3].symbol}</Text>
              </CurrencyItem>
            ))}
          </DropdownMenu>
        </>
      )}
    </CurrencyWrapper>
  )
}
