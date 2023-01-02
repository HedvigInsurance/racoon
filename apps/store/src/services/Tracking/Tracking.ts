import { datadogLogs } from '@datadog/browser-logs'
import { ProductData } from '@/components/ProductPage/ProductPage.types'
import { CartFragmentFragment, ProductOfferFragment } from '@/services/apollo/generated'
import {
  AppTrackingContext,
  EcommerceEvent,
  pushToGTMDataLayer,
  setGtmContext,
} from '@/services/gtm'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { newSiteAbTest } from '../../newSiteAbTest'

type TrackingContext = Record<string, unknown>

export enum TrackingEvent {
  AddToCart = 'add_to_cart',
  BeginCheckout = 'begin_checkout',
  DeleteFromCart = 'delete_from_cart',
  ExperimentImpression = 'experiment_impression',
  OfferCreated = 'offer_created',
  PageView = 'virtual_page_view',
  Purchase = 'purchase',
  SignedCustomer = 'signed_customer',
  ViewCart = 'view_cart',
  ViewItem = 'view_item',
}

// Simple version with 2 destinations (GTM and Datadog) implemented inline
export class Tracking {
  static LOGGER_NAME = 'tracking'

  constructor(public context: TrackingContext = {}) {}

  private logger = datadogLogs.getLogger(Tracking.LOGGER_NAME)!

  public setContext = (key: string, value: unknown) => {
    if (this.context[key] !== value) {
      console.debug(`tracking context ${key}:`, value)
    }
    if (value != null) {
      this.context[key] = value
    } else {
      delete this.context[key]
    }
  }

  public setAppContext = (context: AppTrackingContext) => {
    this.setContext('countryCode', context.countryCode)
    setGtmContext(context)
  }

  public setProductContext = (product: ProductData) => {
    this.setContext('has_home', product.name.includes('_APARTMENT'))
    this.setContext('has_house', product.name.includes('_HOUSE'))
    this.setContext('has_card', product.name.includes('_CAR'))
    this.setContext('has_accident', product.name.includes('_ACCIDENT'))
    this.setContext('has_travel', false)
    this.setContext('is_student', product.name.includes('STUDENT'))
  }

  public setPriceIntentContext = (priceIntent: PriceIntent) => {
    const { numberCoInsured } = priceIntent.data
    this.setContext(
      'number_of_people',
      numberCoInsured ? parseInt(numberCoInsured, 10) + 1 : undefined,
    )
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

  // TODO: Decide what to do with legacy context fields
  // referral_code
  // discounted_premium
  // flow_type
  // quote_cart_id
  // ownership_type
  // car_sub_type
  public reportOfferCreated(offer: ProductOfferFragment) {
    // Our custom event compatible with market-web
    const event = {
      event: TrackingEvent.OfferCreated,
      offerData: {
        id: offer.id,
        currency: offer.price.currencyCode as string,
        insurance_price: offer.price.amount,
        insurance_type: offer.variant.typeOfContract,
        ...this.context,
      },
    }
    this.logger.log(event.event, event.offerData)
    pushToGTMDataLayer(event)
  }

  public reportViewItem(offer: ProductOfferFragment) {
    this.reportEcommerceEvent(offerToEcommerceEvent(TrackingEvent.ViewItem, offer))
  }

  public reportAddToCart(offer: ProductOfferFragment) {
    this.reportEcommerceEvent(offerToEcommerceEvent(TrackingEvent.AddToCart, offer))
  }

  public reportDeleteFromCart(offer: ProductOfferFragment) {
    this.reportEcommerceEvent(offerToEcommerceEvent(TrackingEvent.DeleteFromCart, offer))
  }

  public reportViewCart(cart: CartFragmentFragment) {
    this.reportEcommerceEvent(cartToEcommerceEvent(TrackingEvent.ViewCart, cart))
  }

  public reportBeginCheckout(cart: CartFragmentFragment) {
    this.reportEcommerceEvent(cartToEcommerceEvent(TrackingEvent.BeginCheckout, cart))
  }

  public reportPurchase(cart: CartFragmentFragment) {
    const event = cartToEcommerceEvent(TrackingEvent.Purchase, cart)
    event.ecommerce.transaction_id = cart.id
    this.reportEcommerceEvent(event)
  }

  // Google Analytics ecommerce events
  // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm
  private reportEcommerceEvent(ecommerceEvent: EcommerceEvent) {
    const { event, ...dataFields } = ecommerceEvent
    this.logger.log(event, dataFields)
    pushToGTMDataLayer(ecommerceEvent)
  }
}

datadogLogs.createLogger(Tracking.LOGGER_NAME)

const offerToEcommerceEvent = (
  event: TrackingEvent,
  offer: ProductOfferFragment,
): EcommerceEvent => {
  return {
    event,
    ecommerce: {
      value: offer.price.amount,
      currency: offer.price.currencyCode,
      items: [
        {
          item_id: offer.variant.typeOfContract,
          item_name: offer.variant.displayName,
          price: offer.price.amount,
        },
      ],
    },
  } as const
}

// NOTE: Intentionally not adding coupon field, there's no good mapping between our model and analytics
// Let's figure it out later when/if it becomes a priority
const cartToEcommerceEvent = (event: TrackingEvent, cart: CartFragmentFragment): EcommerceEvent => {
  return {
    event,
    ecommerce: {
      value: cart.cost.net.amount,
      currency: cart.cost.net.currencyCode,
      items: cart.entries.map((entry) => ({
        item_id: entry.variant.typeOfContract,
        item_name: entry.variant.displayName,
        price: entry.price.amount,
      })),
    },
  } as const
}
