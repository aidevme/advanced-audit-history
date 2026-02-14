# Semantic Release

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated version management and releases.

## How It Works

Semantic release automates the entire package release workflow:

1. **Analyzes commits** since the last release
2. **Determines version bump** based on commit message conventions
3. **Generates changelog** from commit messages
4. **Updates version** in package.json and ControlManifest.Input.xml
5. **Creates Git tag** with the new version
6. **Publishes GitHub release** with release notes
7. **Commits changes** back to main branch

## Commit Message Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types and Version Bumps

| Type | Description | Version Bump | Example |
|------|-------------|--------------|---------|
| `feat` | New feature | **Minor** (0.x.0) | `feat: add export to Excel functionality` |
| `fix` | Bug fix | **Patch** (0.0.x) | `fix: resolve security validation error` |
| `perf` | Performance improvement | Patch | `perf: optimize audit data caching` |
| `refactor` | Code refactoring | Patch | `refactor: improve service layer architecture` |
| `revert` | Revert previous commit | Patch | `revert: undo breaking change` |
| `docs` | Documentation only | **No release** | `docs: update README with examples` |
| `style` | Code style changes | No release | `style: format code with prettier` |
| `test` | Add/update tests | No release | `test: add unit tests for AuditService` |
| `chore` | Maintenance tasks | No release | `chore: update dependencies` |
| `ci` | CI/CD changes | No release | `ci: update build workflow` |
| `build` | Build system changes | No release | `build: configure webpack analyzer` |

### Breaking Changes (Major Release)

To trigger a **major version** bump (x.0.0), add `BREAKING CHANGE:` in the commit footer:

```
feat: redesign settings panel

BREAKING CHANGE: The settings API has changed. The `getSettings()` method now returns a Promise.
```

### Examples

**Minor release (new feature):**
```
feat(dashboard): add change frequency heatmap visualization

Implements a 7x24 hour heatmap showing audit change patterns.
Includes hover tooltips and color-coded intensity scale.
```

**Patch release (bug fix):**
```
fix(security): correct systemuserroles query validation

Fixed invalid $expand operation on intersect entity.
Now uses $select=roleid for proper role retrieval.

Closes #42
```

**No release (documentation):**
```
docs: add TSDoc comments to SecurityService

Added comprehensive documentation with examples
for all security validation methods.
```

**Major release (breaking change):**
```
refactor(api)!: modernize service interfaces

BREAKING CHANGE: All service methods now return Promises instead of observables.
Migration guide:
- Change `.subscribe()` to `.then()`
- Update error handling from catchError to .catch()
```

## Scopes (Optional)

Common scopes for this project:

- `security` - Security-related changes
- `analytics` - Analytics and dashboard features
- `ui` - User interface components
- `services` - Service layer changes
- `api` - Data access layer changes
- `workflow` - GitHub Actions workflows
- `config` - Configuration files

## Release Process

### Automatic Releases

1. **Write commits** following the convention above
2. **Push to main** branch (directly or via merged PR)
3. **Workflow runs** automatically on push
4. **Semantic release** analyzes commits and creates release if needed

### Manual Trigger

You can manually trigger a release from GitHub Actions:

1. Go to Actions → Build PCF Control
2. Click "Run workflow"
3. Select branch: `main`
4. Click "Run workflow"

### What Gets Updated

When semantic-release runs, it updates:

- ✅ **package.json** - version field
- ✅ **ControlManifest.Input.xml** - version attribute
- ✅ **CHANGELOG.md** - generated changelog
- ✅ **Git tag** - created for the version (e.g., v1.2.3)
- ✅ **GitHub Release** - created with release notes

### Commit Message

Semantic release creates a commit with message:
```
chore(release): 1.2.3 [skip ci]

# 1.2.3 (2026-02-14)

### Features
* add export to Excel functionality ([abc123])

### Bug Fixes
* resolve security validation error ([def456])
```

The `[skip ci]` tag prevents infinite workflow loops.

## Configuration

### .releaserc.json

The semantic-release configuration is in `.releaserc.json`:

- **Branches**: Only `main` branch triggers releases
- **Plugins**:
  - `commit-analyzer` - Analyzes commit messages
  - `release-notes-generator` - Generates release notes
  - `changelog` - Updates CHANGELOG.md
  - `exec` - Runs custom script to update manifest
  - `git` - Commits updated files
  - `github` - Creates GitHub release

### Custom Script

`scripts/update-manifest-version.js` updates the PCF control manifest version.

## Checking What Will Be Released

Before pushing, you can check what semantic-release would do:

```bash
# Dry run (doesn't actually release)
npx semantic-release --dry-run
```

This shows:
- Next version number
- Commits included
- Files that would be updated

## Troubleshooting

### No release created

**Cause**: No commits since last release match release rules (all were `docs`, `chore`, etc.)

**Solution**: Ensure you have `feat:`, `fix:`, or other release-triggering commits.

### Release failed

**Cause**: Missing or invalid GITHUB_TOKEN

**Solution**: Verify workflow permissions include `contents: write`.

### Version not updated in manifest

**Cause**: Script failed to update ControlManifest.Input.xml

**Solution**: Check `scripts/update-manifest-version.js` execution logs.

## Best Practices

1. ✅ **Write clear commit messages** - They become your changelog
2. ✅ **Use conventional commits** - Enables automatic versioning
3. ✅ **Squash PRs** - Creates clean commit history
4. ✅ **Describe breaking changes** - Helps users understand migrations
5. ✅ **Link issues** - Use `Closes #123` in commit body
6. ✅ **Keep commits atomic** - One logical change per commit

## Version History

Current version: **0.0.33**

Version history is maintained in [CHANGELOG.md](../CHANGELOG.md) (generated automatically).

## References

- [Semantic Versioning (SemVer)](https://semver.org/)
- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Semantic Release Documentation](https://semantic-release.gitbook.io/)
- [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
