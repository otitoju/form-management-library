export interface ValidationRule<T = any> {
  required?: boolean | string
  min?: number | string
  max?: number | string
  pattern?: RegExp | string
  custom?: (value: T) => boolean | string
  email?: boolean | string
  url?: boolean | string
  number?: boolean | string
}

export interface FieldConfig<T = any> {
  name: string
  defaultValue?: T
  validation?: ValidationRule<T>
  dependencies?: string[]
  condition?: (formData: Record<string, any>) => boolean
}

export interface FormError {
  field: string
  message: string
  type: string
}

export interface FormState<T extends Record<string, any> = Record<string, any>> {
  values: T
  errors: Record<string, string>
  touched: Record<string, boolean>
  dirty: Record<string, boolean>
  isValid: boolean
  isSubmitting: boolean
  isDirty: boolean
}

export interface UseFormOptions<T extends Record<string, any> = Record<string, any>> {
  defaultValues?: Partial<T>
  validation?: Record<string, ValidationRule>
  onSubmit?: (data: T) => void | Promise<void>
  mode?: "onChange" | "onBlur" | "onSubmit"
}

export interface RegisterReturn {
  name: string
  value: any
  onChange: (value: any) => void
  onBlur: () => void
  error?: string
  required?: boolean
}

export interface FormMethods<T extends Record<string, any> = Record<string, any>> {
  register: (name: keyof T, config?: FieldConfig) => RegisterReturn
  setValue: (name: keyof T, value: any) => void
  getValue: (name: keyof T) => any
  getValues: () => T
  setError: (name: keyof T, message: string) => void
  clearError: (name: keyof T) => void
  clearErrors: () => void
  reset: (values?: Partial<T>) => void
  handleSubmit: (onValid: (data: T) => void | Promise<void>) => (e?: any) => void
  watch: (name?: keyof T) => any
  trigger: (name?: keyof T) => Promise<boolean>
}

export interface FormContextValue<T extends Record<string, any> = Record<string, any>> extends FormMethods<T> {
  formState: FormState<T>
}
