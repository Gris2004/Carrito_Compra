"use client"

import { ShoppingCart, User, LogOut } from 'lucide-react'
import Link from "next/link"
import { useEffect, useState } from "react"
import { getCurrentUser, logoutUser } from "@/lib/autenticacion"
import { getCartItemCount } from "@/lib/carrito"
import { Button } from "@/components/ui/button"
import type { AuthUser } from "@/lib/tipos"

export function Encabezado() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    setUser(getCurrentUser())
    setCartCount(getCartItemCount())

    const handleStorageChange = () => {
      setUser(getCurrentUser())
      setCartCount(getCartItemCount())
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("cartUpdated", handleStorageChange)
    window.addEventListener("authUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cartUpdated", handleStorageChange)
      window.removeEventListener("authUpdated", handleStorageChange)
    }
  }, [])

  const handleLogout = () => {
    logoutUser()
    setUser(null)
    window.dispatchEvent(new Event("authUpdated"))
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <ShoppingCart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">ZurStore</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/carrito" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Hola, {user.name}</span>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link href="/autenticacion">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}