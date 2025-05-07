import type React from "react"
import { ActivityIndicator, View, StyleSheet } from "react-native"

interface LoadingSpinnerProps {
  fullPage?: boolean
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullPage = false }) => {
  const spinner = <ActivityIndicator size="large" color="#0a7ea4" />

  if (fullPage) {
    return <View style={styles.fullPageContainer}>{spinner}</View>
  }

  return <View style={styles.container}>{spinner}</View>
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  fullPageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})

export default LoadingSpinner
