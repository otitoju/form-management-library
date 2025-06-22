import { execSync } from "child_process"
import { writeFileSync, readFileSync } from "fs"

// Build the package
console.log("🔨 Building package...")
execSync("npm run build", { stdio: "inherit" })

// Copy CSS file to dist
console.log("📄 Copying CSS files...")
execSync("cp src/styles/web.css dist/", { stdio: "inherit" })

// Update package.json for publishing
const packageJson = JSON.parse(readFileSync("package.json", "utf8"))
packageJson.files.push("dist/web.css")

writeFileSync("package.json", JSON.stringify(packageJson, null, 2))

console.log("✅ Package built successfully!")
console.log("📦 Ready for publishing with: npm publish")
