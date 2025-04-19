import React from 'react'
import Page from 'components/Layout/Page'

import { StyledBridgeContainer } from './styles'
import BridgeHistory from './components/BridgeHistory'

export default function History() {
  return (
    <Page>
      <StyledBridgeContainer>
        <BridgeHistory />
      </StyledBridgeContainer>
    </Page>
  )
}
