# GitHub Actions Workflows

This directory contains all GitHub Actions workflows for React Console.

## Workflows

### CI (`ci.yml`)
Main continuous integration workflow that runs on every push and PR:
- Linting (ESLint + Prettier)
- Type checking
- Testing (Node 18, 20, 22)
- Build verification
- Security audit

### Release (`release.yml`)
Automated release workflow:
- Triggers on version tags (`v*.*.*`) or manual dispatch
- Builds and tests
- Publishes to npm
- Creates GitHub release

### CodeQL (`codeql.yml`)
Security code analysis:
- Weekly schedule
- On push/PR to main/develop
- JavaScript/TypeScript analysis

### PR Check (`pr-check.yml`)
Pull request quality checks:
- Semantic PR title validation
- Large file detection (>1MB)
- Merge commit detection

### Validate PR (`validate-pr.yml`)
PR validation:
- Checks for PR description
- Warns about TODO/FIXME comments

### Stale (`stale.yml`)
Automatically manages stale issues and PRs:
- Marks issues stale after 60 days
- Marks PRs stale after 30 days
- Closes after 7 more days of inactivity

### Dependabot Auto-merge (`dependabot-auto-merge.yml`)
Automatically merges Dependabot PRs:
- Only for minor/patch updates
- Requires tests to pass

### Label (`label.yml`)
Auto-labels PRs based on changed files:
- CLI changes → `cli` label
- Renderer changes → `renderer` label
- Documentation → `docs` label
- etc.

### Changelog (`changelog.yml`)
Updates CHANGELOG.md automatically when PRs are merged.

### Benchmark (`benchmark.yml`)
Performance benchmarking (placeholder for future implementation).

### Docs (`docs.yml`)
Documentation build and validation (placeholder for future implementation).

## Workflow Triggers

Most workflows trigger on:
- `push` to `main` or `develop`
- `pull_request` to `main` or `develop`

Some workflows have additional triggers:
- `release.yml`: Version tags and manual dispatch
- `stale.yml`: Weekly schedule
- `codeql.yml`: Weekly schedule

## Required Secrets

For releases to work, add these secrets in GitHub Settings → Secrets → Actions:

- `NPM_TOKEN`: npm authentication token for publishing

## Workflow Status

You can view workflow runs in the "Actions" tab on GitHub.
