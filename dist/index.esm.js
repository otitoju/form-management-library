import { useState, useRef, useCallback, useMemo, createContext, useContext, forwardRef } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';

class FormValidator {
    static validate(value, rules) {
        if (rules.required && this.isEmpty(value)) {
            return typeof rules.required === "string" ? rules.required : "This field is required";
        }
        if (this.isEmpty(value)) {
            return null; // Don't validate empty optional fields
        }
        if (rules.email && !this.isValidEmail(String(value))) {
            return typeof rules.email === "string" ? rules.email : "Please enter a valid email";
        }
        if (rules.url && !this.isValidUrl(String(value))) {
            return typeof rules.url === "string" ? rules.url : "Please enter a valid URL";
        }
        if (rules.number && !this.isValidNumber(value)) {
            return typeof rules.number === "string" ? rules.number : "Please enter a valid number";
        }
        if (rules.min !== undefined) {
            const minError = this.validateMin(value, rules.min);
            if (minError)
                return minError;
        }
        if (rules.max !== undefined) {
            const maxError = this.validateMax(value, rules.max);
            if (maxError)
                return maxError;
        }
        if (rules.pattern) {
            const pattern = typeof rules.pattern === "string" ? new RegExp(rules.pattern) : rules.pattern;
            if (!pattern.test(String(value))) {
                return "Please enter a valid format";
            }
        }
        if (rules.custom) {
            const customResult = rules.custom(value);
            if (typeof customResult === "string") {
                return customResult;
            }
            if (customResult === false) {
                return "Invalid value";
            }
        }
        return null;
    }
    static isEmpty(value) {
        return value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
    }
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        }
        catch (_a) {
            return false;
        }
    }
    static isValidNumber(value) {
        return !isNaN(Number(value)) && isFinite(Number(value));
    }
    static validateMin(value, min) {
        if (typeof min === "number") {
            if (typeof value === "string" && value.length < min) {
                return `Minimum ${min} characters required`;
            }
            if (typeof value === "number" && value < min) {
                return `Minimum value is ${min}`;
            }
            if (Array.isArray(value) && value.length < min) {
                return `Minimum ${min} items required`;
            }
        }
        return null;
    }
    static validateMax(value, max) {
        if (typeof max === "number") {
            if (typeof value === "string" && value.length > max) {
                return `Maximum ${max} characters allowed`;
            }
            if (typeof value === "number" && value > max) {
                return `Maximum value is ${max}`;
            }
            if (Array.isArray(value) && value.length > max) {
                return `Maximum ${max} items allowed`;
            }
        }
        return null;
    }
}
// Zod-inspired schema builder
class Schema {
    constructor() {
        this.rules = {};
    }
    static string() {
        return new Schema();
    }
    static number() {
        const schema = new Schema();
        schema.rules.number = true;
        return schema;
    }
    static email() {
        const schema = new Schema();
        schema.rules.email = true;
        return schema;
    }
    static url() {
        const schema = new Schema();
        schema.rules.url = true;
        return schema;
    }
    required(message) {
        this.rules.required = message || true;
        return this;
    }
    min(value, message) {
        this.rules.min = value;
        if (message)
            this.rules.min = message;
        return this;
    }
    max(value, message) {
        this.rules.max = value;
        if (message)
            this.rules.max = message;
        return this;
    }
    pattern(regex, message) {
        this.rules.pattern = regex;
        return this;
    }
    custom(validator) {
        this.rules.custom = validator;
        return this;
    }
    getRules() {
        return this.rules;
    }
}

