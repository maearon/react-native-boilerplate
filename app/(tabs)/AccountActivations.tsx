import LoadingSpinner from "@/components/LoadingSpinner"
import { activateAccount } from "@/services/accountActivationService"
import { useEffect, useState } from "react"
import { SafeAreaView, StyleSheet, Text, View } from "react-native"

const AccountActivations = ({ route, navigation }: any) => {
  const { token, email } = route.params
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const activateUserAccount = async () => {
      if (!token) {
        setError("Invalid activation link")
        setLoading(false)
        return
      }

      if (!email) {
        setError("Email parameter is missing")
        setLoading(false)
        return
      }

      try {
        const response = await activateAccount(token, email)

        if (response.flash) {
          // Show success message and navigate to login
          setTimeout(() => {
            navigation.navigate("Login")
          }, 2000)
        } else if (response.error) {
          setError(Array.isArray(response.error) ? response.error[0] : response.error)
        }
      } catch (error: any) {
        setError(error.message || "Account activation failed")
      } finally {
        setLoading(false)
      }
    }

    activateUserAccount()
  }, [token, email, navigation])

  if (loading) {
    return <LoadingSpinner fullPage />
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Activation Error</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>Processing your account activation...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 15,
    flex: 1,
    justifyContent: "center",
  },
  errorContainer: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    borderWidth: 1,
    borderRadius: 5,
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#721c24",
    marginBottom: 10,
  },
  errorText: {
    color: "#721c24",
  },
  successContainer: {
    backgroundColor: "#d4edda",
    borderColor: "#c3e6cb",
    borderWidth: 1,
    borderRadius: 5,
    padding: 20,
  },
  successText: {
    color: "#155724",
    textAlign: "center",
  },
})

export default AccountActivations
