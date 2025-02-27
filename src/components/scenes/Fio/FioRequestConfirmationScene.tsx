import { div, mul } from 'biggystring'
import { EdgeAccount, EdgeCurrencyConfig, EdgeCurrencyWallet } from 'edge-core-js'
import * as React from 'react'
import { View } from 'react-native'

import { formatNumber } from '../../../locales/intl'
import { lstrings } from '../../../locales/strings'
import { CcWalletMap } from '../../../reducers/FioReducer'
import { getExchangeDenomByCurrencyCode, selectDisplayDenomByCurrencyCode } from '../../../selectors/DenominationSelectors'
import { getExchangeRate, getSelectedCurrencyWallet } from '../../../selectors/WalletSelectors'
import { connect } from '../../../types/reactRedux'
import { EdgeSceneProps } from '../../../types/routerTypes'
import { emptyCurrencyInfo, GuiCurrencyInfo } from '../../../types/types'
import { getTokenIdForced, getWalletTokenId } from '../../../util/CurrencyInfoHelpers'
import {
  addToFioAddressCache,
  checkPubAddress,
  convertEdgeToFIOCodes,
  fioMakeSpend,
  fioSignAndBroadcast,
  getRemainingBundles
} from '../../../util/FioAddressUtils'
import { DECIMAL_PRECISION } from '../../../util/utils'
import { SceneWrapper } from '../../common/SceneWrapper'
import { AddressModal } from '../../modals/AddressModal'
import { ButtonsModal } from '../../modals/ButtonsModal'
import { TextInputModal } from '../../modals/TextInputModal'
import { Airship, showError, showToast } from '../../services/AirshipInstance'
import { cacheStyles, Theme, ThemeProps, withTheme } from '../../services/ThemeContext'
import { SceneHeader } from '../../themed/SceneHeader'
import { Slider } from '../../themed/Slider'
import { CardUi4 } from '../../ui4/CardUi4'
import { RowUi4 } from '../../ui4/RowUi4'

interface StateProps {
  exchangeSecondaryToPrimaryRatio: string
  edgeWallet: EdgeCurrencyWallet
  chainCode: string
  primaryCurrencyInfo: GuiCurrencyInfo
  fioWallets: EdgeCurrencyWallet[]
  account: EdgeAccount
  isConnected: boolean
  fioPlugin?: EdgeCurrencyConfig
  walletId: string
  currencyCode: string
  connectedWalletsByFioAddress: {
    [fioAddress: string]: CcWalletMap
  }
}

interface OwnProps extends EdgeSceneProps<'fioRequestConfirmation'> {}

type Props = StateProps & ThemeProps & OwnProps

interface State {
  loading: boolean
  walletAddresses: Array<{ fioAddress: string; fioWallet: EdgeCurrencyWallet }>
  fioAddressFrom: string
  fioAddressTo: string
  memo: string
  settingFioAddressTo: boolean
  showSlider: boolean
}

