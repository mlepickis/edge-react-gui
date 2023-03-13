import { asMaybe, asObject, asString } from 'cleaners'

export const asHomeAddress = asObject({
  address: asString,
  address2: asMaybe(asString),
  city: asString,
  country: asString,
  state: asString,
  postalCode: asString
})

export type HomeAddress = ReturnType<typeof asHomeAddress>
