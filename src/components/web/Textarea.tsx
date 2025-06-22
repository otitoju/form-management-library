"use client"

import { forwardRef, type TextareaHTMLAttributes } from "react"
import { useFormContext } from "./FormProvider"

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {
  name: string
  label?: string
  showError?: boolean
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
      <div className={`form-field ${containerClassName}`}>
        {label && (
          <label htmlFor={name} className={`form-label ${labelClassName}`}>
            {label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          {...props}
          ref={ref}
          id={name}
          name={field.name}
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
          className={`form-textarea ${field.error ? "error" : ""} ${className}`}
          aria-invalid={!!field.error}
          aria-describedby={field.error ? `${name}-error` : undefined}
        />
        {showError && field.error && (
          <span id={`${name}-error`} className={`form-error ${errorClassName}`} role="alert">
            {field.error}
          </span>
        )}
      </div>
    )
  },
)

Textarea.displayName = "Textarea"
