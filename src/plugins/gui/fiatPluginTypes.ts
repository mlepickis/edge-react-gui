import { asValue } from 'cleaners'
import { EdgeAccount } from 'edge-core-js'

import { DisablePluginMap } from '../../actions/ExchangeInfoActions'
import { SendScene2Params } from '../../components/scenes/SendScene2'
import { HomeAddress } from '../../types/FormTypes'
import { EdgeTokenId } from '../../types/types'
import { EnterAmountPoweredBy } from './scenes/EnterAmountScene'

export const asFiatPaymentType = asValue('credit', 'applepay', 'googlepay', 'iach', 'sepa')
export type FiatPaymentType = ReturnType<typeof asFiatPaymentType>
export type FiatPaymentTypes = FiatPaymentType[]

export interface FiatSepaOwnerAddress extends HomeAddress {
  name: string
}

export interface FiatPluginGetMethodsResponse {
  setStatusText: (params: { statusText: string; options?: { textType?: 'warning' | 'error' } }) => void
  setPoweredBy: (params: EnterAmountPoweredBy) => void
  setValue1: (value: string) => void
  setValue2: (value: string) => void
}
export interface FiatPluginEnterAmountParams {
  headerTitle: string
  direction: 'buy' | 'sell'
  label1: string
  label2: string
  convertValue: (sourceFieldNum: number, value: string) => Promise<string | undefined>
  getMethods?: (methods: FiatPluginGetMethodsResponse) => void
  initialAmount1?: string
  headerIconUri?: string
}

export interface FiatPluginAddressFormParams {
  countryCode: string
  headerTitle: string
  headerIconUri?: string
  onSubmit: (homeAddress: HomeAddress) => Promise<void>
}

export interface FiatPluginListModalParams {
  title: string
  items: Array<{ icon: string | number | React.ReactNode; name: string; text?: string }> // Icon strings are image uri, numbers are local files
  selected?: string // Must match one of the name param in the items array
}

export interface FiatPluginEnterAmountResponse {
  lastUsed: number
  value1: string
  value2: string
}
export interface FiatPluginOpenWebViewParams {
  url: string
}

export interface FiatPluginUi {
  showToastSpinner: <T>(message: string, promise: Promise<T>) => Promise<T>
  openWebView: (params: FiatPluginOpenWebViewParams) => Promise<void>
  walletPicker: (params: { headerTitle: string; allowedAssets?: EdgeTokenId[]; showCreateWallet?: boolean }) => Promise<{
    walletId: string | undefined
    currencyCode: string | undefined
  }>
  showError: (error: Error) => Promise<void>
  listModal: (params: FiatPluginListModalParams) => Promise<string | undefined>
  enterAmount: (params: FiatPluginEnterAmountParams) => Promise<FiatPluginEnterAmountResponse>
  popScene: () => {}
  send: (params: SendScene2Params) => Promise<void>
  // showWebView: (params: { webviewUrl: string }) => Promise<void>
}

export interface FiatPluginFactoryArgs {
  // TODO:
  // io: {
  //   log: EdgeLog, // scoped logs
  // }
  disablePlugins: DisablePluginMap
  showUi: FiatPluginUi
  account: EdgeAccount
}

export interface FiatPluginRegionCode {
  countryCode: string
  stateCode?: string
}
export interface FiatPluginStartParams {
  direction: 'buy' | 'sell'
  paymentTypes: FiatPaymentTypes
  regionCode: FiatPluginRegionCode
}
export interface FiatPlugin {
  pluginId: string
  startPlugin: (params: FiatPluginStartParams) => Promise<void>
}

export type FiatPluginFactory = (params: FiatPluginFactoryArgs) => Promise<FiatPlugin>
