"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert } from "react-native"
import { Formik } from "formik"
import * as Yup from "yup"
import { editUser, updateUser } from "../services/userService"
import { useAuthStore } from "../stores/authStore"
import { TextInput } from "react-native-gesture-handler"
import LoadingSpinner from "../components/LoadingSpinner"
import type { UserUpdateParams } from "../types/user"

const UserEditSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters"),
  password_confirmation: Yup.string().oneOf([Yup.ref("password")], "Passwords must match"),
})

const UserEdit = ({ route, navigation }: any) => {
  const { id } = route.params
  const { user: currentUser } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<{ name: string; email: string }>({ name: "", email: "" })
  const [gravatar, setGravatar] = useState("")
  const [updateErrors, setUpdateErrors] = useState<{ [key: string]: string[] } | null>(null)
  const [generalError, setGeneralError] = useState<string | null>(null)

  useEffect(() => {
    const loadUserData = async () => {
      if (!id) return

      try {
        const response = await editUser(id)
        setUserData({
          name: response.user.name,
          email: response.user.email,
        })
        setGravatar(response.gravatar)
      } catch (error) {
        Alert.alert("Error", "Failed to load user data")
        navigation.goBack()
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [id, navigation])

  const handleUpdate = async (values: UserUpdateParams, { setSubmitting }: any) => {
    if (!id) return

    setUpdateErrors(null)
    setGeneralError(null)

    try {
      const response = await updateUser(id, { user: values })

      if (response.flash_success) {
        Alert.alert("Success", response.flash_success[1], [
          { text: "OK", onPress: () => navigation.navigate("UserProfile", { id }) },
        ])
      } else if (response.error) {
        setGeneralError(Array.isArray(response.error) ? response.error[0] : response.error)
      }
    } catch (error: any) {
      if (error.errors) {
        setUpdateErrors(error.errors)
      } else if (error.error) {
        setGeneralError(Array.isArray(error.error) ? error.error[0] : error.error)
      } else {
        setGeneralError("An error occurred while updating your profile. Please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner fullPage />
  }

  // Check if the current user is authorized to edit this profile
  if (currentUser?.id.toString() !== id && !currentUser?.admin) {
    navigation.goBack()
    return null
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Update your profile</Text>

          {generalError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{generalError}</Text>
            </View>
          )}

          {updateErrors && Object.keys(updateErrors).length > 0 && (
            <View style={styles.errorContainer}>
              {Object.entries(updateErrors).map(([field, errors]) =>
                errors.map((error, index) => (
                  <Text key={`${field}-${index}`} style={styles.errorText}>
                    {field.charAt(0).toUpperCase() + field.slice(1)} {error}
                  </Text>
                )),
              )}
            </View>
          )}

          <View style={styles.avatarContainer}>
            <Image style={styles.avatar} source={{ uri: `https://secure.gravatar.com/avatar/${gravatar}?s=80` }} />
          </View>

          <Formik
            initialValues={{
              name: userData.name,
              email: userData.email,
              password: "",
              password_confirmation: "",
            }}
            validationSchema={UserEditSchema}
            onSubmit={handleUpdate}
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
                  <Text style={styles.helperText}>Leave blank if you don't want to change it</Text>
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
                  <Text style={styles.buttonText}>{isSubmitting ? "Saving changes..." : "Save changes"}</Text>
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
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  helperText: {
    color: "#6c757d",
    fontSize: 12,
    marginTop: 5,
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

export default UserEdit
