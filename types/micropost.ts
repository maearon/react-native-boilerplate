export interface Micropost {
  readonly id: number
  content: string
  gravatar_id?: string
  image: string
  size: number
  timestamp: string
  readonly user_id: string
  user_name?: string
  title?: string
  description?: string
  videoId?: string
  channelTitle?: string
}
