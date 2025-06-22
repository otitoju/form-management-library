"use client"
import { useForm, WebFormProvider, WebInput, WebSelect, WebTextarea, WebCheckbox, Schema } from "@formcraft/core"

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  priority: string
  newsletter: boolean
}

const validationSchema = {
  name: Schema.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  email: Schema.email().required("Email is required"),
  subject: Schema.string().required("Subject is required"),
  message: Schema.string().required("Message is required").min(10, "Message must be at least 10 characters"),
  priority: Schema.string().required("Please select a priority"),
  newsletter: Schema.string(), // Boolean fields don't need validation unless required
}

export function ContactFormExample() {
  const form = useForm<ContactFormData>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      priority: "",
      newsletter: false,
    },
    validation: validationSchema,
    mode: "onChange",
  })

  const onSubmit = async (data: ContactFormData) => {
    console.log("Form submitted:", data)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    alert("Message sent successfully!")
    form.reset()
  }

  const priorityOptions = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" },
    { value: "urgent", label: "Urgent" },
  ]

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Contact Form Example</h1>

      <WebFormProvider form={form}>
        <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <WebInput name="name" label="Full Name" placeholder="Enter your full name" />

          <WebInput name="email" type="email" label="Email Address" placeholder="Enter your email" />

          <WebInput name="subject" label="Subject" placeholder="What is this about?" />

          <WebSelect
            name="priority"
            label="Priority Level"
            options={priorityOptions}
            placeholder="Select priority level"
          />

          <WebTextarea name="message" label="Message" placeholder="Enter your message here..." rows={5} />

          <WebCheckbox name="newsletter" label="Subscribe to our newsletter for updates" />

          <div style={{ marginTop: "20px" }}>
            <button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              style={{
                padding: "12px 24px",
                backgroundColor: form.formState.isValid ? "#3B82F6" : "#9CA3AF",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                cursor: form.formState.isValid ? "pointer" : "not-allowed",
                transition: "background-color 0.2s",
              }}
            >
              {form.formState.isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </div>

          {/* Debug info */}
          <details style={{ marginTop: "20px", padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "6px" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>Debug Info</summary>
            <pre style={{ fontSize: "12px", marginTop: "8px" }}>
              {JSON.stringify(
                {
                  values: form.formState.values,
                  errors: form.formState.errors,
                  isValid: form.formState.isValid,
                  isDirty: form.formState.isDirty,
                },
                null,
                2,
              )}
            </pre>
          </details>
        </form>
      </WebFormProvider>
    </div>
  )
}
