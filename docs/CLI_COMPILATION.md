# CLI Application Compilation Guide

Guide to compiling React Console CLI applications into standalone executables.

## Overview

React Console provides build utilities for creating standalone executables from your CLI applications. You can use multiple bundlers depending on your needs:

- **esbuild** - Fast, modern bundler with executable support
- **pkg** - Node.js executable bundler with icon support
- **nexe** - Node.js executable creator
- **ncc** - Single-file bundle output (Vercel)

## Quick Start

### 1. Create Your CLI Application

```tsx
// src/index.tsx
import { render } from 'react-console';
import { CLIApp, CommandRouter, Command, Default } from 'react-console/cli';
import { Text, View } from 'react-console';

function App() {
  return (
    <CLIApp name="my-cli" version="1.0.0" description="My CLI app">
      <CommandRouter>
        <Default>
          <Text>Hello from my CLI!</Text>
        </Default>
        <Command name="hello" description="Say hello">
          <Text>Hello, World!</Text>
        </Command>
      </CommandRouter>
    </CLIApp>
  );
}

render(<App />, { mode: 'interactive' });
```

### 2. Configure Build

Create `build.config.ts`:

```typescript
import type { BuildConfig } from 'react-console/build';

export const buildConfig: BuildConfig = {
  entry: './src/index.tsx',
  outDir: './dist',
  format: 'esm',
  minify: true,
  sourcemap: true,
  bundle: true,
  platform: 'node',
  target: 'node18',
  cli: {
    executable: true,
    bundler: 'esbuild',
    name: 'my-cli',
    version: '1.0.0',
    description: 'My CLI application',
    targets: ['linux', 'macos', 'windows'], // For pkg/nexe
  },
};
```

### 3. Build Executable

```typescript
import { build } from 'react-console/build';
import { buildConfig } from './build.config';

await build(buildConfig);
```

Or use the CLI tool:

```bash
node -r ts-node/register src/utils/build/index.ts build
```

## Build Configuration

### Basic Configuration

```typescript
interface BuildConfig {
  entry?: string;              // Entry point (default: './src/index.ts')
  outDir?: string;             // Output directory (default: './dist')
  format?: 'cjs' | 'esm' | 'umd';
  minify?: boolean;             // Minify output
  sourcemap?: boolean | 'inline' | 'external';
  bundle?: boolean;             // Bundle dependencies
  target?: string;             // Target Node.js version
  platform?: 'node' | 'browser';
  external?: string[];         // External dependencies
  cli?: {
    executable?: boolean;       // Create executable
    bundler?: 'pkg' | 'nexe' | 'esbuild';
    name?: string;             // Executable name
    version?: string;          // Application version
    description?: string;      // Application description
    targets?: Array<'linux' | 'macos' | 'windows'>;
  };
}
```

## Bundlers

### esbuild

**Pros:**
- Fast compilation
- Modern bundler
- Good tree-shaking
- Supports shebang for Unix executables

**Cons:**
- Limited icon support
- No native Windows executable (uses shebang)

**Usage:**

```typescript
{
  cli: {
    executable: true,
    bundler: 'esbuild',
    name: 'my-cli',
  },
}
```

**Installation:**

```bash
npm install --save-dev esbuild
```

### pkg

**Pros:**
- Full executable support
- Icon embedding
- Cross-platform compilation
- Single-file output

**Cons:**
- Slower than esbuild
- Larger file sizes

**Usage:**

```typescript
{
  cli: {
    executable: true,
    bundler: 'pkg',
    name: 'my-cli',
    targets: ['linux', 'macos', 'windows'],
  },
}
```

**Installation:**

```bash
npm install --save-dev pkg
```

### nexe

**Pros:**
- Node.js executable creator
- Cross-platform support
- Good for simple apps

**Cons:**
- Limited customization
- Single target per build

**Usage:**

```typescript
{
  cli: {
    executable: true,
    bundler: 'nexe',
    name: 'my-cli',
    targets: ['linux'], // One at a time
  },
}
```

**Installation:**

```bash
npm install --save-dev nexe
```

### ncc

**Pros:**
- Single-file bundle
- Fast compilation
- Good for distribution

**Cons:**
- Not a true executable (requires Node.js)
- No icon support

**Usage:**

```typescript
{
  cli: {
    executable: false, // ncc creates bundle, not executable
  },
}
```

**Installation:**

```bash
npm install --save-dev @vercel/ncc
```

## Metadata Configuration

### Application Metadata

Use the metadata utilities to configure application information:

```typescript
import { prepareMetadata } from 'react-console/build';

const { metadata, manifestPath, licensePath } = prepareMetadata(
  buildConfig,
  './dist'
);
```

### Manifest Generation

Automatically generates `package.json` manifest:

```typescript
import { generateManifest } from 'react-console/build';

generateManifest({
  name: 'my-cli',
  version: '1.0.0',
  description: 'My CLI app',
  author: 'John Doe',
  license: 'MIT',
}, './dist');
```

### License Bundling

Automatically copies LICENSE file:

```typescript
import { bundleLicense } from 'react-console/build';

bundleLicense('./LICENSE', './dist');
```

## Cross-Platform Compilation

### pkg

Supports multiple targets in one build:

```typescript
{
  cli: {
    bundler: 'pkg',
    targets: ['linux', 'macos', 'windows'],
  },
}
```

### nexe

Build for one platform at a time:

```typescript
// Build for Linux
{
  cli: {
    bundler: 'nexe',
    targets: ['linux'],
  },
}

// Then build for Windows
{
  cli: {
    bundler: 'nexe',
    targets: ['windows'],
  },
}
```

