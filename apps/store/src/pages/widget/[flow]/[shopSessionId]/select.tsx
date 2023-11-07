import { type GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { type ComponentProps } from 'react'
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

  const translations = await serverSideTranslations(context.locale)

  return {
    props: {
      ...translations,
      ...context.params,
    },
  }
}

export default SelectProductPage
