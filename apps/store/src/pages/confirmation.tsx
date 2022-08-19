import type { GetServerSideProps, NextPageWithLayout } from 'next'
import { ConfirmationPage } from '@/components/ConfirmationPage/ConfirmationPage'
import { ConfirmationPageProps } from '@/components/ConfirmationPage/ConfirmationPage.types'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { PageLink } from '@/lib/PageLink'
import { initializeApollo } from '@/services/apollo/client'
import { CheckoutService } from '@/services/checkout/CheckoutService'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'

export const getServerSideProps: GetServerSideProps<ConfirmationPageProps> = async ({
  req,
  res,
}) => {
  const apolloClient = initializeApollo()
  const shopSession = await getCurrentShopSessionServerSide({ req, res, apolloClient })
  const checkoutService = new CheckoutService(shopSession, apolloClient)

  if (checkoutService.checkout().completedAt === null) {
    return { redirect: { destination: PageLink.store(), permanent: false } }
  }

  return {
    props: {
      currency: 'SEK',
      cost: { total: 0 },
      products: [],
      firstName: 'Josh',
    },
  }
}

const CheckoutConfirmationPage: NextPageWithLayout<ConfirmationPageProps> = (props) => {
  return <ConfirmationPage {...props} />
}

CheckoutConfirmationPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default CheckoutConfirmationPage
