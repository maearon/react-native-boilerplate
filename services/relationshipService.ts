import { api, handleApiResponse } from "@/services/api"
import type { CreateRelationshipResponse, DestroyRelationshipResponse } from "@/types/api"

export const followUser = async (followedId: string): Promise<CreateRelationshipResponse> => {
  return handleApiResponse<CreateRelationshipResponse>(
    api.post("relationships", { json: { followed_id: followedId } }).json(),
  )
}

export const unfollowUser = async (id: string): Promise<DestroyRelationshipResponse> => {
  return handleApiResponse<DestroyRelationshipResponse>(api.delete(`relationships/${id}`).json())
}
