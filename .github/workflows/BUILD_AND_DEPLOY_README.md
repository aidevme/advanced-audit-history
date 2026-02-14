# Build and Deploy Workflow

## Overview

This workflow automates the build and deployment of the Advanced Audit History PCF solution to Dynamics 365/Power Platform environments.

## Workflow Steps

1. **Build PCF Control** - Compiles the TypeScript/React PCF component
2. **Increment Solution Version** - Automatically increments the solution version in `Solution.xml`
3. **Build Solution** - Creates the solution package (.zip) using MSBuild
4. **Deploy to Environment** - Imports the unmanaged solution to the target environment
5. **Commit Version Change** - Commits the updated version back to the repository

## Prerequisites

### GitHub Secrets Required

Configure these secrets in your repository settings (`Settings > Secrets and variables > Actions`):

- `POWERPLATFORM_CLIENT_ID` - Application (client) ID from Azure AD app registration
- `POWERPLATFORM_CLIENT_SECRET` - Client secret from Azure AD app registration
- `POWERPLATFORM_TENANT_ID` - Azure AD tenant ID

### Azure AD App Registration Setup

1. **Create App Registration** in Azure Portal:
   - Navigate to **Azure Active Directory > App registrations > New registration**
   - Name: `PowerPlatform-CI-CD` (or your preferred name)
   - Supported account types: **Accounts in this organizational directory only**
   - Click **Register**

2. **Copy Required IDs**:
   - **Application (client) ID** → `POWERPLATFORM_CLIENT_ID`
   - **Directory (tenant) ID** → `POWERPLATFORM_TENANT_ID`

3. **Create Client Secret**:
   - Go to **Certificates & secrets > New client secret**
   - Description: `GitHub Actions Deploy`
   - Expires: Choose appropriate duration (recommended: 12-24 months)
   - Click **Add**
   - **Copy the secret value immediately** → `POWERPLATFORM_CLIENT_SECRET` (you cannot view it again)

4. **Grant API Permissions**:
   - Go to **API permissions > Add a permission**
   - Select **Dynamics CRM**
   - Check **user_impersonation**
   - Click **Add permissions**
   - Click **Grant admin consent** (requires admin privileges)

5. **Add Application User to Power Platform**:
   - Navigate to Power Platform Admin Center (`https://admin.powerplatform.microsoft.com`)
   - Select your environment
   - Go to **Settings > Users + permissions > Application users**
   - Click **+ New app user**
   - Select your app registration
   - Select Business Unit
   - Assign **System Administrator** or **System Customizer** security role
   - Click **Create**

### Application User Permissions

The application user must have:

- **System Administrator** or **System Customizer** role in the target environment
- Permission to import solutions
- Enabled for API access

## Usage

### Manual Trigger

1. Go to **Actions** tab in GitHub
2. Select **"Build and Deploy PCF Solution"** workflow
3. Click **"Run workflow"**
4. Configure parameters:
   - **Environment**: Target environment URL (e.g., `https://yourorg.crm.dynamics.com`)
   - **Increment version**: Check to auto-increment solution version (default: true)
5. Click **"Run workflow"**

### Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `environment` | Yes | `https://yourorg.crm.dynamics.com` | The full URL of your Dynamics 365/Power Platform environment |
| `increment_version` | Yes | `true` | Whether to increment the solution version number automatically |

## Solution Versioning

### Version Format

Solution versions follow the format: `Major.Minor.Build.Revision`

Example: `1.0.0.34`

### Auto-Increment Behavior

When `increment_version` is enabled:

- The **Revision** number (last digit) is incremented by 1
- `1.0.0.34` → `1.0.0.35`
- The change is committed back to the repository with `[skip ci]` to prevent recursive builds

### Manual Version Update

To manually increment the solution version:

```bash
node scripts/increment-solution-version.js
```

Or add to package.json:

```bash
npm run increment-solution-version
```

## Solution Type

**Unmanaged Solution** - The workflow deploys as an unmanaged solution by default, allowing for:

- Customization in the target environment
- Development and testing scenarios
- Iterative development

To deploy as **managed**, modify the workflow:

```yaml
convert-to-managed: true  # Change from false to true
```

## Artifacts

The workflow uploads:

- **PCF Control Bundle** (`bundle.js`) - 30 day retention
- **Solution Package** (`.zip`) - 30 day retention

Access artifacts from the workflow run summary page.

## Deployment Summary

After each run, the workflow generates a summary showing:

- Solution version (if incremented)
- Target environment URL
- Solution type (Unmanaged/Managed)
- Solution package size
- Deployment status

## Troubleshooting

### Authentication Failures

```
Error: Authentication failed
```

**Solution**:

- Verify `POWERPLATFORM_CLIENT_ID`, `POWERPLATFORM_CLIENT_SECRET`, and `POWERPLATFORM_TENANT_ID` secrets are correct
- Ensure the client secret hasn't expired in Azure AD
- Verify admin consent was granted for API permissions
- Check that the application user exists in the target environment with proper roles

### Import Failures

```
Error: Solution import failed
```

**Causes**:

- Missing dependencies in target environment
- Insufficient permissions
- Environment URL incorrect

**Solution**:

- Check deployment logs in Power Platform admin center
- Verify all dependencies are present in target environment
- Ensure service account has System Administrator role

### Version Conflict

```
Error: A solution with this version already exists
```

**Solution**: Enable `increment_version` parameter or manually update version in `Solution.xml`

### Build Failures

```
Error: MSBuild failed
```

**Solution**:

- Check PCF control built successfully
- Verify all NuGet packages restored
- Review MSBuild logs in workflow output

## Environment URL Examples

| Platform | URL Format | Example |
|----------|-----------|---------|
| Dynamics 365 (US) | `https://<org>.crm.dynamics.com` | `https://contoso.crm.dynamics.com` |
| Dynamics 365 (EU) | `https://<org>.crm4.dynamics.com` | `https://contoso.crm4.dynamics.com` |
| Dynamics 365 (APAC) | `https://<org>.crm5.dynamics.com` | `https://contoso.crm5.dynamics.com` |
| Power Platform (Gov) | `https://<org>.crm.microsoftdynamics.us` | `https://contoso.crm.microsoftdynamics.us` |

## CI/CD Best Practices

1. **Use separate environments** for dev, test, and production
2. **Test in lower environments** before deploying to production
3. **Enable increment_version** to maintain version history
4. **Review deployment summary** after each deployment
5. **Monitor solution health** in Power Platform admin center

## Related Documentation

- [Power Platform Build Tools](https://docs.microsoft.com/power-platform/alm/devops-build-tools)
- [Solution Lifecycle Management](https://docs.microsoft.com/power-platform/alm/)
- [PCF Control Deployment](https://docs.microsoft.com/powerapps/developer/component-framework/import-custom-controls)

## Security Notes

- Never commit credentials to the repository
- Use GitHub Secrets for all sensitive values
- **Rotate client secrets before expiration** (set calendar reminders)
- Use dedicated app registrations for automation (don't share with other apps)
- Store client secret securely - it cannot be retrieved after initial creation
- Limit app registration permissions to only what's needed
- Use separate app registrations for dev, test, and production environments
- Monitor app registration sign-in activity in Azure AD logs
- Enable Conditional Access policies where appropriate
