import { type GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { type ComponentProps } from 'react'
import { fetchFlowProducts } from '@/features/widget/fetchFlowProducts'
import { SelectProductPage } from '@/features/widget/SelectProductPage'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type Props = ComponentProps<typeof SelectProductPage>

type Params = {
  flow: string
  shopSessionId: string
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  if (!context.params) throw new Error('Missing params')
  if (!isRoutingLocale(context.locale)) throw new Error(`Invalid locale: ${context.locale}`)

  const [translations, products] = await Promise.all([
    serverSideTranslations(context.locale),
    fetchFlowProducts({
      locale: context.locale,
      flow: context.params.flow,
      draft: context.draftMode,
    }),
  ])

  return {
    props: { ...translations, products, ...context.params },
  }
}

export default SelectProductPage