function useForm(options = {}) {
    const { defaultValues = {}, validation = {}, onSubmit, mode = "onChange" } = options;
    const [values, setValues] = useState(defaultValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [dirty, setDirty] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fieldsRef = useRef(new Map());
    const watchersRef = useRef(new Map());
    const validateField = useCallback((name, value) => {
        const fieldConfig = fieldsRef.current.get(name);
        const validationRules = validation[name] || (fieldConfig === null || fieldConfig === void 0 ? void 0 : fieldConfig.validation);
        if (!validationRules)
            return null;
        return FormValidator.validate(value, validationRules);
    }, [validation]);
    const validateAllFields = useCallback(() => {
        const newErrors = {};
        let isValid = true;
        Object.keys(values).forEach((name) => {
            const error = validateField(name, values[name]);
            if (error) {
                newErrors[name] = error;
                isValid = false;
            }
        });
        setErrors(newErrors);
        return isValid;
    }, [values, validateField]);
    const setValue = useCallback((name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
        setDirty((prev) => ({ ...prev, [name]: true }));
        if (mode === "onChange") {
            const error = validateField(String(name), value);
            setErrors((prev) => ({
                ...prev,
                [name]: error || "",
            }));
        }
        // Notify watchers
        const watchers = watchersRef.current.get(String(name));
        if (watchers) {
            watchers.forEach((callback) => callback());
        }
    }, [mode, validateField]);
    const getValue = useCallback((name) => {
        return values[name];
    }, [values]);
    const getValues = useCallback(() => {
        return values;
    }, [values]);
    const setError = useCallback((name, message) => {
        setErrors((prev) => ({ ...prev, [name]: message }));
    }, []);
    const clearError = useCallback((name) => {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[String(name)];
            return newErrors;
        });
    }, []);
    const clearErrors = useCallback(() => {
        setErrors({});
    }, []);
    const reset = useCallback((newValues) => {
        const resetValues = newValues || defaultValues;
        setValues(resetValues);
        setErrors({});
        setTouched({});
        setDirty({});
        setIsSubmitting(false);
    }, [defaultValues]);
    const register = useCallback((name, config) => {
        if (config) {
            fieldsRef.current.set(String(name), config);
        }
        const fieldValidation = validation[String(name)];
        const isRequired = typeof (fieldValidation === null || fieldValidation === void 0 ? void 0 : fieldValidation.required) === "boolean" ? fieldValidation.required : !!(fieldValidation === null || fieldValidation === void 0 ? void 0 : fieldValidation.required);
        return {
            name: String(name),
            value: values[name] || "",
            onChange: (value) => setValue(name, value),
            onBlur: () => {
                setTouched((prev) => ({ ...prev, [name]: true }));
                if (mode === "onBlur") {
                    const error = validateField(String(name), values[name]);
                    setErrors((prev) => ({
                        ...prev,
                        [name]: error || "",
                    }));
                }
            },
            error: errors[String(name)],
            required: isRequired,
        };
    }, [values, errors, setValue, mode, validateField, validation]);
    const handleSubmit = useCallback((onValid) => {
        return async (e) => {
            if (e === null || e === void 0 ? void 0 : e.preventDefault) {
                e.preventDefault();
            }
            setIsSubmitting(true);
            try {
                const isValid = validateAllFields();
                if (isValid) {
                    await onValid(values);
                    if (onSubmit) {
                        await onSubmit(values);
                    }
                }
            }
            catch (error) {
                console.error("Form submission error:", error);
            }
            finally {
                setIsSubmitting(false);
            }
        };
    }, [values, validateAllFields, onSubmit]);
    const watch = useCallback((name) => {
        if (name) {
            return values[name];
        }
        return values;
    }, [values]);
    const trigger = useCallback(async (name) => {
        if (name) {
            const error = validateField(String(name), values[name]);
            setErrors((prev) => ({
                ...prev,
                [name]: error || "",
            }));
            return !error;
        }
        return validateAllFields();
    }, [validateField, values, validateAllFields]);
    const formState = useMemo(() => ({
        values,
        errors,
        touched,
        dirty,
        isValid: Object.keys(errors).length === 0,
        isSubmitting,
        isDirty: Object.keys(dirty).length > 0,
    }), [values, errors, touched, dirty, isSubmitting]);
    return {
        register,
        setValue,
        getValue,
        getValues,
        setError,
        clearError,
        clearErrors,
        reset,
        handleSubmit,
        watch,
        trigger,
        formState,
    };
}

const FormContext$1 = createContext(null);
function FormProvider$1({ children, form, }) {
    return jsx(FormContext$1.Provider, { value: form, children: children });
}
function useFormContext$1() {
    const context = useContext(FormContext$1);
    if (!context) {
        throw new Error("useFormContext must be used within a FormProvider");
    }
    return context;
}

