import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { CartFragmentFragment, ProductOfferFragment } from '@/services/apollo/generated'
import {
  AppTrackingContext,
  EcommerceEvent,
  pushToGTMDataLayer,
  initializeGtm,
} from '@/services/gtm'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { newSiteAbTest } from '../../newSiteAbTest'

type TrackingContext = Partial<Record<TrackingContextKey, unknown>>

type TrackingProductData = {
  id: string
  displayNameFull: string
}

export enum TrackingEvent {
  AddToCart = 'add_to_cart',
  BeginCheckout = 'begin_checkout',
  DeleteFromCart = 'delete_from_cart',
  ExperimentImpression = 'experiment_impression',
  OfferCreated = 'offer_created',
  OpenPriceCalculator = 'open_price_calculator',
  PageView = 'virtual_page_view',
  Purchase = 'purchase',
  SelectItem = 'select_item',
  SignedCustomer = 'signed_customer',
  ViewCart = 'view_cart',
  ViewItem = 'view_item',
}

export enum TrackingContextKey {
  City = 'city',
  CountryCode = 'countryCode',
  Customer = 'customer',
  NumberOfPeople = 'numberOfPeople',
  ShopSessionId = 'shopSessionId',
  ZipCode = 'zipCode',
}

// Simple version with 2 destinations (GTM and Datadog) implemented inline
export class Tracking {
  static LOGGER_NAME = 'tracking'

  constructor(public context: TrackingContext = {}) {}

  private logger = datadogLogs.getLogger(Tracking.LOGGER_NAME)!

  public setContext = (key: TrackingContextKey, value: unknown) => {
    if (this.context[key] !== value) {
      console.debug(`tracking context ${key}:`, value)
    }
    if (value != null) {
      this.context[key] = value
    } else {
      delete this.context[key]
    }
  }

  public setPriceIntentContext = (priceIntent: PriceIntent) => {
    const { numberCoInsured } = priceIntent.data
    this.setContext(
      TrackingContextKey.NumberOfPeople,
      numberCoInsured ? parseInt(numberCoInsured, 10) + 1 : undefined,
    )
    this.setContext(TrackingContextKey.ZipCode, priceIntent.data.zipCode)
    this.setContext(TrackingContextKey.City, priceIntent.data.city)
  }

  public reportAppInit = (context: AppTrackingContext) => {
    this.setContext(TrackingContextKey.CountryCode, context.countryCode)
    initializeGtm(context)
  }

  public reportPageView(urlPath: string) {
    const event = {
      event: TrackingEvent.PageView,
      pageData: {
        page: urlPath,
        title: document.title,
      },
    }
    console.debug(event.event, urlPath)
    pushToGTMDataLayer(event)
  }

  public reportExperimentImpression(variantId: string) {
    const event = {
      event: TrackingEvent.ExperimentImpression,
      eventData: {
        experiment_id: newSiteAbTest.optimizeExperimentId,
        variant_id: variantId,
      },
    }
    console.debug(event.event, variantId)
    pushToGTMDataLayer(event)
  }

  public reportViewProductPage(productData: TrackingProductData) {
    const event = productDataToEcommerceEvent(TrackingEvent.SelectItem, productData, this.context)
    Object.assign(event.ecommerce, {
      // TODO: Support recommendations as separate list
      item_list_id: 'store',
      item_list_name: 'Store',
    })
    this.reportEcommerceEvent(event)
  }

  public reportOpenPriceCalculator(productData: TrackingProductData) {
    this.reportEcommerceEvent(
      productDataToEcommerceEvent(TrackingEvent.OpenPriceCalculator, productData, this.context),
    )
  }

  // Legacy event in market-web format
  public async reportOfferCreated(offer: ProductOfferFragment) {
    const event = TrackingEvent.OfferCreated
    const userData = await getLegacyUserData(this.context)
    const eventData = {
      offerData: {
        insurance_price: offer.price.amount,
        currency: offer.price.currencyCode as string,

        insurance_type: offer.variant.typeOfContract,
        flow_type: offer.variant.product.name,
        ...getLegacyEventFlags([offer.variant.typeOfContract]),
      },
      userData,
      shopSession: {
        id: this.context[TrackingContextKey.ShopSessionId] as string,
      },
    }
    this.logger.log(event, eventData)
    pushToGTMDataLayer({ event, ...eventData })
  }

  // Legacy event in market-web format
  public async reportSignedCustomer(cart: CartFragmentFragment, memberId: string) {
    const event = TrackingEvent.SignedCustomer
    const userData = await getLegacyUserData(this.context)

    const eventData = {
      offerData: {
        quote_cart_id: cart.id,
        transaction_id: cart.id,
        discounted_premium: cart.cost.net.amount,
        insurance_price: cart.cost.gross.amount,
        currency: cart.cost.net.currencyCode as string,

        insurance_type: cart.entries[0].variant.typeOfContract,
        flow_type: cart.entries[0].variant.product.name,
        memberId: memberId,
        ...getLegacyEventFlags(cart.entries.map((entry) => entry.variant.typeOfContract)),
      },
      shopSession: {
        id: this.context[TrackingContextKey.ShopSessionId] as string,
      },
      userData,
    }
    this.logger.log(event, eventData)
    pushToGTMDataLayer({ event, ...eventData })
  }

  public reportViewItem(offer: ProductOfferFragment) {
    this.reportEcommerceEvent(offerToEcommerceEvent(TrackingEvent.ViewItem, offer, this.context))
  }

