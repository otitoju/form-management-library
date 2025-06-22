export { useForm } from "./core/useForm";
export { FormValidator, Schema } from "./core/validation";
export type { ValidationRule, FieldConfig, FormError, FormState, UseFormOptions, FormMethods, RegisterReturn, FormContextValue, } from "./types";
export { FormProvider as WebFormProvider, useFormContext as useWebFormContext } from "./components/web/FormProvider";
export { Input as WebInput } from "./components/web/Input";
export { Select as WebSelect } from "./components/web/Select";
export { Textarea as WebTextarea } from "./components/web/Textarea";
export { Checkbox as WebCheckbox } from "./components/web/Checkbox";
export { FormProvider as NativeFormProvider, useFormContext as useNativeFormContext, } from "./components/native/FormProvider";
export { Input as NativeInput } from "./components/native/Input";
export { Select as NativeSelect } from "./components/native/Select";
export { Checkbox as NativeCheckbox } from "./components/native/Checkbox";
export * as Web from "./components/web";
export * as Native from "./components/native";
//# sourceMappingURL=index.d.ts.map