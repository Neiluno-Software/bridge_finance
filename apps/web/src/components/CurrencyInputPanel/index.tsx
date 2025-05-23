import { useMemo, memo, useCallback } from 'react'
import { Currency, Pair, Token, Percent, CurrencyAmount } from '@pancakeswap/sdk'
import { Button, Text, useModal, Flex, Box, CopyButton, Loading, Skeleton, ArrowDropDownIcon } from '@pancakeswap/uikit'
import { Swap as SwapUI } from '@pancakeswap/widgets-internal'
import { styled } from 'styled-components'
import { safeGetAddress } from 'utils'
import { useTranslation } from '@pancakeswap/localization'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'
import { formatAmount } from '@pancakeswap/utils/formatFractions'

import { useStablecoinPriceAmount } from 'hooks/useBUSDPrice'

import { FiatLogo } from 'components/Logo/CurrencyLogo'

import { useAccount } from 'wagmi'
import { useCurrencyBalance } from 'state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo'

import AddToWalletButton from '../AddToWallet/AddToWalletButton'

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
`
const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })`
  padding: 0px;
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onInputBlur?: () => void
  onPercentInput?: (percent: number) => void
  onMax?: () => void
  showQuickInputButton?: boolean
  showMaxButton: boolean
  maxAmount?: CurrencyAmount<Currency>
  lpPercent?: string
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  commonBasesType?: string
  showSearchInput?: boolean
  beforeButton?: React.ReactNode
  disabled?: boolean
  error?: boolean | string
  showUSDPrice?: boolean
  tokensToShow?: Token[]
  currencyLoading?: boolean
  inputLoading?: boolean
  title?: React.ReactNode
  hideBalanceComp?: boolean
}
const CurrencyInputPanel = memo(function CurrencyInputPanel({
  value,
  onUserInput,
  onInputBlur,
  onPercentInput,
  onMax,
  showQuickInputButton = false,
  showMaxButton,
  maxAmount,
  lpPercent,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  beforeButton,
  pair = null, // used for double token logo
  otherCurrency,
  id,
  showCommonBases,
  commonBasesType,
  showSearchInput,
  disabled,
  error,
  showUSDPrice,
  tokensToShow,
  currencyLoading,
  inputLoading,
  title,
  hideBalanceComp,
}: CurrencyInputPanelProps) {
  const { address: account } = useAccount()

  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const { t } = useTranslation()

  const mode = id
  const token = pair ? pair.liquidityToken : currency?.isToken ? currency : null
  const tokenAddress = token ? safeGetAddress(token.address) : null

  const amountInDollar = useStablecoinPriceAmount(
    showUSDPrice ? currency : undefined,
    Number.isFinite(+value) ? +value : undefined,
    {
      hideIfPriceImpactTooHigh: true,
      enabled: Number.isFinite(+value),
    },
  )

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
      commonBasesType={commonBasesType}
      showSearchInput={showSearchInput}
      tokensToShow={tokensToShow}
      mode={mode}
    />,
  )

  const percentAmount = useMemo(
    () => ({
      25: maxAmount ? maxAmount.multiply(new Percent(25, 100)).toExact() : undefined,
      50: maxAmount ? maxAmount.multiply(new Percent(50, 100)).toExact() : undefined,
      75: maxAmount ? maxAmount.multiply(new Percent(75, 100)).toExact() : undefined,
    }),
    [maxAmount],
  )

  const handleUserInput = useCallback(
    (val: string) => {
      onUserInput(val)
    },
    [onUserInput],
  )

  const onCurrencySelectClick = useCallback(() => {
    if (!disableCurrencySelect) {
      onPresentCurrencyModal()
    }
  }, [onPresentCurrencyModal, disableCurrencySelect])

  const isAtPercentMax = (maxAmount && value === maxAmount.toExact()) || (lpPercent && lpPercent === '100')

  const balance = !hideBalance && !!currency ? formatAmount(selectedCurrencyBalance, 6) : undefined
  return (
    <SwapUI.CurrencyInputPanel
      id={id}
      disabled={disabled}
      error={error as boolean}
      value={value}
      onInputBlur={onInputBlur}
      onUserInput={handleUserInput}
      loading={inputLoading}
      top={
        <>
          {title}
          <Flex alignItems="center">
            {beforeButton}
            <CurrencySelectButton
              className="open-currency-select-button"
              selected={!!currency}
              onClick={onCurrencySelectClick}
            >
              <Flex alignItems="center" justifyContent="space-between">
                {pair ? (
                  <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
                ) : currency ? (
                  id === 'onramp-input' ? (
                    <FiatLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
                  ) : (
                    <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
                  )
                ) : currencyLoading ? (
                  <Skeleton width="24px" height="24px" variant="circle" />
                ) : null}
                {currencyLoading ? null : pair ? (
                  <Text id="pair" bold>
                    {pair?.token0.symbol}:{pair?.token1.symbol}
                  </Text>
                ) : (
                  <Text id="pair" bold>
                    {(currency && currency.symbol && currency.symbol.length > 10
                      ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                          currency.symbol.length - 5,
                          currency.symbol.length,
                        )}`
                      : currency?.symbol) || t('Select a currency')}
                  </Text>
                )}
                {!currencyLoading && !disableCurrencySelect && <ArrowDropDownIcon />}
              </Flex>
            </CurrencySelectButton>
            {token && tokenAddress ? (
              <Flex style={{ gap: '4px' }} ml="4px" alignItems="center">
                <CopyButton
                  width="16px"
                  buttonColor="textSubtle"
                  text={tokenAddress}
                  tooltipMessage={t('Token address copied')}
                />
                <AddToWalletButton
                  variant="text"
                  p="0"
                  height="auto"
                  width="fit-content"
                  tokenAddress={tokenAddress}
                  tokenSymbol={token.symbol}
                  tokenDecimals={token.decimals}
                  tokenLogo={token instanceof WrappedTokenInfo ? token.logoURI : undefined}
                />
              </Flex>
            ) : null}
          </Flex>
          {account && !hideBalanceComp && (
            <Text
              onClick={!disabled ? onMax : undefined}
              color="gray"
              fontSize="12px"
              ellipsis
              title={!hideBalance && !!currency ? t('BALANCE: %balance%', { balance: balance ?? t('Loading') }) : ' -'}
              style={{ display: 'inline', cursor: 'pointer' }}
            >
              {!hideBalance && !!currency
                ? (balance?.replace('.', '')?.length || 0) > 12
                  ? balance
                  : t('BALANCE: %balance%', { balance: balance ?? t('Loading') })
                : ' -'}
            </Text>
          )}
        </>
      }
      bottom={
        <>
          <InputRow selected={disableCurrencySelect}>
            {account && currency && selectedCurrencyBalance?.greaterThan(0) && !disabled && label !== 'To' && (
              <Flex alignItems="right" justifyContent="right">
                {maxAmount?.greaterThan(0) &&
                  showQuickInputButton &&
                  onPercentInput &&
                  [25, 50, 75].map((percent) => {
                    const isAtCurrentPercent =
                      (maxAmount && value !== '0' && value === percentAmount[percent]) ||
                      (lpPercent && lpPercent === percent.toString())

                    return (
                      <Text
                        key={`btn_quickCurrency${percent}`}
                        onClick={() => {
                          onPercentInput(percent)
                        }}
                        mr="12px"
                        fontSize="12px"
                      >
                        {percent}%
                      </Text>
                    )
                  })}
                {maxAmount?.greaterThan(0) && showMaxButton && (
                  <Text
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      onMax?.()
                    }}
                    mr="12px"
                    fontSize="12px"
                  >
                    {t('MAX')}
                  </Text>
                )}
              </Flex>
            )}
          </InputRow>
        </>
      }
    />
  )
})

export default CurrencyInputPanel
