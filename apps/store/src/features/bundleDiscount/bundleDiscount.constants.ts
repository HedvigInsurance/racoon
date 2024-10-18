// TODO: Move these settings to API if we decide to convert experiment into real feature
export const BUNDLE_DISCOUNT_PERCENTAGE = '15%'
// TODO: Calculate # of eligible items on server and return in API. This should probably be related to priceIntent
export const BUNDLE_DISCOUNT_ELIGIBLE_PRODUCT_IDS = new Set([
  'Product:SE_APARTMENT_RENT',
  'Product:SE_APARTMENT_BRF',
  'Product:SE_APARTMENT_STUDENT',
  'Product:SE_HOUSE',
  'Product:SE_CAR',
  'Product:SE_PET_CAT',
  'Product:SE_PET_DOG',
])
