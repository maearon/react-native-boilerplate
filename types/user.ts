export interface User {
  id: number
  name: string
  email: string
  gravatar_id?: string
  size?: number
  following?: number
  followers?: number
  current_user_following_user?: boolean
  admin?: boolean
  activated?: boolean
}

export interface UserShow extends User {
  following: number
  followers: number
  current_user_following_user: boolean
}

export interface UserEdit {
  name: string
  email: string
}

export interface UserCreateParams {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface UserUpdateParams {
  name: string
  email: string
  password: string
  password_confirmation: string
}
