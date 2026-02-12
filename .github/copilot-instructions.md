# GitHub Copilot Instructions - Advanced Audit History PCF Control

## Project Overview
Enterprise-grade PowerApps Component Framework (PCF) control for Dynamics 365/Power Platform audit history management. Built with TypeScript, React 18+, and follows a strict layered architecture pattern.

## Architecture Pattern
This project uses a **4-layer architecture**. Always maintain strict separation:

1. **Presentation Layer** (`/AuditHistory/components/`) - React components only, no business logic
2. **PCF Control Layer** (`/AuditHistory/index.ts`) - PCF lifecycle, Redux state management, event handlers
3. **Service Layer** (`/AuditHistory/services/`) - All business logic encapsulated in services (AuditService, ExportService, NotificationService, AnalyticsSvc, FilterService, CacheService, SecurityService)
4. **Data Access Layer** (`/AuditHistory/data/`) - Web API clients, OData query builders, caching

**Never mix layers**: Components call services, services call data access layer, data layer communicates with Dataverse.

## Key Development Patterns

### PCF Control Entry Point (`index.ts`)
- Implement standard PCF lifecycle: `init()`, `updateView()`, `getOutputs()`, `destroy()`
- Use Redux for state management, not React useState at the control level
- Always handle context binding changes in `updateView()`
- Properly dispose resources in `destroy()` to prevent memory leaks

### Service Layer Pattern
```typescript
// Services are singleton classes with dependency injection
class AuditService {
  constructor(private webApiClient: IWebApiClient, private cache: ICacheService) {}
  
  async getAuditHistory(entityId: string, filters: FilterOptions): Promise<AuditRecord[]> {
    // 1. Check cache first
    // 2. Build OData query
    // 3. Call API
    // 4. Transform response
    // 5. Update cache
  }
}
```

### Component Structure
- Use **FluentUI components** as the primary UI framework for Dynamics 365 consistency
- All components in `/components/` must be functional components with TypeScript
- Use custom hooks for shared logic (`/hooks/useAuditData.ts`, `/hooks/useFilters.ts`)
- Prop interfaces must be defined in component files or `/types/`

### Dataverse Integration
- Use Web API, not XRM/Client API (PCF best practice)
- Build OData queries with `QueryBuilder` class for type safety
- Always implement proper error handling for 401, 403, 429, 500 responses
- Use batch requests for multiple operations to reduce API calls
- Respect Dataverse API limits (no more than 6000 requests per 5 minutes per user)

### State Management
- Use Redux Toolkit for state management
- Slice structure: `/store/slices/auditSlice.ts`, `/store/slices/filterSlice.ts`, etc.
- Use RTK Query for API calls and caching
- Never mutate state directly - use reducers

### Localization
- String resources in `/localization/` using `.resx` files (PCF standard)
- Support 20+ languages as documented in README
- Use resource keys, never hardcoded strings: `context.resources.getString("FilterLabel")`

## Build & Development Commands

```bash
npm start watch          # Development with hot reload (harness test)
npm run build           # Production build
npm test                # Run Jest tests
npm run lint            # ESLint check
npm run package         # Create PCF solution package
pac pcf push            # Push to test environment
```

## Testing Requirements
- **Unit tests**: All services must have >80% coverage using Jest
- **Component tests**: Use React Testing Library, test user interactions
- **Integration tests**: Mock Dataverse API responses using MSW (Mock Service Worker)
- Never test implementation details, test behavior and outputs
- Test files alongside source: `AuditService.test.ts` next to `AuditService.ts`

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
- Services: PascalCase with Service suffix (`AuditService.ts`)
- Utilities: camelCase (`dateFormatter.ts`)
- Types: PascalCase (`AuditRecord.ts` or in `types/index.ts`)
- Tests: Match source file with `.test.ts` extension
