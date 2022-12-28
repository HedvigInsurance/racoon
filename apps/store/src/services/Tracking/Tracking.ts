import { ProductOfferFragment } from '@/services/apollo/generated'
import { AppTrackingContext, pushToGTMDataLayer, setGtmContext } from '@/services/gtm'
import { isBrowser } from '@/utils/env'
import { newSiteAbTest } from '../../newSiteAbTest'

type TrackingContext = Record<string, unknown>

export enum TrackingEvent {
  ExperimentImpression = 'experiment_impression',
  OfferCreated = 'offer_created',
  PageView = 'virtual_page_view',
}

// Simple version with 2 destinations (GTM and Datadog) implemented inline
export class Tracking {
  constructor(public context: TrackingContext = {}) {}

  public setContext = (key: string, value: unknown) => {
    if (this.context[key] !== value) {
      console.debug('tracking context', key, value)
    }
    this.context[key] = value
  }

  public setAppContext = (context: AppTrackingContext) => {
    this.setContext('countryCode', context.countryCode)
    setGtmContext(context)
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

  public reportOffer(offer: ProductOfferFragment) {
    this.ensureBrowserEnvironment()
    const event = {
      event: TrackingEvent.OfferCreated,
      offerData: {
        currency: offer.price.currencyCode as string,
        insurance_price: offer.price.amount,
        insurance_type: offer.variant.typeOfContract,
        // TODO: Decide what to do with remaining fields
        // number_of_people
        // referral_code
        // has_accident
        // has_home
        // has_travel
        // is_student
        // discounted_premium
        // flow_type
        // quote_cart_id
        // has_house
        // ownership_type
        // has_car_
        // car_sub_type
      },
    }
    console.debug(event.event, event.offerData)
    pushToGTMDataLayer(event)
  }

  private ensureBrowserEnvironment() {
    if (!isBrowser()) {
      throw new Error('This method must be called in browser environment')
    }
  }
}
