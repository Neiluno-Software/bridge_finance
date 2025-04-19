import { ChainId } from "@pancakeswap/chains"
import { GraphQLClient } from "graphql-request"

export const SPOT_ADDRESS = '0x53020F42f6Da51B50cf6E23e45266ef223122376'
export const STAKING_CONTRACT = '0xaf894a45df2ee09df961d159f5371d1bebe02a58'
export const SPOT_LP_ADDRESS = '0xc0e1cb42ec3e2dc239f080a2c98659f58cbce9ed'

export const MIN_STAKE_SPOT_AMOUNT = 10
export const MIN_STAKE_LP_AMOUNT = 1

export const SPOT_TOKEN_SUBGRAPH = "https://api.thegraph.com/subgraphs/name/mladen2023/spot-token"

export const spotInfoClient = {[ChainId.ETHEREUM]: new GraphQLClient(SPOT_TOKEN_SUBGRAPH) }