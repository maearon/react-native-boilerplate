import type React from "react"
import { View, Text, StyleSheet } from "react-native"

interface ErrorMessageProps {
  error: string | string[] | null
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null

  const errorMessages = Array.isArray(error) ? error : [error]

  return (
    <View style={styles.container}>
      {errorMessages.map((message, index) => (
        <Text key={index} style={styles.text}>
          {message}
        </Text>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  text: {
    color: "#721c24",
    fontSize: 14,
  },
})

export default ErrorMessage
