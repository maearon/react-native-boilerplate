import { Formik } from "formik"
import { useState } from "react"
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import * as Yup from "yup"
import { useAuthStore } from "../stores/authStore"

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
})

const Login = ({ navigation }: any) => {
  const { login } = useAuthStore()
  const [loginError, setLoginError] = useState<string | null>(null)

  const handleLogin = async (values: { email: string; password: string; remember_me: boolean }) => {
    setLoginError(null)
    try {
      await login(values)
      // Navigation will be handled by the AppNavigator when loggedIn state changes
    } catch (error: any) {
      if (error.error) {
        setLoginError(Array.isArray(error.error) ? error.error[0] : error.error)
      } else {
        setLoginError("Invalid email/password combination")
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Log in</Text>

          {loginError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{loginError}</Text>
            </View>
          )}

          <Formik
            initialValues={{ email: "", password: "", remember_me: false }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, setFieldValue }) => (
              <View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={[styles.input, touched.email && errors.email ? styles.inputError : null]}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={[styles.input, touched.password && errors.password ? styles.inputError : null]}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    placeholder="Enter your password"
                    secureTextEntry
                  />
                  {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                </View>

                <View style={styles.switchContainer}>
                  <Switch value={values.remember_me} onValueChange={(value) => setFieldValue("remember_me", value)} />
                  <Text style={styles.switchLabel}>Remember me on this device</Text>
                </View>

                <TouchableOpacity
                  style={[styles.button, isSubmitting && styles.buttonDisabled]}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                >
                  <Text style={styles.buttonText}>{isSubmitting ? "Logging in..." : "Log in"}</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>

          <View style={styles.linksContainer}>
            <Text style={styles.linkText}>
              New user?{" "}
              <Text style={styles.link} onPress={() => navigation.navigate("Signup")}>
                Sign up now!
              </Text>
            </Text>
            <Text style={styles.link} onPress={() => navigation.navigate("PasswordResetsNew")}>
              Forgot password?
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 15,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#dc3545",
  },
  errorContainer: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  errorText: {
    color: "#dc3545",
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  switchLabel: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#0a7ea4",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#7fb7c9",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linksContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    marginBottom: 10,
  },
  link: {
    color: "#0a7ea4",
    fontWeight: "500",
  },
})

export default Login
