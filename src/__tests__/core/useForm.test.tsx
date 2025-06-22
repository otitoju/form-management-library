import { renderHook, act } from "@testing-library/react"
import { useForm } from "../../core/useForm"
import { Schema } from "../../core/validation"

interface TestFormData {
  name: string
  email: string
  age: number
}

describe("useForm", () => {
  it("should initialize with default values", () => {
    const defaultValues = { name: "John", email: "john@example.com", age: 25 }
    const { result } = renderHook(() => useForm<TestFormData>({ defaultValues }))

    expect(result.current.formState.values).toEqual(defaultValues)
    expect(result.current.formState.errors).toEqual({})
    expect(result.current.formState.isDirty).toBe(false)
    expect(result.current.formState.isValid).toBe(true)
  })

  it("should register fields and handle changes", () => {
    const { result } = renderHook(() =>
      useForm<TestFormData>({
        defaultValues: { name: "", email: "", age: 0 },
      }),
    )

    const nameField = result.current.register("name")

    expect(nameField.name).toBe("name")
    expect(nameField.value).toBe("")

    act(() => {
      nameField.onChange("John Doe")
    })

    expect(result.current.formState.values.name).toBe("John Doe")
    expect(result.current.formState.isDirty).toBe(true)
  })

  it("should validate fields on change when mode is onChange", () => {
    const validation = {
      email: Schema.email().required("Email is required").getRules(),
    }

    const { result } = renderHook(() =>
      useForm<TestFormData>({
        defaultValues: { name: "", email: "", age: 0 },
        validation,
        mode: "onChange",
      }),
    )

    const emailField = result.current.register("email")

    act(() => {
      emailField.onChange("invalid-email")
    })

    expect(result.current.formState.errors.email).toBe("Please enter a valid email")
    expect(result.current.formState.isValid).toBe(false)

    act(() => {
      emailField.onChange("john@example.com")
    })

    expect(result.current.formState.errors.email).toBeFalsy()
  })

  it("should handle form submission", async () => {
    const onSubmit = jest.fn()
    const { result } = renderHook(() =>
      useForm<TestFormData>({
        defaultValues: { name: "John", email: "john@example.com", age: 25 },
        onSubmit,
      }),
    )

    const handleSubmit = result.current.handleSubmit(onSubmit)

    await act(async () => {
      await handleSubmit()
    })

    expect(onSubmit).toHaveBeenCalledWith({
      name: "John",
      email: "john@example.com",
      age: 25,
    })
  })

  it("should prevent submission when form is invalid", async () => {
    const onSubmit = jest.fn()
    const validation = {
      name: Schema.string().required("Name is required").getRules(),
    }

    const { result } = renderHook(() =>
      useForm<TestFormData>({
        defaultValues: { name: "", email: "", age: 0 },
        validation,
        onSubmit,
      }),
    )

    const handleSubmit = result.current.handleSubmit(onSubmit)

    await act(async () => {
      await handleSubmit()
    })

    expect(onSubmit).not.toHaveBeenCalled()
    expect(result.current.formState.errors.name).toBe("Name is required")
  })

  it("should reset form to initial state", () => {
    const defaultValues = { name: "John", email: "john@example.com", age: 25 }
    const { result } = renderHook(() => useForm<TestFormData>({ defaultValues }))

    // Make changes
    act(() => {
      result.current.setValue("name", "Jane")
      result.current.setError("email", "Some error")
    })

    expect(result.current.formState.values.name).toBe("Jane")
    expect(result.current.formState.errors.email).toBe("Some error")
    expect(result.current.formState.isDirty).toBe(true)

    // Reset
    act(() => {
      result.current.reset()
    })

    expect(result.current.formState.values).toEqual(defaultValues)
    expect(result.current.formState.errors).toEqual({})
    expect(result.current.formState.isDirty).toBe(false)
  })

  it("should watch field changes", () => {
    const { result } = renderHook(() =>
      useForm<TestFormData>({
        defaultValues: { name: "John", email: "", age: 0 },
      }),
    )

    expect(result.current.watch("name")).toBe("John")
    expect(result.current.watch()).toEqual({ name: "John", email: "", age: 0 })

    act(() => {
      result.current.setValue("name", "Jane")
    })

    expect(result.current.watch("name")).toBe("Jane")
  })
})
