import dynamic from 'next/dynamic'

export const GlobalBannerDynamic = dynamic(() => import('@/components/GlobalBanner/GlobalBanner'), {
  ssr: false,
})