const Input$1 = forwardRef(({ name, label, showError = true, containerClassName = "", labelClassName = "", errorClassName = "", className = "", ...props }, ref) => {
    const form = useFormContext$1();
    const field = form.register(name);
    return (jsxs("div", { className: `form-field ${containerClassName}`, children: [label && (jsxs("label", { htmlFor: name, className: `form-label ${labelClassName}`, children: [label, field.required && jsx("span", { className: "text-red-500 ml-1", children: "*" })] })), jsx("input", { ...props, ref: ref, id: name, name: field.name, value: field.value, onChange: (e) => field.onChange(e.target.value), onBlur: field.onBlur, className: `form-input ${field.error ? "error" : ""} ${className}`, "aria-invalid": !!field.error, "aria-describedby": field.error ? `${name}-error` : undefined }), showError && field.error && (jsx("span", { id: `${name}-error`, className: `form-error ${errorClassName}`, role: "alert", children: field.error }))] }));
});
Input$1.displayName = "Input";

const Select$1 = forwardRef(({ name, label, options, placeholder, showError = true, containerClassName = "", labelClassName = "", errorClassName = "", className = "", ...props }, ref) => {
    const form = useFormContext$1();
    const field = form.register(name);
    return (jsxs("div", { className: `form-field ${containerClassName}`, children: [label && (jsxs("label", { htmlFor: name, className: `form-label ${labelClassName}`, children: [label, field.required && jsx("span", { className: "text-red-500 ml-1", children: "*" })] })), jsxs("select", { ...props, ref: ref, id: name, name: field.name, value: field.value, onChange: (e) => field.onChange(e.target.value), onBlur: field.onBlur, className: `form-select ${field.error ? "error" : ""} ${className}`, "aria-invalid": !!field.error, "aria-describedby": field.error ? `${name}-error` : undefined, children: [placeholder && (jsx("option", { value: "", disabled: true, children: placeholder })), options.map((option) => (jsx("option", { value: option.value, disabled: option.disabled, children: option.label }, option.value)))] }), showError && field.error && (jsx("span", { id: `${name}-error`, className: `form-error ${errorClassName}`, role: "alert", children: field.error }))] }));
});
Select$1.displayName = "Select";

const Textarea = forwardRef(({ name, label, showError = true, containerClassName = "", labelClassName = "", errorClassName = "", className = "", ...props }, ref) => {
    const form = useFormContext$1();
    const field = form.register(name);
    return (jsxs("div", { className: `form-field ${containerClassName}`, children: [label && (jsxs("label", { htmlFor: name, className: `form-label ${labelClassName}`, children: [label, field.required && jsx("span", { className: "text-red-500 ml-1", children: "*" })] })), jsx("textarea", { ...props, ref: ref, id: name, name: field.name, value: field.value, onChange: (e) => field.onChange(e.target.value), onBlur: field.onBlur, className: `form-textarea ${field.error ? "error" : ""} ${className}`, "aria-invalid": !!field.error, "aria-describedby": field.error ? `${name}-error` : undefined }), showError && field.error && (jsx("span", { id: `${name}-error`, className: `form-error ${errorClassName}`, role: "alert", children: field.error }))] }));
});
Textarea.displayName = "Textarea";

const Checkbox$1 = forwardRef(({ name, label, showError = true, containerClassName = "", labelClassName = "", errorClassName = "", className = "", ...props }, ref) => {
    const form = useFormContext$1();
    const field = form.register(name);
    return (jsxs("div", { className: `form-field form-checkbox ${containerClassName}`, children: [jsxs("label", { className: `form-checkbox-label ${labelClassName}`, children: [jsx("input", { ...props, ref: ref, type: "checkbox", id: name, name: field.name, checked: !!field.value, onChange: (e) => field.onChange(e.target.checked), onBlur: field.onBlur, className: `form-checkbox-input ${field.error ? "error" : ""} ${className}`, "aria-invalid": !!field.error, "aria-describedby": field.error ? `${name}-error` : undefined }), label && (jsxs("span", { className: "form-checkbox-text", children: [label, field.required && jsx("span", { className: "text-red-500 ml-1", children: "*" })] }))] }), showError && field.error && (jsx("span", { id: `${name}-error`, className: `form-error ${errorClassName}`, role: "alert", children: field.error }))] }));
});
Checkbox$1.displayName = "Checkbox";