  public reportAddToCart(offer: ProductOfferFragment) {
    this.reportEcommerceEvent(offerToEcommerceEvent(TrackingEvent.AddToCart, offer, this.context))
  }

  public reportDeleteFromCart(offer: ProductOfferFragment) {
    this.reportEcommerceEvent(
      offerToEcommerceEvent(TrackingEvent.DeleteFromCart, offer, this.context),
    )
  }

  public reportViewCart(cart: CartFragmentFragment) {
    this.reportEcommerceEvent(cartToEcommerceEvent(TrackingEvent.ViewCart, cart, this.context))
  }

  public reportBeginCheckout(cart: CartFragmentFragment) {
    this.reportEcommerceEvent(cartToEcommerceEvent(TrackingEvent.BeginCheckout, cart, this.context))
  }

  public reportPurchase(cart: CartFragmentFragment, memberId: string) {
    const event = cartToEcommerceEvent(TrackingEvent.Purchase, cart, this.context)
    event.ecommerce.transaction_id = cart.id
    this.reportEcommerceEvent(event)
    // Also report in web-onboarding format
    this.reportSignedCustomer(cart, memberId)
  }

  // Google Analytics ecommerce events
  // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm
  private reportEcommerceEvent(ecommerceEvent: EcommerceEvent) {
    const { event, ...dataFields } = ecommerceEvent
    this.logger.log(event, dataFields)
    datadogRum.addAction(event, dataFields)
    pushToGTMDataLayer(ecommerceEvent)
  }
}

datadogLogs.createLogger(Tracking.LOGGER_NAME)

const offerToEcommerceEvent = (
  event: TrackingEvent,
  offer: ProductOfferFragment,
  context: TrackingContext,
): EcommerceEvent => {
  return {
    event,
    ecommerce: {
      value: offer.price.amount,
      currency: offer.price.currencyCode,
      items: [
        {
          item_id: offer.variant.product.name,
          item_name: offer.variant.product.displayNameFull,
          price: offer.price.amount,
          variant: offer.variant.typeOfContract,
        },
      ],
    },
    shopSession: {
      id: context[TrackingContextKey.ShopSessionId] as string,
    },
  } as const
}

// NOTE: Intentionally not adding coupon field, there's no good mapping between our model and analytics
// Let's figure it out later when/if it becomes a priority
const cartToEcommerceEvent = (
  event: TrackingEvent,
  cart: CartFragmentFragment,
  context: TrackingContext,
): EcommerceEvent => {
  return {
    event,
    ecommerce: {
      value: cart.cost.net.amount,
      currency: cart.cost.net.currencyCode,
      items: cart.entries.map((entry) => ({
        item_id: entry.variant.product.name,
        item_name: entry.variant.product.displayNameFull,
        price: entry.price.amount,
        variant: entry.variant.typeOfContract,
      })),
    },
    shopSession: {
      id: context[TrackingContextKey.ShopSessionId] as string,
    },
  } as const
}

const productDataToEcommerceEvent = (
  event: TrackingEvent,
  productData: TrackingProductData,
  context: TrackingContext,
): EcommerceEvent => {
  return {
    event,
    ecommerce: {
      items: [
        {
          item_id: productData.id,
          item_name: productData.displayNameFull,
        },
      ],
    },
    shopSession: {
      id: context[TrackingContextKey.ShopSessionId] as string,
    },
  } as const
}

// TODO: Decide what do to with
// ownership_type - maybe expose though API?
// number_of_people - get from offer, tricky for cart
const getLegacyEventFlags = (typesOfContract: Array<string>) => {
  return {
    has_home: typesOfContract.some((type) => type.includes('_APARTMENT')),
    has_house: typesOfContract.some((type) => type.includes('_HOUSE')),
    has_car: typesOfContract.some((type) => type.includes('_CAR_')),
    has_accident: typesOfContract.some((type) => type.includes('_ACCIDENT')),
    is_student: typesOfContract.some((type) => type.includes('STUDENT')),
    car_sub_type: typesOfContract.find((type) => type.includes('_CAR_')),
  } as const
}

// Retargeting info for web-onboarding compatibility
// Reference for formatting user data
// https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
const getLegacyUserData = async (context: TrackingContext) => {
  const customer = context.customer as ShopSession['customer']
  if (!customer) return {}
  const firstName = await hashValue(normalizeUserValue(customer.firstName))
  const lastName = await hashValue(normalizeUserValue(customer.lastName))
  const email = await hashValue(normalizeUserValue(customer.email))
  const zipCode = await hashValue(normalizeUserValue(context.zipCode))
  const city = await hashValue(normalizeUserValue(context.city))
  const country = await hashValue(normalizeUserValue(context.countryCode))
  return {
    fn: firstName,
    ln: lastName,
    em: email,
    ad: {
      zp: zipCode,
      ct: city,
      co: country,
    },
  } as const
}

// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
export const hashValue = async (value?: string) => {
  const msgUint8 = new TextEncoder().encode(value)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

const normalizeUserValue = (value: unknown) => {
  if (value && typeof value !== 'string' && typeof value !== 'number') {
    throw new Error(`Unexpected type for userData normalization ${typeof value}`)
  }
  const punctuationAndWhitespaceRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\s]/g
  return (
    value?.toString().toLowerCase().trim().replace(punctuationAndWhitespaceRegex, '') ?? undefined
  )
}
