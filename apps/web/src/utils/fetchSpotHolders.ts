import { spotInfoClient } from "config/constants/blockspot"

const TOKEN_HOLDERS = (skip: number) => {
  const queryString = `
    query SpotHolders {
      userEntities(where: {amount_gt: "0"}, first: 100, skip: ${skip}) {
        id
        amount
      }
    }
  `
  return queryString
}

export const fetchSpotHolders = async (chainId) => {
  let totalHolders = 0
  let skip = 0
  while (1) {
    const result = await spotInfoClient[chainId].request(TOKEN_HOLDERS(skip))
    if (result && result.userEntities.length > 0) {
      totalHolders += result.userEntities.length
      skip += 100
    } else {
      break
    }
  }
  return totalHolders
}