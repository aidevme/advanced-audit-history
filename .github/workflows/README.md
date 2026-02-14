# GitHub Workflows

This directory contains GitHub Actions workflows for the Advanced Audit History PCF Control.

## Available Workflows

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
