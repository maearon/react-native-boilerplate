import LoadingSpinner from "@/components/LoadingSpinner"
import { deleteUser, getUsers } from "@/services/userService"
import { useAuthStore } from "@/stores/authStore"
import type { User } from "@/types/user"
import { router } from 'expo-router'
import { useEffect, useState } from "react"
import { Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const Users = ({ navigation }: any) => {
  const { user: currentUser } = useAuthStore()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)

  const loadUsers = async (refresh = false) => {
    try {
      const currentPage = refresh ? 1 : page
      const response = await getUsers({ page: currentPage })

      setUsers(refresh ? response.users || [] : [...users, ...(response.users || [])])
      setTotalCount(response.total_count || 0)

      if (refresh) {
        setPage(1)
      }
    } catch (error) {
      console.error("Failed to load users:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    loadUsers(true)
  }

  const handleLoadMore = () => {
    if (users.length < totalCount) {
      setPage(page + 1)
      loadUsers()
    }
  }

  const handleDelete = (id: string) => {
    Alert.alert("Delete User", "Are you sure you want to delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await deleteUser(id.toString())
            if (response.flash) {
              Alert.alert("Success", response.flash[1])
              handleRefresh()
            }
          } catch (error) {
            Alert.alert("Error", "Failed to delete user")
          }
        },
      },
    ])
  }

  if (loading && users.length === 0) {
    return <LoadingSpinner fullPage />
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => router.push({ pathname: '/UserProfile', params: { id: item.id, name: item.name } })}
          >
            <Image
              style={styles.avatar}
              source={{ uri: `https://secure.gravatar.com/avatar/${item.gravatar_id}?s=50` }}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              {item.admin && (
                <View style={styles.adminBadge}>
                  <Text style={styles.adminText}>admin</Text>
                </View>
              )}
            </View>
            {currentUser?.admin && currentUser.id !== item.id && (
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>👥 All users</Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
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
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
  },
  adminBadge: {
    backgroundColor: "#0a7ea4",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
  },
  adminText: {
    color: "#fff",
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 12,
  },
})

export default Users
