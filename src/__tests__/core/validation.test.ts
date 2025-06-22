import { FormValidator, Schema } from "../../core/validation"

describe("FormValidator", () => {
  describe("validate", () => {
    it("should validate required fields", () => {
      const rules = { required: true }

      expect(FormValidator.validate("", rules)).toBe("This field is required")
      expect(FormValidator.validate(null, rules)).toBe("This field is required")
      expect(FormValidator.validate(undefined, rules)).toBe("This field is required")
      expect(FormValidator.validate("value", rules)).toBeNull()
    })

    it("should validate email format", () => {
      const rules = { email: true }

      expect(FormValidator.validate("invalid-email", rules)).toBe("Please enter a valid email")
      expect(FormValidator.validate("test@example.com", rules)).toBeNull()
      expect(FormValidator.validate("", rules)).toBeNull() // Empty optional field
    })

    it("should validate minimum length", () => {
      const rules = { min: 5 }

      expect(FormValidator.validate("abc", rules)).toBe("Minimum 5 characters required")
      expect(FormValidator.validate("abcdef", rules)).toBeNull()
    })

    it("should validate maximum length", () => {
      const rules = { max: 10 }

      expect(FormValidator.validate("this is too long", rules)).toBe("Maximum 10 characters allowed")
      expect(FormValidator.validate("short", rules)).toBeNull()
    })

    it("should validate custom rules", () => {
      const rules = {
        custom: (value: string) => value.includes("test") || 'Must contain "test"',
      }

      expect(FormValidator.validate("hello", rules)).toBe('Must contain "test"')
      expect(FormValidator.validate("test123", rules)).toBeNull()
    })

    it("should validate pattern matching", () => {
      const rules = { pattern: /^\d{3}-\d{3}-\d{4}$/ }

      expect(FormValidator.validate("123-456-7890", rules)).toBeNull()
      expect(FormValidator.validate("invalid-format", rules)).toBe("Please enter a valid format")
    })
  })
})

describe("Schema", () => {
  it("should create string schema with validation rules", () => {
    const schema = Schema.string().required("Name is required").min(2, "Too short")
    const rules = schema.getRules()

    expect(rules.required).toBe("Name is required")
    expect(rules.min).toBe("Too short")
  })

  it("should create email schema", () => {
    const schema = Schema.email().required()
    const rules = schema.getRules()

    expect(rules.email).toBe(true)
    expect(rules.required).toBe(true)
  })

  it("should create number schema", () => {
    const schema = Schema.number().min(0).max(100)
    const rules = schema.getRules()

    expect(rules.number).toBe(true)
    expect(rules.min).toBe(0)
    expect(rules.max).toBe(100)
  })

  it("should chain validation rules", () => {
    const schema = Schema.string()
      .required("Required field")
      .min(8, "At least 8 chars")
      .pattern(/^[A-Za-z]+$/, "Letters only")

    const rules = schema.getRules()

    expect(rules.required).toBe("Required field")
    expect(rules.min).toBe("At least 8 chars")
    expect(rules.pattern).toBeInstanceOf(RegExp)
  })
})
