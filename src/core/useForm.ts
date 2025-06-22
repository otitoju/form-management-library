"use client"

import { useState, useCallback, useRef, useMemo } from "react"
import type { UseFormOptions, FormState, FormMethods, FieldConfig } from "../types"
import { FormValidator } from "./validation"

export function useForm<T extends Record<string, any> = Record<string, any>>(
  options: UseFormOptions<T> = {},
): FormMethods<T> & { formState: FormState<T> } {
  const { defaultValues = {} as Partial<T>, validation = {}, onSubmit, mode = "onChange" } = options

  const [values, setValues] = useState<T>(defaultValues as T)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [dirty, setDirty] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fieldsRef = useRef<Map<string, FieldConfig>>(new Map())
  const watchersRef = useRef<Map<string, Set<() => void>>>(new Map())

  const validateField = useCallback(
    (name: string, value: any): string | null => {
      const fieldConfig = fieldsRef.current.get(name)
      const validationRules = validation[name] || fieldConfig?.validation

      if (!validationRules) return null

      return FormValidator.validate(value, validationRules)
    },
    [validation],
  )

  const validateAllFields = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    Object.keys(values).forEach((name) => {
      const error = validateField(name, values[name])
      if (error) {
        newErrors[name] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [values, validateField])

  const setValue = useCallback(
    (name: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }))
      setDirty((prev) => ({ ...prev, [name]: true }))

      if (mode === "onChange") {
        const error = validateField(String(name), value)
        setErrors((prev) => ({
          ...prev,
          [name]: error || "",
        }))
      }

      // Notify watchers
      const watchers = watchersRef.current.get(String(name))
      if (watchers) {
        watchers.forEach((callback) => callback())
      }
    },
    [mode, validateField],
  )

  const getValue = useCallback(
    (name: keyof T) => {
      return values[name]
    },
    [values],
  )

  const getValues = useCallback(() => {
    return values
  }, [values])

  const setError = useCallback((name: keyof T, message: string) => {
    setErrors((prev) => ({ ...prev, [name]: message }))
  }, [])

  const clearError = useCallback((name: keyof T) => {
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[String(name)]
      return newErrors
    })
  }, [])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const reset = useCallback(
    (newValues?: Partial<T>) => {
      const resetValues = newValues || defaultValues
      setValues(resetValues as T)
      setErrors({})
      setTouched({})
      setDirty({})
      setIsSubmitting(false)
    },
    [defaultValues],
  )

  const register = useCallback(
    (name: keyof T, config?: FieldConfig) => {
      if (config) {
        fieldsRef.current.set(String(name), config)
      }

      const fieldValidation = validation[String(name)]
      const isRequired =
        typeof fieldValidation?.required === "boolean" ? fieldValidation.required : !!fieldValidation?.required

      return {
        name: String(name),
        value: values[name] || "",
        onChange: (value: any) => setValue(name, value),
        onBlur: () => {
          setTouched((prev) => ({ ...prev, [name]: true }))
          if (mode === "onBlur") {
            const error = validateField(String(name), values[name])
            setErrors((prev) => ({
              ...prev,
              [name]: error || "",
            }))
          }
        },
        error: errors[String(name)],
        required: isRequired,
      }
    },
    [values, errors, setValue, mode, validateField, validation],
  )

  const handleSubmit = useCallback(
    (onValid: (data: T) => void | Promise<void>) => {
      return async (e?: any) => {
        if (e?.preventDefault) {
          e.preventDefault()
        }

        setIsSubmitting(true)

        try {
          const isValid = validateAllFields()

          if (isValid) {
            await onValid(values)
            if (onSubmit) {
              await onSubmit(values)
            }
          }
        } catch (error) {
          console.error("Form submission error:", error)
        } finally {
          setIsSubmitting(false)
        }
      }
    },
    [values, validateAllFields, onSubmit],
  )

  const watch = useCallback(
    (name?: keyof T) => {
      if (name) {
        return values[name]
      }
      return values
    },
    [values],
  )

  const trigger = useCallback(
    async (name?: keyof T): Promise<boolean> => {
      if (name) {
        const error = validateField(String(name), values[name])
        setErrors((prev) => ({
          ...prev,
          [name]: error || "",
        }))
        return !error
      }

      return validateAllFields()
    },
    [validateField, values, validateAllFields],
  )

  const formState: FormState<T> = useMemo(
    () => ({
      values,
      errors,
      touched,
      dirty,
      isValid: Object.keys(errors).length === 0,
      isSubmitting,
      isDirty: Object.keys(dirty).length > 0,
    }),
    [values, errors, touched, dirty, isSubmitting],
  )

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
  }
}
