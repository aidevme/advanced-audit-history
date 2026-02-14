# GitHub Copilot Instructions - Advanced Audit History PCF Control

## Project Overview
Enterprise-grade PowerApps Component Framework (PCF) control for Dynamics 365/Power Platform audit history management. Built with **TypeScript 5.8**, **React 16.14**, and **FluentUI v9** components. Uses React Context API and custom hooks for state management.

## Architecture Pattern
This project uses a **layered architecture**:

1. **Presentation Layer** (`/AdvancedAuditHistory/components/`) - React functional components, FluentUI v9 controls
2. **PCF Control Layer** (`/AdvancedAuditHistory/index.ts`) - PCF lifecycle methods, minimal logic (delegates to App component)
3. **Application Layer** (`AdvancedAuditHistoryApp.tsx`) - Main React app with state management via hooks and Context API
4. **Custom Hooks** (`/hooks/`) - Shared logic: `useDataverse`, `useAudit`, `useNavigation`, service hooks
5. **Context Layer** (`/context/`) - React Context providers: `ControlContext`, `FilterContext`
6. **Service Layer** (`/services/`) - Business logic: `SecurityService`, `AnalyticsService`
7. **Type Layer** (`/interfaces/`, `/types/`, `/enums/`) - TypeScript type definitions

**Key principle**: PCF control (`index.ts`) is minimal - it delegates to `AdvancedAuditHistoryApp.tsx` which manages all state and logic.

## Key Development Patterns

### PCF Control Entry Point (`index.ts`)
```typescript
// ACTUAL pattern - minimal PCF wrapper that delegates to React
export class AdvancedAuditHistory implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    public init(context, notifyOutputChanged, state): void {
        this.notifyOutputChanged = notifyOutputChanged;
    }
    
    public updateView(context): React.ReactElement {
        // Delegate everything to the React app component
        return React.createElement(AdvancedAuditHistoryApp, { context });
    }
    
    public destroy(): void {
        this.mainControl.destroy();
    }
}
```
- Keep PCF layer thin - just lifecycle hooks
- All logic lives in `AdvancedAuditHistoryApp.tsx`
- React component receives PCF context as prop

### State Management Pattern (React Hooks + Context)
```typescript
// Main app uses useState for local state, Context for shared state
function AdvancedAuditHistoryApp({ context }: IAdvancedAuditHistoryAppProps) {
    const { isLoading, attributes, audits, record, onRefresh } = useDataverse(context);
    const [filter, setFilter] = useState<string[]>([]);
    const [viewType, setViewType] = useState<'card' | 'card-timeline'>('card');
    
    // Context providers wrap the component tree
    return (
        <ControlContext.Provider value={{ context }}>
            <FilterContext.Provider value={{ filter: selectedAttributes }}>
                {/* Component tree */}
            </FilterContext.Provider>
        </ControlContext.Provider>
    );
}
```
**NOT using MobX/Redux** - use React hooks and Context API instead.

### Custom Hooks Pattern
```typescript
// hooks/useDataverse.tsx - Encapsulates Dataverse API calls
export function useDataverse(context: Context<IInputs>) {
    const [isLoading, setIsLoading] = useState(true);
    const [audits, setAudits] = useState<AuditInstance[]>([]);
    
    const onRefresh = useCallback(async () => {
        // Fetch from Dataverse Web API
        const response = await Xrm.WebApi.online.execute(request);
        setAudits(processedAudits);
    }, [context]);
    
    return { isLoading, audits, attributes, record, onRefresh };
}
```
**Current custom hooks**:
- `useDataverse` - Main data fetching hook using Dataverse Web API
- `useAudit` - Audit-specific operations
- `useNavigation` - Navigation and routing helpers
- Hooks in `/hooks/service.tsx` - Service layer access

### Service Layer Pattern
```typescript
// Services are static utility classes, NOT dependency injection
export class SecurityService {
    static async validateAuditAccess(
        context: Context<IInputs>, 
        entityLogicalName: string
    ): Promise<{canAccess: boolean, hasPermission: boolean, isAuditEnabled: boolean, message?: string}> {
        const hasPermission = await this.checkUserAuditPermission(context);
        const isAuditEnabled = await this.checkEntityAuditEnabled(context, entityLogicalName);
        // Return validation result
    }
}
```
**Current services**: `SecurityService`, `AnalyticsService` (no AuditService, ExportService, CacheService yet)

