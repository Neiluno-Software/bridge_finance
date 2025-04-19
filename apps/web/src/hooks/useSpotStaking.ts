import { useContract } from 'hooks/useContract'
import { useCallback, useEffect, useState } from 'react'
import { STAKING_CONTRACT, SPOT_ADDRESS, SPOT_LP_ADDRESS } from 'config/constants/blockspot'
import { useContractReads, useAccount } from 'wagmi'
import { stakingContractABI } from 'config/abi/blockspotStaking'
import { getContractResult, getFormattedUnits, getParseUnits } from 'utils/blockspotHelper'
import { lpContractABI } from 'config/abi/blockspotLp'
import { spotContractABI } from 'config/abi/blockspot'

const options = {}

export const useSpotStaking = () => {
  const { address: account } = useAccount()

  const [accountInfo, setAccountInfo] = useState({
    spotBalance: 0,
    lpBalance: 0,
    pendingReward: 0,
    pendingLpReward: 0,
    stakedSpot: 0,
    stakedLp: 0,
    spotRewardAddon: 0,
    lpRewardAddon: 0,
    spotUnlockTime: 0,
    lpUnlockTime: 0,
  })

  const [totalInfo, setTotalInfo] = useState({
    totalSpotStaked: 0,
    totalLpStaked: 0,
    spotApr: 0,
    lpApr: 0,
    spotStakers: 0,
    lpStakers: 0,
  })

  const stakingContract = useContract(STAKING_CONTRACT, stakingContractABI)

  const { data: accountResult, refetch: refetchAccounts } = useContractReads({
    contracts: [
      {
        address: SPOT_ADDRESS as `0x${string}`,
        abi: spotContractABI,
        functionName: 'balanceOf', // user spot balance
        args: [account as `0x${string}`],
      },
      {
        address: SPOT_LP_ADDRESS as `0x${string}`,
        abi: lpContractABI,
        functionName: 'balanceOf', // user lp balance
        args: [account as `0x${string}`],
      },
      {
        address: STAKING_CONTRACT as `0x${string}`,
        abi: stakingContractABI,
        functionName: 'viewHowMuchMilk', // pending rewards
        args: [account as `0x${string}`],
      },
      {
        address: STAKING_CONTRACT as `0x${string}`,
        abi: stakingContractABI,
        functionName: 'checkEstMilQRewards', // pending lp rewards
        args: [account as `0x${string}`],
      },
      {
        address: STAKING_CONTRACT as `0x${string}`,
        abi: stakingContractABI,
        functionName: 'SpoTerParlours', // user details for spot
        args: [account as `0x${string}`],
      },
      {
        address: STAKING_CONTRACT as `0x${string}`,
        abi: stakingContractABI,
        functionName: 'MilQerParlours', // user details for lp
        args: [account as `0x${string}`],
      },
    ],
  })

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: STAKING_CONTRACT as `0x${string}`,
        abi: stakingContractABI,
        functionName: 'bessies', // total lp staked
      },
      {
        address: STAKING_CONTRACT as `0x${string}`,
        abi: stakingContractABI,
        functionName: 'daisys', // total spot staked
      },
      {
        address: STAKING_CONTRACT as `0x${string}`,
        abi: stakingContractABI,
        functionName: 'totalVitaliksMilkShipments', // ???
      },
      {
        address: STAKING_CONTRACT as `0x${string}`,
        abi: stakingContractABI,
        functionName: 'VitaliksMilkShipments', // APR ???
        args: [1n],
      },
      {
        address: STAKING_CONTRACT as `0x${string}`,
        abi: stakingContractABI,
        functionName: 'spoTers', // spot stakers
      },
      {
        address: STAKING_CONTRACT as `0x${string}`,
        abi: stakingContractABI,
        functionName: 'milQers', // lp stakers
      },
    ],
  })

  const onStaking = useCallback(
    async (amount, type) => {
      return stakingContract?.write.staQe(
        [type === 0 ? getParseUnits(amount) : 0n, type === 0 ? 0n : getParseUnits(amount), type],
        options,
      )
    },
    [stakingContract],
  )

  const onUnstaking = useCallback(
    async (amount, type) => {
      return stakingContract?.write.unstaQe(
        [type === 0 ? getParseUnits(amount) : 0n, type === 0 ? 0n : getParseUnits(amount), type],
        options,
      )
    },
    [stakingContract],
  )

  const onPerpSwitch = useCallback(
    async (type) => {
      return stakingContract?.write.ownCows([type], options)
    },
    [stakingContract],
  )

  const onRequestUnlock = useCallback(
    async (type) => {
      return stakingContract?.write.roundUpCows([type], options)
    },
    [stakingContract],
  )

  const onCompound = useCallback(async () => {
    return stakingContract?.write.QompoundSpoT([10n], options)
  }, [stakingContract])

  const onClaim = useCallback(async () => {
    return stakingContract?.write.shipMilk(options)
  }, [stakingContract])

  const onClaimLp = useCallback(async () => {
    return stakingContract?.write.shipSpoTersMilQ(options)
  }, [stakingContract])

  useEffect(() => {
    if (!contractResult) return

    const _totalInfo = { ...totalInfo }

    _totalInfo.totalLpStaked = getContractResult(contractResult[0])
    _totalInfo.totalSpotStaked = getContractResult(contractResult[1])
    if (contractResult[3].result) {
      _totalInfo.spotApr = getFormattedUnits(contractResult[3].result[1])
      _totalInfo.lpApr = getFormattedUnits(contractResult[3].result[2])
    }
    _totalInfo.spotStakers = getContractResult(contractResult[4], 0)
    _totalInfo.lpStakers = getContractResult(contractResult[5], 0)

    setTotalInfo(_totalInfo)
  }, [contractResult])

  useEffect(() => {
    if (!accountResult) return

    const _accountInfo = { ...accountInfo }
    _accountInfo.spotBalance = getContractResult(accountResult[0])
    _accountInfo.lpBalance = getContractResult(accountResult[1])
    _accountInfo.pendingReward = getContractResult(accountResult[2])
    _accountInfo.pendingLpReward = getContractResult(accountResult[3])
    if (accountResult[4].result) {
      _accountInfo.stakedSpot = getFormattedUnits(accountResult[4].result[0])
      _accountInfo.spotUnlockTime = getFormattedUnits(accountResult[4].result[2], 0)
      _accountInfo.spotRewardAddon = getFormattedUnits(accountResult[4].result[5])
    }
    if (accountResult[5].result) {
      _accountInfo.stakedLp = getFormattedUnits(accountResult[5].result[0])
      _accountInfo.lpUnlockTime = getFormattedUnits(accountResult[5].result[2], 0)
      _accountInfo.lpRewardAddon = getFormattedUnits(accountResult[5].result[6])
    }

    setAccountInfo(_accountInfo)
  }, [accountResult])

  return {
    accountInfo,
    totalInfo,
    refetchAccounts,
    refetchContracts,
    onStaking,
    onUnstaking,
    onPerpSwitch,
    onRequestUnlock,
    onCompound,
    onClaim,
    onClaimLp,
  }
}
