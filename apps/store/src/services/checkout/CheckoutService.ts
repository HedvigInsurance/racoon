import { ApolloClient } from '@apollo/client'
import { Checkout } from '@/services/apollo/generated'
import { ShopSession } from '@/services/shopSession/ShopSession.types'

export class CheckoutService {
  constructor(
    private readonly shopSession: ShopSession,
    private readonly apolloClient: ApolloClient<unknown>,
  ) {}

  public checkout(): Checkout {
    throw new Error('Not implemented')
  }

  public async personCreate() {
    throw new Error('Not implemented')
  }
}