### Component Structure
```typescript
// Use functional components with FluentUI v9 and React hooks
import { Button, Dialog, Spinner } from "@fluentui/react-components";

export const MyComponent: React.FC<MyComponentProps> = ({ audits, onSelect }) => {
    const [expanded, setExpanded] = useState(false);
    const context = useContext(ControlContext);
    
    const filteredData = useMemo(() => {
        return audits.filter(audit => /* filtering logic */);
    }, [audits]);
    
    return <div>{/* FluentUI components */}</div>;
};
```
- **All components are functional** - no class components
- **FluentUI v9** as primary UI library (`@fluentui/react-components: 9.46.2`)
- Use `useState`, `useEffect`, `useMemo`, `useCallback` for component logic
- Access shared state via `useContext(ControlContext)` or `useContext(FilterContext)`
- Prop interfaces defined in component files or centralized in `/types/`

**Component organization**:
```
/components/
  /cards/         - Card-based audit display
  /dashboards/    - Analytics dashboard components
  /filters/       - Filter UI components (ActiveFilters, etc.)
  /header/        - Header with date range picker
  /panel/         - Settings and Filters panels
  /table/         - Table view components
  /toolbar/       - Toolbar actions
  /views/         - Different view modes
  history.tsx     - Main history display component
```

### Documentation Standards (TSDoc)
All components, services, and utilities must have TSDoc comments. Follow this pattern:

```typescript
/**
 * TimelineView component displays audit history in an interactive timeline format.
 * 
 * @remarks
 * This component uses virtual scrolling for performance with large datasets.
 * Supports zoom, pan, and milestone markers for significant changes.
 * 
 * @example
 * ```tsx
 * <TimelineView
 *   auditRecords={records}
 *   onRecordSelect={handleSelect}
 *   enableZoom={true}
 * />
 * ```
 */
export const TimelineView: React.FC<TimelineViewProps> = observer(({ auditRecords, onRecordSelect }) => {
  // Component implementation
});

/**
 * Props for the TimelineView component
 * 
 * @property auditRecords - Array of audit records to display in timeline
 * @property onRecordSelect - Callback fired when user selects a record
 * @property enableZoom - Optional. Enable zoom/pan functionality. Defaults to true
 * @property className - Optional. Additional CSS classes for styling
 */
interface TimelineViewProps {
  auditRecords: AuditRecord[];
  onRecordSelect: (record: AuditRecord) => void;
  enableZoom?: boolean;
  className?: string;
}
```

For services, include method documentation:

```typescript
/**
 * Service for managing audit history data retrieval and caching.
 * 
 * @remarks
 * Implements intelligent caching with 5-minute TTL and handles
 * Dataverse API rate limiting automatically.
 */
export class AuditService {
  /**
   * Retrieves audit history for a specific entity record.
   * 
   * @param entityId - The GUID of the entity record
   * @param filters - Optional filter criteria for the audit query
   * @returns Promise resolving to array of audit records
   * @throws {ApiError} When API request fails or rate limit is exceeded
   * 
   * @example
   * ```typescript
   * const audits = await auditService.getAuditHistory(
   *   '12345678-1234-1234-1234-123456789012',
   *   { dateFrom: new Date('2026-01-01') }
   * );
   * ```
   */
  async getAuditHistory(entityId: string, filters?: FilterOptions): Promise<AuditRecord[]> {
    // Implementation
  }
}
```

**Required TSDoc tags:**
- `@param` - Document all parameters with type and description
- `@returns` - Describe what the function/method returns
- `@throws` - Document exceptions that can be thrown
- `@remarks` - Additional implementation notes or warnings
- `@example` - Provide usage examples for complex components/methods
- `@deprecated` - Mark deprecated code with migration path

### Dataverse Integration
- Use **Dataverse Web API** via `Xrm.WebApi.online.execute(request)` for RetrieveRecordChangeHistory
- Direct fetch API calls to EntityDefinitions for metadata queries
- Always implement proper error handling for 401, 403, 429, 500 responses
- Use `context.webAPI` for standard entity CRUD operations
- Respect Dataverse API limits (no more than 6000 requests per 5 minutes per user)

