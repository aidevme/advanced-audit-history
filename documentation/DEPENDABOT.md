# Dependabot Configuration

Automated dependency update detection for the Advanced Audit History PCF Control.

**All updates require manual review and merge.**

## What's Configured

### NPM Dependencies (Weekly)

- **Schedule**: Every Monday at 09:00 UTC
- **Open PRs Limit**: Maximum 5 at a time
- **Grouping**: Related packages grouped into single PRs
  - All `@fluentui/*` packages together
  - Development dependencies together
  - Semantic-release packages together

### GitHub Actions (Monthly)

- **Schedule**: First Monday of each month
- **Open PRs Limit**: Maximum 3 at a time
- **Updates**: actions/checkout, actions/setup-node, etc.

## Update Strategy

### All Updates Require Manual Review

📝 **Every dependency update** requires manual review and merge
- No automatic merging
- You control when updates are applied
- Test thoroughly before merging

### Priority Guidelines

🔴 **High Priority - Review Immediately**
- Security patches (marked with security label)
- Critical bug fixes

🟡 **Medium Priority - Review This Week**
- Minor version updates
- Development dependencies

🟢 **Low Priority - Review When Convenient**
- Major version updates (may require code changes)
- Indirect dependencies

## What's Protected (Won't Auto-Update)

🔒 **React 16.14** - PCF framework requirement
🔒 **React-DOM 16.14** - Must match React version
🔒 **TypeScript major versions** - Breaking changes
🔒 **PCF Scripts major versions** - Framework compatibility

## Workflow

1. **Monday 09:00 UTC**: Dependabot checks for updates
2. **PR Created**: With grouped dependencies and change notes
3. **CI Runs**: Build, Lint, CodeQL execute automatically
4. **Manual Review**: You review the PR, check changes, test locally
5. **Manual Merge**: You merge when satisfied with testing

## Testing Dependabot PRs

### Standard Review Process

```bash
# Checkout PR
gh pr checkout <number>

# Install and build
npm ci
npm run build

# Check for breaking changes
git diff main -- package-lock.json

# Test in PCF harness
npm start watch

# Test in Dynamics 365 environment (recommended)
pac pcf push --environment yourenv
```

### Quick Checklist

- [ ] CI checks passed (Build, Lint, CodeQL)
- [ ] No major version jumps on critical packages
- [ ] Bundle size acceptable (`ls -lh out/controls/AdvancedAuditHistory/bundle.js`)
- [ ] Built successfully locally
- [ ] Tested in PCF harness
- [ ] No console errors
- [ ] UI components render correctly (if FluentUI update)
- [ ] Tested in Dynamics 365 environment (for production dependencies)

## Common Scenarios

### FluentUI Update

```yaml
# PR: chore(deps): update fluentui packages
# Contains: @fluentui/react-components, @fluentui/react-icons, etc.
```

**Action**: Manual review required
**Testing**:
1. Visual regression - check all components render correctly
2. Test Settings panel tabs
3. Test FiltersPanel drawer
4. Verify date picker positioning
5.Testing Required**:
1. Visual regression - check all components render correctly
2. Test Settings panel tabs
3. Test FiltersPanel drawer
4. Verify date picker positioning
5. Check bundle size increase (<5% acceptable)

**Decision**: Merge after thorough UI testing

### Security Patch

```yaml
# PR: chore(deps): bump @fluentui/react-components from 9.46.2 to 9.46.3
# Update type: semver-patch
```

**Testing Required**:
1. Verify CI passes
2. Quick build test locally
3. Quick smoke test in dev environment

**Decision**: Merge after CI passes and smoke test

### TypeScript Update

```yaml
# PR: chore(deps-dev): bump typescript from 5.8.3 to 5.9.0
# Update type: semver-minor
```

**Testing Required**:
1. Verify no new compilation errors
2. Check for deprecated API warnings
3. Test full build

**Decision**: Merge after successful build
gh pr list --label dependencies --state open
```

### Check Dependabot Logs

Go to: **Settings → Code security and analysis → Dependabot**

### Force Update Check

```bash
# Via GitHub CLI
gh api repos/aidevme/advanced-audit-history/import/dependabot/updates -X POST
```

## Disabling Dependabot

If you need to pause updates temporarily:

1. Go to **Settings → Code security and analysis**
2. Disable **Dependabot version updates**
3. Re-enable when ready

Or comment on any Dependabot PR:
```
@dependabot pause
```

Resume with:
```
@dependabot resume
```

## Customization

### Change Update Frequency

Edit `.github/dependabot.yml`:

```yaml
schedule:
  interval: "monthly"  # daily, weekly, monthly
  day: "monday"
  time: "09:00"
```

### Add More Ignores

```yaml
ignore:
  - dependency-name: "package-name"
    update-types: ["version-update:semver-major"]
```
Not applicable - all merges are manual
### Change Auto-Merge Rules

Edit `.github/workflows/dependabot-auto-merge.yml` to adjust conditions.

## FAQ

**Q: Will this spam PRs?**
A: PR stays open. Fix the issue or close the PR if the update isn't compatible.

**Q: Do I have to merge every update?**
A: No - you control all merges. Close PRs you don't want to merge.

**Q: How do I prioritize which PRs to review first?**
A: Security patches first, then bug fixes, then features, then dev dependencies.

**Q: How do I update React?**
A: You can't with Dependabot (protected). PCF requires React 16.14 exactly.

**Q: What about semantic-release commits?**
A: Dependabot uses `chore(deps):` which doesn't trigger releases (configured in `.releaserc.json`). No version spam.

**Q: Can I batch merge multiple Dependabot PRs?**
A: Not recommended. Test each PR individually to isolate any issues
Grouped FluentUI updates
- ✅ React version protected
- ✅ CI integration
- ✅ Manual review and merge for all updates
## Current Status

- ✅ Dependabot enabled
- ✅ Weekly NPM updates (Mondays 09:00 UTC)
- ✅ Monthly GitHub Actions updates
- ✅ Auto-merge for security patches
- ✅ Grouped FluentUI updates
- ✅ React version protected
- ✅ CI integration

**First update check**: Next Monday at 09:00 UTC

---

**Last Updated**: February 14, 2026
