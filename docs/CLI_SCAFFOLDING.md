# CLI Application Scaffolding

React Console provides utilities for quickly scaffolding new CLI applications with a complete project structure, build configuration, and example code.

## Usage

### Command Line (Recommended)

Once `create-react-console-app` is set up as a CLI tool, you can create a new project:

```bash
# Basic usage
npx create-react-console-app my-app

# With options
npx create-react-console-app my-app --template full --package-manager pnpm

# With metadata
npx create-react-console-app my-app \
  --description "My awesome CLI app" \
  --author "John Doe" \
  --version "0.1.0" \
  --license "MIT"
```

### Programmatic Usage

You can also use the scaffolding functions programmatically:

```typescript
import { scaffold } from 'react-console/build';

scaffold({
  name: 'my-app',
  template: 'basic',
  directory: './my-app',
  packageManager: 'npm',
  version: '1.0.0',
  description: 'My CLI application',
  author: 'John Doe',
  license: 'MIT',
  includeExamples: true,
});
```

## Options

### Template Types

- **`basic`** (default) - Full project setup with:
  - TypeScript configuration
  - Build scripts
  - Build configuration (`build.config.ts`)
  - Example component structure
  - Complete `package.json` with scripts

- **`full`** - Everything from `basic` plus:
  - Example command components
  - More complete project structure
  - Additional examples

- **`minimal`** - Minimal setup for quick starts:
  - Basic TypeScript setup
  - Simple entry point
  - Minimal dependencies

### CLI Options

| Option | Description | Default |
|--------|-------------|---------|
| `--template <type>` | Template type: `basic`, `full`, or `minimal` | `basic` |
| `--directory <path>` | Output directory | `./<project-name>` |
| `--package-manager <pm>` | Package manager: `npm`, `yarn`, or `pnpm` | `npm` |
| `--examples` | Include example commands (for basic template) | `false` |
| `--version <version>` | Initial version | `1.0.0` |
| `--description <text>` | Project description | Auto-generated |
| `--author <name>` | Author name | None |
| `--license <type>` | License type | `MIT` |
| `--skip-git` | Skip git initialization | `false` |
| `--help`, `-h` | Show help message | - |

### Programmatic Options

```typescript
interface ScaffoldOptions {
  /** Project name (required) */
  name: string;
  /** Output directory */
  directory?: string;
  /** Template type */
  template?: 'basic' | 'full' | 'minimal';
  /** Include example commands */
  includeExamples?: boolean;
  /** Package manager */
  packageManager?: 'npm' | 'yarn' | 'pnpm';
  /** Initial version */
  version?: string;
  /** Project description */
  description?: string;
  /** Author name */
  author?: string;
  /** License type */
  license?: string;
  /** Skip git initialization */
  skipGit?: boolean;
}
```

## Generated Project Structure

### Basic Template

```
my-app/
├── src/
│   ├── index.tsx          # Main entry point
│   └── commands/          # Command components directory
├── dist/                  # Build output
├── package.json           # Project configuration
├── tsconfig.json          # TypeScript configuration
├── build.config.ts        # Build configuration
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

### Full Template

Same as basic, plus:
- Example command components
- More complete examples
- Additional documentation

### Minimal Template

```
my-app/
├── src/
│   └── index.tsx          # Simple entry point
├── package.json           # Minimal configuration
└── README.md             # Basic documentation
```

## Generated Files

### package.json

Includes:
- Project metadata (name, version, description, author, license)
- Dependencies (`react`, `react-console`)
- Dev dependencies (`typescript`, `@types/node`, `@types/react`)
- Build scripts (`build`, `dev`, `start`)
- Binary entry point configuration

### tsconfig.json

TypeScript configuration with:
- ES2022 target
- ESNext modules
- React JSX support
- Strict mode enabled
- Source maps

### build.config.ts

Build configuration for creating executables:
- Entry point configuration
- Output directory
- Format (ESM)
- Minification
- Source maps
- Executable bundler settings

### src/index.tsx

Main application entry point with:
- `CLIApp` wrapper
- `CommandRouter` setup
- Default component
- Example command (if `--examples` is used)

## Next Steps

After scaffolding:

1. **Install dependencies:**
   ```bash
   cd my-app
   npm install
   ```

2. **Start development:**
   ```bash
   npm run dev
   ```

3. **Build executable:**
   ```bash
   npm run build
   ```

4. **Run the app:**
   ```bash
   npm start
   # or
   ./dist/my-app
   ```

## Examples

### Create a basic app

```bash
npx create-react-console-app my-cli
```

### Create a full-featured app with examples

```bash
npx create-react-console-app my-cli --template full
```

### Create a minimal app for quick prototyping

```bash
npx create-react-console-app my-cli --template minimal
```

### Create an app with custom metadata

```bash
npx create-react-console-app my-cli \
  --description "A powerful CLI tool" \
  --author "Jane Doe" \
  --version "0.1.0" \
  --license "Apache-2.0"
```

### Create an app with pnpm

```bash
npx create-react-console-app my-cli --package-manager pnpm
```

## Integration with Build System

The generated project includes `build.config.ts` which can be used with the React Console build system to create executables:

```typescript
import { build } from 'react-console/build';
import { buildConfig } from './build.config';

// Build executable
await build(buildConfig);
```

See the [Build System Documentation](./BUILD_SYSTEM.md) for more details.
