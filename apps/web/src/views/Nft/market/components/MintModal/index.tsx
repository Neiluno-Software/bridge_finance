import { useTranslation } from '@pancakeswap/localization'
import { Button, Dots, Flex, InjectedModalProps, Text, useToast } from '@pancakeswap/uikit'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useOrb3CollectionContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { useCallback, useEffect, useState } from 'react'
import { Collection } from 'state/nftMarket/types'
import { formatUnits } from 'ethers/lib/utils'
import { useGetEthBalance } from 'hooks/useTokenBalance'
import { formatEther } from 'viem'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import useCatchTxError from 'hooks/useCatchTxError'
import { BorderedBox, EthAmountCell, RightAlignedInput, StyledModal } from './styles'

interface MintModalProps extends InjectedModalProps {
  collection: Collection
}

const MintModal: React.FC<React.PropsWithChildren<MintModalProps>> = ({
  collection,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account, chainId } = useAccountActiveChain()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { toastSuccess, toastError } = useToast()
  const collectionContract = useOrb3CollectionContract(collection.address)

  // ETH - returns ethers.BigNumber
  const { balance: ethBalance, fetchStatus: ethFetchStatus, refresh: refetchEth } = useGetEthBalance()
  const formattedEthBalance = parseFloat(formatEther(ethBalance))
  
  const [price, setPrice] = useState(0)
  const [priceWei, setPriceWei] = useState(0n)
  const [maxMintAmount, setMaxMintAmount] = useState(0)
  const [maxSupply, setMaxSupply] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)

  const [isMinting, setMinting] = useState(false)

  const [amount, setAmount] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (!collectionContract) return
    const readCollection = async() => {
      const _price = await collectionContract.read.cost()
      const _maxMintAmount = await collectionContract.read.maxMintAmountPerTx()
      const _maxSupply = await collectionContract.read.maxSupply()
      const _totalSupply = await collectionContract.read.totalSupply()

      setPriceWei(_price)
      setPrice(parseFloat(formatUnits(_price)))
      setMaxMintAmount(Number(_maxMintAmount))
      setMaxSupply(Number(_maxSupply))
      setTotalSupply(Number(_totalSupply))
    }

    readCollection()
  }, [collectionContract])

  const onMint = useCallback(async () => {
    if (!collectionContract || !amount || !fetchWithCatchTxError || !callWithGasPrice) return
    setMinting(true)
    try {
      const receipt = await fetchWithCatchTxError(() => {
        return callWithGasPrice(collectionContract, 'mint', [
          amount,
        ], {value: priceWei * BigInt(amount)})
      })
      if (receipt?.status) {
        toastSuccess("Mint NFT Successed!")
        onDismiss?.()
      }
    } catch (error) {
      toastError("Mint NFT Failed!")
    }
    setMinting(false)
  }, [amount, priceWei, collectionContract, onDismiss, fetchWithCatchTxError, callWithGasPrice, toastError, toastSuccess])
 
  return (
    <StyledModal
      title={collection.name}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradientCardHeader}
      headerPadding={'12px 24px'}
    >
      {collection.description ? (
        <Text color="primary" p="16px">
          {collection.description}
        </Text>
      ) : null}
      <BorderedBox>
        <Flex justifyContent="space-between" alignItems="center">
          <Text small color="textSubtle">
            {t('ETH in wallet')}
          </Text>
          <EthAmountCell ethAmount={formattedEthBalance} />
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Text small color="textSubtle">
            {t('NFT Price')}
          </Text>
          <EthAmountCell ethAmount={price} />
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" mt="16px">
          <Text small color="textSubtle">
            {t('Input Amount')}
          </Text>
          <RightAlignedInput
            scale="sm"
            type="number"
            pattern="^[0-9]"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="true"
            inputMode="numeric"
            placeholder='0'
            isWarning={Number(amount) > maxMintAmount}
            value={amount}
            onChange={(e) => {
              setAmount(Number(e.target.value) || undefined)
            }}
          />
        </Flex>
      </BorderedBox>

      {Number(amount) > maxMintAmount && (
        <Text fontSize="12px" color="failure" ml={24} mt={12}>
          {`Max mint amount per transaction is ${maxMintAmount}`}
        </Text>
      )}

      {amount && priceWei * BigInt(Math.ceil(amount)) > ethBalance && (
        <Text fontSize="12px" color="failure" ml={24} mt={12}>
          {`Insufficient ETH balance`}
        </Text>
      )}
      
      <Flex flexDirection="column" p="16px">
        <Button
          mb="8px"
          onClick={onMint}
          disabled={!amount || Number(amount) > maxMintAmount || priceWei * BigInt(amount) > ethBalance || isMinting}
        >
          {isMinting ? <Dots>Minting</Dots> : 'Mint'}
        </Button>
      </Flex>
    </StyledModal>
  )
}

export default MintModal
