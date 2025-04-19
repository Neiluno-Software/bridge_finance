import React from 'react'
import { CHAIN_IDS } from 'utils/wagmi'
import Bridge from '../views/Bridge'

const IndexPage = () => {
  return <Bridge />
}

IndexPage.chains = CHAIN_IDS

export default IndexPage
