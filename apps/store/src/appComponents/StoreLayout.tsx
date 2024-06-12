import { type ReactNode, Suspense } from 'react'
import { AppTrackingTriggers } from '@/app/[locale]/AppTrackingTriggers'
import { StoryblokLayout } from '@/app/[locale]/StoryblokLayout'
import { ProductMetadataProvider } from '@/appComponents/providers/ProductMetadataProvider'
import { StoryblokProvider } from '@/appComponents/providers/StoryblokProvider'
import { RootLayout } from '@/appComponents/RootLayout/RootLayout'
import { AppErrorDialog } from '@/components/AppErrorDialog'
import { CookieConsent } from '@/components/CookieConsent/CookieConsent'
import { GlobalBannerDynamic } from '@/components/GlobalBanner/GlobalBannerDynamic'
import { fetchGlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import { CompanyReviewsMetadataProvider } from '@/features/memberReviews/CompanyReviewsMetadataProvider'
import { fetchCompanyReviewsMetadata } from '@/features/memberReviews/memberReviews'
import { getApolloClient } from '@/services/apollo/app-router/rscClient'
import { AppErrorProvider } from '@/services/appErrors/AppErrorContext'
import { type GlobalStory } from '@/services/storyblok/storyblok'
import { getStoryBySlug } from '@/services/storyblok/storyblok.rsc'
import { TrackingProvider } from '@/services/Tracking/TrackingContext'
import { Features } from '@/utils/Features'
import { type RoutingLocale } from '@/utils/l10n/types'

type StoreLayoutProps = {
  locale: RoutingLocale
  children: ReactNode
}

// Used in global not-found page and in CMS pages
export async function StoreLayout({ locale, children }: StoreLayoutProps) {
  const apolloClient = getApolloClient(locale)
  const [companyReviewsMetadata, productMetadata, globalStory] = await Promise.all([
    fetchCompanyReviewsMetadata(),
    fetchGlobalProductMetadata({ apolloClient }),
    getStoryBySlug<GlobalStory>('global', { locale }),
  ])

  return (
    <RootLayout locale={locale}>
      <ProductMetadataProvider productMetadata={productMetadata}>
        <CompanyReviewsMetadataProvider companyReviewsMetadata={companyReviewsMetadata}>
          <AppErrorProvider>
            <TrackingProvider>
              <AppErrorDialog />
              <GlobalBannerDynamic />
              <StoryblokProvider>
                <StoryblokLayout globalStory={globalStory}>{children}</StoryblokLayout>
              </StoryblokProvider>
              <Suspense>
                <AppTrackingTriggers />
              </Suspense>
            </TrackingProvider>
          </AppErrorProvider>
        </CompanyReviewsMetadataProvider>
      </ProductMetadataProvider>
      {Features.enabled('COOKIE_BANNER_INP_IMPROVEMENT') && <CookieConsent />}
    </RootLayout>
  )
}
