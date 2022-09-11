/* globals describe it expect */

import * as React from 'react'
import ShallowRenderer from 'react-test-renderer/shallow'

import { CreateWalletImportComponent } from '../../components/scenes/CreateWalletImportScene'
import { getTheme } from '../../components/services/ThemeContext'
import { fakeNavigation } from '../../util/fake/fakeNavigation'
import { fakeUser } from '../../util/fake-user'

describe('CreateWalletImportComponent', () => {
  it('should render with loading props', () => {
    const renderer = new ShallowRenderer()

    const props = {
      navigation: fakeNavigation,
      route: {
        name: 'createWalletImport',
        params: {
          selectedWalletType: {
            currencyName: 'ethereum',
            walletType: 'wallet:ethereum',
            symbolImage: 'ETH',
            currencyCode: 'ETH'
          }
        }
      },
      account: () => fakeUser,
      context: { apiKey: '', appId: '' }, // used  EdgeContextOptions
      theme: getTheme()
    }
    const actual = renderer.render(<CreateWalletImportComponent {...props} />)

    expect(actual).toMatchSnapshot()
  })
})
