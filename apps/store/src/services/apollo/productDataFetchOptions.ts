// Shorter validation window in preview environments to simplify testing terms changes
// GOTCHA: storefront has its own caching for product metadata configured in storyblok, so you may see delays there
export const productDataFetchOptions = {
  next: {
    // We want to see terms-hub changes soon in preview environments
    // but production requires higher performance, hence long cache TTL
    revalidate: process.env.VERCEL_ENV === 'production' ? 12 * 60 * 60 : 60,
    // Not used yet, but makes debugging with NEXT_PRIVATE_DEBUG_CACHE=1 easier
    tags: ['productData'],
  },
}
