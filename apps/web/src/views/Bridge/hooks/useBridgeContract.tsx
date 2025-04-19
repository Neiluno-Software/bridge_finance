import { useContract } from 'hooks/useContract'
import { ChainId } from '@pancakeswap/sdk'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import { bridgeContractABI } from 'config/abi/blockspotBridge'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { BRIDGE_CONTRACT } from '../config'

export const useBridgeContract = () => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const bridgeContract = useContract(BRIDGE_CONTRACT[chainId || ChainId.ETHEREUM].address, bridgeContractABI)

  const onDeposit = useCallback(
    async (amount, receiver, code) => {
      return bridgeContract?.write.deposit([receiver, code], {
        value: amount,
      })
    },
    [bridgeContract],
  )

  const onDepositToken = useCallback(
    async (amount, token, receiver, code) => {
      return bridgeContract?.write.depositToken([token, receiver, amount, code], {})
    },
    [bridgeContract],
  )

  return {
    onDeposit,
    onDepositToken,
  }
}