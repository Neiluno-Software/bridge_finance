import { ChainId } from '@pancakeswap/chains'
import { formatBigInt } from '@pancakeswap/utils/formatBalance'
import { erc721CollectionABI } from 'config/abi/erc721collection'
import { nftMarketABI } from 'config/abi/nftMarket'
import { NOT_ON_SALE_SELLER } from 'config/constants'
import { API_NFT, GRAPH_API_NFTMARKET } from 'config/constants/endpoints'
import { COLLECTIONS_WITH_WALLET_OF_OWNER } from 'config/constants/nftsCollections'
import { gql, request } from 'graphql-request'
import fromPairs from 'lodash/fromPairs'
import groupBy from 'lodash/groupBy'
import pickBy from 'lodash/pickBy'
import range from 'lodash/range'
import lodashSize from 'lodash/size'
import { stringify } from 'querystring'
import { safeGetAddress } from 'utils'
import { getNftMarketAddress } from 'utils/addressHelpers'
import { getNftMarketContract } from 'utils/contractHelpers'
import { publicClient } from 'utils/wagmi'
import { Address } from 'wagmi'
import { baseNftFields, baseTransactionFields, collectionBaseFields } from './queries'
import {
  ApiCollection,
  ApiCollections,
  ApiCollectionsResponse,
  ApiResponseCollectionTokens,
  ApiResponseSpecificToken,
  ApiSingleTokenData,
  ApiTokenFilterResponse,
  AskOrder,
  AskOrderType,
  Collection,
  CollectionMarketDataBaseFields,
  MarketEvent,
  NftActivityFilter,
  NftAttribute,
  NftLocation,
  NftToken,
  TokenIdWithCollectionAddress,
  TokenMarketData,
  Transaction,
  UserActivity,
} from './types'

/**
 * API HELPERS
 */

/**
 * Fetch static data from all collections using the API
 * @returns
 */
export const getCollectionsApi = async (): Promise<ApiCollectionsResponse> => {
  const res = await fetch(`${API_NFT}/collections`)
  if (res.ok) {
    const json = await res.json()
    return json
  }
  console.error('Failed to fetch NFT collections', res.statusText)
  return null
}

const fetchCollectionsTotalSupply = async (collections: ApiCollection[]): Promise<number[]> => {
  const totalSupplyCalls = collections
    .filter((collection) => collection?.address)
    .map(
      (collection) =>
        ({
          abi: erc721CollectionABI,
          address: collection.address as Address,
          functionName: 'totalSupply',
        } as const),
    )
  if (totalSupplyCalls.length > 0) {
    const client = publicClient({ chainId: ChainId.BSC })
    const totalSupplyRaw = await client.multicall({
      contracts: totalSupplyCalls,
    })

    const totalSupply = totalSupplyRaw.map((r) => r.result)
    return totalSupply.map((totalCount) => (totalCount ? Number(totalCount) : 0))
  }
  return []
}

/**
 * Fetch all collections data by combining data from the API (static metadata) and the Subgraph (dynamic market data)
 */
export const getCollections = async (): Promise<Record<string, Collection>> => {
  try {
    const [collections, collectionsMarket] = await Promise.all([getCollectionsApi(), getCollectionsSg()])
    const collectionApiData: ApiCollection[] = collections?.data ?? []
    let collectionsTotalSupply
    try {
      collectionsTotalSupply = await fetchCollectionsTotalSupply(collectionApiData)
    } catch (error) {
      console.error('on chain fetch collections total supply error', error)
    }
    const collectionApiDataCombinedOnChain = collectionApiData.map((collection, index) => {
      const totalSupplyFromApi = Number(collection?.totalSupply) || 0
      const totalSupplyFromOnChain = collectionsTotalSupply[index]
      return {
        ...collection,
        totalSupply: Math.max(totalSupplyFromApi, totalSupplyFromOnChain).toString(),
      }
    })

    return combineCollectionData(collectionApiDataCombinedOnChain, collectionsMarket)
  } catch (error) {
    console.error('Unable to fetch data:', error)
    return null
  }
}

/**
 * Fetch collection data by combining data from the API (static metadata) and the Subgraph (dynamic market data)
 */
