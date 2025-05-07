"use client"

import type React from "react"
import { useState } from "react"
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert, Platform } from "react-native"
import * as ImagePicker from "expo-image-picker"
import { createMicropost } from "../services/micropostService"
import { Ionicons } from "@expo/vector-icons"

interface MicropostFormProps {
  onPostCreated?: () => void
}

const MicropostForm: React.FC<MicropostFormProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant permission to access your photos")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Please enter some content")
      return
    }

    setSubmitting(true)

    const formData = new FormData()
    formData.append("micropost[content]", content)

    if (image) {
      const filename = image.split("/").pop() || "image.jpg"
      const match = /\.(\w+)$/.exec(filename)
      const type = match ? `image/${match[1]}` : "image/jpeg"

      formData.append("micropost[image]", {
        uri: Platform.OS === "ios" ? image.replace("file://", "") : image,
        name: filename,
        type,
      } as any)
    }

    try {
      const response = await createMicropost(formData)

      if (response.flash) {
        setContent("")
        setImage(null)
        if (onPostCreated) onPostCreated()
      } else if (response.error) {
        Alert.alert("Error", Array.isArray(response.error) ? response.error[0] : response.error)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create micropost")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Compose new micropost..."
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={3}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, submitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>{submitting ? "Posting..." : "Post"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Ionicons name="image-outline" size={24} color="#0a7ea4" />
        </TouchableOpacity>
      </View>
      {image && (
        <View style={styles.imagePreviewContainer}>
          <Text style={styles.imagePreviewText}>Image selected</Text>
          <TouchableOpacity onPress={() => setImage(null)}>
            <Text style={styles.removeImageText}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    minHeight: 80,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#0a7ea4",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  disabledButton: {
    backgroundColor: "#7fb7c9",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imageButton: {
    padding: 10,
  },
  imagePreviewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  imagePreviewText: {
    color: "#333",
  },
  removeImageText: {
    color: "#dc3545",
  },
})

export default MicropostForm
