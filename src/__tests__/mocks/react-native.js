// Mock React Native components for web testing
// Note: React is available as a peer dependency in the test environment

const View = ({ children, style, ...props }) => {
  if (typeof document !== "undefined") {
    const element = document.createElement("div")
    if (style) {
      Object.assign(element.style, style)
    }
    return element
  }
  return { type: "View", props: { children, style, ...props } }
}

const Text = ({ children, style, ...props }) => {
  if (typeof document !== "undefined") {
    const element = document.createElement("span")
    if (style) {
      Object.assign(element.style, style)
    }
    element.textContent = children
    return element
  }
  return { type: "Text", props: { children, style, ...props } }
}

const TextInput = ({ style, onChangeText, value, ...props }) => {
  if (typeof document !== "undefined") {
    const element = document.createElement("input")
    if (style) {
      Object.assign(element.style, style)
    }
    element.value = value || ""
    element.addEventListener("change", (e) => onChangeText?.(e.target.value))
    return element
  }
  return { type: "TextInput", props: { style, onChangeText, value, ...props } }
}

const TouchableOpacity = ({ children, onPress, style, disabled, ...props }) => {
  if (typeof document !== "undefined") {
    const element = document.createElement("button")
    if (style) {
      Object.assign(element.style, style)
    }
    element.disabled = disabled
    element.addEventListener("click", onPress)
    return element
  }
  return { type: "TouchableOpacity", props: { children, onPress, style, disabled, ...props } }
}

const Modal = ({ children, visible, onRequestClose, ...props }) => {
  if (!visible) return null
  if (typeof document !== "undefined") {
    const element = document.createElement("div")
    element.style.position = "fixed"
    element.style.top = "0"
    element.style.left = "0"
    element.style.right = "0"
    element.style.bottom = "0"
    element.style.zIndex = "1000"
    return element
  }
  return { type: "Modal", props: { children, visible, onRequestClose, ...props } }
}

const FlatList = ({ data, renderItem, keyExtractor, ...props }) => {
  if (typeof document !== "undefined") {
    const element = document.createElement("div")
    return element
  }
  return { type: "FlatList", props: { data, renderItem, keyExtractor, ...props } }
}

const ScrollView = ({ children, style, ...props }) => {
  if (typeof document !== "undefined") {
    const element = document.createElement("div")
    if (style) {
      Object.assign(element.style, { ...style, overflow: "auto" })
    }
    return element
  }
  return { type: "ScrollView", props: { children, style, ...props } }
}

const StyleSheet = {
  create: (styles) => styles,
}

module.exports = {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  StyleSheet,
}
