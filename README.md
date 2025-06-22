# @otitoju/formcraft-core

<div align="center">

🚀 **Lightweight, TypeScript-first form management library for React and React Native**

[![npm version](https://badge.fury.io/js/@otitoju%2Fformcraft-core.svg)](https://www.npmjs.com/package/@otitoju/formcraft-core)
[![Downloads](https://img.shields.io/npm/dm/@otitoju/formcraft-core.svg)](https://www.npmjs.com/package/@otitoju/formcraft-core)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@otitoju/formcraft-core)](https://bundlephobia.com/package/@otitoju/formcraft-core)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## ✨ Why FormCraft?

- 🪶 **Ultra Lightweight** - Only ~5KB gzipped, zero dependencies
- 🔧 **TypeScript First** - Full type safety with excellent IntelliSense
- 🌐 **Cross Platform** - Works seamlessly with React and React Native
- ⚡ **Performance Focused** - Optimized re-renders and efficient updates
- 🎯 **Developer Experience** - Simple API inspired by React Hook Form
- ✅ **Built-in Validation** - Zod-inspired schema validation included
- 📱 **Mobile Ready** - Native components for React Native
- ♿ **Accessible** - WCAG compliant with proper ARIA attributes

## 🚀 Quick Start

\`\`\`bash
npm install @otitoju/formcraft-core
# or
yarn add @otitoju/formcraft-core
# or
pnpm add @otitoju/formcraft-core
\`\`\`

### React/Next.js Example

\`\`\`tsx
import { useForm, WebFormProvider, WebInput, Schema } from '@otitoju/formcraft-core';
import '@otitoju/formcraft-core/dist/web.css'; // Optional default styles

interface FormData {
  email: string;
  password: string;
}

function LoginForm() {
  const form = useForm<FormData>({
    defaultValues: { email: '', password: '' },
    validation: {
      email: Schema.email().required('Email is required'),
      password: Schema.string().min(8, 'At least 8 characters').required()
    }
  });

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
  };

  return (
    <WebFormProvider form={form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <WebInput name="email" label="Email" type="email" />
        <WebInput name="password" label="Password" type="password" />
        <button type="submit" disabled={!form.formState.isValid}>
          Sign In
        </button>
      </form>
    </WebFormProvider>
  );
}
\`\`\`

### React Native Example

\`\`\`tsx
import { useForm, NativeFormProvider, NativeInput, Schema } from '@otitoju/formcraft-core';
import { View, Button } from 'react-native';

function ContactForm() {
  const form = useForm({
    defaultValues: { name: '', email: '' },
    validation: {
      name: Schema.string().required('Name is required'),
      email: Schema.email().required('Email is required')
    }
  });

  return (
    <NativeFormProvider form={form}>
      <View>
        <NativeInput name="name" label="Name" />
        <NativeInput name="email" label="Email" keyboardType="email-address" />
        <Button 
          title="Submit" 
          onPress={form.handleSubmit(console.log)}
          disabled={!form.formState.isValid}
        />
      </View>
    </NativeFormProvider>
  );
}
\`\`\`

## 🔥 Next.js Integration

FormCraft works seamlessly with Next.js App Router, Server Actions, and all modern Next.js features.

### Setup in Next.js

\`\`\`tsx
// app/layout.tsx
import '@otitoju/formcraft-core/dist/web.css'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
\`\`\`

### Contact Form with API Route

\`\`\`tsx
// app/contact/page.tsx
"use client"

import { useForm, WebFormProvider, WebInput, WebTextarea, WebSelect, Schema } from '@otitoju/formcraft-core'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  priority: string
}

export default function ContactPage() {
  const form = useForm<ContactFormData>({
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      priority: ''
    },
    validation: {
      name: Schema.string().required('Name is required').min(2, 'At least 2 characters'),
      email: Schema.email().required('Email is required'),
      subject: Schema.string().required('Subject is required'),
      message: Schema.string().required('Message is required').min(10, 'At least 10 characters'),
      priority: Schema.string().required('Please select priority')
    },
    mode: 'onChange'
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        alert('Message sent successfully!')
        form.reset()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ]

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      
      <WebFormProvider form={form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <WebInput 
            name="name" 
            label="Full Name" 
            placeholder="Enter your name"
          />
          
          <WebInput 
            name="email" 
            label="Email Address" 
            type="email"
            placeholder="Enter your email"
          />
          
          <WebInput 
            name="subject" 
            label="Subject" 
            placeholder="What is this about?"
          />
          
          <WebSelect
            name="priority"
            label="Priority Level"
            options={priorityOptions}
            placeholder="Select priority"
          />
          
          <WebTextarea 
            name="message" 
            label="Message" 
            placeholder="Enter your message..."
            rows={5}
          />
          
          <button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </WebFormProvider>
    </div>
  )
}
\`\`\`

\`\`\`tsx
// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Process the form data (send email, save to database, etc.)
    console.log('Contact form submission:', data)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process form' },
      { status: 500 }
    )
  }
}
\`\`\`

### Multi-Step Form

\`\`\`tsx
// app/signup/page.tsx
"use client"

import { useState } from 'react'
import { useForm, WebFormProvider, WebInput, WebSelect, Schema } from '@otitoju/formcraft-core'

interface SignupFormData {
  // Step 1: Account
  email: string
  password: string
  confirmPassword: string
  
  // Step 2: Personal
  firstName: string
  lastName: string
  phone: string
  
  // Step 3: Professional
  company: string
  role: string
  experience: string
}

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  
  const form = useForm<SignupFormData>({
    defaultValues: {
      email: '', password: '', confirmPassword: '',
      firstName: '', lastName: '', phone: '',
      company: '', role: '', experience: ''
    },
    validation: {
      email: Schema.email().required('Email is required'),
      password: Schema.string().min(8, 'At least 8 characters').required(),
      confirmPassword: Schema.string()
        .required('Please confirm password')
        .custom((value, formData) => 
          value === formData.password || 'Passwords do not match'
        ),
      firstName: Schema.string().required('First name is required'),
      lastName: Schema.string().required('Last name is required'),
      phone: Schema.string().required('Phone is required'),
      company: Schema.string().required('Company is required'),
      role: Schema.string().required('Role is required'),
      experience: Schema.string().required('Experience is required')
    }
  })

  const nextStep = () => setCurrentStep(prev => prev + 1)
  const prevStep = () => setCurrentStep(prev => prev - 1)

  const onSubmit = async (data: SignupFormData) => {
    console.log('Signup data:', data)
    // Submit to your API
  }

  const experienceOptions = [
    { value: '0-1', label: '0-1 years' },
    { value: '2-5', label: '2-5 years' },
    { value: '5+', label: '5+ years' }
  ]

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={\`w-8 h-8 rounded-full flex items-center justify-center \${
                step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }\`}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      <WebFormProvider form={form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Account Information</h2>
              <WebInput name="email" label="Email" type="email" />
              <WebInput name="password" label="Password" type="password" />
              <WebInput name="confirmPassword" label="Confirm Password" type="password" />
              
              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-blue-600 text-white py-3 rounded-lg"
              >
                Next
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Personal Information</h2>
              <WebInput name="firstName" label="First Name" />
              <WebInput name="lastName" label="Last Name" />
              <WebInput name="phone" label="Phone Number" />
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Professional Information</h2>
              <WebInput name="company" label="Company" />
              <WebInput name="role" label="Job Title" />
              <WebSelect
                name="experience"
                label="Years of Experience"
                options={experienceOptions}
              />
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={!form.formState.isValid || form.formState.isSubmitting}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg disabled:opacity-50"
                >
                  {form.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}
        </form>
      </WebFormProvider>
    </div>
  )
}
\`\`\`

### Server Actions Integration

\`\`\`tsx
// app/login/page.tsx
"use client"

import { useForm, WebFormProvider, WebInput, WebCheckbox, Schema } from '@otitoju/formcraft-core'
import { loginAction } from './actions'

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export default function LoginPage() {
  const form = useForm<LoginFormData>({
    defaultValues: { email: '', password: '', rememberMe: false },
    validation: {
      email: Schema.email().required('Email is required'),
      password: Schema.string().required('Password is required').min(6, 'At least 6 characters')
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    const result = await loginAction(data)
    if (result.success) {
      // Redirect or show success
    } else {
      form.setError('email', result.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-8">Sign In</h2>
        
        <WebFormProvider form={form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <WebInput name="email" label="Email Address" type="email" />
            <WebInput name="password" label="Password" type="password" />
            <WebCheckbox name="rememberMe" label="Remember me" />
            
            <button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {form.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </WebFormProvider>
      </div>
    </div>
  )
}
\`\`\`

\`\`\`tsx
// app/login/actions.ts
"use server"

interface LoginData {
  email: string
  password: string
  rememberMe: boolean
}

export async function loginAction(data: LoginData) {
  try {
    // Authenticate user
    // const user = await authenticate(data.email, data.password)
    
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Invalid credentials' }
  }
}
\`\`\`

## 📚 Core Documentation

### useForm Hook

\`\`\`tsx
const form = useForm({
  defaultValues: { name: '', email: '' },
  validation: {
    name: Schema.string().required().min(2),
    email: Schema.email().required()
  },
  mode: 'onChange' // 'onChange' | 'onBlur' | 'onSubmit'
});
\`\`\`

### Schema Validation

\`\`\`tsx
const schema = {
  email: Schema.email().required('Email is required'),
  age: Schema.number().min(18, 'Must be 18+').max(100),
  website: Schema.url().required(),
  password: Schema.string()
    .min(8, 'At least 8 characters')
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must contain uppercase, lowercase, and number')
    .required(),
  terms: Schema.string().custom(value => value === true || 'You must accept the terms')
};
\`\`\`

### Form State

\`\`\`tsx
const {
  values,      // Current form values
  errors,      // Validation errors
  touched,     // Fields that have been interacted with
  dirty,       // Fields that have been modified
  isValid,     // Overall form validity
  isSubmitting,// Submission state
  isDirty      // Whether any field has been modified
} = form.formState;
\`\`\`

## 🎯 Comparison

| Feature | FormCraft | React Hook Form | Formik |
|---------|-----------|-----------------|--------|
| Bundle Size | ~5KB | ~25KB | ~45KB |
| TypeScript | ✅ Built-in | ✅ Good | ⚠️ Basic |
| React Native | ✅ Native | ❌ Manual | ❌ Manual |
| Validation | ✅ Built-in | ❌ External | ❌ External |
| Learning Curve | 🟢 Easy | 🟡 Medium | 🔴 Hard |
| Performance | ⚡ Excellent | ⚡ Excellent | 🟡 Good |
| Next.js Support | ✅ Perfect | ✅ Good | ⚠️ Basic |

## 🛠️ Advanced Usage

### Conditional Fields

\`\`\`tsx
const showDetails = form.watch('type') !== '';

return (
  <WebFormProvider form={form}>
    <WebSelect name="type" options={typeOptions} />
    {showDetails && <WebTextarea name="details" />}
  </WebFormProvider>
);
\`\`\`

### Custom Validation

\`\`\`tsx
const validation = {
  username: Schema.string()
    .required('Username is required')
    .custom(async (value) => {
      const isAvailable = await checkAvailability(value);
      return isAvailable || 'Username is taken';
    })
};
\`\`\`

### Dynamic Forms

\`\`\`tsx
const [fields, setFields] = useState(['field1']);

return (
  <WebFormProvider form={form}>
    {fields.map(fieldName => (
      <WebInput key={fieldName} name={fieldName} />
    ))}
    <button onClick={() => setFields(prev => [...prev, \`field\${prev.length + 1}\`])}>
      Add Field
    </button>
  </WebFormProvider>
);
\`\`\`

## 🎨 Styling

### Web (CSS Classes)

\`\`\`tsx
<WebInput
  name="email"
  className="my-input"
  containerClassName="my-field"
  labelClassName="my-label"
  errorClassName="my-error"
/>
\`\`\`

### React Native (Style Objects)

\`\`\`tsx
<NativeInput
  name="email"
  inputStyle={{ borderColor: 'blue' }}
  containerStyle={{ marginBottom: 20 }}
  labelStyle={{ fontSize: 18 }}
/>
\`\`\`

### Custom Components with Tailwind

\`\`\`tsx
import { useFormContext } from '@otitoju/formcraft-core'

function CustomInput({ name, label, type = 'text' }) {
  const form = useFormContext()
  const field = form.register(name)

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={field.value || ''}
        onChange={(e) => field.onChange(e.target.value)}
        onBlur={field.onBlur}
        className={\`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 \${
          field.error ? 'border-red-500' : 'border-gray-300'
        }\`}
      />
      {field.error && (
        <p className="text-sm text-red-600">{field.error}</p>
      )}
    </div>
  )
}
\`\`\`

## 🤝 Migration Guides

### From React Hook Form

\`\`\`tsx
// React Hook Form
const { register, handleSubmit, formState: { errors } } = useForm();

// FormCraft
const form = useForm();
const field = form.register('email'); // Same API!
\`\`\`

### From Formik

\`\`\`tsx
// Formik
<Formik initialValues={{ email: '' }} onSubmit={handleSubmit}>
  <Field name="email" />
</Formik>

// FormCraft
<WebFormProvider form={form}>
  <WebInput name="email" />
</WebFormProvider>
\`\`\`

## 📦 What's Included

- ✅ Core form management hook
- ✅ Built-in validation with Schema builder
- ✅ Web components (Input, Select, Textarea, Checkbox)
- ✅ React Native components
- ✅ TypeScript definitions
- ✅ Default CSS styles
- ✅ Next.js App Router support
- ✅ Server Actions integration
- ✅ Comprehensive examples

## 🚀 Framework Support

- ✅ **Next.js** - Full App Router support, Server Actions, SSR/SSG
- ✅ **React** - All versions 16.8+
- ✅ **React Native** - iOS and Android
- ✅ **Vite** - Perfect for modern React apps
- ✅ **Create React App** - Works out of the box
- ✅ **Remix** - Server-side form handling
- ✅ **Gatsby** - Static site generation

## 🔗 Links

- [📖 Full Documentation](https://github.com/otitoju/formcraft-core#readme)
- [🎮 Interactive Examples](https://github.com/otitoju/formcraft-core/tree/main/examples)
- [🐛 Report Issues](https://github.com/otitoju/formcraft-core/issues)
- [💬 Discussions](https://github.com/otitoju/formcraft-core/discussions)
- [📦 NPM Package](https://www.npmjs.com/package/@otitoju/formcraft-core)

## 📄 License

MIT © [Otitoju](https://github.com/otitoju)

---

<div align="center">

**Made with ❤️ for the React community**

[⭐ Star on GitHub](https://github.com/otitoju/formcraft-core) | [📦 View on NPM](https://www.npmjs.com/package/@otitoju/formcraft-core)

</div>
