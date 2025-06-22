#!/usr/bin/env node

import { execSync } from "child_process"
import { readFileSync } from "fs"
import { prompt } from "enquirer"

interface PublishOptions {
  version: "patch" | "minor" | "major" | "prerelease"
  tag: "latest" | "beta" | "alpha"
  dryRun: boolean
}

async function publishPackage() {
  console.log("📦 FormCraft Publishing Tool")
  console.log("============================\n")

  // Read current package.json
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"))
  console.log(`Current version: ${packageJson.version}`)

  // Get publish options
  const options = await prompt<PublishOptions>([
    {
      type: "select",
      name: "version",
      message: "Select version bump:",
      choices: ["patch", "minor", "major", "prerelease"],
    },
    {
      type: "select",
      name: "tag",
      message: "Select npm tag:",
      choices: ["latest", "beta", "alpha"],
    },
    {
      type: "confirm",
      name: "dryRun",
      message: "Dry run? (no actual publishing)",
      initial: true,
    },
  ])

  console.log("\n🔍 Pre-publish checks...")

  // Run tests
  console.log("Running tests...")
  try {
    execSync("npm test", { stdio: "inherit" })
    console.log("✅ Tests passed")
  } catch (error) {
    console.error("❌ Tests failed")
    process.exit(1)
  }

  // Type check
  console.log("Type checking...")
  try {
    execSync("npm run type-check", { stdio: "inherit" })
    console.log("✅ Type check passed")
  } catch (error) {
    console.error("❌ Type check failed")
    process.exit(1)
  }

  // Lint
  console.log("Linting...")
  try {
    execSync("npm run lint", { stdio: "inherit" })
    console.log("✅ Linting passed")
  } catch (error) {
    console.error("❌ Linting failed")
    process.exit(1)
  }

  // Build
  console.log("Building package...")
  try {
    execSync("npm run build", { stdio: "inherit" })
    console.log("✅ Build successful")
  } catch (error) {
    console.error("❌ Build failed")
    process.exit(1)
  }

  // Version bump
  console.log(`\n📈 Bumping version (${options.version})...`)
  if (!options.dryRun) {
    execSync(`npm version ${options.version}`, { stdio: "inherit" })
  } else {
    console.log("(Dry run - version not actually bumped)")
  }

  // Publish
  console.log(`\n🚀 Publishing to npm (tag: ${options.tag})...`)
  if (!options.dryRun) {
    execSync(`npm publish --tag ${options.tag}`, { stdio: "inherit" })
    console.log("✅ Package published successfully!")

    // Git push tags
    console.log("📤 Pushing git tags...")
    execSync("git push --follow-tags", { stdio: "inherit" })
  } else {
    console.log("(Dry run - package not actually published)")
  }

  console.log("\n🎉 Publishing complete!")

  if (!options.dryRun) {
    const newPackageJson = JSON.parse(readFileSync("package.json", "utf8"))
    console.log(`New version: ${newPackageJson.version}`)
    console.log(`Install with: npm install @formcraft/core@${options.tag}`)
  }
}

publishPackage().catch(console.error)
