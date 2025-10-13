import type { CartItem, Product } from "./tipos"

const CART_KEY = "shopping_cart_items"

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return []

  const cartStr = localStorage.getItem(CART_KEY)
  if (!cartStr) return []

  try {
    return JSON.parse(cartStr)
  } catch {
    return []
  }
}

export function addToCart(product: Product): void {
  const cart = getCart()
  const existingItem = cart.find((item) => item.product.id === product.id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ product, quantity: 1 })
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export function removeFromCart(productId: number): void {
  const cart = getCart()
  const updatedCart = cart.filter((item) => item.product.id !== productId)
  localStorage.setItem(CART_KEY, JSON.stringify(updatedCart))
}

export function updateQuantity(productId: number, quantity: number): void {
  const cart = getCart()
  const item = cart.find((item) => item.product.id === productId)

  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      item.quantity = quantity
      localStorage.setItem(CART_KEY, JSON.stringify(cart))
    }
  }
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY)
}

export function getCartTotal(): number {
  const cart = getCart()
  return cart.reduce((total, item) => total + item.product.precio * item.quantity, 0)
}

export function getCartItemCount(): number {
  const cart = getCart()
  return cart.reduce((count, item) => count + item.quantity, 0)
}
