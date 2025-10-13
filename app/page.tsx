import { TarjetaProducto } from "@/components/tarjeta-producto"
import { Encabezado } from "@/components/encabezado"
import type { Product } from "@/lib/tipos"
import productosData from "@/data/productos.json"

export default function Home() {
  const productos: Product[] = productosData

  return (
    <div className="min-h-screen">
      <Encabezado />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-balance">Catálogo de Productos</h1>
          <p className="text-lg text-muted-foreground">
            Descubre nuestra selección de productos tecnológicos de alta calidad
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productos.map((producto) => (
            <TarjetaProducto key={producto.id} producto={producto} />
          ))}
        </div>
      </main>
    </div>
  )
}
