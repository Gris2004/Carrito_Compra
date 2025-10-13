"use client"

import type { Product } from "@/lib/tipos"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from 'lucide-react'
import Image from "next/image"
import { addToCart } from "@/lib/carrito"
import { useToast } from "@/hooks/use-toast"


interface ProductCardProps {
  producto: Product
}

export function TarjetaProducto({ producto }: ProductCardProps) {
  const { toast } = useToast()

  const handleAddToCart = () => {
    addToCart(producto)
    window.dispatchEvent(new Event("cartUpdated"))
    toast({
      title: "Producto agregado",
      description: `${producto.nom} se agregó al carrito`,
    })
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={producto.imag || "/placeholder.svg"}
            alt={producto.nom}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {producto.stock < 10 && (
            <div className="absolute right-2 top-2 rounded-full bg-destructive px-2 py-1 text-xs text-destructive-foreground">
              Solo {producto.stock} disponibles
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="mb-1 text-xs text-muted-foreground">{producto.cate}</div>
          <h3 className="mb-2 text-lg font-semibold leading-tight">{producto.nom}</h3>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{producto.descrip}</p>
          <div className="text-2xl font-bold text-primary">${producto.precio.toFixed(2)}</div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart} disabled={producto.stock === 0}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {producto.stock === 0 ? "Agotado" : "Agregar al carrito"}
        </Button>
      </CardFooter>
    </Card>
  )
}