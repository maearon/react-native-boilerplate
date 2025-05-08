import { View, Text, StyleSheet, SafeAreaView, Linking, TouchableOpacity } from "react-native"

const Contact = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Contact</Text>
        <Text style={styles.text}>
          Contact the React Native Tutorial about the sample app at the{" "}
          <TouchableOpacity onPress={() => Linking.openURL("https://github.com/maearon/react-boilerplate")}>
            <Text style={styles.link}>contact page</Text>
          </TouchableOpacity>
          .
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  link: {
    color: "#0a7ea4",
    textDecorationLine: "underline",
  },
})

export default Contact