export const getCollection = async (collectionAddress: string): Promise<Record<string, Collection> | null> => {
  try {
    const [collection, collectionMarket] = await Promise.all([
      getCollectionApi(collectionAddress),
      getCollectionSg(collectionAddress),
    ])
    let collectionsTotalSupply
    try {
      collectionsTotalSupply = await fetchCollectionsTotalSupply([collection])
    } catch (error) {
      console.error('on chain fetch collections total supply error', error)
    }
    const totalSupplyFromApi = Number(collection?.totalSupply) || 0
    const totalSupplyFromOnChain = collectionsTotalSupply?.[0]
    const collectionApiDataCombinedOnChain = {
      ...collection,
      totalSupply: Math.max(totalSupplyFromApi, totalSupplyFromOnChain).toString(),
    }

    return combineCollectionData([collectionApiDataCombinedOnChain], [collectionMarket])
  } catch (error) {
    console.error('Unable to fetch data:', error)
    return null
  }
}

/**
 * Fetch static data from a collection using the API
 * @returns
 */
export const getCollectionApi = async (collectionAddress: string): Promise<ApiCollection> => {
  const res = await fetch(`${API_NFT}/collections/${collectionAddress}`)
  if (res.ok) {
    const json = await res.json()
    return json.data
  }
  console.error(`API: Failed to fetch NFT collection ${collectionAddress}`, res.statusText)
  return null
}

/**
 * Fetch static data for all nfts in a collection using the API
 * @param collectionAddress
 * @param size
 * @param page
 * @returns
 */
export const getNftsFromCollectionApi = async (
  collectionAddress: string,
  size = 100,
  page = 1,
): Promise<ApiResponseCollectionTokens> => {
  const requestPath = `${API_NFT}/collections/${collectionAddress}/tokens${`?page=${page}&size=${size}`}`

  try {
    const res = await fetch(requestPath)
    if (res.ok) {
      const data = await res.json()
      const filteredAttributesDistribution = pickBy(data.attributesDistribution, Boolean)
      const filteredData = pickBy(data.data, Boolean)
      const filteredTotal = lodashSize(filteredData)
      return {
        ...data,
        total: filteredTotal,
        attributesDistribution: filteredAttributesDistribution,
        data: filteredData,
      }
    }
    console.error(`API: Failed to fetch NFT tokens for ${collectionAddress} collection`, res.statusText)
    return null
  } catch (error) {
    console.error(`API: Failed to fetch NFT tokens for ${collectionAddress} collection`, error)
    return null
  }
}

/**
 * Fetch a single NFT using the API
 * @param collectionAddress
 * @param tokenId
 * @returns NFT from API
 */
export const getNftApi = async (
  collectionAddress: string,
  tokenId: string,
): Promise<ApiResponseSpecificToken['data']> => {
  const res = await fetch(`${API_NFT}/collections/${collectionAddress}/tokens/${tokenId}`)
  if (res.ok) {
    const json = await res.json()
    return json.data
  }

  console.error(`API: Can't fetch NFT token ${tokenId} in ${collectionAddress}`, res.status)
  return null
}

/**
 * Fetch a list of NFT from different collections
 * @param from Array of { collectionAddress: string; tokenId: string }
 * @returns Array of NFT from API
 */
export const getNftsFromDifferentCollectionsApi = async (
  from: { collectionAddress: string; tokenId: string }[],
): Promise<NftToken[]> => {
  const promises = from.map((nft) => getNftApi(nft.collectionAddress as Address, nft.tokenId))
  const responses = await Promise.all(promises)
  // Sometimes API can't find some tokens (e.g. 404 response)
  // at least return the ones that returned successfully
  return responses
    .filter((resp) => resp)
    .map((res, index) => ({
      tokenId: res.tokenId,
      name: res.name,
      collectionName: res.collection.name,
      collectionAddress: from[index].collectionAddress as Address,
      description: res.description,
      attributes: res.attributes,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
      image: res.image,
    }))
}

/**
 * SUBGRAPH HELPERS
 */

/**
 * Fetch market data from a collection using the Subgraph
 * @returns
 */
export const getCollectionSg = async (collectionAddress: string): Promise<CollectionMarketDataBaseFields> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getCollectionData($collectionAddress: String!) {
          collection(id: $collectionAddress) {
            ${collectionBaseFields}
          }
        }
      `,
      { collectionAddress: collectionAddress.toLowerCase() },
    )
    return res.collection
  } catch (error) {
    console.error('Failed to fetch collection', error)
    return null
  }
}

/**
 * Fetch market data from all collections using the Subgraph
 * @returns
 */
export const getCollectionsSg = async (): Promise<CollectionMarketDataBaseFields[]> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        {
          collections {
            ${collectionBaseFields}
          }
        }
      `,
    )
    return res.collections
  } catch (error) {
    console.error('Failed to fetch NFT collections', error)
    return []
  }
}

/**
 * Fetch market data for nfts in a collection using the Subgraph
 * @param collectionAddress
 * @param first
 * @param skip
 * @returns
 */
