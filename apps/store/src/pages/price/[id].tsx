import type { GetServerSideProps, NextPage } from 'next'
import type { FormEvent } from 'react'
import { TestPricePage } from '@/components/TestPricePage/TestPricePage'
import { prepopulateFormTemplate } from '@/components/TestPricePage/TestPricePage.helpers'
import { TestPricePageProps } from '@/components/TestPricePage/TestPricePage.types'
import useRouterRefresh from '@/hooks/useRouterRefresh'
import { PageLink } from '@/lib/PageLink'
import { FormTemplateService } from '@/services/formTemplate/FormTemplateService'
import { priceIntentServiceInitServerSide } from '@/services/priceIntent/PriceIntentService'

type Params = {
  id: string
}

type Props = TestPricePageProps

const NextTestPricePage: NextPage<Props> = ({ product, template }) => {
  const refreshData = useRouterRefresh()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const { intent, ...data } = Object.fromEntries(formData.entries())

    const url = PageLink.apiPriceProduct({
      productId: product.id,
      intent: intent === 'confirm' ? 'confirm' : undefined,
    })
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
    await refreshData()
  }

  return (
    <form onSubmit={handleSubmit}>
      <TestPricePage product={product} template={template} />
    </form>
  )
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  if (context.params === undefined) return { notFound: true }

  const productId = context.params.id

  const priceIntentServiceServerSide = priceIntentServiceInitServerSide(context.req, context.res)

  const formTemplateService = new FormTemplateService()

  const [emptyTemplate, priceIntent] = await Promise.all([
    formTemplateService.fetch({ id: productId }),
    priceIntentServiceServerSide.fetch(productId),
  ])

  if (emptyTemplate === null) return { notFound: true }

  const template = prepopulateFormTemplate(emptyTemplate, priceIntent.data)

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
}

export default NextTestPricePage
