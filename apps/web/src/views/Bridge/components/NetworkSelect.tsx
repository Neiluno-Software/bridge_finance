import { Flex, FlexGap, Text, ChevronDownIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useState } from 'react'
import { ChainLogo } from 'components/Logo/ChainLogo'

const NetworkWrapper = styled(Flex)`
  background: transparent; //${({ theme }) => theme.colors.backgroundAlt2};
  padding: 8px 12px;
  border-radius: 8px;
  gap: 8px;
  transition: 0.2s background;
  cursor: pointer;
  position: relative;
  min-width: 160px;
  &:hover {
    background: #2f2f2f;
  }
  @media screen and (max-width: 499px) {
    min-width: 145px;
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
const NetworkItem = styled(Flex)`
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

export default function NetworkSelect({ network, setNetwork }) {
  const [open, setOpen] = useState(false)

  const handleChangeNetwork = (newNetwork) => {
    setNetwork(newNetwork)
    setOpen(false)
  }

  return (
    <NetworkWrapper>
      <FlexGap gap="4px" width="100%" onClick={() => setOpen(true)}>
        <ChainLogo chainId={network.chainId} />
        <Text width="100%">{network.chainName}</Text>
        <ChevronDownIcon />
      </FlexGap>

      {/* {open && (
        <>
          <Overlay onClick={() => setOpen(false)} />
          <DropdownMenu>
            {SUPPORT_NETWORKS.map((_network) => (
              <NetworkItem
                className={_network === network ? 'active' : ''}
                onClick={() => handleChangeNetwork(_network)}
              >
                <ChainLogo chainId={_network.chainId} />
                <Text>{_network.chainName}</Text>
              </NetworkItem>
            ))}
          </DropdownMenu>
        </>
      )} */}
    </NetworkWrapper>
  )
}
