import { render, screen, fireEvent } from "@testing-library/react"
import { useForm } from "../../../core/useForm"
import { FormProvider, Input } from "../../../components/web"

function TestForm() {
  const form = useForm({
    defaultValues: { email: "" },
    validation: {
      email: { required: true, email: true },
    },
    mode: "onChange",
  })

  return (
    <FormProvider form={form}>
      <Input name="email" label="Email Address" placeholder="Enter your email" data-testid="email-input" />
    </FormProvider>
  )
}

describe("WebInput", () => {
  it("should render input with label", () => {
    render(<TestForm />)

    expect(screen.getByLabelText("Email Address")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument()
  })

  it("should show validation error on invalid input", async () => {
    render(<TestForm />)

    const input = screen.getByTestId("email-input")

    fireEvent.change(input, { target: { value: "invalid-email" } })

    expect(await screen.findByText("Please enter a valid email")).toBeInTheDocument()
    expect(input).toHaveAttribute("aria-invalid", "true")
  })

  it("should clear error on valid input", async () => {
    render(<TestForm />)

    const input = screen.getByTestId("email-input")

    // Enter invalid email first
    fireEvent.change(input, { target: { value: "invalid" } })
    expect(await screen.findByText("Please enter a valid email")).toBeInTheDocument()

    // Enter valid email
    fireEvent.change(input, { target: { value: "test@example.com" } })

    expect(screen.queryByText("Please enter a valid email")).not.toBeInTheDocument()
    expect(input).toHaveAttribute("aria-invalid", "false")
  })

  it("should show required indicator when field is required", () => {
    render(<TestForm />)

    expect(screen.getByText("*")).toBeInTheDocument()
  })
})
