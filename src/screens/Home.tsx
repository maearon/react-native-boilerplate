"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView } from "react-native"
import { useAuthStore } from "../stores/authStore"
import { getMicroposts } from "../services/micropostService"
import MicropostItem from "../components/MicropostItem"
import MicropostForm from "../components/MicropostForm"
import UserInfo from "../components/UserInfo"
import UserStats from "../components/UserStats"
import LoadingSpinner from "../components/LoadingSpinner"
import { useNavigation } from "@react-navigation/native"
import type { Micropost } from "../types/micropost"

const Home = () => {
  const { loggedIn, user } = useAuthStore()
  const navigation = useNavigation()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [feedItems, setFeedItems] = useState<Micropost[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [followersCount, setFollowersCount] = useState(0)
  const [micropostCount, setMicropostCount] = useState(0)

  const loadFeed = async (refresh = false) => {
    try {
      const currentPage = refresh ? 1 : page
      const response = await getMicroposts({ page: currentPage })

      setFeedItems(refresh ? response.feed_items || [] : [...feedItems, ...(response.feed_items || [])])
      setTotalCount(response.total_count || 0)
      setFollowingCount(response.following || 0)
      setFollowersCount(response.followers || 0)
      setMicropostCount(response.micropost || 0)

      if (refresh) {
        setPage(1)
      }
    } catch (error) {
      console.error("Error loading feed:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (loggedIn) {
      loadFeed()
    } else {
      setLoading(false)
    }
  }, [loggedIn])

  const handleRefresh = () => {
    setRefreshing(true)
    loadFeed(true)
  }

  const handleLoadMore = () => {
    if (feedItems.length < totalCount) {
      setPage(page + 1)
      loadFeed()
    }
  }

  const handleMicropostDeleted = () => {
    handleRefresh()
  }

  if (loading) {
    return <LoadingSpinner fullPage />
  }

  if (!loggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome to the Sample App</Text>
          <Text style={styles.welcomeText}>
            This is the home page for the React Native Tutorial sample application.
          </Text>
          <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate("Signup" as never)}>
            <Text style={styles.signupButtonText}>Sign up now!</Text>
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image source={require("../../assets/images/react-logo.png")} style={styles.logo} resizeMode="contain" />
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={feedItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MicropostItem micropost={item} onDelete={handleMicropostDeleted} />}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={styles.card}>
              {user && <UserInfo user={user} micropostCount={micropostCount} showProfileLink={true} />}
            </View>

            <View style={styles.card}>
              <UserStats userId={user?.id ?? ""} following={followingCount} followers={followersCount} />
            </View>

            <View style={styles.card}>
              <MicropostForm onPostCreated={handleRefresh} />
            </View>

            <Text style={styles.sectionTitle}>Micropost Feed</Text>

            {feedItems.length === 0 && (
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
        ListFooterComponent={feedItems.length > 0 && page * 5 < totalCount ? <LoadingSpinner /> : null}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
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
  welcomeContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  signupButton: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoContainer: {
    marginTop: 40,
  },
  logo: {
    width: 180,
    height: 38,
  },
})

export default Home
