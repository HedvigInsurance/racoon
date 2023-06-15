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

  // TODO: Implement this function after the API is ready
  const pageProps = {
    id: context.params.contractId,
    displayName: 'Bilförsäkring · If',
    status: { type: 'PENDING', message: 'Pending' },
    approveByDate: '2021-01-01',
  } satisfies Props

  return {
    props: {
      ...(await serverSideTranslations(context.locale)),
      ...pageProps,
    },
  }
}

export default InitiateCarCancellationPage
