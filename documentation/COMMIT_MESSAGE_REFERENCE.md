# Conventional Commits Quick Reference

Quick reference for commit messages that work with semantic-release.

---

## Basic Format

```
<type>(<scope>): <subject>
```

**Examples:**

```bash
feat(ui): add dark mode support
fix(security): resolve XSS vulnerability in field rendering
docs: update installation instructions
```

---

## Commit Types

| Type | Description | Version Bump | Badge |
|------|-------------|--------------|-------|
| **feat** | New feature | Minor (0.X.0) | ✨ |
| **fix** | Bug fix | Patch (0.0.X) | 🐛 |
| **perf** | Performance improvement | Patch (0.0.X) | ⚡ |
| **refactor** | Code refactoring | Patch (0.0.X) | ♻️ |
| **revert** | Revert previous commit | Patch (0.0.X) | ⏪ |
| **docs** | Documentation only | None | 📝 |
| **style** | Formatting, whitespace | None | 💄 |
| **test** | Add/update tests | None | ✅ |
| **chore** | Maintenance tasks | None | 🔧 |
| **ci** | CI/CD changes | None | 👷 |
| **build** | Build system changes | None | 📦 |

---

## Common Scopes

Project-specific scopes for this PCF control:

- `security` - Security features/fixes
- `analytics` - Analytics dashboard
- `ui` - User interface components
- `services` - Service layer
- `api` - Data access layer
- `export` - Export functionality
- `cache` - Caching logic
- `workflow` - GitHub Actions
- `config` - Configuration
- `deps` - Dependencies

---

## Command Cheat Sheet

### Copy-Paste Templates

**New feature:**

```bash
git commit -m "feat(scope): description"
```

**Bug fix:**

```bash
git commit -m "fix(scope): description"
```

**Performance:**

```bash
git commit -m "perf(scope): description"
```

**Refactor:**

```bash
git commit -m "refactor(scope): description"
```

**Documentation:**

```bash
git commit -m "docs: description"
```

**Maintenance:**

```bash
git commit -m "chore(scope): description"
```

**Breaking change:**

```bash
git commit -m "feat(scope): description

BREAKING CHANGE: explanation of breaking change"
```

---

## Real Examples

### Feature Commits (Minor Version Bump)

```bash
git commit -m "feat(analytics): add change frequency heatmap visualization"

git commit -m "feat(export): implement PDF export with custom templates"

git commit -m "feat(ui): add responsive layout for mobile devices"

git commit -m "feat(security): implement field-level access control"
```

### Bug Fix Commits (Patch Version Bump)

```bash
git commit -m "fix(security): correct systemuserroles query validation"

git commit -m "fix(ui): resolve settings panel tab switching issue"

git commit -m "fix(cache): prevent stale data after record updates"

git commit -m "fix(export): handle special characters in Excel export"
```

### Performance Commits (Patch Version Bump)

```bash
git commit -m "perf(ui): implement virtual scrolling for large datasets"

git commit -m "perf(api): optimize batch request handling"

git commit -m "perf(cache): reduce memory usage with LRU cache"
```

### Refactor Commits (Patch Version Bump)

```bash
git commit -m "refactor(services): extract common logic to base service"

git commit -m "refactor(ui): convert class components to hooks"

git commit -m "refactor(api): improve error handling consistency"
```

### Documentation Commits (No Release)

```bash
git commit -m "docs: add TSDoc comments to SecurityService"

git commit -m "docs: update README with usage examples"

git commit -m "docs(contributing): add commit message guidelines"
```

### Maintenance Commits (No Release)

```bash
git commit -m "chore(deps): update FluentUI to v9.46.2"

git commit -m "chore: configure ESLint rules"

git commit -m "ci: add Node 24 to workflow matrix"
```

### Breaking Change Commits (Major Version Bump)

```bash
git commit -m "refactor(api)!: modernize service interfaces

BREAKING CHANGE: All service methods now return Promises instead of observables.
Migration: Change .subscribe() to .then() and update error handling."
```

**Alternative breaking change format:**

```bash
git commit -m "feat!: redesign settings API"
```

(The `!` after type also indicates breaking change)

---

## Multi-line Commits

For more detailed commits, use:

```bash
git commit
```

Then in editor:

```
feat(analytics): add change frequency heatmap

Implements a 7x24 hour heatmap showing audit change patterns.
Includes hover tooltips and color-coded intensity scale.

- Uses D3.js for visualization
- Supports custom date ranges
- Exports to PNG/SVG

Closes #42
Ref #38
```

---

## Best Practices

✅ **DO:**

- Use lowercase for type and scope
- Keep subject under 72 characters
- Use imperative mood ("add" not "added")
- Provide body for complex changes
- Link to issues with "Closes #123"

❌ **DON'T:**

- End subject with period
- Use past tense ("added feature")
- Mix multiple unrelated changes
- Forget the colon after scope
- Use generic messages ("fix stuff")

---

## Testing Before Push

**Check what release would be created:**

```bash
npx semantic-release --dry-run --no-ci
```

**See commit history:**

```bash
git log --oneline -10
```

**Amend last commit message:**

```bash
git commit --amend -m "feat(scope): new message"
```

---

## GitHub Squash & Merge

When merging PRs with "Squash and merge", GitHub lets you edit the final commit message. Use this to:

1. Combine multiple commits into one conventional commit
2. Ensure proper type and scope
3. Add breaking change footer if needed

**Example:**

Multiple commits:

- "added export feature"
- "fixed tests"
- "updated docs"

Squash to:

```
feat(export): implement PDF export with templates

- Added PDF generation using jsPDF
- Supports custom templates
- Includes print preview
```

---

## Quick Tips

💡 **No release needed?** Use `docs:`, `chore:`, or `test:` types

💡 **Quick patch?** Use `fix:` for version 0.0.X bump

💡 **New feature?** Use `feat:` for version 0.X.0 bump

💡 **Breaking API?** Add `BREAKING CHANGE:` footer or `!` after type for X.0.0 bump

💡 **Scope optional?** Yes, but recommended for clarity

💡 **Multiple scopes?** Choose primary or use broader scope (e.g., `ui` instead of `ui/components`)

---

**Last Updated**: February 14, 2026  
**Semantic Release Version**: 24.2.9
