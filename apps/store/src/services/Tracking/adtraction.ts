import { CartFragmentFragment } from '@/services/apollo/generated'

export const getAdtractionProductCategories = (cart: CartFragmentFragment) => {
  const categoryList = cart.entries.reduce((acc, product) => {
    if (product.variant.typeOfContract.includes('ACCIDENT')) return [...acc, 'accident_0']
    if (product.variant.typeOfContract.includes('HOUSE')) return [...acc, 'house_0']
    if (product.variant.typeOfContract.includes('CAR')) return [...acc, 'car_0']
    if (product.variant.typeOfContract.includes('APARTMENT_STUDENT'))
      return [...acc, 'homecontentstudent_0']
    if (product.variant.typeOfContract.includes('APARTMENT')) return [...acc, 'homecontent_0']

    return acc
  }, [] as string[])
  return categoryList.join('-')
}