export class FioRequestConfirmationConnected extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      loading: false,
      fioAddressFrom: '',
      walletAddresses: [],
      fioAddressTo: this.props.route.params.fioAddressTo,
      memo: '',
      settingFioAddressTo: false,
      showSlider: true
    }
  }

  componentDidMount() {
    this.setAddressesState().catch(err => showError(err))
  }

  setAddressesState = async () => {
    if (this.props.fioWallets) {
      const { chainCode, currencyCode, connectedWalletsByFioAddress } = this.props
      const walletAddresses = []
      let defaultFioAddressFrom = null
      for (const fioWallet of this.props.fioWallets) {
        try {
          const fioAddresses: string[] = await fioWallet.otherMethods.getFioAddressNames()
          if (fioAddresses.length > 0) {
            for (const fioAddress of fioAddresses) {
              walletAddresses.push({ fioAddress, fioWallet })
              if (defaultFioAddressFrom == null && connectedWalletsByFioAddress[fioAddress]?.[`${chainCode}:${currencyCode}`] === this.props.walletId) {
                defaultFioAddressFrom = fioAddress
              }
            }
          }
        } catch (e: any) {
          continue
        }
      }

      this.setState({
        walletAddresses,
        fioAddressFrom: defaultFioAddressFrom != null ? defaultFioAddressFrom : walletAddresses[0].fioAddress
      })
    }
  }

  resetSlider = (): void => {
    this.setState({ showSlider: false }, () => this.setState({ showSlider: true }))
  }

  onConfirm = async () => {
    const { account, chainCode, currencyCode, edgeWallet, fioPlugin, isConnected, navigation, primaryCurrencyInfo, route } = this.props
    const { amounts } = route.params
    const { walletAddresses, fioAddressFrom } = this.state
    const walletAddress = walletAddresses.find(({ fioAddress }) => fioAddress === fioAddressFrom)
    const { publicAddress } = await edgeWallet.getReceiveAddress({ tokenId: null })

    if (walletAddress && fioPlugin) {
      const { fioWallet } = walletAddress
      const val = div(amounts.nativeAmount, primaryCurrencyInfo.exchangeDenomination.multiplier, DECIMAL_PRECISION)
      try {
        if (!isConnected) {
          showError(lstrings.fio_network_alert_text)
          return
        }
        // checking fee
        this.setState({ loading: true })
        try {
          const edgeTx = await fioMakeSpend(fioWallet, 'requestFunds', {
            payerFioAddress: '',
            payeeFioAddress: this.state.fioAddressFrom,
            payeeTokenPublicAddress: '',
            payerFioPublicKey: '',
            amount: '',
            chainCode: '',
            tokenCode: '',
            memo: ''
          })
          const bundledTxs = await getRemainingBundles(fioWallet, this.state.fioAddressFrom)
          // The API only returns a fee if there are 0 bundled transactions remaining. New requests can cost up to two transactions
          // so we need to check the corner case where a user might have one remaining transaction.
          if (edgeTx.networkFee !== '0' || bundledTxs < 2) {
            this.setState({ loading: false })
            this.resetSlider()
            const answer = await Airship.show<'ok' | undefined>(bridge => (
              <ButtonsModal
                bridge={bridge}
                title={lstrings.fio_no_bundled_err_msg}
                message={lstrings.fio_no_bundled_add_err_msg}
                buttons={{
                  ok: { label: lstrings.title_fio_add_bundled_txs }
                }}
                closeArrow
              />
            ))
            if (answer === 'ok') {
              navigation.navigate('fioAddressSettings', {
                showAddBundledTxs: true,
                walletId: fioWallet.id,
                fioAddressName: this.state.fioAddressFrom
              })
            }
            return
          }
        } catch (e: any) {
          this.setState({ loading: false })
          this.resetSlider()
          return showError(lstrings.fio_get_fee_err_msg)
        }

        let payerPublicKey
        try {
          const fioCurrencyCode = fioPlugin.currencyInfo.currencyCode
          payerPublicKey = await checkPubAddress(fioPlugin, this.state.fioAddressTo, fioCurrencyCode, fioCurrencyCode)
        } catch (e: any) {
          console.log(e)
        }

        const { fioChainCode, fioTokenCode } = convertEdgeToFIOCodes(edgeWallet.currencyInfo.pluginId, chainCode, primaryCurrencyInfo.exchangeCurrencyCode)

        // send fio request
        const edgeTx = await fioMakeSpend(fioWallet, 'requestFunds', {
          payerFioAddress: this.state.fioAddressTo,
          payeeFioAddress: this.state.fioAddressFrom,
          payerFioPublicKey: payerPublicKey,
          payeeTokenPublicAddress: publicAddress,
          amount: val,
          tokenCode: fioTokenCode,
          chainCode: fioChainCode,
          memo: this.state.memo
        })
        await fioSignAndBroadcast(fioWallet, edgeTx)
        this.setState({ loading: false })
        showToast(lstrings.fio_request_ok_body)
        await addToFioAddressCache(account, [this.state.fioAddressTo])
        const tokenId = getWalletTokenId(edgeWallet, currencyCode)
        navigation.navigate('request', { tokenId, walletId: edgeWallet.id })
      } catch (error: any) {
        this.setState({ loading: false })
        this.resetSlider()
        showError(
          `${lstrings.fio_request_error_header}. ${error.json && error.json.fields && error.json.fields[0] ? JSON.stringify(error.json.fields[0].error) : ''}`
        )
      }
    } else {
      showError(lstrings.fio_wallet_missing_for_fio_address)
    }
  }

  onAddressFromPressed = async () => {
    await this.openFioAddressFromModal()
  }

  onAddressToPressed = async () => {
    await this.openFioAddressToModal()
  }

  onMemoPressed = async () => {
    await this.openMemoModal()
  }

  openFioAddressFromModal = async () => {
    const { fioPlugin, walletId, currencyCode } = this.props
    const { walletAddresses } = this.state
    const fioAddressFrom = await Airship.show<string | undefined>(bridge => (
      <AddressModal bridge={bridge} walletId={walletId} currencyCode={currencyCode} title={lstrings.fio_confirm_request_fio_title} useUserFioAddressesOnly />
    ))
    if (fioAddressFrom == null) return
    if (fioPlugin && !(await fioPlugin.otherMethods.doesAccountExist(fioAddressFrom)))
      return showError(`${lstrings.send_fio_request_error_addr_not_exist}${fioAddressFrom ? '\n' + fioAddressFrom : ''}`)
    if (!walletAddresses.find(({ fioAddress }) => fioAddress === fioAddressFrom)) return showError(lstrings.fio_wallet_missing_for_fio_address) // Check if valid owned fio address
    if (fioAddressFrom === this.state.fioAddressTo) return showError(lstrings.fio_confirm_request_error_from_same)
    this.setState({ fioAddressFrom })
  }

  showError(error?: string) {
    this.setState({ settingFioAddressTo: false })
    if (error != null) {
      showError(error)
    }
  }

  openFioAddressToModal = async () => {
    const { fioPlugin, walletId, currencyCode } = this.props

    this.setState({ settingFioAddressTo: true })
    const fioAddressTo = await Airship.show<string | undefined>(bridge => (
      <AddressModal bridge={bridge} walletId={walletId} currencyCode={currencyCode} title={lstrings.fio_confirm_request_fio_title} isFioOnly />
    ))
    if (fioAddressTo == null) {
      this.showError()
    } else if (fioPlugin && !(await fioPlugin.otherMethods.doesAccountExist(fioAddressTo))) {
      this.showError(`${lstrings.send_fio_request_error_addr_not_exist}${fioAddressTo ? '\n' + fioAddressTo : ''}`)
    } else if (this.state.fioAddressFrom === fioAddressTo) {
      this.showError(lstrings.fio_confirm_request_error_to_same)
    } else {
      this.setState({ fioAddressTo, settingFioAddressTo: false })
    }
  }

  openMemoModal = async () => {
    const memo = await Airship.show<string | undefined>(bridge => (
      <TextInputModal
        bridge={bridge}
        initialValue={this.state.memo}
        inputLabel={lstrings.fio_confirm_request_memo}
        returnKeyType="done"
        multiline
        submitLabel={lstrings.string_save}
        title={lstrings.fio_confirm_request_input_title_memo}
        autoCorrect={false}
      />
    ))
    if (memo == null) return
    if (memo.length > 64) return showError(lstrings.send_fio_request_error_memo_inline)
    if (memo && !/^[\x20-\x7E\x85\n]*$/.test(memo)) return showError(lstrings.send_fio_request_error_memo_invalid_character)
    this.setState({ memo })
  }

  render() {
    const { edgeWallet, exchangeSecondaryToPrimaryRatio, primaryCurrencyInfo, route, theme } = this.props
    const { amounts } = route.params

    const { fioAddressFrom, fioAddressTo, loading, memo, settingFioAddressTo, showSlider } = this.state

    if (!primaryCurrencyInfo) return null
    let cryptoAmount, exchangeAmount
    try {
      cryptoAmount = div(amounts.nativeAmount, primaryCurrencyInfo.displayDenomination.multiplier, DECIMAL_PRECISION)
      exchangeAmount = div(amounts.nativeAmount, primaryCurrencyInfo.exchangeDenomination.multiplier, DECIMAL_PRECISION)
    } catch (e: any) {
      return null
    }

    const styles = getStyles(theme)

    const fiatAmount = formatNumber(mul(exchangeSecondaryToPrimaryRatio, exchangeAmount), { toFixed: 2 }) || '0'
    const cryptoName = primaryCurrencyInfo.displayDenomination.name
    const fiatName = edgeWallet.fiatCurrencyCode.replace('iso:', '')

    return (
      <SceneWrapper scroll>
        <SceneHeader title={lstrings.fio_confirm_request_header} underline withTopMargin />
        <View style={styles.container}>
          <CardUi4 sections>
            <RowUi4 rightButtonType="editable" title={lstrings.fio_confirm_request_from} body={fioAddressFrom} onPress={this.onAddressFromPressed} />
            <RowUi4
              rightButtonType="editable"
              title={lstrings.fio_confirm_request_to}
              body={settingFioAddressTo ? lstrings.resolving : fioAddressTo}
              onPress={this.onAddressToPressed}
            />
            <RowUi4 title={lstrings.fio_confirm_request_amount} body={`${cryptoAmount} ${cryptoName} (${fiatAmount} ${fiatName})`} />
            <RowUi4 maximumHeight="large" rightButtonType="editable" title={lstrings.fio_confirm_request_memo} body={memo} onPress={this.onMemoPressed} />
          </CardUi4>
          <View style={styles.sliderContainer}>
            {fioAddressFrom.length > 0 && fioAddressTo.length > 0 && showSlider ? (
              <Slider onSlidingComplete={this.onConfirm} disabled={loading} showSpinner={loading} disabledText={lstrings.loading} />
            ) : null}
          </View>
        </View>
      </SceneWrapper>
    )
  }
}

