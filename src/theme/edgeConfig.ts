import { AppConfig } from '../types/types'
import { edgeDark } from './variables/edgeDark'
import { edgeLight } from './variables/edgeLight'

export const edgeConfig: AppConfig = {
  appId: undefined,
  appName: 'Edge',
  appNameShort: 'Edge',
  appStore: 'https://itunes.apple.com/app/id1344400091',
  backupAccountSite: 'https://edge.app/light-account-creation/',
  configName: 'edge',
  darkTheme: edgeDark,
  defaultWallets: ['BTC', 'ETH', 'LTC', 'BCH', 'DASH'],
  forceCloseUrlIos: 'https://support.apple.com/en-us/HT201330 ',
  forceCloseUrlAndroid: 'https://support.google.com/android/answer/9079646?hl=en',
  knowledgeBase: 'https://help.edge.app/support/home',
  lightTheme: edgeLight,
  notificationServers: ['https://notif1.edge.app'],
  phoneNumber: '+1-619-777-5688',
  referralServers: ['https://referral1.edge.app'],
  supportsEdgeLogin: true,
  supportEmail: 'support@edge.app',
  supportContactSite: 'https://support.edge.app/hc/en-us/requests/new',
  supportSite: 'https://help.edge.app/support/tickets/new',
  termsOfServiceSite: 'https://edge.app/tos/',
  website: 'https://edge.app'
}
