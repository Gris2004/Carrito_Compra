import type { User, AuthUser } from "./tipos"

const USERS_KEY = "shopping_cart_users"
const CURRENT_USER_KEY = "shopping_cart_current_user"

export function registerUser(email: string, password: string, name: string): { success: boolean; message: string } {
  const users = getUsers()

  if (users.find((u) => u.email === email)) {
    return { success: false, message: "El correo ya está registrado" }
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    password,
    name,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))

  return { success: true, message: "Usuario registrado exitosamente" }
}

export function loginUser(email: string, password: string): { success: boolean; message: string; user?: AuthUser } {
  const users = getUsers()
  const user = users.find((u) => u.email === email && u.password === password)

  if (!user) {
    return { success: false, message: "Correo o contraseña incorrectos" }
  }

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    name: user.name,
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser))

  return { success: true, message: "Inicio de sesión exitoso", user: authUser }
}

export function logoutUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem(CURRENT_USER_KEY)
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

function getUsers(): User[] {
  if (typeof window === "undefined") return []

  const usersStr = localStorage.getItem(USERS_KEY)
  if (!usersStr) return []

  try {
    return JSON.parse(usersStr)
  } catch {
    return []
  }
}
