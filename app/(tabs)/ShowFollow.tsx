import LoadingSpinner from "@/components/LoadingSpinner"
import UserInfo from "@/components/UserInfo"
import UserStats from "@/components/UserStats"
import { getFollowers, getFollowing } from "@/services/userService"
import type { User } from "@/types/user"
import { useEffect, useState } from "react"
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const ShowFollow = ({ route, navigation }: any) => {
  const { id, type } = route.params
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [userData, setUserData] = useState<{
    id: string
    name: string
    followers: number
    following: number
    gravatar: string
    micropost: number
  } | null>(null)

  const loadData = async (refresh = false) => {
    if (!id) return

    try {
      const currentPage = refresh ? 1 : page
      const response = type === "following" ? await getFollowing(id, currentPage) : await getFollowers(id, currentPage)

      setUsers(refresh ? response.users || [] : [...users, ...(response.users || [])])
      setTotalCount(response.total_count || 0)
      setUserData(response.user)

      if (refresh) {
        setPage(1)
      }
    } catch (error) {
      console.error(`Failed to load ${type}:`, error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id, type])

  const handleRefresh = () => {
    setRefreshing(true)
    loadData(true)
  }

  const handleLoadMore = () => {
    if (users.length < totalCount) {
      setPage(page + 1)
      loadData()
    }
  }

  if (loading && !userData) {
    return <LoadingSpinner fullPage />
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>User not found</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => navigation.navigate("UserProfile", { id: item.id, name: item.name })}
          >
            <Image
              style={styles.avatar}
              source={{ uri: `https://secure.gravatar.com/avatar/${item.gravatar_id}?s=50` }}
            />
            <Text style={styles.userName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.card}>
              <UserInfo user={userData} micropostCount={userData.micropost} />
              <View style={styles.statsContainer}>
                <UserStats userId={userData.id} following={userData.following} followers={userData.followers} />
              </View>
            </View>

            <Text style={styles.sectionTitle}>
              {type === "following" ? "Following" : "Followers"} ({totalCount})
            </Text>

            {users.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No {type} yet.</Text>
              </View>
            )}
          </View>
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={users.length > 0 && page * 10 < totalCount ? <LoadingSpinner /> : null}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsContainer: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
  },
  emptyContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
  },
  errorContainer: {
    padding: 20,
    backgroundColor: "#f8d7da",
    margin: 15,
    borderRadius: 5,
  },
  errorText: {
    color: "#721c24",
    textAlign: "center",
  },
})

export default ShowFollow
