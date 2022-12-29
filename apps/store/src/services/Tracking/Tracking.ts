import { datadogLogs } from '@datadog/browser-logs'
import { ProductData } from '@/components/ProductPage/ProductPage.types'
import { ProductOfferFragment } from '@/services/apollo/generated'
import { AppTrackingContext, pushToGTMDataLayer, setGtmContext } from '@/services/gtm'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { isBrowser } from '@/utils/env'
import { newSiteAbTest } from '../../newSiteAbTest'

type TrackingContext = Record<string, unknown>

export enum TrackingEvent {
  ExperimentImpression = 'experiment_impression',
  OfferCreated = 'offer_created',
  PageView = 'virtual_page_view',
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
    this.setContext('number_of_people', numberCoInsured ? numberCoInsured + 1 : undefined)
  }

  public reportPageView(urlPath: string) {
    this.ensureBrowserEnvironment()
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
    this.ensureBrowserEnvironment()
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
    this.ensureBrowserEnvironment()
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
    this.ensureBrowserEnvironment()
    // Google Analytics ecommerce event
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#view_item
    const analyticsEvent = {
      event: TrackingEvent.ViewItem,
      value: offer.price.amount,
      currency: offer.price.currencyCode,
      items: [
        {
          item_id: offer.variant.typeOfContract,
          item_name: offer.variant.displayName,
        },
      ],
    }
    const { event, ...dataFields } = analyticsEvent
    this.logger.log(event, dataFields)
    pushToGTMDataLayer(analyticsEvent)
  }

  private ensureBrowserEnvironment() {
    if (!isBrowser()) {
      throw new Error('This method must be called in browser environment')
    }
  }
}

datadogLogs.createLogger(Tracking.LOGGER_NAME)
