"use client"

import { useEffect, useState } from "react"
import { Encabezado } from "@/components/encabezado"
import type { CartItem } from "@/lib/tipos"
import { getCart, removeFromCart, updateQuantity, getCartTotal, clearCart } from "@/lib/carrito"
import { getCurrentUser } from "@/lib/autenticacion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setIsClient(true)
    loadCart()

    const handleCartUpdate = () => {
      loadCart()
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    return () => window.removeEventListener("cartUpdated", handleCartUpdate)
  }, [])

  const loadCart = () => {
    setCart(getCart())
    setTotal(getCartTotal())
  }

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity)
    loadCart()
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const handleRemove = (productId: number) => {
    removeFromCart(productId)
    loadCart()
    window.dispatchEvent(new Event("cartUpdated"))
    toast({
      title: "Producto eliminado",
      description: "El producto se eliminó del carrito",
    })
  }

  const handleCheckout = () => {
    const user = getCurrentUser()
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para realizar la compra",
        variant: "destructive",
      })
      return
    }

    clearCart()
    loadCart()
    window.dispatchEvent(new Event("cartUpdated"))
    toast({
      title: "Compra exitosa",
      description: "Tu pedido ha sido procesado correctamente",
    })
  }

  if (!isClient) {
    return null
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen">
        <Encabezado />
        <main className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground" />
            <h1 className="text-3xl font-bold">Tu carrito está vacío</h1>
            <p className="text-muted-foreground">Agrega productos para comenzar tu compra</p>
            <Link href="/">
              <Button size="lg">Ver productos</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Encabezado />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold">Carrito de Compras</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.map((item) => (
                <Card key={item.product.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={item.product.imag || "/placeholder.svg"}
                          alt={item.product.nom}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="font-semibold">{item.product.nom}</h3>
                          <p className="text-sm text-muted-foreground">{item.product.cate}</p>
                        </div>
                        <div className="text-lg font-bold text-primary">${item.product.precio.toFixed(2)}</div>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <Button variant="ghost" size="icon" onClick={() => handleRemove(item.product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold">Resumen del pedido</h2>

                <div className="space-y-2 border-b pb-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product.nom} x{item.quantity}
                      </span>
                      <span>${(item.product.precio * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>

                <Button className="mt-6 w-full" size="lg" onClick={handleCheckout}>
                  Realizar compra
                </Button>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  {getCurrentUser() ? "Haz clic para completar tu compra" : "Debes iniciar sesión para comprar"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
