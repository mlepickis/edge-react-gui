import { fantomPolicyInfo } from './policyInfo/fantom'
import { StakePolicyInfo } from './stakePolicy'

export interface StakePluginInfo {
  pluginId: string
  policyInfo: StakePolicyInfo[]
}

export const pluginInfo: StakePluginInfo = {
  pluginId: 'stake:uniswapV2',
  policyInfo: [...fantomPolicyInfo]
}
