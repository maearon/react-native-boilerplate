import { api, handleApiResponse } from "./api"
import type { PasswordResetCreateResponse, PasswordResetUpdateResponse } from "../types/api"

export interface PasswordResetUpdateParams {
  email: string
  user: {
    password: string
    password_confirmation: string
  }
}

export const requestPasswordReset = async (email: string): Promise<PasswordResetCreateResponse> => {
  return handleApiResponse<PasswordResetCreateResponse>(
    api.post("password_resets", { json: { password_reset: { email } } }).json(),
  )
}

export const resetPassword = async (
  token: string,
  params: PasswordResetUpdateParams,
): Promise<PasswordResetUpdateResponse> => {
  return handleApiResponse<PasswordResetUpdateResponse>(api.patch(`password_resets/${token}`, { json: params }).json())
}
