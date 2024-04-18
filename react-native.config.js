module.exports = {
  dependencies: {
    'react-native-custom-tabs': {
      platforms: {
        ios: null
      }
    }
  },
  project: {
    android: {
      unstable_reactLegacyComponentNames: [
        // list of conponents that needs to be wrapped by the interop layer
      ]
    },
    ios: {
      unstable_reactLegacyComponentNames: [
        // list of conponents that needs to be wrapped by the interop layer
      ]
    }
  }
}
