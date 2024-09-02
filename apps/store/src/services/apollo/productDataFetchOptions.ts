// Shorter validation window in preview environments to simplify testing terms changes
// GOTCHA: storefront has its own caching for product metadata configured in storyblok, so you may see delays there
export const productDataFetchOptions = {
  next: {
    revalidate: process.env.VERCEL_ENV === 'production' ? 10 * 60 : 60,
    // Not used yet, but makes debugging with NEXT_PRIVATE_DEBUG_CACHE=1 easier
    tags: ['productData'],
  },
}
