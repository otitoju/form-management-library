import type { ValidationRule } from "../types"

export class FormValidator {
  static validate<T>(value: T, rules: ValidationRule<T>): string | null {
    if (rules.required && this.isEmpty(value)) {
      return typeof rules.required === "string" ? rules.required : "This field is required"
    }

    if (this.isEmpty(value)) {
      return null // Don't validate empty optional fields
    }

    if (rules.email && !this.isValidEmail(String(value))) {
      return typeof rules.email === "string" ? rules.email : "Please enter a valid email"
    }

    if (rules.url && !this.isValidUrl(String(value))) {
      return typeof rules.url === "string" ? rules.url : "Please enter a valid URL"
    }

    if (rules.number && !this.isValidNumber(value)) {
      return typeof rules.number === "string" ? rules.number : "Please enter a valid number"
    }

    if (rules.min !== undefined) {
      const minError = this.validateMin(value, rules.min)
      if (minError) return minError
    }

    if (rules.max !== undefined) {
      const maxError = this.validateMax(value, rules.max)
      if (maxError) return maxError
    }

    if (rules.pattern) {
      const pattern = typeof rules.pattern === "string" ? new RegExp(rules.pattern) : rules.pattern
      if (!pattern.test(String(value))) {
        return "Please enter a valid format"
      }
    }

    if (rules.custom) {
      const customResult = rules.custom(value)
      if (typeof customResult === "string") {
        return customResult
      }
      if (customResult === false) {
        return "Invalid value"
      }
    }

    return null
  }

  private static isEmpty(value: any): boolean {
    return value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  private static isValidNumber(value: any): boolean {
    return !isNaN(Number(value)) && isFinite(Number(value))
  }

  private static validateMin(value: any, min: number | string): string | null {
    if (typeof min === "number") {
      if (typeof value === "string" && value.length < min) {
        return `Minimum ${min} characters required`
      }
      if (typeof value === "number" && value < min) {
        return `Minimum value is ${min}`
      }
      if (Array.isArray(value) && value.length < min) {
        return `Minimum ${min} items required`
      }
    }
    return null
  }

  private static validateMax(value: any, max: number | string): string | null {
    if (typeof max === "number") {
      if (typeof value === "string" && value.length > max) {
        return `Maximum ${max} characters allowed`
      }
      if (typeof value === "number" && value > max) {
        return `Maximum value is ${max}`
      }
      if (Array.isArray(value) && value.length > max) {
        return `Maximum ${max} items allowed`
      }
    }
    return null
  }
}

// Zod-inspired schema builder
export class Schema<T = any> {
  private rules: ValidationRule<T> = {}

  static string() {
    return new Schema<string>()
  }

  static number() {
    const schema = new Schema<number>()
    schema.rules.number = true
    return schema
  }

  static email() {
    const schema = new Schema<string>()
    schema.rules.email = true
    return schema
  }

  static url() {
    const schema = new Schema<string>()
    schema.rules.url = true
    return schema
  }

  required(message?: string) {
    this.rules.required = message || true
    return this
  }

  min(value: number, message?: string) {
    this.rules.min = value
    if (message) this.rules.min = message
    return this
  }

  max(value: number, message?: string) {
    this.rules.max = value
    if (message) this.rules.max = message
    return this
  }

  pattern(regex: RegExp, message?: string) {
    this.rules.pattern = regex
    return this
  }

  custom(validator: (value: T) => boolean | string) {
    this.rules.custom = validator
    return this
  }

  getRules(): ValidationRule<T> {
    return this.rules
  }
}
