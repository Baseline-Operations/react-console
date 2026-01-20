# Git Workflow Guide

This document describes the Git workflow, hooks, and CI/CD setup for React Console.

## Git Hooks

We use [Husky](https://typicode.github.io/husky/) to manage Git hooks.

### Pre-commit Hook

Runs automatically before each commit:

- **Lint-staged**: Formats and lints staged files
  - TypeScript/TSX files: ESLint + Prettier
  - JSON/Markdown files: Prettier
  - Only processes staged files (fast)

To skip (not recommended):
```bash
git commit --no-verify
```

### Pre-push Hook

Runs automatically before each push:

- **Type checking**: `npm run typecheck`
- **Tests**: `npm test -- --run`
- **Linting**: `npm run lint`

To skip (not recommended):
```bash
git push --no-verify
```

### Commit Message Hook

Validates commit messages (basic validation).

## Branch Strategy

### Main Branches

- `main`: Production-ready code
- `develop`: Integration branch for features

### Feature Branches

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Refactoring
- `test/` - Tests
- `chore/` - Maintenance

### Example Workflow

```bash
# Create feature branch
git checkout -b feature/new-component

# Make changes and commit
git add .
git commit -m "feat(components): add new component"

# Push and create PR
git push origin feature/new-component
```

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

**Examples:**
```
feat(cli): add support for nested commands

fix(renderer): correct layout calculation

docs: update API documentation
```

## Pull Request Process

1. **Create PR** from feature branch to `main`
2. **Fill PR template** with details
3. **Wait for CI** to pass (automated checks)
4. **Request review** from maintainers
5. **Address feedback** and update PR
6. **Merge** after approval

### PR Requirements

- ✅ All CI checks pass
- ✅ Code follows style guidelines
- ✅ Tests added/updated
- ✅ Documentation updated
- ✅ No merge conflicts
- ✅ PR title follows conventional commits

## GitHub Actions

### CI Workflow

Runs on every push and PR:

1. **Lint**: ESLint + Prettier checks
2. **Type Check**: TypeScript validation
3. **Test**: Unit and integration tests (Node 18, 20, 22)
4. **Build**: Verify build succeeds
5. **Security**: npm audit

### Release Workflow

Automated releases on version tags:

1. Build and test
2. Extract version from tag
3. Update package.json
4. Publish to npm
5. Create GitHub release

### CodeQL Analysis

Weekly security scanning of codebase.

### PR Checks

- Semantic PR title validation
- Large file detection
- Merge commit detection

## Dependabot

Automatically updates dependencies:

- **npm packages**: Weekly on Monday
- **GitHub Actions**: Weekly on Monday
- **Auto-merge**: Minor/patch updates (if tests pass)

## Stale Issues/PRs

Automatically marks inactive items:

- **Issues**: Stale after 60 days, closed after 7 more days
- **PRs**: Stale after 30 days, closed after 7 more days
- **Exemptions**: Pinned, security, bug, enhancement labels

## Local Development

### Setup

```bash
# Install dependencies (includes Husky setup)
npm install

# Husky will be installed automatically via prepare script
```

### Running Checks Manually

```bash
npm run lint          # Check code style
npm run typecheck     # Type check
npm test              # Run tests
npm run format        # Format code
npm run build         # Build project
```

### Bypassing Hooks

**Not recommended**, but possible:

```bash
# Skip pre-commit
git commit --no-verify -m "message"

# Skip pre-push
git push --no-verify
```

## Troubleshooting

### Hooks Not Running

1. Check Husky is installed: `ls .husky/`
2. Reinstall: `npm run prepare`
3. Check file permissions: `chmod +x .husky/*`

### Lint-staged Not Working

1. Check `.lintstagedrc.js` exists
2. Verify lint-staged is installed: `npm list lint-staged`
3. Run manually: `npx lint-staged`

### CI Failing Locally

1. Run checks locally: `npm run lint && npm run typecheck && npm test`
2. Check Node version: `node --version` (should be >= 18)
3. Clean install: `rm -rf node_modules && npm install`

## Best Practices

1. **Commit often**: Small, focused commits
2. **Write good messages**: Clear, descriptive commit messages
3. **Test locally**: Run checks before pushing
4. **Keep PRs focused**: One feature/fix per PR
5. **Update docs**: Keep documentation in sync
6. **Review your own PR**: Check diff before requesting review

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Contributing Guide](./CONTRIBUTING.md)