**Example pattern**:
```typescript
// Global Xrm declaration for TypeScript
declare const Xrm: { 
    WebApi: { 
        online: { 
            execute: (request: any) => Promise<any> 
        } 
    } 
};

// Using in custom hook
const response = await Xrm.WebApi.online.execute(request);
```

### Context API for Shared State
```typescript
// context/control-context.tsx - Provides PCF context to all components
export const ControlContext = createContext<IControlContext>(undefined!);

// context/filter-context.tsx - Manages filter state
export const FilterContext = createContext<IFilterContext>(undefined!);

// Usage in components
const { context } = useContext(ControlContext);
const { filter } = useContext(FilterContext);
```
**Current contexts**: `ControlContext`, `FilterContext`

### Localization
- String resources in `/localization/` using `.resx` files (PCF standard)
- Support 20+ languages as documented in README
- Use resource keys, never hardcoded strings: `context.resources.getString("FilterLabel")`

## Build & Development Commands

```bash
npm start watch          # Development with hot reload (harness test)
npm run build           # Production build (webpack 5.105.2, ~20-24 seconds)
npm run lint            # ESLint check
npm run lint:fix        # Auto-fix ESLint issues
npm run analyze         # Bundle analysis with webpack-bundle-analyzer
npm run semantic-release # Run semantic-release (CI only)
pac pcf push            # Push to test environment
```

**Build output**: `out/controls/AdvancedAuditHistory/bundle.js` (~10.1 MiB with 30 modules)

## Version Management & Releases

This project uses **semantic-release** for automated version management:

**Commit message format** (Conventional Commits):
```bash
<type>(<scope>): <subject>

# Examples:
feat(analytics): add change frequency heatmap    # → minor version (0.X.0)
fix(security): resolve permission check bug      # → patch version (0.0.X)
docs: update README                              # → no release
```

**Version bump rules**:
- `feat:` → minor (0.X.0)
- `fix:`, `perf:`, `refactor:` → patch (0.0.X)
- `BREAKING CHANGE:` footer → major (X.0.0)
- `docs:`, `chore:`, `test:`, `ci:` → no release

**What happens on push to main**:
1. Build + Lint jobs run
2. Semantic-release analyzes commits
3. Updates `package.json` and `ControlManifest.Input.xml` version
4. Generates `CHANGELOG.md`
5. Creates Git tag and GitHub release
6. Commits changes back to main with `[skip ci]`

**Documentation**: See `documentation/semantic-release.md` and `documentation/COMMIT_MESSAGE_REFERENCE.md`

## Testing Requirements

**Current state**: No test infrastructure implemented yet.

**When implementing tests**:
- **Unit tests**: Services should have >80% coverage using Jest
- **Component tests**: Use React Testing Library for user interactions
- **Integration tests**: Mock Dataverse API responses using MSW (Mock Service Worker)
- Test behavior and outputs, not implementation details
- Place test files alongside source: `SecurityService.test.ts` next to `SecurityService.ts`

**Test commands** (to be added):
```bash
npm test              # Run all tests
npm test -- --coverage # Coverage report
npm test -- --watch   # Watch mode
```

## Critical Development Rules

### Performance
- Implement virtual scrolling for lists >100 items (use `react-window`)
- Lazy load components with `React.lazy()` and `Suspense`
- Cache API responses with 5-minute TTL by default
- Use `useMemo` and `useCallback` for expensive computations in components
- Never call APIs in render methods

### Security
- Validate all user inputs before API calls
- Sanitize HTML when displaying user-generated content
- Use SecurityService for RBAC checks before showing sensitive data
- Never log sensitive data (PII, credentials) - use generic error messages
- Implement field-level security checks via SecurityService

### PCF-Specific Conventions
- Use `ControlManifest.Input.xml` for all configurable properties
- Properties must have type-safety in `IInputs` and `IOutputs`
- Always check `context.mode.isControlDisabled` before allowing interactions
- Respect `context.mode.trackContainerResize` for responsive layouts
- Use `context.factory.requestRender()` to trigger re-renders

### Code Style
- Use TypeScript strict mode (`strict: true` in tsconfig.json)
- Prefer interface over type for object shapes
- Use async/await over Promise chains
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Enum for constants, never magic strings or numbers
- Component prop names: PascalCase, functions: camelCase