export const getNftsFromCollectionSg = async (
  collectionAddress: string,
  first = 1000,
  skip = 0,
): Promise<TokenMarketData[]> => {
  // Squad to be sorted by tokenId as this matches the order of the paginated API return. For PBs - get the most recent,
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getNftCollectionMarketData($collectionAddress: String!) {
          collection(id: $collectionAddress) {
            id
            nfts(orderBy:${'tokenId'}, skip: $skip, first: $first) {
             ${baseNftFields}
            }
          }
        }
      `,
      { collectionAddress: collectionAddress.toLowerCase(), skip, first },
    )
    return res.collection.nfts
  } catch (error) {
    console.error('Failed to fetch NFTs from collection', error)
    return []
  }
}

/**
 * Fetch market data for PancakeBunnies NFTs by bunny id using the Subgraph
 * @param bunnyId - bunny id to query
 * @param existingTokenIds - tokens that are already loaded into redux
 * @returns
 */
export const getMarketDataForTokenIds = async (
  collectionAddress: string,
  existingTokenIds: string[],
): Promise<TokenMarketData[]> => {
  try {
    if (existingTokenIds.length === 0) {
      return []
    }
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getMarketDataForTokenIds($collectionAddress: String!, $where: NFT_filter) {
          collection(id: $collectionAddress) {
            id
            nfts(first: 1000, where: $where) {
              ${baseNftFields}
            }
          }
        }
      `,
      {
        collectionAddress: collectionAddress.toLowerCase(),
        where: { tokenId_in: existingTokenIds },
      },
    )
    return res.collection.nfts
  } catch (error) {
    console.error(`Failed to fetch market data for NFTs stored tokens`, error)
    return []
  }
}

export const getNftsOnChainMarketData = async (
  collectionAddress: Address,
  tokenIds: string[],
): Promise<TokenMarketData[]> => {
  try {
    const nftMarketContract = getNftMarketContract()
    const response = await nftMarketContract.read.viewAsksByCollectionAndTokenIds([
      collectionAddress,
      tokenIds.map((t) => BigInt(t)),
    ])
    const askInfo = response[1]

    if (!askInfo) return []

    return askInfo
      .map((tokenAskInfo, index) => {
        if (!tokenAskInfo.seller || !tokenAskInfo.price) return null
        const currentSeller = tokenAskInfo.seller
        const isTradable = currentSeller.toLowerCase() !== NOT_ON_SALE_SELLER
        const currentAskPrice = tokenAskInfo.price && formatBigInt(tokenAskInfo.price)

        return {
          collection: { id: collectionAddress.toLowerCase() },
          tokenId: tokenIds[index],
          currentSeller,
          isTradable,
          currentAskPrice,
        }
      })
      .filter(Boolean)
  } catch (error) {
    console.error('Failed to fetch NFTs onchain market data', error)
    return []
  }
}

export const getNftsUpdatedMarketData = async (
  collectionAddress: Address,
  tokenIds: string[],
): Promise<{ tokenId: string; currentSeller: string; currentAskPrice: bigint; isTradable: boolean }[]> => {
  try {
    const nftMarketContract = getNftMarketContract()
    const response = await nftMarketContract.read.viewAsksByCollectionAndTokenIds([
      collectionAddress,
      tokenIds.map((t) => BigInt(t)),
    ])
    const askInfo = response?.[1]

    if (!askInfo) return null

    return askInfo.map((tokenAskInfo, index) => {
      const isTradable = tokenAskInfo.seller ? tokenAskInfo.seller.toLowerCase() !== NOT_ON_SALE_SELLER : false

      return {
        tokenId: tokenIds[index],
        currentSeller: tokenAskInfo.seller,
        isTradable,
        currentAskPrice: tokenAskInfo.price,
      }
    })
  } catch (error) {
    console.error('Failed to fetch updated NFT market data', error)
    return null
  }
}

