import { Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const StyledBridgeContainer = styled(Flex)`
  width: 100%;
  max-width: 480px;
  height: fit-content;
  margin: auto;
  margin-top: 80px;
  @media screen and (max-width: 360px) {
    margin-top: 0px;
  }
`
