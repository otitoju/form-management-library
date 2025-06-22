"use client"
\
#!/usr/bin/env node

import { execSync } from "child_process"
import { existsSync, mkdirSync, writeFileSync } from "fs"
import { join } from "path"

console.log("🧪 Setting up local testing environment...")

// Create test app directory
const testAppDir = join(process.cwd(), "test-app")
if (!existsSync(testAppDir)) {
  mkdirSync(testAppDir)
}

// Create a simple test React app
const testAppPackageJson = {
  name: "formcraft-test-app",
  version: "1.0.0",
  private: true,
  dependencies: {
    react: "^18.0.0",
    "react-dom": "^18.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    typescript: "^5.0.0",
    vite: "^4.0.0",
    "@vitejs/plugin-react": "^4.0.0",
  },
  scripts: {
    dev: "vite",
    build: "vite build",
    preview: "vite preview",
  },
}

writeFileSync(join(testAppDir, "package.json"), JSON.stringify(testAppPackageJson, null, 2))

// Create test component
const testComponent = `
import React from 'react'
import { useForm, WebFormProvider, WebInput, Schema } from '@formcraft/core'

interface FormData {
  name: string
  email: string
}

export function TestForm() {
  const form = useForm<FormData>({
    defaultValues: { name: '', email: '' },
    validation: {
      name: Schema.string().required('Name is required').getRules(),
      email: Schema.email().required('Email is required').getRules()
    }
  })

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data)
    alert('Form submitted successfully!')
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h1>FormCraft Test</h1>
      <WebFormProvider form={form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <WebInput name="name" label="Name" />
          <WebInput name="email" label="Email" type="email" />
          <button 
            type="submit" 
            disabled={!form.formState.isValid}
            style={{ 
              marginTop: '20px', 
              padding: '10px 20px',
              backgroundColor: form.formState.isValid ? '#007bff' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Submit
          </button>
        </form>
      </WebFormProvider>
    </div>
  )
}
`

writeFileSync(join(testAppDir, "TestForm.tsx"), testComponent)

// Create main app file
const appFile = `
import React from 'react'
import ReactDOM from 'react-dom/client'
import { TestForm } from './TestForm'
import '@formcraft/core/dist/web.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TestForm />
  </React.StrictMode>
)
`

writeFileSync(join(testAppDir, "main.tsx"), appFile)

// Create HTML file
const htmlFile = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FormCraft Test App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
`

writeFileSync(join(testAppDir, "index.html"), htmlFile)

// Create Vite config
const viteConfig = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@formcraft/core': '../dist/index.esm.js'
    }
  }
})
`

writeFileSync(join(testAppDir, "vite.config.ts"), viteConfig)

console.log("✅ Test app created!")
console.log("📦 Installing dependencies...")

try {
  execSync("npm install", { cwd: testAppDir, stdio: "inherit" })
  console.log("✅ Dependencies installed!")
  console.log("\n🚀 To test your package:")
  console.log("1. npm run build (build your package)")
  console.log("2. cd test-app")
  console.log("3. npm run dev")
  console.log("4. Open http://localhost:5173")
} catch (error) {
  console.error("❌ Failed to install dependencies:", error)
}
