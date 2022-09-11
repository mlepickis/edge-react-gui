/* globals describe it expect */

import * as React from 'react'
import ShallowRenderer from 'react-test-renderer/shallow'

import { RequestComponent } from '../components/scenes/RequestScene'
import { getTheme } from '../components/services/ThemeContext'

describe('Request', () => {
  it('should render with loading props', () => {
    // @ts-expect-error
    const renderer = new ShallowRenderer()

    const props = {
      currencyCode: null,
      currentScene: 'request',
      wallet: null,
      exchangeSecondaryToPrimaryRatio: null,
      guiWallet: null,
      loading: true,
      primaryCurrencyInfo: null,
      receiveAddress: null,
      secondaryCurrencyInfo: null,
      showToWalletModal: null,
      useLegacyAddress: null,
      wallets: {},
      theme: getTheme()
    }
    // @ts-expect-error
    const actual = renderer.render(<RequestComponent {...props} />)

    expect(actual).toMatchSnapshot()
  })

  it('should render with loaded props', () => {
    // @ts-expect-error
    const renderer = new ShallowRenderer()

    const props = {
      currencyCode: 'BTC',
      wallet: { currencyInfo: { pluginId: 'bitcoin' }, balances: { BTC: '1234' } },
      exchangeSecondaryToPrimaryRatio: {},
      guiWallet: {},
      loading: false,
      primaryCurrencyInfo: { displayDenomination: { multiplier: '100000000' }, exchangeDenomination: { multiplier: '100000000' } },
      receiveAddress: {},
      secondaryCurrencyInfo: {},
      showToWalletModal: false,
      useLegacyAddress: false,
      currentScene: 'request',
      wallets: {},
      theme: getTheme()
    }
    // @ts-expect-error
    const actual = renderer.render(<RequestComponent {...props} />)

    expect(actual).toMatchSnapshot()
  })
})
