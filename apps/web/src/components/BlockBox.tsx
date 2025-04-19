import { Box } from '@pancakeswap/uikit'
import styled from 'styled-components'

const BlockBox = styled(Box)`
  border-radius: 20px;
  padding: 20px;
  background: #202020;
  @media screen and (max-width: 499px) {
    padding: 15px;
  }
`

export default BlockBox
