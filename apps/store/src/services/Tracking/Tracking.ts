import { pushToGTMDataLayer } from '@/services/gtm'
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

  private ensureBrowserEnvironment() {
    if (!isBrowser()) {
      throw new Error('This method must be called in browser environment')
    }
  }
}
