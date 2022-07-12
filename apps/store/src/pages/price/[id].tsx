import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { TestPricePage } from '@/components/TestPricePage/TestPricePage'
import {
  fetchOrCreatePriceIntent,
  prepopulateFormTemplate,
} from '@/components/TestPricePage/TestPricePage.helpers'
import { TestPricePageProps } from '@/components/TestPricePage/TestPricePage.types'
import useRouterRefresh from '@/hooks/useRouterRefresh'
import { FormTemplateService } from '@/services/formTemplate/FormTemplateService'
import { CookiePersister } from '@/services/priceIntent/CookiePersister'
import { PriceIntentService } from '@/services/priceIntent/PriceIntentService'
import { ServerCookiePersister } from '@/services/priceIntent/ServerCookiePersister'

type Params = {
  id: string
}

type Props = Pick<TestPricePageProps, 'template' | 'intent'>

const clientPriceIntentService = new PriceIntentService(new CookiePersister())

const NextTestPricePage: NextPage<Props> = ({ template, intent }) => {
  const refreshData = useRouterRefresh()

  const handleSubmit: TestPricePageProps['onSubmit'] = async (params) => {
    await clientPriceIntentService.addData({ id: intent.id, data: params.data })
    await refreshData()
  }

  const router = useRouter()
  const handleReset = async () => {
    await clientPriceIntentService.reset()
    router.reload()
  }

  return (
    <TestPricePage
      template={template}
      intent={intent}
      onSubmit={handleSubmit}
      onReset={handleReset}
    />
  )
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  if (context.params === undefined) return { notFound: true }

  const productId = context.params.id

  const serverPriceIntentService = new PriceIntentService(
    new ServerCookiePersister(context.req, context.res),
  )
  const formTemplateService = new FormTemplateService()

  const [intent, emptyTemplate] = await Promise.all([
    fetchOrCreatePriceIntent({ service: serverPriceIntentService, productId }),
    formTemplateService.fetch({ id: productId }),
  ])

  if (emptyTemplate === null) return { notFound: true }

  const template = prepopulateFormTemplate(emptyTemplate, intent)

  return { props: { template, intent } }
}

export default NextTestPricePage
