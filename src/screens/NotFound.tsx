import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native"

const NotFound = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.alertContainer}>
          <Text style={styles.title}>404 - Page Not Found</Text>
          <Text style={styles.message}>The page you are looking for does not exist.</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.buttonText}>Return to Home</Text>
        </TouchableOpacity>
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
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  alertContainer: {
    backgroundColor: "#fff3cd",
    borderColor: "#ffeeba",
    borderWidth: 1,
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#856404",
  },
  message: {
    color: "#856404",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#0a7ea4",
    padding: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})

export default NotFound
