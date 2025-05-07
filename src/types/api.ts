import type { Micropost } from "./micropost"
import type { User, UserShow, UserEdit } from "./user"

export interface ApiResponse<T> {
  data?: T
  flash?: [string, string]
  error?: string[] | string
  status?: number
  message?: string
  errors?: {
    [key: string]: string[]
  }
}

export interface ListParams {
  page?: number
  [key: string]: any
}

export interface ListResponse<T> {
  items: T[]
  total_count: number
}

export interface MicropostListResponse {
  feed_items: Micropost[]
  followers: number
  following: number
  gravatar: string
  micropost: number
  total_count: number
}

export interface UserListResponse {
  users: User[]
  total_count: number
}

export interface UserShowResponse {
  user: UserShow
  id_relationships?: number
  microposts: Micropost[]
  total_count: number
}

export interface UserEditResponse {
  user: UserEdit
  gravatar: string
  flash?: [string, string]
}

export interface UserUpdateResponse {
  flash_success?: [string, string]
  error?: string[]
}

export interface UserCreateResponse {
  user?: User
  flash?: [string, string]
  error?: string[]
  status?: number
  message?: string
  errors?: {
    [key: string]: string[]
  }
}

export interface FollowResponse {
  users: User[]
  total_count: number
  user: {
    id: string
    name: string
    followers: number
    following: number
    gravatar: string
    micropost: number
  }
}

export interface CreateRelationshipResponse {
  follow: boolean
}

export interface DestroyRelationshipResponse {
  unfollow: boolean
}

export interface MicropostResponse {
  flash?: [string, string]
  error?: string[]
}

export interface PasswordResetCreateResponse {
  flash: [string, string]
}

export interface PasswordResetUpdateResponse {
  user_id?: string
  flash?: [string, string]
  error?: string[]
}

export interface ActivationResponse {
  user_id?: string
  flash?: [string, string]
  error?: string[]
}

export interface ActivationUpdateResponse {
  user?: User
  jwt?: string
  token?: string
  flash: [string, string]
}
