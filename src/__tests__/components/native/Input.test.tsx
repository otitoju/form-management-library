import { render, fireEvent } from "@testing-library/react"
import { useForm } from "../../../core/useForm"
import { FormProvider, Input } from "../../../components/native"

function TestForm() {
  const form = useForm({
    defaultValues: { name: "" },
    validation: {
      name: { required: true, min: 2 },
    },
    mode: "onChange",
  })

  return (
    <FormProvider form={form}>
      <Input name="name" label="Full Name" placeholder="Enter your name" testID="name-input" />
    </FormProvider>
  )
}

describe("NativeInput", () => {
  it("should render input with label", () => {
    const { getByText, getByPlaceholderText } = render(<TestForm />)

    expect(getByText("Full Name")).toBeTruthy()
    expect(getByPlaceholderText("Enter your name")).toBeTruthy()
  })

  it("should show validation error on invalid input", () => {
    const { getByTestId, getByText } = render(<TestForm />)

    const input = getByTestId("name-input")

    fireEvent.change(input, { target: { value: "a" } })

    expect(getByText("Minimum 2 characters required")).toBeTruthy()
  })

  it("should show required indicator", () => {
    const { getByText } = render(<TestForm />)

    expect(getByText("*")).toBeTruthy()
  })
})
