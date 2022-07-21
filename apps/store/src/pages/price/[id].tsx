import type { GetServerSideProps, NextPage } from 'next'
import { setupPriceCalculator } from '@/components/PriceCalculator/PriceCalculator.helpers'
import { useHandleSubmitPriceCalculator } from '@/components/PriceCalculator/useHandleSubmitPriceCalculator'
import { TestPricePage } from '@/components/TestPricePage/TestPricePage'
import { TestPricePageProps } from '@/components/TestPricePage/TestPricePage.types'

type Params = {
  id: string
}

type Props = TestPricePageProps

const NextTestPricePage: NextPage<Props> = ({ product, template }) => {
  const { handleSubmit } = useHandleSubmitPriceCalculator({ productId: product.id })

  return (
    <form onSubmit={handleSubmit}>
      <TestPricePage product={product} template={template} />
    </form>
  )
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  if (context.params === undefined) return { notFound: true }
  const productId = context.params.id

  try {
    const { template, priceIntent } = await setupPriceCalculator({
      productId,
      request: context.req,
      response: context.res,
    })

    const lineItem = priceIntent.lines?.[0]

    return {
      props: {
        template,
        product: {
          id: productId,
          name: 'Hedvig Home',
          price: lineItem?.price.amount ?? null,
          currencyCode: 'SEK',
          gradient: ['#00BFFF', '#00ff00'],
        },
      },
    }
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
}

export default NextTestPricePage
