import { cookies } from 'next/headers'
import { type ReactNode, Suspense } from 'react'
import { AppTrackingTriggers } from '@/app/[locale]/AppTrackingTriggers'
import { StoryblokLayout } from '@/app/[locale]/StoryblokLayout'
import { ProductMetadataProvider } from '@/appComponents/providers/ProductMetadataProvider'
import { ShopSessionTrackingProvider } from '@/appComponents/providers/ShopSessionTrackingProvider'
import { StoryblokProvider } from '@/appComponents/providers/StoryblokProvider'
import { RootLayout } from '@/appComponents/RootLayout/RootLayout'
import { AppErrorDialog } from '@/components/AppErrorDialog'
import { CookieConsent } from '@/components/CookieConsent/CookieConsent'
import { GlobalBannerDynamic } from '@/components/GlobalBanner/GlobalBannerDynamic'
import { fetchGlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import { CompanyReviewsMetadataProvider } from '@/features/memberReviews/CompanyReviewsMetadataProvider'
import { fetchCompanyReviewsMetadata } from '@/features/memberReviews/memberReviews'
import { setupApolloClient } from '@/services/apollo/app-router/rscClient'
import { AppErrorProvider } from '@/services/appErrors/AppErrorContext'
import { getShopSessionId } from '@/services/shopSession/app-router/ShopSession.utils'
import { ShopSessionProvider } from '@/services/shopSession/ShopSessionContext'
import { type GlobalStory } from '@/services/storyblok/storyblok'
import { getStoryBySlug } from '@/services/storyblok/storyblok.rsc'
import { Features } from '@/utils/Features'
import { type RoutingLocale } from '@/utils/l10n/types'

type StoreLayoutProps = {
  locale: RoutingLocale
  children: ReactNode
}

// Does not use routing params directly, so can be used outside of app/[locale] if needed - just pass locale explicitly
export async function StoreLayout({ locale, children }: StoreLayoutProps) {
  const shopSessionId = getShopSessionId(cookies())

  const { getApolloClient } = setupApolloClient({ locale })
  const apolloClient = getApolloClient()
  const [companyReviewsMetadata, productMetadata, globalStory] = await Promise.all([
    fetchCompanyReviewsMetadata(),
    fetchGlobalProductMetadata({ apolloClient }),
    getStoryBySlug<GlobalStory>('global', { locale }),
  ])

  return (
    <RootLayout locale={locale}>
      <ShopSessionProvider shopSessionId={shopSessionId}>
        <ProductMetadataProvider productMetadata={productMetadata}>
          <CompanyReviewsMetadataProvider companyReviewsMetadata={companyReviewsMetadata}>
            <ShopSessionTrackingProvider>
              <AppErrorProvider>
                <AppErrorDialog />
                <GlobalBannerDynamic />
                <StoryblokProvider>
                  <StoryblokLayout globalStory={globalStory}>{children}</StoryblokLayout>
                </StoryblokProvider>
              </AppErrorProvider>
              <Suspense>
                <AppTrackingTriggers />
              </Suspense>
            </ShopSessionTrackingProvider>
          </CompanyReviewsMetadataProvider>
        </ProductMetadataProvider>
        {Features.enabled('COOKIE_BANNER_INP_IMPROVEMENT') && <CookieConsent />}
      </ShopSessionProvider>
    </RootLayout>
  )
}
