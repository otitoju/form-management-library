import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native"
import { useForm, NativeFormProvider, NativeInput, NativeSelect, NativeCheckbox, Schema } from "@formcraft/core"

interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  bio: string
  notifications: boolean
  terms: boolean
}

const validationSchema = {
  firstName: Schema.string().required("First name is required").min(2, "At least 2 characters"),
  lastName: Schema.string().required("Last name is required").min(2, "At least 2 characters"),
  email: Schema.email().required("Email is required"),
  phone: Schema.string().required("Phone number is required").min(10, "Phone number must be at least 10 digits"),
  country: Schema.string().required("Please select your country"),
  bio: Schema.string().max(500, "Bio must be less than 500 characters"),
  notifications: Schema.string(), // Optional boolean field
  terms: Schema.string().custom((value) => value === true || "You must accept the terms and conditions"),
}

export function ProfileFormExample() {
  const form = useForm<ProfileFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
      bio: "",
      notifications: true,
      terms: false,
    },
    validation: validationSchema,
    mode: "onBlur",
  })

  const onSubmit = async (data: ProfileFormData) => {
    console.log("Form submitted:", data)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    Alert.alert("Success", "Profile updated successfully!", [{ text: "OK", onPress: () => form.reset() }])
  }

  const countryOptions = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "au", label: "Australia" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" },
    { value: "jp", label: "Japan" },
    { value: "other", label: "Other" },
  ]

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile Form Example</Text>

      <NativeFormProvider form={form}>
        <View style={styles.form}>
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <NativeInput name="firstName" label="First Name" placeholder="Enter first name" />
            </View>
            <View style={styles.halfWidth}>
              <NativeInput name="lastName" label="Last Name" placeholder="Enter last name" />
            </View>
          </View>

          <NativeInput
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <NativeInput
            name="phone"
            label="Phone Number"
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />

          <NativeSelect name="country" label="Country" options={countryOptions} placeholder="Select your country" />

          <NativeInput
            name="bio"
            label="Bio (Optional)"
            placeholder="Tell us about yourself..."
            multiline
            numberOfLines={4}
            containerStyle={styles.bioContainer}
          />

          <NativeCheckbox name="notifications" label="Receive email notifications" />

          <NativeCheckbox name="terms" label="I accept the terms and conditions" />

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!form.formState.isValid || form.formState.isSubmitting) && styles.submitButtonDisabled,
            ]}
            onPress={form.handleSubmit(onSubmit)}
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {form.formState.isSubmitting ? "Updating Profile..." : "Update Profile"}
            </Text>
          </TouchableOpacity>

          {/* Debug Panel */}
          <View style={styles.debugPanel}>
            <Text style={styles.debugTitle}>Debug Info</Text>
            <Text style={styles.debugText}>Valid: {form.formState.isValid ? "Yes" : "No"}</Text>
            <Text style={styles.debugText}>Dirty: {form.formState.isDirty ? "Yes" : "No"}</Text>
            <Text style={styles.debugText}>Errors: {Object.keys(form.formState.errors).length}</Text>
          </View>
        </View>
      </NativeFormProvider>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#1F2937",
  },
  form: {
    padding: 20,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  bioContainer: {
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  debugPanel: {
    marginTop: 30,
    padding: 16,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#374151",
  },
  debugText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
})
