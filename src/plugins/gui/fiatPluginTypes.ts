import { asValue } from 'cleaners'
import { EdgeAccount } from 'edge-core-js'

import { DisablePluginMap } from '../../actions/ExchangeInfoActions'
import { SepaInfo } from '../../types/FormTypes'
import { EdgeTokenId } from '../../types/types'
import { EnterAmountPoweredBy } from './scenes/EnterAmountScene'

export const asFiatPaymentType = asValue('sepa', 'credit', 'applepay', 'googlepay', 'iach')
export type FiatPaymentType = ReturnType<typeof asFiatPaymentType>
export type FiatPaymentTypes = FiatPaymentType[]

export interface FiatPluginGetMethodsResponse {
  setStatusText: (params: { statusText: string; options?: { textType?: 'warning' | 'error' } }) => void
  setPoweredBy: (params: EnterAmountPoweredBy) => void
  setValue1: (value: string) => void
  setValue2: (value: string) => void
}
export interface FiatPluginEnterAmountParams {
  headerTitle: string
  isBuy: boolean
  label1: string
  label2: string
  convertValue: (sourceFieldNum: number, value: string) => Promise<string | undefined>
  getMethods?: (methods: FiatPluginGetMethodsResponse) => void
  initialAmount1?: string
  headerIconUri?: string
}

export interface FiatPluginSepaFormParams {
  headerTitle: string
  headerIconUri?: string
  // TODO: onSubmit handling control by the plugin/provider may still be needed
  // to communicate the working status of the action and success/failure to the
  // scene, unless some other callback API is designed
  onSubmit: (sepaInfo: SepaInfo) => Promise<void>
}

export interface FiatPluginSepaTransferInfo {
  input: {
    amount: string
    currency: string
  }
  output: {
    amount: string
    currency: string
    walletAddress: string
  }
  paymentDetails: {
    id: string
    iban: string
    swiftBic: string
    recipient: string
    reference: string
  }
}

export interface FiatPluginSepaTransferParams {
  headerTitle: string
  promptMessage: string
  transferInfo: FiatPluginSepaTransferInfo
  headerIconUri?: string
  onDone: () => Promise<void>
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
  sepaForm: (params: FiatPluginSepaFormParams) => Promise<SepaInfo>
  sepaTransferInfo: (params: FiatPluginSepaTransferParams) => Promise<void>
  popScene: () => {}
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
  isBuy: boolean
  paymentTypes: FiatPaymentTypes
  regionCode: FiatPluginRegionCode
  providerId?: string
}
export interface FiatPlugin {
  pluginId: string
  startPlugin: (params: FiatPluginStartParams) => Promise<void>
}

export type FiatPluginFactory = (params: FiatPluginFactoryArgs) => Promise<FiatPlugin>
