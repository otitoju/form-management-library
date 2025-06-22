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

## 📚 Documentation

### Core Hook

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
    <button onClick={() => setFields(prev => [...prev, `field${prev.length + 1}`])}>
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
- ✅ Comprehensive examples

## 🔗 Links

- [📖 Full Documentation](https://github.com/otitoju/formcraft-core#readme)
- [🎮 Interactive Examples](https://github.com/otitoju/formcraft-core/tree/main/examples)
- [🐛 Report Issues](https://github.com/otitoju/formcraft-core/issues)
- [💬 Discussions](https://github.com/otitoju/formcraft-core/discussions)

## 📄 License

MIT © [Otitoju](https://github.com/otitoju)

---

<div align="center">

**Made with ❤️ for the React community**

[⭐ Star on GitHub](https://github.com/otitoju/formcraft-core) | [📦 View on NPM](https://www.npmjs.com/package/@otitoju/formcraft-core)

</div>
