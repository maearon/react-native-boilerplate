import { api, handleApiResponse } from "@/services/api"
import type {
  FollowResponse,
  ListParams,
  UserCreateResponse,
  UserEditResponse,
  UserListResponse,
  UserShowResponse,
  UserUpdateResponse,
} from "../types/api"
import type { UserCreateParams, UserUpdateParams } from "../types/user"

export const getUsers = async (params: ListParams = {}): Promise<UserListResponse> => {
  const searchParams = new URLSearchParams()

  if (params.page) {
    searchParams.set("page", params.page.toString())
  }

  Object.keys(params).forEach((key) => {
    if (key !== "page" && params[key] !== null && params[key] !== undefined) {
      searchParams.set(key, params[key].toString())
    }
  })

  return handleApiResponse<UserListResponse>(api.get(`users?${searchParams.toString()}`).json())
}

export const getUser = async (id: string, params: ListParams = {}): Promise<UserShowResponse> => {
  const searchParams = new URLSearchParams()

  if (params.page) {
    searchParams.set("page", params.page.toString())
  }

  Object.keys(params).forEach((key) => {
    if (key !== "page" && params[key] !== null && params[key] !== undefined) {
      searchParams.set(key, params[key].toString())
    }
  })

  return handleApiResponse<UserShowResponse>(api.get(`users/${id}?${searchParams.toString()}`).json())
}

export const editUser = async (id: string): Promise<UserEditResponse> => {
  return handleApiResponse<UserEditResponse>(api.get(`users/${id}/edit`).json())
}

export const updateUser = async (id: string, params: { user: UserUpdateParams }): Promise<UserUpdateResponse> => {
  return handleApiResponse<UserUpdateResponse>(api.patch(`users/${id}`, { json: params }).json())
}

export const createUser = async (params: { user: UserCreateParams }): Promise<UserCreateResponse> => {
  return handleApiResponse<UserCreateResponse>(api.post("users", { json: params }).json())
}

export const deleteUser = async (id: string): Promise<{ flash?: [string, string] }> => {
  return handleApiResponse<{ flash?: [string, string] }>(api.delete(`users/${id}`).json())
}

export const getFollowers = async (id: string, page: number): Promise<FollowResponse> => {
  return handleApiResponse<FollowResponse>(api.get(`users/${id}/followers?page=${page}`).json())
}

export const getFollowing = async (id: string, page: number): Promise<FollowResponse> => {
  return handleApiResponse<FollowResponse>(api.get(`users/${id}/following?page=${page}`).json())
}
