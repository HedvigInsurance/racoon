import { graphql } from 'msw'
import { graphqlConstants } from '../helpers'
import { getConstants } from './PaymentMock.constants'

const { PAYMENT_PROVIDERS } = getConstants()

const api = graphql.link(graphqlConstants().GRAPHQL_ENDPOINT)

export const mockPaymentHandlers = [
  api.query(PAYMENT_PROVIDERS, (_, res, ctx) => {
    return res(
      ctx.data({
        paymentProviders: [
          {
            __typename: 'PaymentProviderAdyen',
            availablePaymentMethods: {
              paymentMethods: [
                {
                  brands: ['visadankort', 'mc', 'visa'],
                  details: [
                    {
                      key: 'encryptedCardNumber',
                      type: 'cardToken',
                    },
                    {
                      key: 'encryptedSecurityCode',
                      type: 'cardToken',
                    },
                    {
                      key: 'encryptedExpiryMonth',
                      type: 'cardToken',
                    },
                    {
                      key: 'encryptedExpiryYear',
                      type: 'cardToken',
                    },
                    {
                      key: 'holderName',
                      optional: true,
                      type: 'text',
                    },
                  ],
                  name: 'Credit Card',
                  type: 'scheme',
                },
                {
                  configuration: {
                    merchantId: '50',
                    gatewayMerchantId: 'HEDVIG-DK',
                  },
                  details: [
                    {
                      key: 'paywithgoogle.token',
                      type: 'payWithGoogleToken',
                    },
                  ],
                  name: 'Google Pay',
                  type: 'paywithgoogle',
                },
              ],
            },
          },
        ],
      }),
    )
  }),
]
