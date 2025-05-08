import { useNavigation } from "@react-navigation/native"
import { router } from 'expo-router'
import type React from "react"
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { deleteMicropost } from "../services/micropostService"
import { useAuthStore } from "../stores/authStore"
import type { Micropost } from "../types/micropost"

interface MicropostItemProps {
  micropost: Micropost
  onDelete?: (id: number) => void
}

const MicropostItem: React.FC<MicropostItemProps> = ({ micropost, onDelete }) => {
  const { user } = useAuthStore()
  const navigation = useNavigation()

  const handleDelete = async () => {
    Alert.alert("Delete Micropost", "Are you sure you want to delete this micropost?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await deleteMicropost(micropost.id)
            if (response.flash) {
              if (onDelete) onDelete(micropost.id)
            }
          } catch (error) {
            Alert.alert("Error", "Failed to delete micropost")
          }
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push({ pathname: '/UserProfile', params: { id: String(micropost.user_id) } })}

        style={styles.avatarContainer}
      >
        <Image
          style={styles.avatar}
          source={{ uri: `https://secure.gravatar.com/avatar/${micropost.gravatar_id}?s=${micropost.size}` }}
        />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/UserProfile', params: { id: micropost.user_id } })}
        >
          <Text style={styles.userName}>{micropost.user_name}</Text>
        </TouchableOpacity>
        <Text style={styles.content}>{micropost.content}</Text>
        {micropost.image && <Image source={{ uri: micropost.image }} style={styles.postImage} />}
        <View style={styles.footer}>
          <Text style={styles.timestamp}>Posted {micropost.timestamp} ago</Text>
          {String(user?.id) === String(micropost.user_id) && (
            <TouchableOpacity onPress={handleDelete}>
              <Text style={styles.deleteButton}>delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  contentContainer: {
    flex: 1,
  },
  userName: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#0a7ea4",
  },
  content: {
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
  deleteButton: {
    fontSize: 12,
    color: "#dc3545",
  },
})

export default MicropostItem
