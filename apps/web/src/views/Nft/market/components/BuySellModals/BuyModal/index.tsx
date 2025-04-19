import { ChainId } from '@pancakeswap/chains'
import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { orb3Tokens } from '@pancakeswap/tokens'
import { InjectedModalProps, useToast } from '@pancakeswap/uikit'
import { bigIntToBigNumber } from '@pancakeswap/utils/bigNumber'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { ToastDescriptionWithTx } from 'components/Toast'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20, useNftMarketContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import useTokenBalance, { useGetEthBalance } from 'hooks/useTokenBalance'
import { useEffect, useState } from 'react'
import { NftToken } from 'state/nftMarket/types'
import { requiresApproval } from 'utils/requiresApproval'
import { formatEther, parseUnits } from 'viem'
import ApproveAndConfirmStage from '../shared/ApproveAndConfirmStage'
import ConfirmStage from '../shared/ConfirmStage'
import TransactionConfirmed from '../shared/TransactionConfirmed'
import ReviewStage from './ReviewStage'
import { StyledModal } from './styles'
import { BuyingStage, PaymentCurrency } from './types'

const modalTitles = (t: TranslateFunction) => ({
  [BuyingStage.REVIEW]: t('Review'),
  [BuyingStage.APPROVE_AND_CONFIRM]: t('Back'),
  [BuyingStage.CONFIRM]: t('Back'),
  [BuyingStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
}

const BuyModal: React.FC<React.PropsWithChildren<BuyModalProps>> = ({ nftToBuy, onDismiss }) => {
  const [stage, setStage] = useState(BuyingStage.REVIEW)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const [paymentCurrency, setPaymentCurrency] = useState<PaymentCurrency>(PaymentCurrency.ETH)
  const [isPaymentCurrentInitialized, setIsPaymentCurrentInitialized] = useState(false)
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { callWithGasPrice } = useCallWithGasPrice()

  const { account, chainId } = useAccountActiveChain()
  const wethAddress = orb3Tokens.weth.address
  const wethContractReader = useERC20(wethAddress)
  const wethContractApprover = useERC20(wethAddress)
  const nftMarketContract = useNftMarketContract()

  const { toastSuccess } = useToast()

  const nftPriceWei = parseUnits(nftToBuy?.marketData?.currentAskPrice as `${number}`, 18)
  const nftPrice = parseFloat(nftToBuy?.marketData?.currentAskPrice)

  // ETH - returns ethers.BigNumber
  const { balance: ethBalance, fetchStatus: ethFetchStatus } = useGetEthBalance()
  const formattedEthBalance = parseFloat(formatEther(ethBalance))
  // WETH - returns BigNumber
  const { balance: wethBalance, fetchStatus: wethFetchStatus } = useTokenBalance(wethAddress)
  const formattedWethBalance = getBalanceNumber(wethBalance)

  const walletBalance = paymentCurrency === PaymentCurrency.ETH ? formattedEthBalance : formattedWethBalance
  const walletFetchStatus = paymentCurrency === PaymentCurrency.ETH ? ethFetchStatus : wethFetchStatus

  const notEnoughEthForPurchase =
    paymentCurrency === PaymentCurrency.ETH ? ethBalance < nftPriceWei : wethBalance.lt(bigIntToBigNumber(nftPriceWei))

  useEffect(() => {
    if (ethBalance < nftPriceWei && wethBalance.gte(bigIntToBigNumber(nftPriceWei)) && !isPaymentCurrentInitialized) {
      setPaymentCurrency(PaymentCurrency.WETH)
      setIsPaymentCurrentInitialized(true)
    }
  }, [ethBalance, wethBalance, nftPriceWei, isPaymentCurrentInitialized])

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      return requiresApproval(wethContractReader, account, nftMarketContract.address)
    },
    onApprove: () => {
      return callWithGasPrice(wethContractApprover, 'approve', [nftMarketContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now buy NFT with WETH!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    onConfirm: () => {
      const payAmount = Number.isNaN(nftPrice)
        ? 0n
        : parseUnits(nftToBuy?.marketData?.currentAskPrice as `${number}`, 18)
      if (paymentCurrency === PaymentCurrency.ETH) {
        return callWithGasPrice(
          nftMarketContract,
          'buyTokenUsingETH',
          [nftToBuy.collectionAddress, BigInt(nftToBuy.tokenId)],
          {
            value: payAmount,
          },
        )
      }
      return callWithGasPrice(nftMarketContract, 'buyTokenUsingWETH', [
        nftToBuy.collectionAddress,
        BigInt(nftToBuy.tokenId),
        payAmount,
      ])
    },
    onSuccess: async ({ receipt }) => {
      setConfirmedTxHash(receipt.transactionHash)
      setStage(BuyingStage.TX_CONFIRMED)
      toastSuccess(
        t('Your NFT has been sent to your wallet'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
  })

  const continueToNextStage = () => {
    if (paymentCurrency === PaymentCurrency.WETH && !isApproved) {
      setStage(BuyingStage.APPROVE_AND_CONFIRM)
    } else {
      setStage(BuyingStage.CONFIRM)
    }
  }

  const goBack = () => {
    setStage(BuyingStage.REVIEW)
  }

  const showBackButton = stage === BuyingStage.CONFIRM || stage === BuyingStage.APPROVE_AND_CONFIRM

  return (
    <StyledModal
      title={modalTitles(t)[stage]}
      stage={stage}
      onDismiss={onDismiss}
      onBack={showBackButton ? goBack : null}
      headerBackground={theme.colors.gradientCardHeader}
    >
      {stage === BuyingStage.REVIEW && (
        <ReviewStage
          nftToBuy={nftToBuy}
          paymentCurrency={paymentCurrency}
          setPaymentCurrency={setPaymentCurrency}
          nftPrice={nftPrice}
          walletBalance={walletBalance}
          walletFetchStatus={walletFetchStatus}
          notEnoughEthForPurchase={notEnoughEthForPurchase}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === BuyingStage.APPROVE_AND_CONFIRM && (
        <ApproveAndConfirmStage
          variant="buy"
          handleApprove={handleApprove}
          isApproved={isApproved}
          isApproving={isApproving}
          isConfirming={isConfirming}
          handleConfirm={handleConfirm}
        />
      )}
      {stage === BuyingStage.CONFIRM && <ConfirmStage isConfirming={isConfirming} handleConfirm={handleConfirm} />}
      {stage === BuyingStage.TX_CONFIRMED && <TransactionConfirmed txHash={confirmedTxHash} onDismiss={onDismiss} />}
    </StyledModal>
  )
}

export default BuyModal
