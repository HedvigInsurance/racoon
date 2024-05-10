import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { ProductMetadataProvider } from '@/appComponents/providers/ProductMetadataProvider'
import { StoryblokProvider } from '@/appComponents/providers/StoryblokProvider'
import { RootLayout } from '@/appComponents/RootLayout/RootLayout'
import { AppErrorDialog } from '@/components/AppErrorDialog'
import { GlobalBannerDynamic } from '@/components/GlobalBanner/GlobalBannerDynamic'
import { fetchGlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import { CompanyReviewsMetadataProvider } from '@/features/memberReviews/CompanyReviewsMetadataProvider'
import { fetchCompanyReviewsMetadata } from '@/features/memberReviews/memberReviews'
import { getApolloClient } from '@/services/apollo/app-router/rscClient'
import { AppErrorProvider } from '@/services/appErrors/AppErrorContext'
import { ShopSessionProvider } from '@/services/shopSession/ShopSessionContext'
import type { GlobalStory } from '@/services/storyblok/storyblok'
import { getStoryBySlug } from '@/services/storyblok/storyblok.rsc'
import { TrackingProvider } from '@/services/Tracking/TrackingContext'
import { locales } from '@/utils/l10n/locales'
import type { RoutingLocale } from '@/utils/l10n/types'
import { NavigationTracker } from './NavigationTracker'
import { StoryblokLayout } from './StoryblokLayout'

export type LocalizedLayoutProps<P = unknown> = P & {
  children: ReactNode
  params: { locale: RoutingLocale }
}

const Layout = async ({ children, params: { locale } }: LocalizedLayoutProps) => {
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
            <ShopSessionProvider>
              <AppErrorProvider>
                <TrackingProvider>
                  <AppErrorDialog />
                  <GlobalBannerDynamic />
                  <StoryblokProvider>
                    <StoryblokLayout globalStory={globalStory}>{children}</StoryblokLayout>
                  </StoryblokProvider>
                  <Suspense>
                    <NavigationTracker />
                  </Suspense>
                </TrackingProvider>
              </AppErrorProvider>
            </ShopSessionProvider>
          </CompanyReviewsMetadataProvider>
        </ProductMetadataProvider>
      </RootLayout>
    </>
  )
}

export const dynamicParams = false

export const generateStaticParams = () => {
  return Object.values(locales).map(({ routingLocale }) => ({ locale: routingLocale }))
}

export default Layout