export const getAccountNftsOnChainMarketData = async (
  collections: ApiCollections,
  account: Address,
): Promise<TokenMarketData[]> => {
  try {
    const nftMarketAddress = getNftMarketAddress()
    const collectionList = Object.values(collections)

    const call = collectionList.map((collection) => {
      const { address: collectionAddress } = collection
      return {
        abi: nftMarketABI,
        address: nftMarketAddress,
        functionName: 'viewAsksByCollectionAndSeller',
        args: [collectionAddress, account, 0n, 1000n] as const,
      } as const
    })

    const askCallsResultsRaw = await publicClient({ chainId: ChainId.ORB3 }).multicall({
      contracts: call,
      allowFailure: false,
    })

    const askCallsResults = askCallsResultsRaw
      .map((askCallsResultRaw, askCallIndex) => {
        const askCallsResult = {
          tokenIds: askCallsResultRaw?.[0],
          askInfo: askCallsResultRaw?.[1],
        }
        if (!askCallsResult?.tokenIds || !askCallsResult?.askInfo || !collectionList[askCallIndex]?.address) return null
        return askCallsResult.tokenIds
          .map((tokenId, tokenIdIndex) => {
            if (!tokenId || !askCallsResult.askInfo[tokenIdIndex] || !askCallsResult.askInfo[tokenIdIndex].price)
              return null

            const currentAskPrice = formatBigInt(askCallsResult.askInfo[tokenIdIndex].price)

            return {
              collection: { id: collectionList[askCallIndex].address.toLowerCase() as Address },
              tokenId: tokenId.toString(),
              account,
              isTradable: true,
              currentAskPrice,
            }
          })
          .filter(Boolean)
      })
      .flat()
      .filter(Boolean)

    // @ts-ignore FIXME: wagmi
    return askCallsResults
  } catch (error) {
    console.error('Failed to fetch NFTs onchain market data', error)
    return []
  }
}

export const getNftsMarketData = async (
  where = {},
  first = 1000,
  orderBy = 'id',
  orderDirection: 'asc' | 'desc' = 'desc',
  skip = 0,
): Promise<TokenMarketData[]> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getNftsMarketData($first: Int, $skip: Int!, $where: NFT_filter, $orderBy: NFT_orderBy, $orderDirection: OrderDirection) {
          nfts(where: $where, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, skip: $skip) {
            ${baseNftFields}
            transactionHistory {
              ${baseTransactionFields}
            }
          }
        }
      `,
      { where, first, skip, orderBy, orderDirection },
    )

    return res.nfts
  } catch (error) {
    console.error('Failed to fetch NFTs market data', error)
    return []
  }
}

export const getAllPancakeBunniesLowestPrice = async (bunnyIds: string[]): Promise<Record<string, number>> => {
  try {
    const singlePancakeBunnySubQueries = bunnyIds.map(
      (
        bunnyId,
      ) => `b${bunnyId}:nfts(first: 1, where: { otherId: ${bunnyId}, isTradable: true }, orderBy: currentAskPrice, orderDirection: asc) {
        currentAskPrice
      }
    `,
    )
    const rawResponse: Record<string, { currentAskPrice: string }[]> = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getAllPancakeBunniesLowestPrice {
          ${singlePancakeBunnySubQueries}
        }
      `,
    )
    return fromPairs(
      Object.keys(rawResponse).map((subQueryKey) => {
        const bunnyId = subQueryKey.split('b')[1]
        return [
          bunnyId,
          rawResponse[subQueryKey].length > 0 ? parseFloat(rawResponse[subQueryKey][0].currentAskPrice) : Infinity,
        ]
      }),
    )
  } catch (error) {
    console.error('Failed to fetch PancakeBunnies lowest prices', error)
    return {}
  }
}

export const getAllPancakeBunniesRecentUpdatedAt = async (bunnyIds: string[]): Promise<Record<string, number>> => {
  try {
    const singlePancakeBunnySubQueries = bunnyIds.map(
      (
        bunnyId,
      ) => `b${bunnyId}:nfts(first: 1, where: { otherId: ${bunnyId}, isTradable: true }, orderBy: updatedAt, orderDirection: desc) {
        updatedAt
      }
    `,
    )
    const rawResponse: Record<string, { updatedAt: string }[]> = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getAllPancakeBunniesLowestPrice {
          ${singlePancakeBunnySubQueries}
        }
      `,
    )
    return fromPairs(
      Object.keys(rawResponse).map((subQueryKey) => {
        const bunnyId = subQueryKey.split('b')[1]
        return [
          bunnyId,
          rawResponse[subQueryKey].length > 0 ? Number(rawResponse[subQueryKey][0].updatedAt) : -Infinity,
        ]
      }),
    )
  } catch (error) {
    console.error('Failed to fetch PancakeBunnies latest market updates', error)
    return {}
  }
}

/**
 * Returns the lowest/highest price of any NFT in a collection
 */
export const getLeastMostPriceInCollection = async (
  collectionAddress: string,
  orderDirection: 'asc' | 'desc' = 'asc',
) => {
  try {
    const response = await getNftsMarketData(
      { collection: collectionAddress.toLowerCase(), isTradable: true },
      1,
      'currentAskPrice',
      orderDirection,
    )

    if (response.length === 0) {
      return 0
    }

    const [nftSg] = response
    return parseFloat(nftSg.currentAskPrice)
  } catch (error) {
    console.error(`Failed to lowest price NFTs in collection ${collectionAddress}`, error)
    return 0
  }
}

/**
 * Fetch user trading data for buyTradeHistory, sellTradeHistory and askOrderHistory from the Subgraph
 * @param where a User_filter where condition
 * @returns a UserActivity object
 */
export const getUserActivity = async (address: string): Promise<UserActivity> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getUserActivity($address: String!) {
          user(id: $address) {
            buyTradeHistory(first: 250, orderBy: timestamp, orderDirection: desc) {
              ${baseTransactionFields}
              nft {
                ${baseNftFields}
              }
            }
            sellTradeHistory(first: 250, orderBy: timestamp, orderDirection: desc) {
              ${baseTransactionFields}
              nft {
                ${baseNftFields}
              }
            }
            askOrderHistory(first: 500, orderBy: timestamp, orderDirection: desc) {
              id
              block
              timestamp
              orderType
              askPrice
              nft {
                ${baseNftFields}
              }
            }
          }
        }
      `,
      { address },
    )

    return res.user || { askOrderHistory: [], buyTradeHistory: [], sellTradeHistory: [] }
  } catch (error) {
    console.error('Failed to fetch user Activity', error)
    return {
      askOrderHistory: [],
      buyTradeHistory: [],
      sellTradeHistory: [],
    }
  }
}

