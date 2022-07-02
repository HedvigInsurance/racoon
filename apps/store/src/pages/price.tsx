import styled from '@emotion/styled'
import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { Button, Space } from 'ui'
import { PriceCalculator } from '@/components/PriceCalculator/PriceCalculator'
import { SWEDEN_APARTMENT_FORM } from '@/components/PriceCalculator/PriceCalculator.constants'
import type { PriceFormTemplate } from '@/components/PriceCalculator/PriceCalculator.types'
import useRouterRefresh from '@/hooks/useRouterRefresh'
import { CookiePersister } from '@/services/priceForm/CookiePersister'
import { PriceForm } from '@/services/priceForm/priceForm.types'
import { PriceFormService } from '@/services/priceForm/PriceFormService'
import { ServerCookiePersister } from '@/services/priceForm/ServerCookiePersister'

const Wrapper = styled.div(({ theme }) => ({
  padding: theme.space[4],
}))

type HandleSubmitParams = { data: Record<string, string> }

type Props = {
  template: PriceFormTemplate
  form: PriceForm
}

const priceCalculator = new PriceFormService(new CookiePersister())

const NextPricePage: NextPage<Props> = ({ template, form }) => {
  const refreshData = useRouterRefresh()

  const handleSubmit = async (params: HandleSubmitParams) => {
    await priceCalculator.addData({ id: form.id, data: params.data })
    await refreshData()
  }

  const router = useRouter()
  const handleClickReset = async () => {
    await priceCalculator.reset()
    router.reload()
  }

  return (
    <Wrapper>
      <Space y={4}>
        <PriceCalculator form={template} onSubmit={handleSubmit} />
        {form.priceQuote && (
          <div>
            <h2>Price quote</h2>
            <p>{form.priceQuote.price} SEK</p>

            <p>{form.priceQuote.id}</p>
            <Button>Add to cart</Button>
          </div>
        )}

        <Button onClick={handleClickReset} fullWidth>
          Reset
        </Button>
      </Space>
    </Wrapper>
  )
}

const fetchOrCreateForm = async (service: PriceFormService) => {
  const existingForm = await service.fetchLatest()
  if (existingForm) return existingForm

  return service.create({ product: 'car' })
}

const prePopulateTemplate = (template: PriceFormTemplate, form: PriceForm): PriceFormTemplate => {
  return {
    groups: template.groups.map((group) => ({
      ...group,
      inputs: group.inputs.map((input) => ({
        ...input,
        defaultValue: form.data[input.name] ?? '',
      })),
    })),
  }
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const serverPriceCalculator = new PriceFormService(
    new ServerCookiePersister(context.req, context.res),
  )

  const form = await fetchOrCreateForm(serverPriceCalculator)

  const template = prePopulateTemplate(SWEDEN_APARTMENT_FORM, form)

  return { props: { template, form } }
}

export default NextPricePage
