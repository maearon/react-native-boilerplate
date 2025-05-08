import FollowButton from "@/components/FollowButton"
import LoadingSpinner from "@/components/LoadingSpinner"
import MicropostItem from "@/components/MicropostItem"
import UserInfo from "@/components/UserInfo"
import UserStats from "@/components/UserStats"
import { getUser } from "@/services/userService"
import { useAuthStore } from "@/stores/authStore"
import type { Micropost } from "@/types/micropost"
import type { UserShow } from "@/types/user"
import { useEffect, useState } from "react"
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native"

const UserProfile = ({ route, navigation }: any) => {
  // const { id } = route.params
  const { user: currentUser } = useAuthStore()
  const [user, setUser] = useState<UserShow | null>(null)
  const [microposts, setMicroposts] = useState<Micropost[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [isFollowing, setIsFollowing] = useState(false)

  const loadUser = async (refresh = false) => {
    if (!currentUser?.id) return

    try {
      const currentPage = refresh ? 1 : page
      const response = await getUser(currentUser?.id, { page: currentPage })

      setUser(response.user)
      setMicroposts(refresh ? response.microposts || [] : [...microposts, ...(response.microposts || [])])
      setTotalCount(response.total_count || 0)
      setIsFollowing(response.user.current_user_following_user)

      // Update navigation title
      // navigation.setOptions({ title: response.user.name })

      if (refresh) {
        setPage(1)
      }
    } catch (error) {
      console.error("Failed to load user profile:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [currentUser?.id])

  const handleRefresh = () => {
    setRefreshing(true)
    loadUser(true)
  }

  const handleLoadMore = () => {
    if (microposts.length < totalCount) {
      setPage(page + 1)
      loadUser()
    }
  }

  const handleFollowChange = (following: boolean) => {
    setIsFollowing(following)
    if (user) {
      setUser({
        ...user,
        current_user_following_user: following,
        followers: following ? user.followers + 1 : user.followers - 1,
      })
    }
  }

  const handleMicropostDeleted = () => {
    handleRefresh()
  }

  if (loading && !user) {
    return <LoadingSpinner fullPage />
  }

  if (!user) {
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
        data={microposts}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => <MicropostItem micropost={item} onDelete={handleMicropostDeleted} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.card}>
              <UserInfo user={user} />
              <View style={styles.statsContainer}>
                <UserStats userId={user.id} following={user.following} followers={user.followers} />
              </View>
            </View>

            {currentUser && currentUser.id !== user.id && (
              <View style={styles.followButtonContainer}>
                <FollowButton userId={currentUser?.id} isFollowing={isFollowing} onFollowChange={handleFollowChange} />
              </View>
            )}

            <Text style={styles.sectionTitle}>Microposts ({totalCount})</Text>

            {microposts.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No microposts yet.</Text>
              </View>
            )}
          </View>
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={microposts.length > 0 && page * 10 < totalCount ? <LoadingSpinner /> : null}
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
  followButtonContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
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

export default UserProfile
