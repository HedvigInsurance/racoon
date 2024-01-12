import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import md5 from 'md5'
import {
  type CartFragmentFragment,
  type CountryCode,
  type ProductOfferFragment,
} from '@/services/graphql/generated'
import { type EcommerceEvent, pushToGTMDataLayer, initializeGtm, setUserId } from '@/services/gtm'
import { getAdtractionProductCategories } from './adtraction'

type TrackingProductData = {
  id: string
  displayNameFull: string
}

type TrackingOffer = {
  cost: ProductOfferFragment['cost']
  product: {
    id: ProductOfferFragment['product']['id']
    displayNameFull: ProductOfferFragment['product']['displayNameFull']
  }
  variant: {
    typeOfContract: ProductOfferFragment['variant']['typeOfContract']
  }
  priceMatch?: ProductOfferFragment['priceMatch']
}

type ItemListSource = 'store' | 'recommendations'

export enum TrackingEvent {
  AddToCart = 'add_to_cart',
  Adtraction = 'adtraction',
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
  InsurelyPrompted = 'insurely_prompted',
  InsurelyAccepted = 'insurely_accepted',
  InsurelyCorrectlyFetched = 'insurely_correctly_fetched',
}

type TrackingContext = Partial<{
  city: string
  countryCode: CountryCode
  customerFirstName: string
  customerLastName: string
  customerEmail: string
  numberOfPeople: number
  shopSessionId: string
  zipCode: string
  productId: string
  productDisplayName: string
  partner: string
}>

// Simple version with 2 destinations (GTM and Datadog) implemented inline
export class Tracking {
  static LOGGER_NAME = 'tracking'

  constructor(public context: TrackingContext = {}) {}

  private logger = datadogLogs.getLogger(Tracking.LOGGER_NAME)!