### esbuild

Creates platform-specific executables based on current platform:

```typescript
{
  cli: {
    bundler: 'esbuild',
  },
}
```

## Build Scripts

### package.json Scripts

```json
{
  "scripts": {
    "build": "tsc && node build.js",
    "build:executable": "node -r ts-node/register src/utils/build/index.ts build",
    "build:all": "npm run build:executable"
  }
}
```

### Custom Build Script

```typescript
// build.js
import { build } from 'react-console/build';
import { buildConfig } from './build.config';
import { prepareMetadata } from 'react-console/build';

async function main() {
  // Prepare metadata
  await prepareMetadata(buildConfig, buildConfig.outDir || './dist');
  
  // Build executable
  await build(buildConfig);
  
  console.log('Build complete!');
}

main().catch(console.error);
```

## Distribution

### Single-File Executable

All bundlers create single-file executables:

- **esbuild**: `./dist/my-cli` (Unix) or `./dist/my-cli.exe` (Windows)
- **pkg**: `./dist/my-cli-linux`, `./dist/my-cli-macos`, `./dist/my-cli-win.exe`
- **nexe**: `./dist/my-cli` (platform-specific)

### Platform-Specific Packaging

For platform-specific packages (DMG, MSI, AppImage), use external tools. These are not included in React Console but can be integrated:

#### macOS DMG

Using `create-dmg`:

```bash
npm install --save-dev create-dmg

# Create DMG
create-dmg dist/my-cli.app dist/
```

Using `hdiutil` (built-in):

```bash
hdiutil create -volname "My CLI" -srcfolder dist/my-cli -ov -format UDZO dist/my-cli.dmg
```

#### Windows MSI

Using WiX Toolset:

```xml
<?xml version="1.0"?>
<Wix xmlns="http://schemas.microsoft.com/wix/2006/wi">
  <Product Id="*" Name="My CLI" Language="1033" Version="1.0.0" Manufacturer="My Company">
    <Package InstallerVersion="200" Compressed="yes" />
    <MediaTemplate />
    <Feature Id="ProductFeature" Title="My CLI" Level="1">
      <ComponentRef Id="ApplicationFiles" />
    </Feature>
    <Directory Id="TARGETDIR" Name="SourceDir">
      <Directory Id="ProgramFilesFolder">
        <Directory Id="INSTALLFOLDER" Name="My CLI">
          <Component Id="ApplicationFiles" Guid="*">
            <File Id="ApplicationFile1" Source="dist/my-cli.exe" />
          </Component>
        </Directory>
      </Directory>
    </Directory>
  </Product>
</Wix>
```

#### Linux AppImage

Using `appimagetool`:

```bash
# Install appimagetool
wget https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage
chmod +x appimagetool-x86_64.AppImage

# Create AppDir structure
mkdir -p AppDir/usr/bin
cp dist/my-cli AppDir/usr/bin/

# Create AppImage
./appimagetool-x86_64.AppImage AppDir my-cli.AppImage
```

### Update Mechanisms

For CLI applications, update mechanisms typically involve:

1. **Version checking** - Check for updates from a remote source
2. **Download updates** - Fetch new versions
3. **Replace executable** - Update the local executable

#### Simple Update Check

```typescript
import { getAppVersion } from 'react-console/cli';

async function checkForUpdates() {
  const currentVersion = getAppVersion();
  const response = await fetch('https://api.example.com/latest-version');
  const latest = await response.json();
  
  if (latest.version !== currentVersion) {
    console.log(`Update available: ${latest.version}`);
    // Download and replace logic
  }
}
```

#### Using External Update Tools

- **update-notifier** (npm package) - Notifies users of updates
- **electron-updater** - For electron-based apps
- **Custom solution** - Implement your own update mechanism

#### Distribution Best Practices

1. **Version all releases** - Use semantic versioning
2. **Provide checksums** - Include SHA256 checksums for verification
3. **Sign executables** - Code sign for security (macOS/Windows)
4. **Document installation** - Provide clear installation instructions
5. **Support multiple formats** - Provide executables and packages

## Troubleshooting

### Common Issues

1. **Module not found errors**
   - Add problematic modules to `external` array
   - Ensure all dependencies are installed

2. **Executable not working**
   - Check Node.js version compatibility
   - Verify entry point is correct
   - Check file permissions (Unix: `chmod +x`)

3. **Large file sizes**
   - Use `minify: true`
   - Exclude unnecessary dependencies
   - Use `external` for large dependencies

4. **Cross-platform issues**
   - Test on target platform
   - Use platform-specific builds
   - Check path separators

## Best Practices

1. **Use TypeScript** for type safety
2. **Minify production builds** for smaller executables
3. **Bundle dependencies** unless they're platform-specific
4. **Test executables** on target platforms
5. **Include metadata** for better distribution
6. **Bundle license** files for compliance
7. **Use appropriate bundler** for your needs:
   - **esbuild**: Fast development builds
   - **pkg**: Production executables with icons
   - **nexe**: Simple cross-platform executables
   - **ncc**: Single-file bundles

## Examples

See the `examples/cli/` directory for complete CLI application examples that can be compiled to executables.

## Next Steps

- [CLI Framework Guide](./CLI_FRAMEWORK_GUIDE.md) - Learn how to build CLI applications
- [CLI Scaffolding Guide](./CLI_SCAFFOLDING.md) - Generate new CLI projects
- [Build System API](./BUILD_SYSTEM.md) - Advanced build configuration
