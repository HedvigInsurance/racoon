import React, { useEffect, useState } from 'react'
import { CmsProduct } from './mockCmsService'

export type CartProduct = {
  cmsProduct: CmsProduct
  // this kinda represents a unique instance of this product with provided details
  id: string
  price: number
}

type Cart = {
  items: CartProduct[]
  price: number
}

// This context mocks a BE data service
interface CartContextInterface {
  cart: Cart
  addProductToCart: (id: string, price: number, product: CmsProduct) => void
  getItemsByProductType: (productName: string) => CartProduct[]
  removeItem: (id: string) => void
}

export const useCartContextStore = (): CartContextInterface => {
  const [cartItems, setCartItems] = useState([] as CartProduct[])
  const [price, setPrice] = useState(0)
  const cart: Cart = {
    items: cartItems,
    price,
  }

  useEffect(() => {
    setPrice(cartItems.reduce((acc, cartItem) => acc + cartItem.price, 0))
  }, [cartItems])

  const _isProductInCart = (id: string): boolean => {
    return !!cartItems.find((item) => item.id === id)
  }

  const addProductToCart = (id: string, price: number, product: CmsProduct): void => {
    if (_isProductInCart(id)) return

    setCartItems((current) => [...current, { cmsProduct: product, id, price }])
  }

  const getItemsByProductType = (productName: string): CartProduct[] => {
    return cart.items.filter((item) => item.cmsProduct.product === productName)
  }

  const removeItem = (id: string): void => {
    setCartItems((current) => current.filter((item) => item.id !== id))
  }

  return { cart, addProductToCart, getItemsByProductType, removeItem }
}

export const CartContext = React.createContext<CartContextInterface | null>(null)
