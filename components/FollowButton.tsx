import type React from "react"
import { useState } from "react"
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native"
import { followUser, unfollowUser } from "../services/relationshipService"

interface FollowButtonProps {
  userId: string
  isFollowing: boolean
  onFollowChange?: (isFollowing: boolean) => void
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId, isFollowing, onFollowChange }) => {
  const [loading, setLoading] = useState(false)
  const [following, setFollowing] = useState(isFollowing)

  const handleFollow = async () => {
    setLoading(true)
    try {
      const response = await followUser(userId)
      if (response.follow) {
        setFollowing(true)
        if (onFollowChange) onFollowChange(true)
      }
    } catch (error) {
      console.error("Failed to follow user:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnfollow = async () => {
    setLoading(true)
    try {
      const response = await unfollowUser(userId)
      if (response.unfollow) {
        setFollowing(false)
        if (onFollowChange) onFollowChange(false)
      }
    } catch (error) {
      console.error("Failed to unfollow user:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <TouchableOpacity style={[styles.button, following ? styles.unfollowButton : styles.followButton]} disabled>
        <ActivityIndicator size="small" color="#fff" />
      </TouchableOpacity>
    )
  }

  return following ? (
    <TouchableOpacity style={[styles.button, styles.unfollowButton]} onPress={handleUnfollow}>
      <Text style={styles.buttonText}>Unfollow</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity style={[styles.button, styles.followButton]} onPress={handleFollow}>
      <Text style={styles.buttonText}>Follow</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  followButton: {
    backgroundColor: "#0a7ea4",
  },
  unfollowButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})

export default FollowButton
