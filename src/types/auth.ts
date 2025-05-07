export interface LoginCredentials {
  email: string
  password: string
  remember_me: boolean
}

export interface AuthTokens {
  access: {
    token: string
    expires: string
  }
  refresh: {
    token: string
    expires: string
  }
}

export interface LoginResponse {
  user: User
  tokens: AuthTokens
  flash?: [string, string]
}

export interface User {
  id: number
  email: string
  name: string
  gravatar_hash?: string
  admin?: boolean
  activated?: boolean
}
