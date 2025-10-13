"use client"

import type React from "react"

import { useState } from "react"
import { Encabezado } from "@/components/encabezado"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { registerUser, loginUser } from "@/lib/autenticacion"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const result = loginUser(email, password)

    if (result.success) {
      toast({
        title: "Bienvenido",
        description: result.message,
      })
      window.dispatchEvent(new Event("authUpdated"))
      router.push("/")
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    const result = registerUser(email, password, name)

    if (result.success) {
      toast({
        title: "Registro exitoso",
        description: "Ahora puedes iniciar sesión",
      })
      // Auto login after registration
      const loginResult = loginUser(email, password)
      if (loginResult.success) {
        window.dispatchEvent(new Event("authUpdated"))
        router.push("/")
      }
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen">
      <Encabezado />
      <main className="container mx-auto flex items-center justify-center px-4 py-16">
        <Tabs defaultValue="login" className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Iniciar Sesión</CardTitle>
                <CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Correo electrónico</Label>
                    <Input id="login-email" name="email" type="email" placeholder="tu@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <Input id="login-password" name="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Crear Cuenta</CardTitle>
                <CardDescription>Completa el formulario para crear tu cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nombre completo</Label>
                    <Input id="register-name" name="name" type="text" placeholder="Juan Pérez" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Correo electrónico</Label>
                    <Input id="register-email" name="email" type="email" placeholder="tu@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <Input id="register-password" name="password" type="password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Confirmar contraseña</Label>
                    <Input id="register-confirm" name="confirmPassword" type="password" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
