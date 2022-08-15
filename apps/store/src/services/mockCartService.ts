import React, { useEffect, useState } from 'react'
import { Product, ProductNames } from './mockProductService'

type ProductWithSlug = Product & { slug: string }

export type CartProduct = {
  product: ProductWithSlug
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
  addProductToCart: (id: string, price: number, product: ProductWithSlug) => void
  /**
   * Returns cart items that matches on CmsProduct::name
   */
  getItemsByName: (productName: ProductNames) => CartProduct[]
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

  const addProductToCart = (id: string, price: number, product: ProductWithSlug): void => {
    if (_isProductInCart(id)) return

    setCartItems((current) => [...current, { product, id, price }])
  }

  const getItemsByProductName = (name: ProductNames): CartProduct[] => {
    return cart.items.filter((item) => item.product.name === name)
  }

  const removeItem = (id: string): void => {
    setCartItems((current) => current.filter((item) => item.id !== id))
  }

  return { cart, addProductToCart, getItemsByName: getItemsByProductName, removeItem }
}

export const CartContext = React.createContext<CartContextInterface | null>(null)
