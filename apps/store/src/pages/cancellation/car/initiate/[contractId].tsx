import { type GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { type ComponentProps } from 'react'
import { InitiateCarCancellationPage } from '@/components/InitiateCarCancellationPage/InitiateCarCancellationPage'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type Params = { contractId: string }

type Props = ComponentProps<typeof InitiateCarCancellationPage>

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  if (!context.params) throw new Error('Failed to render car cancellation page')
  if (!isRoutingLocale(context.locale)) throw new Error('Invalid locale')

  const ssn = context.query.ssn as string | undefined

  return {
    props: {
      ...(await serverSideTranslations(context.locale)),
      contractId: context.params.contractId,
      ssn,
    },
  }
}

export default InitiateCarCancellationPage
