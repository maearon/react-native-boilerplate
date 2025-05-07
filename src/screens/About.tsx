import { View, Text, StyleSheet, SafeAreaView, Linking, TouchableOpacity } from "react-native"

const About = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>About</Text>
        <Text style={styles.text}>
          The{" "}
          <TouchableOpacity onPress={() => Linking.openURL("https://react.dev/")}>
            <Text style={styles.link}>React Native Tutorial</Text>
          </TouchableOpacity>{" "}
          is a project to make a sample application following the React Native framework.
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

export default About
