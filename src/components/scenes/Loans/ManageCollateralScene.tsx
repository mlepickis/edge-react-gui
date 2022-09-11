import { mul } from 'biggystring'
import { EdgeCurrencyWallet } from 'edge-core-js'
import * as React from 'react'
import { sprintf } from 'sprintf-js'

import { getSpecialCurrencyInfo } from '../../../constants/WalletAndCurrencyConstants'
import { makeActionProgram } from '../../../controllers/action-queue/ActionProgram'
import { useRunningActionQueueId } from '../../../controllers/action-queue/ActionQueueStore'
import { runLoanActionProgram } from '../../../controllers/loan-manager/redux/actions'
import { LoanAccount } from '../../../controllers/loan-manager/types'
import { useAsyncEffect } from '../../../hooks/useAsyncEffect'
import { useHandler } from '../../../hooks/useHandler'
import { useWatch } from '../../../hooks/useWatch'
import s from '../../../locales/strings'
import { ApprovableAction } from '../../../plugins/borrow-plugins/types'
import { RootState } from '../../../reducers/RootReducer'
import { useMemo, useRef, useState } from '../../../types/reactHooks'
import { useDispatch, useSelector } from '../../../types/reactRedux'
import { NavigationProp, ParamList } from '../../../types/routerTypes'
import { zeroString } from '../../../util/utils'
import { FlipInputTile } from '../../cards/FlipInputTile'
import { CollateralAmountTile, DebtAmountTile, ExchangeRateTile, NetworkFeeTile } from '../../cards/LoanDebtsAndCollateralComponents'
import { WalletListModal, WalletListResult } from '../../modals/WalletListModal'
import { Airship, showError } from '../../services/AirshipInstance'
import { ExchangedFlipInputAmounts } from '../../themed/ExchangedFlipInput'
import { AprCard } from '../../tiles/AprCard'
import { InterestRateChangeTile } from '../../tiles/InterestRateChangeTile'
import { LoanToValueTile } from '../../tiles/LoanToValueTile'
import { FormScene } from '../FormScene'

type CollateralTokenMap = {
  [pluginId: string]: Array<{ pluginId: string; tokenId: string; currencyCode: string }>
}

// TODO: Integrate future changes to incorporate token contract addresses into the borrow plugin's domain
const collateralTokenMap: CollateralTokenMap = {
  ethereum: [{ pluginId: 'ethereum', tokenId: '2260fac5e5542a773aa44fbcfedf7c193bc2c599', currencyCode: 'WBTC' }],
  kovan: [{ pluginId: 'kovan', tokenId: 'd1b98b6607330172f1d991521145a22bce793277', currencyCode: 'WBTC' }],
  polygon: [{ pluginId: 'polygon', tokenId: '1bfd67037b42cf73acf2047067bd4f2c47d9bfd6', currencyCode: 'WBTC' }]
}

type ManageCollateralRequest =
  | {
      tokenId?: string
      fromWallet: EdgeCurrencyWallet
      nativeAmount: string
    }
  | {
      tokenId?: string
      toWallet: EdgeCurrencyWallet
      nativeAmount: string
    }

type Props<T extends keyof ParamList> = {
  // TODO: Remove use of ApprovableAction to calculate fees. Update ActionQueue to handle fee calcs
  action: (request: ManageCollateralRequest) => Promise<ApprovableAction>
  actionOpType: 'loan-borrow' | 'loan-deposit' | 'loan-repay' | 'loan-withdraw'
  actionWallet: 'fromWallet' | 'toWallet'
  amountChange?: 'increase' | 'decrease'
  defaultTokenId?: string
  loanAccount: LoanAccount
  ltvType: 'debts' | 'collaterals'

  showExchangeRateTile?: boolean
  showNewDebtAprChange?: true
  showNewDebtTile?: boolean
  showTotalCollateralTile?: boolean
  showTotalDebtTile?: boolean

  headerText: string
  navigation: NavigationProp<T>
}

