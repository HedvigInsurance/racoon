import { type NextApiRequest, type NextApiResponse } from 'next'
import { submitAdyenRedirection } from '@/services/adyen/submitAdyenRedirection'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!isRoutingLocale(req.query.locale)) {
    throw new Error(`Invalid locale: ${req.query.locale}`)
  }

  const { MD: md, PaRes: pares } = req.body

  try {
    const apolloClient = await initializeApolloServerSide({ req, res })
    await submitAdyenRedirection(apolloClient, { md, pares })
  } catch (error) {
    console.warn('Payment Connect Legacy | Error submitting redirection: ', error)
    res.redirect(302, PageLink.paymentConnectLegacyError({ locale: req.query.locale }))
    return
  }

  res.redirect(302, PageLink.paymentConnectLegacySuccess({ locale: req.query.locale }).href)
}

export default handler