export const getCollectionActivity = async (
  address: string,
  nftActivityFilter: NftActivityFilter,
  itemPerQuery,
): Promise<{ askOrders?: AskOrder[]; transactions?: Transaction[] }> => {
  const getAskOrderEvent = (orderType: MarketEvent): AskOrderType => {
    switch (orderType) {
      case MarketEvent.CANCEL:
        return AskOrderType.CANCEL
      case MarketEvent.MODIFY:
        return AskOrderType.MODIFY
      case MarketEvent.NEW:
        return AskOrderType.NEW
      default:
        return AskOrderType.MODIFY
    }
  }

  const isFetchAllCollections = address === ''

  const hasCollectionFilter = nftActivityFilter.collectionFilters.length > 0

  const collectionFilterGql = !isFetchAllCollections
    ? `collection: ${JSON.stringify(address)}`
    : hasCollectionFilter
    ? `collection_in: ${JSON.stringify(nftActivityFilter.collectionFilters)}`
    : ``

  const askOrderTypeFilter = nftActivityFilter.typeFilters
    .filter((marketEvent) => marketEvent !== MarketEvent.SELL)
    .map((marketEvent) => getAskOrderEvent(marketEvent))

  const askOrderIncluded = nftActivityFilter.typeFilters.length === 0 || askOrderTypeFilter.length > 0

  const askOrderTypeFilterGql =
    askOrderTypeFilter.length > 0 ? `orderType_in: ${JSON.stringify(askOrderTypeFilter)}` : ``

  const transactionIncluded =
    nftActivityFilter.typeFilters.length === 0 ||
    nftActivityFilter.typeFilters.some(
      (marketEvent) => marketEvent === MarketEvent.BUY || marketEvent === MarketEvent.SELL,
    )

  let askOrderQueryItem = itemPerQuery / 2
  let transactionQueryItem = itemPerQuery / 2

  if (!askOrderIncluded || !transactionIncluded) {
    askOrderQueryItem = !askOrderIncluded ? 0 : itemPerQuery
    transactionQueryItem = !transactionIncluded ? 0 : itemPerQuery
  }

  const askOrderGql = askOrderIncluded
    ? `askOrders(first: ${askOrderQueryItem}, orderBy: timestamp, orderDirection: desc, where:{
            ${collectionFilterGql}, ${askOrderTypeFilterGql}
          }) {
              id
              block
              timestamp
              orderType
              askPrice
              seller {
                id
              }
              nft {
                ${baseNftFields}
              }
          }`
    : ``

  const transactionGql = transactionIncluded
    ? `transactions(first: ${transactionQueryItem}, orderBy: timestamp, orderDirection: desc, where:{
            ${collectionFilterGql}
          }) {
            ${baseTransactionFields}
              nft {
                ${baseNftFields}
              }
          }`
    : ``

  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getCollectionActivity {
          ${askOrderGql}
          ${transactionGql}
        }
      `,
    )

    return res || { askOrders: [], transactions: [] }
  } catch (error) {
    console.error('Failed to fetch collection Activity', error)
    return {
      askOrders: [],
      transactions: [],
    }
  }
}

export const getTokenActivity = async (
  tokenId: string,
  collectionAddress: string,
): Promise<{ askOrders: AskOrder[]; transactions: Transaction[] }> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getCollectionActivity($tokenId: BigInt!, $address: ID!) {
          nfts(where:{tokenId: $tokenId, collection: $address}) {
            transactionHistory(orderBy: timestamp, orderDirection: desc) {
              ${baseTransactionFields}
                nft {
                  ${baseNftFields}
                }
            }
            askHistory(orderBy: timestamp, orderDirection: desc) {
                id
                block
                timestamp
                orderType
                askPrice
                seller {
                  id
                }
                nft {
                  ${baseNftFields}
                }
            }
          }
        }
      `,
      { tokenId, address: collectionAddress },
    )

    if (res.nfts.length > 0) {
      return { askOrders: res.nfts[0].askHistory, transactions: res.nfts[0].transactionHistory }
    }
    return { askOrders: [], transactions: [] }
  } catch (error) {
    console.error('Failed to fetch token Activity', error)
    return {
      askOrders: [],
      transactions: [],
    }
  }
}

