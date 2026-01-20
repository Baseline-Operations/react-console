# npm Publication Guide

This guide explains how to publish `react-console` to npm and make `create-react-console-app` available via `npx`.

## Current Setup

The package is already configured to work with `npx create-react-console-app`:

1. **`bin` field configured** in `package.json`:
   ```json
   "bin": {
     "create-react-console-app": "./dist/utils/build/create-app.js"
   }
   ```

2. **Shebang preserved**: The `create-app.ts` file has `#!/usr/bin/env node` which is preserved in the compiled output.

3. **Build process**: The build script compiles TypeScript and processes with Babel, preserving the shebang.

4. **Pre-publish hook**: Added `prepublishOnly` script to ensure the package is built before publishing.

## Publishing Steps

### 1. Build the Package

```bash
npm run build
```

This will:
- Compile TypeScript to JavaScript
- Process with Babel (preserving shebang)
- Generate type definitions

### 2. Verify the Build

Check that the binary file exists and has the shebang:

```bash
head -1 dist/utils/build/create-app.js
# Should output: #!/usr/bin/env node
```

### 3. Test Locally (Optional but Recommended)

Test with `npm link` before publishing:

```bash
# From react-console directory
npm link

# In a test directory
npm link react-console

# Test the command
npx create-react-console-app test-app
```

### 4. Publish to npm

```bash
# Make sure you're logged in
npm login

# Publish (prepublishOnly will run build automatically)
npm publish
```

For first-time publication:
```bash
npm publish --access public
```

### 5. Verify After Publishing

After publishing, test from a clean directory:

```bash
# Create a test directory
mkdir test-npx && cd test-npx

# Test with npx
npx create-react-console-app my-test-app

# Or with npm create (npm 6.1+)
npm create react-console-app my-test-app
```

## How It Works

### Without Separate Package

You **don't need** a separate package. The `bin` field in `package.json` makes the command available when users install `react-console`:

1. When users run `npx create-react-console-app`, npm:
   - Downloads the `react-console` package temporarily
   - Looks for the `bin` field in `package.json`
   - Finds `create-react-console-app` pointing to `./dist/utils/build/create-app.js`
   - Executes that file with Node.js (because of the shebang)

2. The command works because:
   - The `bin` field maps command names to file paths
   - npm makes these files executable when installing
   - The shebang tells the system to run it with Node.js

### Benefits of Keeping in Main Package

- **Simpler**: No need to maintain a separate package
- **Consistent**: Same version as the main library
- **Convenient**: Users get the scaffolder when they install the library
- **Standard**: Many packages do this (e.g., `create-react-app` was originally in `react-scripts`)

### When to Consider Separate Package

You might want a separate package if:
- The scaffolder has different dependencies than the main library
- You want faster installs (smaller package for just scaffolding)
- You want to version them independently

For now, keeping it in the main package is perfectly fine and simpler.

## File Permissions

The `create-app.js` file should be executable. npm will handle this automatically when publishing, but you can ensure it manually:

```bash
chmod +x dist/utils/build/create-app.js
```

## Troubleshooting

### Command Not Found After Publishing

1. **Check the `bin` field** in `package.json`:
   ```bash
   cat package.json | grep -A 2 '"bin"'
   ```

2. **Verify the file exists** in the published package:
   ```bash
   npm pack
   tar -tzf react-console-*.tgz | grep create-app
   ```

3. **Check the shebang**:
   ```bash
   head -1 dist/utils/build/create-app.js
   # Should be: #!/usr/bin/env node
   ```

### Build Issues

If the shebang is missing after build:

1. Check Babel config - it should preserve the shebang
2. The current setup uses `tsc` first, then Babel, which should preserve it
3. If issues persist, you might need a Babel plugin or post-build script

### Testing Locally

If `npm link` doesn't work:

```bash
# Unlink first
npm unlink

# Re-link
npm link

# In test directory, use the full path or npx
npx react-console create-react-console-app test-app
```

## Version Management

When publishing updates:

1. **Update version** in `package.json`:
   ```bash
   npm version patch  # or minor, major
   ```

2. **Build and publish**:
   ```bash
   npm run build
   npm publish
   ```

The `prepublishOnly` script ensures the build is always fresh.

## Summary

✅ **Ready to publish!** The package is configured correctly:
- `bin` field points to the compiled file
- Shebang is preserved in the build
- Build process includes the file
- Pre-publish hook ensures fresh builds

Just run `npm publish` and users will be able to use `npx create-react-console-app`!
