# GitHub Workflows

This directory contains GitHub Actions workflows for the Advanced Audit History PCF Control.

## Available Workflows

### Build PCF Control (`build-pcf.yml`)

Automated build pipeline for the PCF control with artifact generation.

**Triggers:**
- Push to `main` branch
- Pull requests to `main` branch
- Manual workflow dispatch

**Jobs:**

1. **Build** (Windows, Node.js 24)
   - Installs dependencies via `npm ci`
   - Builds PCF control with `npm run build`
   - Validates build output (bundle.js)
   - Reports bundle size in MB
   - Uploads build artifacts (30-day retention)
   - Generates build summary

2. **Lint** (Ubuntu, Node.js 24)
   - Runs ESLint checks
   - Continues on error (non-blocking)

3. **Release** (Ubuntu, Node.js 24) - _Only on main branch pushes_
   - Runs after successful build and lint
   - Analyzes commits using conventional commits
   - Determines version bump (major/minor/patch)
   - Updates package.json, ControlManifest.Input.xml, CHANGELOG.md
   - Creates Git tag and GitHub release
   - Commits changes back to main

**Build artifacts include:**
- Compiled bundle.js
- Control manifest files
- Solution package files

**Semantic Release:**

The release job uses [semantic-release](https://semantic-release.gitbook.io/) for automated version management. See [documentation/semantic-release.md](../../documentation/semantic-release.md) for commit message conventions and versioning rules.

### CodeQL Analysis (`codeql.yml`)

Automated security and code quality analysis using GitHub CodeQL.

**Triggers:**
- Push to `main` branch
- Pull requests to `main` branch
- Scheduled: Weekly on Mondays at 00:00 UTC

**What it does:**
- Scans JavaScript/TypeScript code for security vulnerabilities
- Identifies common coding errors and anti-patterns
- Analyzes dependencies for known vulnerabilities
- Reports findings in GitHub Security tab

**Languages analyzed:**
- JavaScript/TypeScript (includes React, Node.js, and PCF framework code)

**Requirements:**
- Node.js 18
- npm dependencies installed via `npm ci`
- Successful build via `npm run build`

## Viewing Results

CodeQL analysis results are available in:
1. **Security tab** → Code scanning alerts
2. **Pull request checks** (for PRs)
3. **Actions tab** → CodeQL workflow runs

## Configuration

The CodeQL workflow uses default query suites. To customize:

1. Create `.github/codeql-config.yml`
2. Add custom queries or packs
3. Reference in workflow: `config-file: .github/codeql-config.yml`

Example custom configuration:
```yaml
name: "CodeQL Config"

queries:
  - uses: security-extended
  - uses: security-and-quality

paths-ignore:
  - node_modules
  - out
  - obj
```

## Best Practices

- **Fix critical/high severity issues** before merging PRs
- **Review medium severity issues** and assess risk
- **Keep dependencies updated** to avoid known vulnerabilities
- **Don't disable CodeQL checks** without team approval

## Resources

- [CodeQL Documentation](https://codeql.github.com/docs/)
- [JavaScript CodeQL Queries](https://codeql.github.com/codeql-query-help/javascript/)
- [GitHub Code Scanning](https://docs.github.com/en/code-security/code-scanning)
