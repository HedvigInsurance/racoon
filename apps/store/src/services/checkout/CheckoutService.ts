import { Market } from '@/lib/l10n/types'
import { CheckoutPerson } from './Checkout.types'
import { CookiePersister } from './CookiePersister'

const getCurrency = (market: Market) => {
  switch (market) {
    case Market.Sweden:
      return 'SEK'
    case Market.Norway:
      return 'NOK'
    case Market.Denmark:
      return 'DKK'
  }
}

const getCheckoutMethods = (market: Market): Array<CheckoutMethod> => {
  switch (market) {
    case Market.Sweden:
      return ['SWEDISH_BANK_ID']
    case Market.Norway:
    case Market.Denmark:
      return ['SIMPLE_SIGN']
  }
}

const getInitialStateType = (market: Market) => {
  switch (market) {
    case Market.Sweden:
      return 'PERSON_SIGN'
    case Market.Norway:
    case Market.Denmark:
      return 'PERSON'
  }
}

export class CheckoutService {
  constructor(private readonly persister: CookiePersister<CheckoutState>) {}

  public async checkoutCreate({ market }: CheckoutCreateParams) {
    const checkout: CheckoutState = {
      type: getInitialStateType(market),
      currency: getCurrency(market),
      cost: { total: 115 },
      products: [
        {
          name: 'Hedvig Home',
          cost: 115,
        },
      ],
      checkoutMethods: getCheckoutMethods(market),
      market,
    }

    this.persister.save({ data: checkout })
    return checkout
  }

  public async checkout() {
    return await this.persister.fetch()
  }

  public async personCreate({ checkout, person }: PersonCreateParams) {
    const newCheckout: CheckoutState = {
      ...checkout,
      type: 'CONNECT_PAYMENT',
      person,
    }

    await this.persister.save({ data: newCheckout })

    return newCheckout
  }

  public async paymentConnectSign({ checkout }: PaymentConnectParams) {
    if (checkout.type !== 'CONNECT_PAYMENT') {
      throw new Error(`Not in payment state: ${checkout.type}`)
    }

    const newCheckout: CheckoutState = { ...checkout, type: 'COMPLETED' }

    await this.persister.save({ data: newCheckout })

    return newCheckout
  }

  public async personCreateSign({ checkout, person }: PersonCreateParams) {
    if (checkout.market !== Market.Sweden) throw new Error('Not available in Sweden')

    const newCheckout: CheckoutState = {
      ...checkout,
      type: 'UPDATE_PAYMENT',
      person,
    }

    await this.persister.save({ data: newCheckout })

    return newCheckout
  }
}

type CheckoutCreateParams = { market: Market }
type PersonCreateParams = { checkout: CheckoutState; person: CheckoutPerson }
type PaymentConnectParams = { checkout: CheckoutState }

type CheckoutState = BaseState &
  (PersonState | PersonSignState | ConnectPaymentState | UpdatePaymentState | CompletedState)

type PersonState = { type: 'PERSON' }
type PersonSignState = { type: 'PERSON_SIGN' }
type ConnectPaymentState = { type: 'CONNECT_PAYMENT'; person: CheckoutPerson }
type UpdatePaymentState = { type: 'UPDATE_PAYMENT'; person: CheckoutPerson }
type CompletedState = { type: 'COMPLETED'; person: CheckoutPerson }

type BaseState = {
  currency: string
  cost: CheckoutCost
  products: Array<CheckoutProduct>
  checkoutMethods: Array<CheckoutMethod>
  market: Market
}

type CheckoutProduct = { name: string; cost: number }

type CheckoutCost = { total: number }

type CheckoutMethod = 'SWEDISH_BANK_ID' | 'SIMPLE_SIGN'
