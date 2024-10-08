import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import md5 from 'md5'
import {
  type CartFragment,
  type CountryCode,
  type ProductOfferFragment,
  type ShopSessionExperiments,
} from '@/services/graphql/generated'
import { type EcommerceEvent, initializeGtm, pushToGTMDataLayer, setUserId } from '@/services/gtm'
import { getAdtractionProductCategories } from './adtraction'
import { type InternalEventReporter } from './InternalEventReporter'
import { TrackingEvent } from './TrackingEvent'

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

type TrackingContext = Partial<{
  city: string
  countryCode: CountryCode
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
  public context: TrackingContext = {}
  public internalEventReporter: InternalEventReporter | null = null

  private logger = datadogLogs.getLogger(Tracking.LOGGER_NAME)!

  public reportAppInit = (countryCode: CountryCode) => {
    console.debug(`app init, country=${countryCode}`)
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
      ...Tracking.sessionData(this.context),
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

  public reportAdtractionEvent(cart: CartFragment, customerEmail: string) {
    const event = TrackingEvent.Adtraction
    // We currently only support 1 campaign code
    const campaignCode = cart.redeemedCampaign?.code
    const productCategories = getAdtractionProductCategories(cart)
    const eventData = {
      adtraction: {
        md5: md5(customerEmail),
        transactionId: cart.id,
        // Our Adtraction program isn't based on order amount, total should be set to 0
        transactionTotal: 0,
        transactionProductCategories: productCategories,
        ...(campaignCode && { transactionPromoCode: campaignCode }),
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

  public reportViewCart(cart: CartFragment) {
    this.reportEcommerceEvent(cartToEcommerceEvent(TrackingEvent.ViewCart, cart, this.context))
  }

  public reportBeginCheckout(cart: CartFragment) {
    this.reportEcommerceEvent(cartToEcommerceEvent(TrackingEvent.BeginCheckout, cart, this.context))
  }

  public async reportPurchase({
    cart,
    memberId,
    customer,
  }: {
    cart: CartFragment
    memberId: string
    customer: {
      email: string
      firstName?: string
      lastName?: string
    }
  }) {
    setUserId(memberId)
    const event = cartToEcommerceEvent(TrackingEvent.Purchase, cart, this.context)
    const userData = await getLegacyUserData(this.context, customer, cart)
    event.ecommerce.userData = userData
    event.ecommerce.transaction_id = cart.id
    this.reportEcommerceEvent(event)
    this.reportAdtractionEvent(cart, customer.email)
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

  public reportShopSessionExperiments(experiments: Partial<ShopSessionExperiments>) {
    const event = TrackingEvent.ShopSessionExperiments
    // { exp_a: true, exp_b: false} => ['exp_a']
    const activeExperiments = Object.keys(experiments).filter(
      (key) => !!experiments[key as keyof ShopSessionExperiments],
    )
    const data = {
      active_experiments: activeExperiments,
      ...this.shopSessionData(),
    }
    this.logger.log(event, data)
    datadogRum.addAction(event, data)
    pushToGTMDataLayer({
      event,
      ...data,
    })
  }

  public reportViewPromotion(options: ViewPromotionOptions) {
    const event = TrackingEvent.ViewPromotion
    const data = {
      ecommerce: {
        promotion_id: options.promotionId,
        creative_name: options.creativeName,
        items: [
          {
            item_id: options.productId,
            item_name: options.productName,
            item_variant: options.productVariant,
            price: options.priceAmount,
          },
        ],
      },
      ...this.shopSessionData(),
      ...this.sessionData(),
    }
    this.reportEcommerceEvent({ event, ...data })
  }

  // Google Analytics ecommerce events
  // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm
  private reportEcommerceEvent(ecommerceEvent: EcommerceEvent) {
    const { event, ...dataFields } = ecommerceEvent
    this.logger.log(event, dataFields)
    datadogRum.addAction(event, dataFields)
    pushToGTMDataLayer(ecommerceEvent)
  }

  ////////////////////////////
  // Internal analytics events
  public reportDeviceInfo(deviceInfo: DeviceInfo) {
    this.reportInternalEvent(TrackingEvent.DeviceInfo, deviceInfo)
  }

  public reportExpandPeril(productName: string, perilTitle: string) {
    this.reportInternalEvent(TrackingEvent.ExpandPeril, { productName, perilTitle })
  }

  public reportClickTermsAndConditions(productName: string, productVariant: string) {
    this.reportInternalEvent(TrackingEvent.ClickTermsAndConditions, {
      productName,
      productVariant,
    })
  }

  public reportOpenProductReviews(productName: string) {
    this.reportInternalEvent(TrackingEvent.OpenProductReviews, { productName })
  }

  private reportInternalEvent(type: TrackingEvent, data: object) {
    if (this.internalEventReporter == null) return
    this.logger.log(type, data)
    this.internalEventReporter.enqueue(type, data)
  }
}

type DeviceInfo = {
  deviceType: string
  osName: string
  browserName: string
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
    price_match: {
      exposure_matched: !!offer.priceMatch,
      price_matched: !!offer.priceMatch && offer.priceMatch.priceReduction.amount > 0,
    },
    ...Tracking.shopSessionData(context),
    ...Tracking.sessionData(context),
  } as const
}

type ViewPromotionOptions = {
  promotionId: string
  creativeName: string
  productId: string
  productName: string
  productVariant?: string
  priceAmount?: number
}

// NOTE: Intentionally not adding coupon field, there's no good mapping between our model and analytics
// Let's figure it out later when/if it becomes a priority
const cartToEcommerceEvent = (
  event: TrackingEvent,
  cart: CartFragment,
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

// Retargeting info for web-onboarding compatibility
// Reference for formatting user data
// https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
const getLegacyUserData = async (
  context: TrackingContext,
  customerData: { email: string; firstName?: string; lastName?: string },
  cart: CartFragment,
) => {
  if (!customerData.email) return {}
  const email = await hashValue(normalizeEmail(customerData.email))
  const gmail = isGmail(customerData.email)
    ? await hashValue(normalizeGmail(customerData.email))
    : undefined
  const firstName = await hashValue(normalizeUserValue(customerData.firstName))
  const lastName = await hashValue(normalizeUserValue(customerData.lastName))
  const zipCode = await hashValue(normalizeUserValue(cart.entries[0].priceIntentData.zipCode))
  // We currently don't expose city in shopsession so leave empty for now
  const city = ''
  const country = await hashValue(normalizeUserValue(context.countryCode))
  return {
    em: email,
    ...(gmail && { gem: gmail }),
    fn: firstName,
    ln: lastName,
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

export const normalizeUserValue = (value: unknown) => {
  if (value && typeof value !== 'string' && typeof value !== 'number') {
    throw new Error(`Unexpected type for userData normalization ${typeof value}`)
  }
  const punctuationAndWhitespaceRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\s]/g
  return (
    value?.toString().toLowerCase().trim().replace(punctuationAndWhitespaceRegex, '') ?? undefined
  )
}

export const normalizeEmail = (value: unknown) => {
  if (value && typeof value !== 'string') {
    throw new Error(`Unexpected type for email normalization ${typeof value}`)
  }

  const whitespaceRegex = /\s/g
  return value?.toString().toLowerCase().trim().replace(whitespaceRegex, '') ?? undefined
}

export const normalizeGmail = (value: unknown) => {
  const normalizedEmail = normalizeEmail(value)
  if (!normalizedEmail) return undefined

  // Remove all periods (.) that precede the domain name
  // in gmail.com and googlemail.com email addresses
  // https://developers.google.com/google-ads/api/docs/conversions/enhanced-conversions/web#python
  const emailParts = normalizedEmail.split('@')
  emailParts[0] = emailParts[0].replaceAll('.', '')
  const normalizedGmail = emailParts.join('@')

  return normalizedGmail
}

const isGmail = (email: string) => {
  const normalizedEmail = normalizeEmail(email)
  if (!normalizedEmail) return false
  const gmailRegex = /^(gmail|googlemail)\.com\s*/
  const emailParts = normalizedEmail.split('@')
  return emailParts.length > 1 && gmailRegex.test(emailParts[1])
}
