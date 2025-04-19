export const baseNftFields = `
  tokenId
  metadataUrl
  currentAskPrice
  currentSeller
  latestTradedPriceInETH
  tradeVolumeETH
  totalTrades
  isTradable
  updatedAt
  otherId
  collection {
    id
  }
`

export const baseTransactionFields = `
  id
  block
  timestamp
  askPrice
  netPrice
  withETH
  buyer {
    id
  }
  seller {
    id
  }
`

export const collectionBaseFields = `
  id
  name
  symbol
  active
  totalTrades
  totalVolumeETH
  numberTokensListed
  creatorAddress
  tradingFee
  creatorFee
  whitelistChecker
`
