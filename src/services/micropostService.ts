import { api, handleApiResponse } from "./api"
import type { MicropostListResponse, MicropostResponse } from "../types/api"

export const getMicroposts = async (params: { page?: number } = {}): Promise<MicropostListResponse> => {
  const searchParams = new URLSearchParams()

  if (params.page) {
    searchParams.set("page", params.page.toString())
  }

  return handleApiResponse<MicropostListResponse>(api.get(`?${searchParams.toString()}`).json())
}

export const createMicropost = async (formData: FormData): Promise<MicropostResponse> => {
  return handleApiResponse<MicropostResponse>(api.post("microposts", { body: formData }).json())
}

export const deleteMicropost = async (id: number): Promise<MicropostResponse> => {
  return handleApiResponse<MicropostResponse>(api.delete(`microposts/${id}`).json())
}
