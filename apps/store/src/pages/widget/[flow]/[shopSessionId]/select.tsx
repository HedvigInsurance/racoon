import { type GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { type ComponentProps } from 'react'
import { GlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import { useHydrateProductMetadata } from '@/components/LayoutWithMenu/ProductMetadataContext'
import { fetchProductMetadata } from '@/features/widget/fetchProductMetadata'
import { SelectProductPage } from '@/features/widget/SelectProductPage'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type Props = ComponentProps<typeof SelectProductPage> & {
  productMetadata: GlobalProductMetadata
}

type Params = {
  flow: string
  shopSessionId: string
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  if (!context.params) throw new Error('Missing params')
  if (!isRoutingLocale(context.locale)) throw new Error(`Invalid locale: ${context.locale}`)

  const [translations, productMetadata] = await Promise.all([
    serverSideTranslations(context.locale),
    fetchProductMetadata({
      locale: context.locale,
      flow: context.params.flow,
      draft: context.draftMode,
    }),
  ])

  return {
    props: { ...translations, productMetadata, ...context.params },
  }
}

const Page = (props: Props) => {
  useHydrateProductMetadata(props.productMetadata)

  return <SelectProductPage {...props} />
}

export default Page