const FormContext = createContext(null);
function FormProvider({ children, form, }) {
    return jsx(FormContext.Provider, { value: form, children: children });
}
function useFormContext() {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error("useFormContext must be used within a FormProvider");
    }
    return context;
}

// Import React Native components (will be mocked in tests)
let View$2, Text$2, TextInput, StyleSheet$2;
try {
    const RN = require("react-native");
    View$2 = RN.View;
    Text$2 = RN.Text;
    TextInput = RN.TextInput;
    StyleSheet$2 = RN.StyleSheet;
}
catch (_a) {
    // Fallback for web/testing environment
    View$2 = ({ children, style, ...props }) => (jsx("div", { style: style, ...props, children: children }));
    Text$2 = ({ children, style, ...props }) => (jsx("span", { style: style, ...props, children: children }));
    TextInput = forwardRef(({ style, onChangeText, ...props }, ref) => (jsx("input", { ref: ref, style: style, onChange: (e) => onChangeText === null || onChangeText === void 0 ? void 0 : onChangeText(e.target.value), ...props })));
    StyleSheet$2 = {
        create: (styles) => styles,
    };
}
const Input = forwardRef(({ name, label, showError = true, containerStyle, labelStyle, inputStyle, errorStyle, style, ...props }, ref) => {
    const form = useFormContext();
    const field = form.register(name);
    return (jsxs(View$2, { style: [styles$2.container, containerStyle], children: [label && (jsxs(Text$2, { style: [styles$2.label, labelStyle], children: [label, field.required && jsx(Text$2, { style: styles$2.required, children: " *" })] })), jsx(TextInput, { ...props, ref: ref, value: field.value || "", onChangeText: field.onChange, onBlur: field.onBlur, style: [styles$2.input, field.error ? styles$2.inputError : null, inputStyle, style], accessibilityLabel: label, accessibilityInvalid: !!field.error }), showError && field.error && jsx(Text$2, { style: [styles$2.error, errorStyle], children: field.error })] }));
});
Input.displayName = "Input";
const styles$2 = StyleSheet$2.create({
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
});

