# Contributing to React Console

Thank you for your interest in contributing to React Console! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 9.0.0
- Git
- **Rust** (stable, 1.85+) — required to build the native addon; there is no JS/TS fallback. See [rustup](https://rustup.rs/).

### Development Setup

1. **Fork and clone the repository:**

   ```bash
   git clone https://github.com/your-username/react-console.git
   cd react-console
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Build the project** (`build:full` runs the native addon then TypeScript/JS; use `npm run build` for TS/JS only):

   ```bash
   npm run build:full
   ```

   Supported platforms for the native addon: macOS (x64, arm64), Linux (x64, arm64), Windows (x64, arm64). If the addon fails to load, the library throws; there is no fallback.

4. **Run tests:**

   ```bash
   npm test
   ```

5. **Run in development mode:**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates
- `chore/` - Maintenance tasks

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions/updates
- `chore`: Maintenance tasks

**Examples:**

```
feat(cli): add support for nested commands

fix(renderer): correct layout calculation for flex containers

docs: update API documentation for CommandRouter
```

### Pull Request Process

1. **Create a feature branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Write clean, maintainable code
   - Follow existing code style
   - Add tests for new features
   - Update documentation as needed

3. **Run checks locally:**

   ```bash
   npm run lint        # Check code style
   npm run typecheck   # Type check
   npm test            # Run tests
   npm run build       # Ensure build succeeds
   ```

4. **Commit your changes:**

   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

5. **Push to your fork:**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request:**
   - Use the PR template
   - Provide a clear description
   - Link related issues
   - Request review from maintainers

## Code Style

### TypeScript

- Use TypeScript strict mode
- Prefer `interface` over `type` for object shapes
- Use `export type` for type-only exports
- Avoid `any` - use `unknown` or proper types
- Add JSDoc comments for public APIs

### React

- Use functional components with hooks
- Follow React Hooks rules
- Use `React.memo` for performance when appropriate
- Keep components focused and composable

### Formatting

- Use Prettier for code formatting
- Run `npm run format` before committing
- Line length: 100 characters
- Use 2 spaces for indentation

### Naming Conventions

- **Files**: `kebab-case.ts` or `PascalCase.tsx` for components
- **Components**: `PascalCase`
- **Functions/Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`

## Testing

### Writing Tests

- Write tests for new features
- Update tests when fixing bugs
- Aim for good coverage
- Use descriptive test names

### Running Tests

```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --coverage # With coverage
```

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should do something', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## Documentation

### Code Documentation

- Add JSDoc comments for public APIs
- Include parameter descriptions
- Provide usage examples
- Document complex logic

### Documentation Updates

- Update README.md for user-facing changes
- Update relevant docs in `docs/` directory
- Keep examples up to date
- Add migration guides for breaking changes

## Project Structure

```
react-console/
├── src/              # Source code
│   ├── components/   # React components
│   ├── renderer/    # Renderer implementation
│   ├── utils/       # Utility functions
│   └── types/       # TypeScript types
├── docs/            # Documentation
├── examples/        # Example applications
└── tests/          # Test files
```

## Git Hooks

We use Husky for Git hooks:

- **pre-commit**: Runs lint-staged (formatting, linting)
- **pre-push**: Runs type checking and tests
- **commit-msg**: Validates commit messages

These run automatically. To skip (not recommended):

```bash
git commit --no-verify
git push --no-verify
```

## Release Process

Releases are handled by maintainers:

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create a git tag
4. GitHub Actions handles publishing

## Getting Help

- **Documentation**: Check `docs/` directory
- **Issues**: Search existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions

## Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to React Console! 🎉
