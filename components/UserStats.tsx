import { useNavigation } from "@react-navigation/native"
import { router } from 'expo-router'
import type React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface UserStatsProps {
  userId: string | number
  following: number
  followers: number
}

const UserStats: React.FC<UserStatsProps> = ({ userId, following, followers }) => {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.statContainer}
        onPress={() => router.push({ pathname: '/ShowFollow', params: { id: userId, type: "following" } })}
      >
        <Text style={styles.statNumber}>{following}</Text>
        <Text style={styles.statLabel}>following</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.statContainer}
        onPress={() => router.push({ pathname: '/ShowFollow', params: { id: userId, type: "followers" } })}
      >
        <Text style={styles.statNumber}>{followers}</Text>
        <Text style={styles.statLabel}>followers</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  statContainer: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#666",
  },
})

export default UserStats
