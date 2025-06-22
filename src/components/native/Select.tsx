"use client"

import { useState } from "react"
import { useFormContext } from "./FormProvider"

// Import React Native components (will be mocked in tests)
let View: any, Text: any, TouchableOpacity: any, Modal: any, FlatList: any, StyleSheet: any

try {
  const RN = require("react-native")
  View = RN.View
  Text = RN.Text
  TouchableOpacity = RN.TouchableOpacity
  Modal = RN.Modal
  FlatList = RN.FlatList
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
  TouchableOpacity = ({ children, onPress, style, disabled, ...props }: any) => (
    <button onClick={onPress} style={style} disabled={disabled} {...props}>
      {children}
    </button>
  )
  Modal = ({ children, visible, onRequestClose, ...props }: any) =>
    visible ? (
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }} {...props}>
        {children}
      </div>
    ) : null
  FlatList = ({ data, renderItem, keyExtractor, ...props }: any) => (
    <div {...props}>
      {data?.map((item: any, index: number) => (
        <div key={keyExtractor ? keyExtractor(item, index) : index}>{renderItem({ item, index })}</div>
      ))}
    </div>
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

interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface SelectProps {
  name: string
  label?: string
  options: SelectOption[]
  placeholder?: string
  showError?: boolean
  containerStyle?: ViewStyle
  labelStyle?: TextStyle
  selectStyle?: TextStyle
  errorStyle?: TextStyle
  modalStyle?: ViewStyle
  optionStyle?: TextStyle
}

export function Select({
  name,
  label,
  options,
  placeholder = "Select an option",
  showError = true,
  containerStyle,
  labelStyle,
  selectStyle,
  errorStyle,
  modalStyle,
  optionStyle,
}: SelectProps) {
  const [isVisible, setIsVisible] = useState(false)
  const form = useFormContext()
  const field = form.register(name)

  const selectedOption = options.find((option) => option.value === field.value)

  const handleSelect = (option: SelectOption) => {
    field.onChange(option.value)
    setIsVisible(false)
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {field.required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.select, field.error ? styles.selectError : null, selectStyle]}
        onPress={() => setIsVisible(true)}
      >
        <Text style={[styles.selectText, !selectedOption && styles.placeholder]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
      </TouchableOpacity>

      {showError && field.error && <Text style={[styles.error, errorStyle]}>{field.error}</Text>}

      <Modal visible={isVisible} onRequestClose={() => setIsVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setIsVisible(false)}>
          <View style={[styles.modalContent, modalStyle]}>
            <FlatList
              data={options}
              keyExtractor={(item: SelectOption) => String(item.value)}
              renderItem={({ item }: { item: SelectOption }) => (
                <TouchableOpacity
                  style={[styles.option, item.disabled && styles.optionDisabled]}
                  onPress={() => !item.disabled && handleSelect(item)}
                  disabled={item.disabled}
                >
                  <Text style={[styles.optionText, item.disabled && styles.optionTextDisabled, optionStyle]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

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
  select: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  selectError: {
    borderColor: "#EF4444",
  },
  selectText: {
    fontSize: 16,
    color: "#374151",
  },
  placeholder: {
    color: "#9CA3AF",
  },
  error: {
    fontSize: 14,
    color: "#EF4444",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    maxHeight: 300,
    width: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 16,
    color: "#374151",
  },
  optionTextDisabled: {
    color: "#9CA3AF",
  },
})