// Import React Native components (will be mocked in tests)
let View$1, Text$1, TouchableOpacity$1, Modal, FlatList, StyleSheet$1;
try {
    const RN = require("react-native");
    View$1 = RN.View;
    Text$1 = RN.Text;
    TouchableOpacity$1 = RN.TouchableOpacity;
    Modal = RN.Modal;
    FlatList = RN.FlatList;
    StyleSheet$1 = RN.StyleSheet;
}
catch (_a) {
    // Fallback for web/testing environment
    View$1 = ({ children, style, ...props }) => (jsx("div", { style: style, ...props, children: children }));
    Text$1 = ({ children, style, ...props }) => (jsx("span", { style: style, ...props, children: children }));
    TouchableOpacity$1 = ({ children, onPress, style, disabled, ...props }) => (jsx("button", { onClick: onPress, style: style, disabled: disabled, ...props, children: children }));
    Modal = ({ children, visible, onRequestClose, ...props }) => visible ? (jsx("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }, ...props, children: children })) : null;
    FlatList = ({ data, renderItem, keyExtractor, ...props }) => (jsx("div", { ...props, children: data === null || data === void 0 ? void 0 : data.map((item, index) => (jsx("div", { children: renderItem({ item, index }) }, keyExtractor ? keyExtractor(item, index) : index))) }));
    StyleSheet$1 = {
        create: (styles) => styles,
    };
}
function Select({ name, label, options, placeholder = "Select an option", showError = true, containerStyle, labelStyle, selectStyle, errorStyle, modalStyle, optionStyle, }) {
    const [isVisible, setIsVisible] = useState(false);
    const form = useFormContext();
    const field = form.register(name);
    const selectedOption = options.find((option) => option.value === field.value);
    const handleSelect = (option) => {
        field.onChange(option.value);
        setIsVisible(false);
    };
    return (jsxs(View$1, { style: [styles$1.container, containerStyle], children: [label && (jsxs(Text$1, { style: [styles$1.label, labelStyle], children: [label, field.required && jsx(Text$1, { style: styles$1.required, children: " *" })] })), jsx(TouchableOpacity$1, { style: [styles$1.select, field.error ? styles$1.selectError : null, selectStyle], onPress: () => setIsVisible(true), children: jsx(Text$1, { style: [styles$1.selectText, !selectedOption && styles$1.placeholder], children: selectedOption ? selectedOption.label : placeholder }) }), showError && field.error && jsx(Text$1, { style: [styles$1.error, errorStyle], children: field.error }), jsx(Modal, { visible: isVisible, onRequestClose: () => setIsVisible(false), children: jsx(TouchableOpacity$1, { style: styles$1.modalOverlay, onPress: () => setIsVisible(false), children: jsx(View$1, { style: [styles$1.modalContent, modalStyle], children: jsx(FlatList, { data: options, keyExtractor: (item) => String(item.value), renderItem: ({ item }) => (jsx(TouchableOpacity$1, { style: [styles$1.option, item.disabled && styles$1.optionDisabled], onPress: () => !item.disabled && handleSelect(item), disabled: item.disabled, children: jsx(Text$1, { style: [styles$1.optionText, item.disabled && styles$1.optionTextDisabled, optionStyle], children: item.label }) })) }) }) }) })] }));
}
const styles$1 = StyleSheet$1.create({
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
});

// Import React Native components (will be mocked in tests)
let View, Text, TouchableOpacity, StyleSheet;
try {
    const RN = require("react-native");
    View = RN.View;
    Text = RN.Text;
    TouchableOpacity = RN.TouchableOpacity;
    StyleSheet = RN.StyleSheet;
}
catch (_a) {
    // Fallback for web/testing environment
    View = ({ children, style, ...props }) => (jsx("div", { style: style, ...props, children: children }));
    Text = ({ children, style, ...props }) => (jsx("span", { style: style, ...props, children: children }));
    TouchableOpacity = ({ children, onPress, style, ...props }) => (jsx("button", { onClick: onPress, style: style, ...props, children: children }));
    StyleSheet = {
        create: (styles) => styles,
    };
}
function Checkbox({ name, label, showError = true, containerStyle, labelStyle, checkboxStyle, errorStyle, }) {
    const form = useFormContext();
    const field = form.register(name);
    return (jsxs(View, { style: [styles.container, containerStyle], children: [jsxs(TouchableOpacity, { style: styles.checkboxContainer, onPress: () => field.onChange(!field.value), children: [jsx(View, { style: [
                            styles.checkbox,
                            field.value && styles.checkboxChecked,
                            field.error && styles.checkboxError,
                            checkboxStyle,
                        ], children: field.value && jsx(Text, { style: styles.checkmark, children: "\u2713" }) }), label && (jsxs(Text, { style: [styles.label, labelStyle], children: [label, field.required && jsx(Text, { style: styles.required, children: " *" })] }))] }), showError && field.error && jsx(Text, { style: [styles.error, errorStyle], children: field.error })] }));
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
});

var index$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Checkbox: Checkbox$1,
    FormProvider: FormProvider$1,
    Input: Input$1,
    Select: Select$1,
    Textarea: Textarea,
    WebCheckbox: Checkbox$1,
    WebFormProvider: FormProvider$1,
    WebInput: Input$1,
    WebSelect: Select$1,
    WebTextarea: Textarea,
    useFormContext: useFormContext$1,
    useWebFormContext: useFormContext$1
});

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Checkbox: Checkbox,
    FormProvider: FormProvider,
    Input: Input,
    NativeCheckbox: Checkbox,
    NativeFormProvider: FormProvider,
    NativeInput: Input,
    NativeSelect: Select,
    Select: Select,
    useFormContext: useFormContext,
    useNativeFormContext: useFormContext
});

export { FormValidator, index as Native, Checkbox as NativeCheckbox, FormProvider as NativeFormProvider, Input as NativeInput, Select as NativeSelect, Schema, index$1 as Web, Checkbox$1 as WebCheckbox, FormProvider$1 as WebFormProvider, Input$1 as WebInput, Select$1 as WebSelect, Textarea as WebTextarea, useForm, useFormContext as useNativeFormContext, useFormContext$1 as useWebFormContext };
//# sourceMappingURL=index.esm.js.map
