"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { FormContextValue } from "../../types"

const FormContext = createContext<FormContextValue | null>(null)

interface FormProviderProps<T extends Record<string, any> = Record<string, any>> {
  children: ReactNode
  form: FormContextValue<T>
}

export function FormProvider<T extends Record<string, any> = Record<string, any>>({
  children,
  form,
}: FormProviderProps<T>) {
  return <FormContext.Provider value={form as FormContextValue}>{children}</FormContext.Provider>
}

export function useFormContext<T extends Record<string, any> = Record<string, any>>(): FormContextValue<T> {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider")
  }
  return context as FormContextValue<T>
}
