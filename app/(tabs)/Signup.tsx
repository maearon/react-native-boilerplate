import { createUser } from "@/services/userService"
import type { UserCreateParams } from "@/types/user"
import { router } from 'expo-router'
import { Formik } from "formik"
import { useState } from "react"
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import * as Yup from "yup"

const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),
})

const Signup = ({ navigation }: any) => {
  const [signupErrors, setSignupErrors] = useState<{ [key: string]: string[] } | null>(null)
  const [generalError, setGeneralError] = useState<string | null>(null)

  const handleSignup = async (values: UserCreateParams, { setSubmitting }: any) => {
    setSignupErrors(null)
    setGeneralError(null)

    try {
      const response = await createUser({ user: values })

      if (response.flash) {
        Alert.alert("Success", response.flash[1], [{ text: "OK", onPress: () => router.push({ pathname: '/Login'}) }])
      } else if (response.errors) {
        setSignupErrors(response.errors)
      } else if (response.error) {
        setGeneralError(Array.isArray(response.error) ? response.error[0] : response.error)
      }
    } catch (error: any) {
      if (error.errors) {
        setSignupErrors(error.errors)
      } else if (error.error) {
        setGeneralError(Array.isArray(error.error) ? error.error[0] : error.error)
      } else {
        setGeneralError("An error occurred during signup. Please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Sign up</Text>

          {generalError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{generalError}</Text>
            </View>
          )}

          {signupErrors && Object.keys(signupErrors).length > 0 && (
            <View style={styles.errorContainer}>
              {Object.entries(signupErrors).map(([field, errors]) =>
                errors.map((error, index) => (
                  <Text key={`${field}-${index}`} style={styles.errorText}>
                    {field.charAt(0).toUpperCase() + field.slice(1)} {error}
                  </Text>
                )),
              )}
            </View>
          )}

          <Formik
            initialValues={{ name: "", email: "", password: "", password_confirmation: "" }}
            validationSchema={SignupSchema}
            onSubmit={handleSignup}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={[styles.input, touched.name && errors.name ? styles.inputError : null]}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                    placeholder="Enter your name"
                  />
                  {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                </View>

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

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.password_confirmation && errors.password_confirmation ? styles.inputError : null,
                    ]}
                    onChangeText={handleChange("password_confirmation")}
                    onBlur={handleBlur("password_confirmation")}
                    value={values.password_confirmation}
                    placeholder="Confirm your password"
                    secureTextEntry
                  />
                  {touched.password_confirmation && errors.password_confirmation && (
                    <Text style={styles.errorText}>{errors.password_confirmation}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.button, isSubmitting && styles.buttonDisabled]}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                >
                  <Text style={styles.buttonText}>{isSubmitting ? "Creating account..." : "Create my account"}</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
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
})

export default Signup