export const ManageCollateralScene = <T extends keyof ParamList>(props: Props<T>) => {
  const {
    action,
    actionOpType,
    actionWallet,
    amountChange = 'increase',
    defaultTokenId,
    loanAccount,
    ltvType,

    showExchangeRateTile,
    showNewDebtAprChange,
    showNewDebtTile,
    showTotalCollateralTile,
    showTotalDebtTile,

    headerText,
    navigation
  } = props

  const { borrowEngine, borrowPlugin } = loanAccount
  const { currencyWallet: borrowEngineWallet } = loanAccount.borrowEngine
  const {
    currencyConfig: { allTokens },
    currencyInfo: borrowEngineCurrencyInfo,
    id: borrowEngineWalletId
  } = borrowEngineWallet
  const { pluginId: borrowEnginePluginId } = borrowEngineCurrencyInfo

  const collaterals = useWatch(borrowEngine, 'collaterals')
  const debts = useWatch(borrowEngine, 'debts')

  // State
  const account = useSelector((state: RootState) => state.core.account)
  const dispatch = useDispatch()
  const wallets = useWatch(account, 'currencyWallets')

  // Skip directly to LoanStatusScene if an action for the same actionOpType is already being processed
  const existingProgramId = useRunningActionQueueId(actionOpType, borrowEngineWalletId)
  if (existingProgramId != null) navigation.navigate('loanDetailsStatus', { actionQueueId: existingProgramId })

  // Flip input selected wallet
  const [selectedWallet, setSelectedWallet] = useState<EdgeCurrencyWallet>(borrowEngineWallet)
  const [selectedTokenId, setSelectedTokenId] = useState<string | undefined>(defaultTokenId)
  const selectedWalletName = useWatch(selectedWallet, 'name') ?? ''
  const { currencyCode: selectedCurrencyCode } = selectedTokenId == null ? borrowEngineCurrencyInfo : allTokens[selectedTokenId]
  const hasMaxSpend = getSpecialCurrencyInfo(borrowEnginePluginId).noMaxSpend !== true

  // Borrow engine stuff
  const [approvalAction, setApprovalAction] = useState<ApprovableAction | null>(null)
  const [actionNativeAmount, setActionNativeAmount] = useState('0')
  const [newDebtApr, setNewDebtApr] = useState(0)
  const collateralTokens = collateralTokenMap[borrowEnginePluginId]

  const [actionOp, setactionOp] = useState()
  // @ts-expect-error
  useAsyncEffect(async () => {
    const actionOp = {
      type: 'seq',
      actions: [
        {
          type: actionOpType,
          borrowPluginId: borrowPlugin.borrowInfo.borrowPluginId,
          nativeAmount: actionNativeAmount,
          walletId: selectedWallet.id,
          tokenId: selectedTokenId
        }
      ]
    }
    // @ts-expect-error
    setactionOp(actionOp)
  }, [actionNativeAmount, selectedWallet, selectedTokenId])

  // @ts-expect-error
  useAsyncEffect(async () => {
    if (zeroString(actionNativeAmount)) {
      setApprovalAction(null)
      return
    }

    const request = {
      nativeAmount: actionNativeAmount,
      [actionWallet]: selectedWallet,
      tokenId: selectedTokenId
    }

    // @ts-expect-error
    const approvalAction = await action(request)
    setApprovalAction(approvalAction)

    if (showNewDebtAprChange) {
      const apr = await borrowEngine.getAprQuote(selectedTokenId)
      setNewDebtApr(apr)
    }
  }, [actionNativeAmount])

  // Max send utils
  const toggleMaxSpend = useRef(false)

  const onMaxSpend = useHandler(() => {
    toggleMaxSpend.current = !toggleMaxSpend.current
  })

  const [firstLaunch, setFirstLaunch] = useState(true)
  // @ts-expect-error
  useAsyncEffect(async () => {
    if (firstLaunch) {
      // Don't call getMaxSpendable when the component is mounted
      setFirstLaunch(false)
      return
    }
    const spendAddress = collateralTokens.find(collateralToken => collateralToken.currencyCode === selectedCurrencyCode)
    const spendInfo = {
      currencyCode: selectedCurrencyCode,
      spendTargets: [
        {
          publicAddress: `0x${spendAddress?.tokenId}` // TODO: replace with aave contract? Just needed a contract address here
        }
      ]
    }
    const nativeAmount = await selectedWallet.getMaxSpendable(spendInfo)
    setActionNativeAmount(nativeAmount)
  }, [toggleMaxSpend.current])

  const handleAmountChanged = useHandler((amounts: ExchangedFlipInputAmounts) => {
    setActionNativeAmount(amounts.nativeAmount)
  })

  const showWalletPicker = useHandler(() => {
    const allowedAssets = collateralTokens
    Airship.show(bridge => (
      <WalletListModal bridge={bridge} headerTitle={s.strings.select_src_wallet} showCreateWallet={false} allowedAssets={allowedAssets} />
      // @ts-expect-error
    )).then(({ walletId, currencyCode, tokenId }: WalletListResult) => {
      if (walletId != null && currencyCode != null) {
        setSelectedWallet(wallets[walletId])
        setSelectedTokenId(tokenId)
        setActionNativeAmount('0')
      }
    })
  })

  const onSliderComplete = async (resetSlider: () => void) => {
    if (actionOp != null) {
      const actionProgram = await makeActionProgram(actionOp)
      try {
        await dispatch(runLoanActionProgram(loanAccount, actionProgram, actionOpType))
        navigation.navigate('loanDetailsStatus', { actionQueueId: actionProgram.programId })
      } catch (e: any) {
        showError(e)
      } finally {
        resetSlider()
      }
    }
  }

  // Tiles
  const renderFlipInput = useMemo(() => {
    return (
      <FlipInputTile
        hasMaxSpend={hasMaxSpend}
        // @ts-expect-error
        onMaxSpend={onMaxSpend}
        headerText={sprintf(s.strings.loan_add_from, selectedWalletName)}
        launchWalletSelector={showWalletPicker}
        onCryptoExchangeAmountChanged={handleAmountChanged}
        wallet={selectedWallet}
        tokenId={selectedTokenId}
        key="flipInput"
      />
    )
  }, [handleAmountChanged, hasMaxSpend, onMaxSpend, selectedTokenId, selectedWallet, selectedWalletName, showWalletPicker])

  const renderExchangeRateTile = useMemo(() => {
    return showExchangeRateTile ? <ExchangeRateTile wallet={borrowEngineWallet} tokenId={selectedTokenId} key="exchangeRate" /> : null
  }, [borrowEngineWallet, selectedTokenId, showExchangeRateTile])

  const renderNewAprCard = useMemo(() => {
    return showNewDebtAprChange ? <AprCard apr={newDebtApr} key="apr" /> : null
  }, [newDebtApr, showNewDebtAprChange])

  const renderTotalDebtTile = useMemo(() => {
    return showTotalDebtTile ? <DebtAmountTile title={s.strings.loan_current_principle} wallet={borrowEngineWallet} debts={debts} key="totalDebt" /> : null
  }, [borrowEngineWallet, debts, showTotalDebtTile])

  const renderNewDebtTile = useMemo(() => {
    const multiplier = amountChange === 'increase' ? '1' : '-1'
    const newDebt = { nativeAmount: mul(actionNativeAmount, multiplier), tokenId: selectedTokenId, apr: 0 } // APR is only present to appease Flow. It does not mean anything.
    return showNewDebtTile ? (
      <DebtAmountTile title={s.strings.loan_new_principle} wallet={borrowEngineWallet} debts={[...debts, newDebt]} key="newDebt" />
    ) : null
  }, [amountChange, actionNativeAmount, selectedTokenId, showNewDebtTile, borrowEngineWallet, debts])

  const renderTotalCollateralTile = useMemo(() => {
    return showTotalCollateralTile ? (
      <CollateralAmountTile title={s.strings.loan_total_collateral_value} wallet={borrowEngineWallet} collaterals={collaterals} key="totalcollateral" />
    ) : null
  }, [borrowEngineWallet, collaterals, showTotalCollateralTile])

  const renderFeeTile = useMemo(() => {
    const nativeAmount = approvalAction != null ? approvalAction.networkFee.nativeAmount : '0'
    return <NetworkFeeTile wallet={borrowEngineWallet} nativeAmount={nativeAmount} key="fee" />
  }, [borrowEngineWallet, approvalAction])

  const renderInterestRateChangeTile = useMemo(() => {
    const newDebt = { nativeAmount: actionNativeAmount, tokenId: selectedTokenId, apr: newDebtApr } // APR is only present to appease Flow. It does not mean anything.
    return showNewDebtAprChange != null ? <InterestRateChangeTile borrowEngine={borrowEngine} newDebt={newDebt} key="interestRate" /> : null
  }, [actionNativeAmount, borrowEngine, newDebtApr, selectedTokenId, showNewDebtAprChange])

  const renderLTVRatioTile = useMemo(() => {
    return (
      <LoanToValueTile
        borrowEngine={borrowEngine}
        tokenId={selectedTokenId}
        nativeAmount={actionNativeAmount}
        type={ltvType}
        direction={amountChange}
        key="ltv"
      />
    )
  }, [borrowEngine, amountChange, ltvType, selectedTokenId, actionNativeAmount])

  const tiles = [
    renderFlipInput,
    renderExchangeRateTile,
    renderNewAprCard,
    renderTotalDebtTile,
    renderNewDebtTile,
    renderTotalCollateralTile,
    renderFeeTile,
    renderInterestRateChangeTile,
    renderLTVRatioTile
  ]

  return (
    <FormScene headerText={headerText} onSliderComplete={onSliderComplete} sliderDisabled={approvalAction == null}>
      {tiles}
    </FormScene>
  )
}
