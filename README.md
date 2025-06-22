# @formcraft/core

A lightweight, TypeScript-first form management library for React and React Native with built-in validation and components.

## Features

- 🚀 **Lightweight** - Minimal bundle size with zero dependencies
- 🔧 **TypeScript First** - Full TypeScript support with excellent IntelliSense
- 🌐 **Cross Platform** - Works seamlessly with React and React Native
- ✅ **Built-in Validation** - Zod-inspired schema validation
- 🎯 **Performance Focused** - Optimized re-renders and efficient updates
- 📱 **Responsive** - Built-in components for both web and mobile
- 🎨 **Customizable** - Flexible styling and component customization
- ♿ **Accessible** - WCAG compliant with proper ARIA attributes

## Installation

\`\`\`bash
npm install @formcraft/core
# or
yarn add @formcraft/core
# or
pnpm add @formcraft/core
\`\`\`

## Quick Start

### Web (React/Next.js)

\`\`\`tsx
import { useForm, WebFormProvider, WebInput, Schema } from '@formcraft/core';
import '@formcraft/core/dist/web.css'; // Optional default styles

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const validationSchema = {
  email: Schema.email().required('Email is required'),
  password: Schema.string().min(8, 'Password must be at least 8 characters').required(),
  confirmPassword: Schema.string().required('Please confirm your password')
    .custom((value, formData) => {
      return value === formData.password || 'Passwords do not match';
    })
};

function SignupForm() {
  const form = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validation: validationSchema,
    mode: 'onChange'
  });

  const onSubmit = async (data: FormData) => {
    console.log('Form submitted:', data);
    // Handle form submission
  };

  return (
    <WebFormProvider form={form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <WebInput
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
        />
        
        <WebInput
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
        />
        
        <WebInput
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
        />
        
        <button 
          type="submit" 
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
    </WebFormProvider>
  );
}
\`\`\`

### React Native

\`\`\`tsx
import React from 'react';
import { View, Button } from 'react-native';
import { useForm, NativeFormProvider, NativeInput, Schema } from '@formcraft/core';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const validationSchema = {
  name: Schema.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: Schema.email().required('Email is required'),
  message: Schema.string().required('Message is required').min(10, 'Message must be at least 10 characters')
};

function ContactForm() {
  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      message: ''
    },
    validation: validationSchema
  });

  const onSubmit = async (data: FormData) => {
    console.log('Form submitted:', data);
    // Handle form submission
  };

  return (
    <NativeFormProvider form={form}>
      <View style={{ padding: 20 }}>
        <NativeInput
          name="name"
          label="Full Name"
          placeholder="Enter your name"
        />
        
        <NativeInput
          name="email"
          label="Email Address"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <NativeInput
          name="message"
          label="Message"
          placeholder="Enter your message"
          multiline
          numberOfLines={4}
        />
        
        <Button
          title={form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
          onPress={form.handleSubmit(onSubmit)}
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        />
      </View>
    </NativeFormProvider>
  );
}
\`\`\`

## API Reference

### useForm Hook

The main hook for form management.

\`\`\`tsx
const form = useForm<T>({
  defaultValues?: Partial<T>;
  validation?: Record<string, ValidationRule>;
  onSubmit?: (data: T) => void | Promise<void>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit';
});
\`\`\`

### Schema Validation

Build validation schemas with a fluent API:

\`\`\`tsx
const schema = {
  email: Schema.email().required('Email is required'),
  age: Schema.number().min(18, 'Must be 18 or older').max(100),
  website: Schema.url().required(),
  password: Schema.string()
    .min(8, 'At least 8 characters')
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must contain uppercase, lowercase, and number')
    .required(),
  terms: Schema.string().custom(value => value === true || 'You must accept the terms')
};
\`\`\`

### Form State

Access comprehensive form state:

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

### Form Methods

\`\`\`tsx
const {
  register,     // Register form fields
  setValue,     // Set field value programmatically
  getValue,     // Get field value
  getValues,    // Get all form values
  setError,     // Set field error
  clearError,   // Clear field error
  clearErrors,  // Clear all errors
  reset,        // Reset form to initial state
  handleSubmit, // Handle form submission
  watch,        // Watch field changes
  trigger       // Trigger validation
} = form;
\`\`\`

## Components

### Web Components

- `WebInput` - Text input with validation
- `WebSelect` - Dropdown select with options
- `WebTextarea` - Multi-line text input
- `WebCheckbox` - Checkbox input
- `WebFormProvider` - Form context provider

### Native Components

- `NativeInput` - React Native TextInput with validation
- `NativeSelect` - Custom select component with modal
- `NativeCheckbox` - Custom checkbox component
- `NativeFormProvider` - Form context provider

## Advanced Usage

### Conditional Fields

\`\`\`tsx
const form = useForm({
  defaultValues: { type: '', details: '' }
});

// Show details field only when type is selected
const showDetails = form.watch('type') !== '';

return (
  <WebFormProvider form={form}>
    <WebSelect
      name="type"
      label="Type"
      options={[
        { value: 'bug', label: 'Bug Report' },
        { value: 'feature', label: 'Feature Request' }
      ]}
    />
    
    {showDetails && (
      <WebTextarea
        name="details"
        label="Details"
        placeholder="Describe in detail..."
      />
    )}
  </WebFormProvider>
);
\`\`\`

### Custom Validation

\`\`\`tsx
const customValidation = {
  username: Schema.string()
    .required('Username is required')
    .min(3, 'At least 3 characters')
    .custom(async (value) => {
      const isAvailable = await checkUsernameAvailability(value);
      return isAvailable || 'Username is already taken';
    })
};
\`\`\`

### Dynamic Forms

\`\`\`tsx
function DynamicForm() {
  const [fields, setFields] = useState(['field1']);
  const form = useForm();

  const addField = () => {
    setFields(prev => [...prev, `field${prev.length + 1}`]);
  };

  return (
    <WebFormProvider form={form}>
      {fields.map(fieldName => (
        <WebInput
          key={fieldName}
          name={fieldName}
          label={`Field ${fieldName}`}
        />
      ))}
      <button type="button" onClick={addField}>
        Add Field
      </button>
    </WebFormProvider>
  );
}
\`\`\`

## Styling

### Web Styling

Import the default CSS or create your own:

\`\`\`tsx
import '@formcraft/core/dist/web.css';

// Or use custom classes
<WebInput
  name="email"
  className="my-custom-input"
  containerClassName="my-field-container"
  labelClassName="my-label"
  errorClassName="my-error"
/>
\`\`\`

### Native Styling

Pass custom styles to components:

\`\`\`tsx
<NativeInput
  name="email"
  inputStyle={{ borderColor: '#blue' }}
  containerStyle={{ marginBottom: 20 }}
  labelStyle={{ fontSize: 18 }}
  errorStyle={{ color: 'red' }}
/>
\`\`\`

## TypeScript Support

Full TypeScript support with type inference:

\`\`\`tsx
interface UserForm {
  name: string;
  email: string;
  age: number;
  preferences: {
    newsletter: boolean;
    notifications: boolean;
  };
}

const form = useForm<UserForm>({
  defaultValues: {
    name: '',
    email: '',
    age: 0,
    preferences: {
      newsletter: false,
      notifications: true
    }
  }
});

// TypeScript will infer the correct types
form.setValue('name', 'John'); // ✅ Valid
form.setValue('age', '25'); // ❌ Type error
\`\`\`

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © FormCraft Team
