export interface Product {
  id: number
  nom: string
  descrip: string
  precio: number
  imag: string
  cate: string
  stock: number
}

export interface User {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface AuthUser {
  id: string
  email: string
  name: string
}
