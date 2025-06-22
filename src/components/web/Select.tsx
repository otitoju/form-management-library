"use client"

import { forwardRef, type SelectHTMLAttributes } from "react"
import { useFormContext } from "./FormProvider"

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "name"> {
  name: string
  label?: string
  options: Array<{ value: string | number; label: string; disabled?: boolean }>
  placeholder?: string
  showError?: boolean
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      name,
      label,
      options,
      placeholder,
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
      <div className={`form-field ${containerClassName}`}>
        {label && (
          <label htmlFor={name} className={`form-label ${labelClassName}`}>
            {label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          {...props}
          ref={ref}
          id={name}
          name={field.name}
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
          className={`form-select ${field.error ? "error" : ""} ${className}`}
          aria-invalid={!!field.error}
          aria-describedby={field.error ? `${name}-error` : undefined}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {showError && field.error && (
          <span id={`${name}-error`} className={`form-error ${errorClassName}`} role="alert">
            {field.error}
          </span>
        )}
      </div>
    )
  },
)

Select.displayName = "Select"
