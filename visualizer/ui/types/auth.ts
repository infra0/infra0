export interface User {
    id: string
    name: string
    email: string
    avatar: string
    provider: "google" | "github" | "demo"
  }

export interface AuthState {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
}
