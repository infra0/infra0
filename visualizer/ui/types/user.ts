export interface User {
    id: string
    firstname: string,
    lastname: string,
    contact: string,
    provider: "google" | "github" | "demo",
    createdAt: string,
    updatedAt: string
  }