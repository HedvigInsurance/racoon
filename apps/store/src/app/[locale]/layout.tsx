import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { Suspense } from 'react'
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
import type { GlobalStory } from '@/services/storyblok/storyblok'
import { getStoryBySlug } from '@/services/storyblok/storyblok.rsc'
import { TrackingProvider } from '@/services/Tracking/TrackingContext'
import { Features } from '@/utils/Features'
import { locales } from '@/utils/l10n/locales'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import type { RoutingLocale } from '@/utils/l10n/types'
import { AppTrackingTriggers } from './AppTrackingTriggers'
import { StoryblokLayout } from './StoryblokLayout'

export type LocalizedLayoutProps<P = unknown> = P & {
  children: ReactNode
  params: { locale: RoutingLocale }
}

const Layout = async ({ children, params: { locale } }: LocalizedLayoutProps) => {
  // GOTCHA: We cannot exclude unknown locales with `dynamicParams = false` since it apparently overrides
  // `dynamicParams` in `[[...slug]]` child dir which breaks our desired CMS rendering config
  // NextJs issue: https://github.com/vercel/next.js/issues/42940
  if (!isRoutingLocale(locale)) {
    return notFound()
  }
  const apolloClient = getApolloClient(locale)
  const [companyReviewsMetadata, productMetadata, globalStory] = await Promise.all([
    fetchCompanyReviewsMetadata(),
    fetchGlobalProductMetadata({ apolloClient }),
    getStoryBySlug<GlobalStory>('global', { locale }),
  ])

  return (
    <>
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
    </>
  )
}

export const generateStaticParams = () => {
  return Object.values(locales).map(({ routingLocale }) => ({ locale: routingLocale }))
}

export default Layout
