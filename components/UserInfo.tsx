import { useNavigation } from "@react-navigation/native"
import { router } from 'expo-router'
import type React from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import type { User } from "../types/user"

interface UserInfoProps {
  user: User | any
  micropostCount?: number
  showProfileLink?: boolean
}

const UserInfo: React.FC<UserInfoProps> = ({ user, micropostCount, showProfileLink = false }) => {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <Image
        style={styles.avatar}
        source={{ uri: `https://secure.gravatar.com/avatar/${user.gravatar_id || user.gravatar}?s=50` }}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{user.name}</Text>
        {showProfileLink && (
          <TouchableOpacity onPress={() => router.push({ pathname: '/UserProfile', params: { id: user.id } })}>
            <Text style={styles.profileLink}>view my profile</Text>
          </TouchableOpacity>
        )}
        {micropostCount !== undefined && (
          <Text style={styles.micropostCount}>
            {micropostCount} micropost{micropostCount !== 1 ? "s" : ""}
          </Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  profileLink: {
    color: "#0a7ea4",
    marginBottom: 5,
  },
  micropostCount: {
    color: "#666",
  },
})

export default UserInfo