/**
 * Get the most recently listed NFTs
 * @param first Number of nfts to retrieve
 * @returns NftTokenSg[]
 */
export const getLatestListedNfts = async (first: number): Promise<TokenMarketData[]> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getLatestNftMarketData($first: Int) {
          nfts(where: { isTradable: true }, orderBy: updatedAt , orderDirection: desc, first: $first) {
            ${baseNftFields}
            collection {
              id
            }
          }
        }
      `,
      { first },
    )

    return res.nfts
  } catch (error) {
    console.error('Failed to fetch NFTs market data', error)
    return []
  }
}

/**
 * Filter NFTs from a collection
 * @param collectionAddress
 * @returns
 */
export const fetchNftsFiltered = async (
  collectionAddress: string,
  filters: Record<string, string | number>,
): Promise<ApiTokenFilterResponse> => {
  const res = await fetch(`${API_NFT}/collections/${collectionAddress}/filter?${stringify(filters)}`)

  if (res.ok) {
    const data = await res.json()
    return data
  }

  console.error(`API: Failed to fetch NFT collection ${collectionAddress}`, res.statusText)
  return null
}

/**
 * OTHER HELPERS
 */

export const getMetadataWithFallback = (apiMetadata: ApiResponseCollectionTokens['data'], bunnyId: string) => {
  // The fallback is just for the testnet where some bunnies don't exist
  return (
    apiMetadata[bunnyId] ?? {
      name: '',
      description: '',
      collection: { name: 'Orb3 Bunnies' },
      image: {
        original: '',
        thumbnail: '',
      },
    }
  )
}

export const getPancakeBunniesAttributesField = (bunnyId: string) => {
  // Generating attributes field that is not returned by API
  // but can be "faked" since objects are keyed with bunny id
  return [
    {
      traitType: 'bunnyId',
      value: bunnyId,
      displayType: null,
    },
  ]
}

export const fetchWalletTokenIdsForCollections = async (
  account: string,
  collections: ApiCollections,
): Promise<TokenIdWithCollectionAddress[]> => {
  const tokenOfOwnerByIndexCollections = Object.values(collections).filter(
    (c) => !COLLECTIONS_WITH_WALLET_OF_OWNER.includes(c.address),
  )
  const balanceOfCalls = tokenOfOwnerByIndexCollections.map((collection) => {
    const { address: collectionAddress } = collection
    return {
      abi: erc721CollectionABI,
      address: collectionAddress,
      functionName: 'balanceOf',
      args: [account as Address],
    } as const
  })

  const client = publicClient({ chainId: ChainId.ORB3 })

  const balanceOfCallsResultRaw = await client.multicall({
    contracts: balanceOfCalls,
    allowFailure: true,
  })

  const balanceOfCallsResult = balanceOfCallsResultRaw.map((r) => r.result)

  const tokenIdCalls = tokenOfOwnerByIndexCollections
    .map((collection, index) => {
      const balanceOf = balanceOfCallsResult[index] ? Number(balanceOfCallsResult[index]) : 0
      const { address: collectionAddress } = collection

      return range(balanceOf).map((tokenIndex) => {
        return {
          abi: erc721CollectionABI,
          address: collectionAddress,
          functionName: 'tokenOfOwnerByIndex',
          args: [account as Address, BigInt(tokenIndex)] as const,
        } as const
      })
    })
    .flat()

  const tokenIdResultRaw = await client.multicall({
    contracts: tokenIdCalls,
    allowFailure: true,
  })

  const tokenIdResult = tokenIdResultRaw.map((r) => r.result)
  const nftLocation = NftLocation.WALLET

  const walletNfts = tokenIdResult.reduce((acc, tokenIdBn, index) => {
    if (tokenIdBn) {
      const { address: collectionAddress } = tokenIdCalls[index]
      acc.push({ tokenId: tokenIdBn.toString(), collectionAddress, nftLocation })
    }
    return acc
  }, [])

  return walletNfts

  /* const walletOfOwnerCalls = Object.values(collections)
    .filter((c) => COLLECTIONS_WITH_WALLET_OF_OWNER.includes(c.address))
    .map((c) => {
      return {
        abi: [
          {
            inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
            name: 'walletOfOwner',
            outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
            stateMutability: 'view',
            type: 'function',
          },
        ] as const,
        address: c.address,
        functionName: 'walletOfOwner',
        args: [account as Address],
      } as const
    })

  const walletOfOwnerCallResult = await client.multicall({
    contracts: walletOfOwnerCalls,
    allowFailure: true,
  })

  const walletNftsWithWO = walletOfOwnerCallResult
    .map((r) => r.result)
    .reduce((acc, wo, index) => {
      if (wo) {
        const { address: collectionAddress } = walletOfOwnerCalls[index]
        acc.push(wo.map((w) => ({ tokenId: w.toString(), collectionAddress, nftLocation })))
      }
      return acc
    }, [] as any[])

  return walletNfts.concat(walletNftsWithWO.flat()) */
}

/**
 * Helper to combine data from the collections' API and subgraph
 */
export const combineCollectionData = (
  collectionApiData: ApiCollection[],
  collectionSgData: CollectionMarketDataBaseFields[],
): Record<string, Collection> => {
  const collectionsMarketObj: Record<string, CollectionMarketDataBaseFields> = fromPairs(
    collectionSgData.filter(Boolean).map((current) => [current.id, current]),
  )

  return fromPairs(
    collectionApiData
      .filter((collection) => collection?.address)
      .map((current) => {
        const collectionMarket = collectionsMarketObj[current.address.toLowerCase()]
        const collection: Collection = {
          ...current,
          ...collectionMarket,
        }

        if (current.name) {
          collection.name = current.name
        }

        return [current.address, collection]
      }),
  )
}

/**
 * Evaluate whether a market NFT is in a users wallet, their profile picture, or on sale
 * @param tokenId string
 * @param tokenIdsInWallet array of tokenIds in wallet
 * @param tokenIdsForSale array of tokenIds on sale
 * @returns NftLocation enum value
 */
export const getNftLocationForMarketNft = (
  tokenId: string,
  tokenIdsInWallet: string[],
  tokenIdsForSale: string[],
): NftLocation => {
  if (tokenIdsForSale.includes(tokenId)) {
    return NftLocation.FORSALE
  }
  if (tokenIdsInWallet.includes(tokenId)) {
    return NftLocation.WALLET
  }
  console.error(`Cannot determine location for tokenID ${tokenId}, defaulting to NftLocation.WALLET`)
  return NftLocation.WALLET
}

/**
 * Construct complete TokenMarketData entities with a users' wallet NFT ids and market data for their wallet NFTs
 * @param walletNfts TokenIdWithCollectionAddress
 * @param marketDataForWalletNfts TokenMarketData[]
 * @returns TokenMarketData[]
 */
export const attachMarketDataToWalletNfts = (
  walletNfts: TokenIdWithCollectionAddress[],
  marketDataForWalletNfts: TokenMarketData[],
): TokenMarketData[] => {
  const walletNftsWithMarketData = walletNfts.map((walletNft) => {
    const marketData = marketDataForWalletNfts.find(
      (marketNft) =>
        marketNft.tokenId === walletNft.tokenId &&
        marketNft.collection.id.toLowerCase() === walletNft.collectionAddress.toLowerCase(),
    )
    return (
      marketData ?? {
        tokenId: walletNft.tokenId,
        collection: {
          id: walletNft.collectionAddress.toLowerCase(),
        },
        nftLocation: walletNft.nftLocation,
        metadataUrl: null,
        transactionHistory: null,
        currentSeller: null,
        isTradable: null,
        currentAskPrice: null,
        latestTradedPriceInETH: null,
        tradeVolumeETH: null,
        totalTrades: null,
        otherId: null,
      }
    )
  })
  return walletNftsWithMarketData
}

/**
 * Attach TokenMarketData and location to NftToken
 * @param nftsWithMetadata NftToken[] with API metadata
 * @param nftsForSale  market data for nfts that are on sale (i.e. not in a user's wallet)
 * @param walletNfts market data for nfts in a user's wallet
 * @param tokenIdsInWallet array of token ids in user's wallet
 * @param tokenIdsForSale array of token ids of nfts that are on sale
 * @returns NFT[]
 */
export const combineNftMarketAndMetadata = (
  nftsWithMetadata: NftToken[],
  nftsForSale: TokenMarketData[],
  walletNfts: TokenMarketData[],
  tokenIdsInWallet: string[],
  tokenIdsForSale: string[],
): NftToken[] => {
  const completeNftData = nftsWithMetadata.map<NftToken>((nft) => {
    // Get metadata object
    let marketData = nftsForSale.find(
      (forSaleNft) =>
        forSaleNft.tokenId === nft.tokenId &&
        forSaleNft.collection &&
        forSaleNft.collection.id === nft.collectionAddress,
    )
    if (!marketData) {
      marketData = walletNfts.find(
        (marketNft) =>
          marketNft.collection &&
          marketNft.collection.id === nft.collectionAddress &&
          marketNft.tokenId === nft.tokenId,
      )
    }
    const location = getNftLocationForMarketNft(nft.tokenId, tokenIdsInWallet, tokenIdsForSale)
    return { ...nft, marketData, location }
  })
  return completeNftData
}

const fetchWalletMarketData = async (walletNftsByCollection: {
  [collectionAddress: string]: TokenIdWithCollectionAddress[]
}): Promise<TokenMarketData[]> => {
  const walletMarketDataRequests = Object.entries(walletNftsByCollection).map(
    async ([collectionAddress, tokenIdsWithCollectionAddress]) => {
      const tokenIdIn = tokenIdsWithCollectionAddress.map((walletNft) => walletNft.tokenId)
      const [nftsOnChainMarketData, nftsMarketData] = await Promise.all([
        getNftsOnChainMarketData(collectionAddress as Address, tokenIdIn),
        getNftsMarketData({
          tokenId_in: tokenIdIn,
          collection: collectionAddress.toLowerCase(),
        }),
      ])

      return tokenIdIn
        .map((tokenId) => {
          const nftMarketData = nftsMarketData.find((tokenMarketData) => tokenMarketData.tokenId === tokenId)
          const onChainMarketData = nftsOnChainMarketData.find(
            (onChainTokenMarketData) => onChainTokenMarketData.tokenId === tokenId,
          )

          if (!nftMarketData && !onChainMarketData) return null

          return { ...nftMarketData, ...onChainMarketData }
        })
        .filter(Boolean)
    },
  )

  const walletMarketDataResponses = await Promise.all(walletMarketDataRequests)
  return walletMarketDataResponses.flat()
}

/**
 * Get in-wallet, on-sale & profile pic NFT metadata, complete with market data for a given account
 * @param account
 * @param collections
 * @returns Promise<NftToken[]>
 */
export const getCompleteAccountNftData = async (
  account: Address,
  collections: ApiCollections,
): Promise<NftToken[]> => {
  // Add delist collections to allow user reclaim their NFTs
  // const collectionsWithDelist = { ...collections, ...DELIST_COLLECTIONS }
  
  const [walletNftIdsWithCollectionAddress, onChainForSaleNfts] = await Promise.all([
    fetchWalletTokenIdsForCollections(account, collections),
    getAccountNftsOnChainMarketData(collections, account),
  ])
  
  const walletNftsByCollection = groupBy(
    walletNftIdsWithCollectionAddress,
    (walletNftId) => walletNftId.collectionAddress,
  )

  const walletMarketData = await fetchWalletMarketData(walletNftsByCollection)

  const walletNftsWithMarketData = attachMarketDataToWalletNfts(walletNftIdsWithCollectionAddress, walletMarketData)

  const walletTokenIds = walletNftIdsWithCollectionAddress.map((nft) => nft.tokenId)

  const tokenIdsForSale = onChainForSaleNfts.map((nft) => nft.tokenId)

  const forSaleNftIds = onChainForSaleNfts.map((nft) => {
    return { collectionAddress: nft.collection.id, tokenId: nft.tokenId }
  })

  const metadataForAllNfts = await getNftsFromDifferentCollectionsApi([
    ...forSaleNftIds,
    ...walletNftIdsWithCollectionAddress,
  ])
  
  const completeNftData = combineNftMarketAndMetadata(
    metadataForAllNfts,
    onChainForSaleNfts,
    walletNftsWithMarketData,
    walletTokenIds,
    tokenIdsForSale,
  )

  return completeNftData
}

/**
 * Fetch distribution information for a collection
 * @returns
 */
export const getCollectionDistributionApi = async <T>(collectionAddress: string): Promise<T> => {
  const res = await fetch(`${API_NFT}/collections/${collectionAddress}/distribution`)
  if (res.ok) {
    const data = await res.json()
    return data
  }
  console.error(`API: Failed to fetch NFT collection ${collectionAddress} distribution`, res.statusText)
  return null
}