## Integration Points
- **Power BI**: Use Power BI Embedded SDK, not direct REST API
- **Power Automate**: Trigger flows via HTTP triggers, pass structured JSON payloads
- **Microsoft Teams**: Use Teams Bot Framework for notifications
- **Export**: Use ExcelJS for Excel, jsPDF for PDF generation

## Common Pitfalls to Avoid
- Don't use XRM page context in PCF - use context provided by framework
- Don't mix UI library (stay consistent with FluentUI)
- Don't call `setState` after component unmounted - clean up in `useEffect` return
- Don't use `any` type - create proper interfaces
- Don't bundle large libraries - check bundle size (`npm run build` shows size)
- Don't forget to handle PCF parameters changes in `updateView()`

## File Naming Conventions
- Components: PascalCase (`TimelineView.tsx`)
- Services: PascalCase with Service suffix (`SecurityService.ts`)
- Utilities: camelCase (`dateFormatter.ts`)
- Types: PascalCase (`AuditRecord.ts` or in `types/index.ts`)
- Tests: Match source file with `.test.ts` extension

## GitHub Workflows & CI/CD

This project has automated workflows in `.github/workflows/`:

### build-pcf.yml
- **Triggers**: Push to main, PRs, manual dispatch
- **Jobs**:
  1. **Build** (Windows, Node 24): Compiles PCF, validates output, uploads artifacts
  2. **Lint** (Ubuntu, Node 24): Runs ESLint
  3. **Release** (Ubuntu, Node 24): Runs semantic-release on main branch pushes only
- **Artifacts**: 30-day retention for `out/controls/**/*`

### codeql.yml
- **Purpose**: Security scanning (JavaScript/TypeScript)
- **Triggers**: Push to main, PRs, weekly schedule (Monday 00:00 UTC)
- **Reports**: Available in GitHub Security tab

**Key files**:
- `.releaserc.json` - Semantic-release configuration
- `scripts/update-manifest-version.js` - Updates ControlManifest.Input.xml version during release

## Current Implementation Status

**✅ Implemented Features**:
- Security validation (SecurityService with permission checks)
- Settings panel with vertical tabs (Display Options, Data Refresh, About)
- Analytics dashboard components (placeholder structure)
- Advanced filtering UI with date ranges
- Card and timeline view modes
- FluentUI v9 component integration
- Semantic-release for version management
- GitHub Actions CI/CD pipeline

**⚠️ Partial/In Progress**:
- Analytics charts (structure exists, needs chart library integration)
- Export functionality (UI exists, export service not implemented)
- Caching layer (no formal CacheService yet)

**❌ Not Yet Implemented**:
- Unit/integration tests
- Power BI integration
- Power Automate integration
- Microsoft Teams notifications
- Offline storage
- Bulk restore operations

**When adding features**: Update this list and document actual implementation patterns in this file.

## Quick Reference for Common Tasks

### Adding a New Component
1. Create in `/AdvancedAuditHistory/components/[category]/`
2. Use functional component with TypeScript
3. Import FluentUI components from `@fluentui/react-components`
4. Access context via `useContext(ControlContext)` if needed
5. Add TSDoc comments with `@remarks` and `@example`

### Adding a New Service
1. Create in `/AdvancedAuditHistory/services/`
2. Use static methods (no dependency injection)
3. Export from `services/index.ts`
4. Add comprehensive TSDoc with `@param`, `@returns`, `@throws`
5. Handle Dataverse API errors (401, 403, 429, 500)

### Adding a New Custom Hook
1. Create in `/AdvancedAuditHistory/hooks/`
2. Prefix name with `use` (e.g., `useExport`)
3. Export from `hooks/index.ts`
4. Use existing hooks as patterns (see `useDataverse.tsx`)

### Modifying Security Validation
1. Edit `/AdvancedAuditHistory/services/SecurityService.ts`
2. Update validation logic in `validateAuditAccess()`
3. Ensure three-stage rendering in `AdvancedAuditHistoryApp.tsx` still works
4. Test with both admin and non-admin users

### Making a Release
1. Write commits using conventional format: `feat:`, `fix:`, `docs:`, etc.
2. Push to main (or merge PR): `git push origin main`
3. GitHub Actions runs build → lint → semantic-release
4. Check GitHub Releases for new version
5. Version auto-updates in `package.json` and `ControlManifest.Input.xml`
