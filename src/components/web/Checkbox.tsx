"use client"

import { forwardRef, type InputHTMLAttributes } from "react"
import { useFormContext } from "./FormProvider"

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "type"> {
  name: string
  label?: string
  showError?: boolean
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      name,
      label,
      showError = true,
      containerClassName = "",
      labelClassName = "",
      errorClassName = "",
      className = "",
      ...props
    },
    ref,
  ) => {
    const form = useFormContext()
    const field = form.register(name)

    return (
      <div className={`form-field form-checkbox ${containerClassName}`}>
        <label className={`form-checkbox-label ${labelClassName}`}>
          <input
            {...props}
            ref={ref}
            type="checkbox"
            id={name}
            name={field.name}
            checked={!!field.value}
            onChange={(e) => field.onChange(e.target.checked)}
            onBlur={field.onBlur}
            className={`form-checkbox-input ${field.error ? "error" : ""} ${className}`}
            aria-invalid={!!field.error}
            aria-describedby={field.error ? `${name}-error` : undefined}
          />
          {label && (
            <span className="form-checkbox-text">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </span>
          )}
        </label>
        {showError && field.error && (
          <span id={`${name}-error`} className={`form-error ${errorClassName}`} role="alert">
            {field.error}
          </span>
        )}
      </div>
    )
  },
)

Checkbox.displayName = "Checkbox"
