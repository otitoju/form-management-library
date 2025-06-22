"use client"

import { forwardRef } from "react"
import { useFormContext } from "./FormProvider"

// Import React Native components (will be mocked in tests)
let View: any, Text: any, TextInput: any, StyleSheet: any

try {
  const RN = require("react-native")
  View = RN.View
  Text = RN.Text
  TextInput = RN.TextInput
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
  TextInput = forwardRef<any, any>(({ style, onChangeText, ...props }, ref) => (
    <input ref={ref} style={style} onChange={(e) => onChangeText?.(e.target.value)} {...props} />
  ))
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

interface TextInputProps {
  value?: string
  onChangeText?: (text: string) => void
  onBlur?: () => void
  placeholder?: string
  style?: any
  accessibilityLabel?: string
  accessibilityInvalid?: boolean
  testID?: string
  multiline?: boolean
  numberOfLines?: number
  keyboardType?: string
  autoCapitalize?: string
}

interface InputProps extends Omit<TextInputProps, "value" | "onChangeText" | "onBlur"> {
  name: string
  label?: string
  showError?: boolean
  containerStyle?: ViewStyle
  labelStyle?: TextStyle
  inputStyle?: TextStyle
  errorStyle?: TextStyle
}

export const Input = forwardRef<any, InputProps>(
  ({ name, label, showError = true, containerStyle, labelStyle, inputStyle, errorStyle, style, ...props }, ref) => {
    const form = useFormContext()
    const field = form.register(name)

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, labelStyle]}>
            {label}
            {field.required && <Text style={styles.required}> *</Text>}
          </Text>
        )}
        <TextInput
          {...props}
          ref={ref}
          value={field.value || ""}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          style={[styles.input, field.error ? styles.inputError : null, inputStyle, style]}
          accessibilityLabel={label}
          accessibilityInvalid={!!field.error}
        />
        {showError && field.error && <Text style={[styles.error, errorStyle]}>{field.error}</Text>}
      </View>
    )
  },
)

Input.displayName = "Input"

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#374151",
  },
  required: {
    color: "#EF4444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  error: {
    fontSize: 14,
    color: "#EF4444",
    marginTop: 4,
  },
})