  public reportAppInit = (countryCode: CountryCode) => {
    initializeGtm(countryCode)
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

  public reportExperimentImpression(experimentId: string, variantId: string) {
    const event = {
      event: TrackingEvent.ExperimentImpression,
      eventData: {
        experiment_id: experimentId,
        variant_id: variantId,
      },
    }
    console.debug(event.event, variantId)
    pushToGTMDataLayer(event)
  }

  public reportViewProductPage(productData: TrackingProductData) {
    this.reportSelectItem(productData, 'store')
  }

  public reportSelectItem(productData: TrackingProductData, itemListId: string) {
    const event = productDataToEcommerceEvent(TrackingEvent.SelectItem, productData, this.context)
    Object.assign(event.ecommerce, { item_list_id: itemListId })
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
        insurance_price: offer.cost.gross.amount,
        currency: offer.cost.gross.currencyCode as string,

        insurance_type: offer.variant.typeOfContract,
        flow_type: offer.product.name,
        ...getLegacyEventFlags([offer.variant.typeOfContract]),
      },
      userData,
      ...this.shopSessionData(),
      ...this.sessionData(),
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
        flow_type: cart.entries[0].product.name,
        memberId: memberId,
        ...getLegacyEventFlags(cart.entries.map((entry) => entry.variant.typeOfContract)),
      },
      ...this.shopSessionData(),
      userData,
    }
    this.logger.log(event, eventData)
    pushToGTMDataLayer({ event, ...eventData })
  }

  public reportAdtractionEvent(cart: CartFragmentFragment, context: TrackingContext) {
    const event = TrackingEvent.Adtraction
    // We currently only support 1 campaign code
    const campaignCode = cart.redeemedCampaign?.code
    const productCategories = getAdtractionProductCategories(cart)
    const eventData = {
      adtraction: {
        transactionId: cart.id,
        // Our Adtraction program isn't based on order amount, total should be set to 0
        transactionTotal: 0,
        transactionProductCategories: productCategories,
        ...(campaignCode && { transactionPromoCode: campaignCode }),
        ...(context.customerEmail && { md5: md5(context.customerEmail) }),
      },
    }
    this.logger.log(event, eventData)
    pushToGTMDataLayer({ event, ...eventData })
  }

  public reportViewItem(offer: TrackingOffer, source: ItemListSource) {
    this.reportEcommerceEvent(
      offerToEcommerceEvent({
        event: TrackingEvent.ViewItem,
        offer,
        context: this.context,
        source,
      }),
    )
  }

  public reportAddToCart(offer: TrackingOffer, source: ItemListSource) {
    this.reportEcommerceEvent(
      offerToEcommerceEvent({
        event: TrackingEvent.AddToCart,
        offer,
        context: this.context,
        source,
      }),
    )
  }

  public reportDeleteFromCart(offer: TrackingOffer) {
    this.reportEcommerceEvent(
      offerToEcommerceEvent({
        event: TrackingEvent.DeleteFromCart,
        offer,
        context: this.context,
      }),
    )
  }

  public reportViewCart(cart: CartFragmentFragment) {
    this.reportEcommerceEvent(cartToEcommerceEvent(TrackingEvent.ViewCart, cart, this.context))
  }

  public reportBeginCheckout(cart: CartFragmentFragment) {
    this.reportEcommerceEvent(cartToEcommerceEvent(TrackingEvent.BeginCheckout, cart, this.context))
  }

  public reportPurchase(cart: CartFragmentFragment, memberId: string, isNewMember: boolean) {
    setUserId(memberId)

    const event = cartToEcommerceEvent(TrackingEvent.Purchase, cart, this.context)
    event.ecommerce.transaction_id = cart.id
    event.new_customer = isNewMember
    this.reportEcommerceEvent(event)

    // Also report in web-onboarding format
    this.reportSignedCustomer(cart, memberId)
    this.reportAdtractionEvent(cart, this.context)
  }

  private productData(): TrackingProductData {
    return {
      id: this.context.productId ?? '',
      displayNameFull: this.context.productDisplayName ?? '',
    }
  }

  static shopSessionData(context: TrackingContext) {
    return {
      shopSession: { id: context.shopSessionId },
    }
  }

  static sessionData(context: TrackingContext) {
    return {
      sessionData: context.partner
        ? {
            channel: 'widget',
            partner: context.partner,
          }
        : { channel: 'store' },
    }
  }

  private shopSessionData() {
    return Tracking.shopSessionData(this.context)
  }

  private sessionData() {
    return Tracking.sessionData(this.context)
  }

  public reportInsurelyPrompted() {
    this.reportEcommerceEvent(
      productDataToEcommerceEvent(TrackingEvent.InsurelyPrompted, this.productData(), this.context),
    )
  }

  public reportInsurelyAccepted() {
    this.reportEcommerceEvent(
      productDataToEcommerceEvent(TrackingEvent.InsurelyAccepted, this.productData(), this.context),
    )
  }

  public reportInsurelyCorrectlyFetched() {
    this.reportEcommerceEvent(
      productDataToEcommerceEvent(
        TrackingEvent.InsurelyCorrectlyFetched,
        this.productData(),
        this.context,
      ),
    )
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

type OfferToEcommerseEventParams = {
  event: TrackingEvent
  offer: TrackingOffer
  context: TrackingContext
  source?: ItemListSource
}

const offerToEcommerceEvent = ({
  event,
  offer,
  context,
  source,
}: OfferToEcommerseEventParams): EcommerceEvent => {
  return {
    event,
    ecommerce: {
      value: offer.cost.gross.amount,
      currency: offer.cost.gross.currencyCode,
      items: [
        {
          item_id: offer.product.id,
          item_name: offer.product.displayNameFull,
          price: offer.cost.gross.amount,
          item_variant: offer.variant.typeOfContract,
          ...(source && { item_list_id: source }),
        },
      ],
    },
    ...Tracking.shopSessionData(context),
    ...Tracking.sessionData(context),
    price_match: {
      exposure_matched: !!offer.priceMatch,
      price_matched: !!offer.priceMatch && offer.priceMatch.priceReduction.amount > 0,
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
        item_id: entry.product.id,
        item_name: entry.product.displayNameFull,
        price: entry.cost.gross.amount,
        variant: entry.variant.typeOfContract,
      })),
    },
    ...Tracking.shopSessionData(context),
    ...Tracking.sessionData(context),
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
    ...Tracking.shopSessionData(context),
    ...Tracking.sessionData(context),
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
  if (!context.customerFirstName || !context.customerLastName || !context.customerEmail) return {}
  const zipCode = await hashValue(normalizeUserValue(context.zipCode))
  const city = await hashValue(normalizeUserValue(context.city))
  const country = await hashValue(normalizeUserValue(context.countryCode))
  return {
    fn: await hashValue(normalizeUserValue(context.customerFirstName)),
    ln: await hashValue(normalizeUserValue(context.customerLastName)),
    em: await hashValue(normalizeUserValue(context.customerEmail)),
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
