import { formatDistanceToNow } from "date-fns"

export const formatTimeAgo = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: false })
  } catch (error) {
    return "unknown time"
  }
}
