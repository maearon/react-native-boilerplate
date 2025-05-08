import { Formik } from "formik"
import { useState } from "react"
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import * as Yup from "yup"
import type { PasswordResetUpdateParams } from "../services/passwordResetService"
import { resetPassword } from "../services/passwordResetService"

const PasswordResetSchema = Yup.object().shape({
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),
})

const PasswordResets = ({ route, navigation }: any) => {
  const { token, email } = route.params
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: { password: string; password_confirmation: string }, { setSubmitting }: any) => {
    if (!token) {
      setError("Invalid reset token")
      return
    }

    setError(null)

    const params: PasswordResetUpdateParams = {
      email,
      user: {
        password: values.password,
        password_confirmation: values.password_confirmation,
      },
    }

    try {
      const response = await resetPassword(token, params)

      if (response.flash) {
        // Show success message and navigate to login
        navigation.navigate("Login")
      } else if (response.error) {
        setError(Array.isArray(response.error) ? response.error[0] : response.error)
      }
    } catch (error: any) {
      setError(error.message || "Password reset failed")
    } finally {
      setSubmitting(false)
    }
  }

  if (!token || !email) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Invalid password reset link</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Reset password</Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Formik
            initialValues={{ password: "", password_confirmation: "" }}
            validationSchema={PasswordResetSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={[styles.input, touched.password && errors.password ? styles.inputError : null]}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    placeholder="Enter your new password"
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
                    placeholder="Confirm your new password"
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
                  <Text style={styles.buttonText}>{isSubmitting ? "Updating password..." : "Update password"}</Text>
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

export default PasswordResets
