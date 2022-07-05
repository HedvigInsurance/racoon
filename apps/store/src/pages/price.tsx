import styled from '@emotion/styled'
import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { Button, Space } from 'ui'
import { PriceCalculator } from '@/components/PriceCalculator/PriceCalculator'
import { SWEDEN_APARTMENT_FORM } from '@/components/PriceCalculator/PriceCalculator.constants'
import type {
  InputGroup,
  PriceFormTemplate,
} from '@/components/PriceCalculator/PriceCalculator.types'
import useRouterRefresh from '@/hooks/useRouterRefresh'
import { CookiePersister } from '@/services/priceForm/CookiePersister'
import { PriceForm } from '@/services/priceForm/priceForm.types'
import { PriceFormService } from '@/services/priceForm/PriceFormService'
import { ServerCookiePersister } from '@/services/priceForm/ServerCookiePersister'

const Section = styled.div(({ theme }) => ({
  padding: theme.space[4],
}))

const CartButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.space[4],
}))

const ButtonInner = styled(Space)(() => ({
  display: 'flex',
  alignItems: 'center',
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
    <>
      <Space y={3}>
        <PriceCalculator form={template} onSubmit={handleSubmit} />

        <Section>
          {form.priceQuote && (
            <div>
              <CartButton fullWidth>
                <p>SEK {form.priceQuote.price}/month</p>

                <ButtonInner x={0.5}>
                  <p>Add to cart</p>
                </ButtonInner>
              </CartButton>
            </div>
          )}
        </Section>

        <Section>
          <Button onClick={handleClickReset} fullWidth>
            Reset
          </Button>
        </Section>
      </Space>
    </>
  )
}

const fetchOrCreateForm = async (service: PriceFormService) => {
  const existingForm = await service.fetchLatest()
  if (existingForm) return existingForm

  return service.create({ product: 'car' })
}

const prePopulateTemplate = (template: PriceFormTemplate, form: PriceForm): PriceFormTemplate => {
  return {
    groups: template.groups.map((group) => {
      const newGroup: InputGroup = {
        ...group,
        inputs: group.inputs.map((input) => ({
          ...input,
          defaultValue: form.data[input.name] ?? '',
        })),
        state: 'INITIAL',
      }

      if (newGroup.inputs.every((input) => input.defaultValue)) {
        newGroup.state = 'VALID'
      }

      return newGroup
    }),
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
