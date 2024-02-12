import { type GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { type ComponentProps } from 'react'
import { InitiateCarCancellationPage } from '@/components/InitiateCarCancellationPage/InitiateCarCancellationPage'
import { getAccessToken } from '@/services/authApi/persist'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'

type Params = { contractId: string }

type Props = ComponentProps<typeof InitiateCarCancellationPage>

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  patchNextI18nContext(context)
  if (!context.params) throw new Error('Failed to render car cancellation page')
  if (!isRoutingLocale(context.locale)) throw new Error('Invalid locale')

  const ssn = context.query.ssn

  return {
    props: {
      ...(await serverSideTranslations(context.locale)),
      contractId: context.params.contractId,
      ...(typeof ssn === 'string' && { ssn }),
      isAuthenticated: !!getAccessToken({ req: context.req }),
    },
  }
}

export default InitiateCarCancellationPage
