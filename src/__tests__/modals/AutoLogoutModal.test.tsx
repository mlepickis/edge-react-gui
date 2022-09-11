/* globals describe it expect */

import * as React from 'react'
import ShallowRenderer from 'react-test-renderer/shallow'

import { AutoLogoutModal } from '../../components/modals/AutoLogoutModal'
import { getTheme } from '../../components/services/ThemeContext'
import { fakeAirshipBridge } from '../../util/fake/fakeAirshipBridge'

describe('AutoLogoutModal', () => {
  it('should render with loading props', () => {
    // @ts-expect-error
    const renderer = new ShallowRenderer()

    const props = {
      bridge: fakeAirshipBridge,
      autoLogoutTimeInSeconds: 11,
      theme: getTheme()
    }
    const actual = renderer.render(<AutoLogoutModal {...props} />)

    expect(actual).toMatchSnapshot()
  })
})
