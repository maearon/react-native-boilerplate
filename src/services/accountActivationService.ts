import { api, handleApiResponse } from "./api"
import type { ActivationResponse, ActivationUpdateResponse } from "../types/api"

export const resendActivationEmail = async (email: string): Promise<ActivationResponse> => {
  return handleApiResponse<ActivationResponse>(
    api.post("account_activations", { json: { resend_activation_email: { email } } }).json(),
  )
}

export const activateAccount = async (token: string, email: string): Promise<ActivationUpdateResponse> => {
  return handleApiResponse<ActivationUpdateResponse>(
    api.patch(`account_activations/${token}`, { json: { email } }).json(),
  )
}