const getStyles = cacheStyles((theme: Theme) => ({
  container: {
    padding: theme.rem(0.5)
  },
  sliderContainer: {
    marginTop: theme.rem(2)
  }
}))

export const FioRequestConfirmationScene = connect<StateProps, {}, OwnProps>(
  state => {
    const selectedWallet: EdgeCurrencyWallet = getSelectedCurrencyWallet(state)
    const { account } = state.core
    const currencyCode: string = state.ui.wallets.selectedCurrencyCode
    const fioWallets: EdgeCurrencyWallet[] = state.ui.wallets.fioWallets
    const { isConnected } = state.network

    if (!currencyCode) {
      return {
        exchangeSecondaryToPrimaryRatio: '0',
        chainCode: '',
        primaryCurrencyInfo: emptyCurrencyInfo,
        edgeWallet: selectedWallet,
        fioWallets,
        account,
        isConnected,
        walletId: '',
        currencyCode: '',
        fioPlugin: account.currencyConfig.fio,
        connectedWalletsByFioAddress: {}
      }
    }

    const primaryDisplayDenomination = selectDisplayDenomByCurrencyCode(state, selectedWallet.currencyConfig, currencyCode)
    const primaryExchangeDenomination = getExchangeDenomByCurrencyCode(selectedWallet.currencyConfig, currencyCode)
    const primaryExchangeCurrencyCode: string = primaryExchangeDenomination.name

    const primaryCurrencyInfo: GuiCurrencyInfo = {
      walletId: state.ui.wallets.selectedWalletId,
      tokenId: getTokenIdForced(account, selectedWallet.currencyInfo.pluginId, currencyCode),
      displayCurrencyCode: currencyCode,
      displayDenomination: primaryDisplayDenomination,
      exchangeCurrencyCode: primaryExchangeCurrencyCode,
      exchangeDenomination: primaryExchangeDenomination
    }
    const isoFiatCurrencyCode: string = selectedWallet.fiatCurrencyCode
    const exchangeSecondaryToPrimaryRatio = getExchangeRate(state, currencyCode, isoFiatCurrencyCode)

    return {
      exchangeSecondaryToPrimaryRatio,
      edgeWallet: selectedWallet,
      chainCode: selectedWallet.currencyInfo.currencyCode,
      primaryCurrencyInfo,
      fioWallets,
      account,
      isConnected,
      walletId: state.ui.wallets.selectedWalletId,
      currencyCode: state.ui.wallets.selectedCurrencyCode,
      fioPlugin: account.currencyConfig.fio,
      connectedWalletsByFioAddress: state.ui.fio.connectedWalletsByFioAddress
    }
  },
  dispatch => ({})
)(withTheme(FioRequestConfirmationConnected))
