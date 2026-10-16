export interface User {
  id: string
  name: string
  username: string
  email: string
}

export interface Session {
  token: string
  user: User
  expiresAt: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  username: string
  email: string
  password: string
}
