import React from 'react'
import { ChainId } from '@pancakeswap/sdk'
import { Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Page from 'components/Layout/Page'

import { StyledBridgeContainer } from './styles'
import BridgeForm from './components/BridgeForm'

export default function Bridge() {
  const { t } = useTranslation()

  return (
    <Page>
      {/* <Text fontSize={32} bold mb={24}>
        {t('Orb3 Bridge')}
      </Text> */}
      <StyledBridgeContainer>
        <BridgeForm />
      </StyledBridgeContainer>
    </Page>
  )
}
