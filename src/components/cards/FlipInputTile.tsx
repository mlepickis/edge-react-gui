import { EdgeCurrencyWallet } from 'edge-core-js'
import * as React from 'react'

import { useWatch } from '../../hooks/useWatch'
import s from '../../locales/strings'
import { getDisplayDenomination, getExchangeDenomination } from '../../selectors/DenominationSelectors'
import { memo, useMemo } from '../../types/reactHooks'
import { useSelector } from '../../types/reactRedux'
import { getDenomFromIsoCode } from '../../util/utils'
import { CryptoExchangeFlipInputWrapper } from '../themed/CryptoExchangeFlipInputWrapperComponent'
import { ExchangedFlipInputAmounts } from '../themed/ExchangedFlipInput'
import { MiniButton } from '../themed/MiniButton'

type Props = {
  hasMaxSpend: boolean
  onMaxspend?: () => void
  headerText: string
  launchWalletSelector: () => void
  onCryptoExchangeAmountChanged: (amounts: ExchangedFlipInputAmounts) => void
  wallet: EdgeCurrencyWallet
  tokenId?: string
}

const FlipInputTileComponent = (props: Props) => {
  const { hasMaxSpend, onMaxspend, headerText, launchWalletSelector, onCryptoExchangeAmountChanged, tokenId, wallet } = props

  const isoFiatCurrencyCode = useWatch(wallet, 'fiatCurrencyCode')
  const walletId = useWatch(wallet, 'id')
  const currencyInfo = useWatch(wallet, 'currencyInfo')
  const { pluginId } = currencyInfo
  const { allTokens } = useWatch(wallet, 'currencyConfig')

  const { currencyCode } = tokenId == null ? currencyInfo : allTokens[tokenId]
  // @ts-expect-error
  const fiatPerCrypto = useSelector(state => state.exchangeRates[`${currencyCode}_${isoFiatCurrencyCode}`])

  // @ts-expect-error
  const selectedWalletExchangeDenominationMultiplier = useSelector(state => getExchangeDenomination(state, pluginId, currencyCode).multiplier)
  // @ts-expect-error
  const selectedWalletExchangeDenominationName = useSelector(state => getExchangeDenomination(state, pluginId, currencyCode).name)
  // @ts-expect-error
  const selectedWalletExchangeDenominationSymbol = useSelector(state => getExchangeDenomination(state, pluginId, currencyCode).symbol ?? '')
  // @ts-expect-error
  const selectedWalletDisplayDenominationMultiplier = useSelector(state => getDisplayDenomination(state, pluginId, currencyCode).multiplier)
  // @ts-expect-error
  const selectedWalletDisplayDenominationName = useSelector(state => getDisplayDenomination(state, pluginId, currencyCode).name)
  // @ts-expect-error
  const selectedWalletDisplayDenominationSymbol = useSelector(state => getDisplayDenomination(state, pluginId, currencyCode).symbol ?? '')

  const primaryCurrencyInfo = useMemo(
    () => ({
      walletId: walletId,
      pluginId,
      displayCurrencyCode: selectedWalletExchangeDenominationName,
      exchangeCurrencyCode: currencyCode,
      displayDenomination: {
        multiplier: selectedWalletDisplayDenominationMultiplier,
        name: selectedWalletDisplayDenominationName,
        symbol: selectedWalletDisplayDenominationSymbol
      },
      exchangeDenomination: {
        multiplier: selectedWalletExchangeDenominationMultiplier,
        name: selectedWalletExchangeDenominationName,
        symbol: selectedWalletExchangeDenominationSymbol
      }
    }),
    [
      pluginId,
      currencyCode,
      selectedWalletDisplayDenominationMultiplier,
      selectedWalletDisplayDenominationName,
      selectedWalletDisplayDenominationSymbol,
      selectedWalletExchangeDenominationMultiplier,
      selectedWalletExchangeDenominationName,
      selectedWalletExchangeDenominationSymbol,
      walletId
    ]
  )
  const secondaryCurrencyInfo = useMemo(() => {
    const displayCurrencyCode = isoFiatCurrencyCode.replace('iso:', '')
    const fiatDenomination = getDenomFromIsoCode(displayCurrencyCode)

    return {
      walletId: walletId,
      displayCurrencyCode,
      exchangeCurrencyCode: isoFiatCurrencyCode,
      displayDenomination: fiatDenomination,
      exchangeDenomination: fiatDenomination
    }
  }, [isoFiatCurrencyCode, walletId])

  const renderMaxButton = useMemo(() => {
    if (!hasMaxSpend || onMaxspend == null) return null
    return <MiniButton alignSelf="center" label={s.strings.string_max_cap} marginRem={[1.2, 0, 0]} onPress={onMaxspend} />
  }, [hasMaxSpend, onMaxspend])

  const renderFlipInput = useMemo(() => {
    return (
      <CryptoExchangeFlipInputWrapper
        walletId={walletId}
        buttonText={s.strings.select_src_wallet}
        headerText={headerText}
        primaryCurrencyInfo={primaryCurrencyInfo}
        secondaryCurrencyInfo={secondaryCurrencyInfo}
        fiatPerCrypto={fiatPerCrypto}
        overridePrimaryExchangeAmount=""
        forceUpdateGuiCounter={0}
        launchWalletSelector={launchWalletSelector}
        onCryptoExchangeAmountChanged={onCryptoExchangeAmountChanged}
        isFocused
        focusMe={() => {}}
        onNext={() => {}}
      >
        {renderMaxButton}
      </CryptoExchangeFlipInputWrapper>
    )
  }, [headerText, fiatPerCrypto, launchWalletSelector, onCryptoExchangeAmountChanged, primaryCurrencyInfo, renderMaxButton, secondaryCurrencyInfo, walletId])

  return renderFlipInput
}

export const FlipInputTile = memo(FlipInputTileComponent)
