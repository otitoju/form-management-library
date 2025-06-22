"use client"

import { useFormContext } from "./FormProvider"

// Import React Native components (will be mocked in tests)
let View: any, Text: any, TouchableOpacity: any, StyleSheet: any

try {
  const RN = require("react-native")
  View = RN.View
  Text = RN.Text
  TouchableOpacity = RN.TouchableOpacity
  StyleSheet = RN.StyleSheet
} catch {
  // Fallback for web/testing environment
  View = ({ children, style, ...props }: any) => (
    <div style={style} {...props}>
      {children}
    </div>
  )
  Text = ({ children, style, ...props }: any) => (
    <span style={style} {...props}>
      {children}
    </span>
  )
  TouchableOpacity = ({ children, onPress, style, ...props }: any) => (
    <button onClick={onPress} style={style} {...props}>
      {children}
    </button>
  )
  StyleSheet = {
    create: (styles: Record<string, any>) => styles,
  }
}

interface ViewStyle {
  [key: string]: any
}

interface TextStyle {
  [key: string]: any
}

interface CheckboxProps {
  name: string
  label?: string
  showError?: boolean
  containerStyle?: ViewStyle
  labelStyle?: TextStyle
  checkboxStyle?: ViewStyle
  errorStyle?: TextStyle
}

export function Checkbox({
  name,
  label,
  showError = true,
  containerStyle,
  labelStyle,
  checkboxStyle,
  errorStyle,
}: CheckboxProps) {
  const form = useFormContext()
  const field = form.register(name)

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity style={styles.checkboxContainer} onPress={() => field.onChange(!field.value)}>
        <View
          style={[
            styles.checkbox,
            field.value && styles.checkboxChecked,
            field.error && styles.checkboxError,
            checkboxStyle,
          ]}
        >
          {field.value && <Text style={styles.checkmark}>✓</Text>}
        </View>
        {label && (
          <Text style={[styles.label, labelStyle]}>
            {label}
            {field.required && <Text style={styles.required}> *</Text>}
          </Text>
        )}
      </TouchableOpacity>

      {showError && field.error && <Text style={[styles.error, errorStyle]}>{field.error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxChecked: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  checkboxError: {
    borderColor: "#EF4444",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    color: "#374151",
    flex: 1,
  },
  required: {
    color: "#EF4444",
  },
  error: {
    fontSize: 14,
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 32,
  },
})
