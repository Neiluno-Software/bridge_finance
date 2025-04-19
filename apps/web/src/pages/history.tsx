import React from 'react'
import { CHAIN_IDS } from 'utils/wagmi'
import History from '../views/Bridge/history'

const HistoryPage = () => {
  return <History />
}

HistoryPage.chains = CHAIN_IDS

export default HistoryPage
