/**
 * If you want to enable locale keys typechecking and enhance IDE experience.
 *
 * Requires `resolveJsonModule:true` in your tsconfig.json.
 *
 * @link https://www.i18next.com/overview/typescript
 */
import 'i18next'

import type bankid from '../../public/locales/en/bankid.json'
import type carDealership from '../../public/locales/en/carDealership.json'
import type cart from '../../public/locales/en/cart.json'
import type checkout from '../../public/locales/en/checkout.json'
import type common from '../../public/locales/en/common.json'
import type contactUs from '../../public/locales/en/contact-us.json'
import type cookieConsent from '../../public/locales/en/cookieConsent.json'
import type memberArea from '../../public/locales/en/memberArea.json'
import type purchaseForm from '../../public/locales/en/purchase-form.json'
import type reviews from '../../public/locales/en/reviews.json'
import type widget from '../../public/locales/en/widget.json'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface I18nNamespaces {
  bankid: typeof bankid
  cart: typeof cart
  checkout: typeof checkout
  cookieConsent: typeof cookieConsent
  common: typeof common
  'purchase-form': typeof purchaseForm
  carDealership: typeof carDealership
  memberArea: typeof memberArea
  'contact-us': typeof contactUs
  widget: typeof widget
  reviews: typeof reviews
}

declare module 'i18next' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: I18nNamespaces
    returnNull: false
  }
}
