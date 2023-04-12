import { CartFragmentFragment } from '@/services/apollo/generated'

// Adtraction Product Category Tracking https://adtraction.com/productcategory.htm?tp=1719019650
// We don't need to send amount since provision isn't based on order amount for our program
export const getAdtractionProductCategories = (cart: CartFragmentFragment) => {
  const categoryList = cart.entries.reduce((acc, product) => {
    if (product.variant.typeOfContract.includes('ACCIDENT')) return [...acc, 'accident_0']
    if (product.variant.typeOfContract.includes('HOUSE')) return [...acc, 'house_0']
    if (product.variant.typeOfContract.includes('CAR')) return [...acc, 'car_0']
    if (product.variant.typeOfContract.includes('APARTMENT_STUDENT'))
      return [...acc, 'homecontentstudent_0']
    if (product.variant.typeOfContract.includes('APARTMENT')) return [...acc, 'homecontent_0']
    if (product.variant.typeOfContract.includes('DOG')) return [...acc, 'dog_0']
    if (product.variant.typeOfContract.includes('CAT')) return [...acc, 'cat_0']

    return acc
  }, [] as string[])
  return categoryList.join('-')
}
