/**
 * If you want to enable locale keys typechecking and enhance IDE experience.
 *
 * Requires `resolveJsonModule:true` in your tsconfig.json.
 *
 * @link https://www.i18next.com/overview/typescript
 */
import 'i18next'

import type cart from '../../public/locales/en/cart.json'
import type checkout from '../../public/locales/en/checkout.json'
import type common from '../../public/locales/en/common.json'
import type purchaseForm from '../../public/locales/en/purchase-form.json'

interface I18nNamespaces {
  common: typeof common
  cart: typeof cart
  checkout: typeof checkout
  'purchase-form': typeof purchaseForm
}

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: I18nNamespaces
    returnNull: false
  }
}
