import { IInputs } from "../../generated/ManifestTypes";

/**
 * Extended PCF Context interface with undocumented page property
 * 
 * @remarks
 * This interface extends the standard PCF Context to include the `page` property
 * which provides access to client URL and other page-level context not exposed
 * in the official PCF SDK types.
 * 
 * The `page.getClientUrl()` method is particularly useful for constructing
 * direct Web API requests to Dataverse endpoints.
 * 
 * @example
 * ```typescript
 * const extendedContext = context as ExtendedContext;
 * const clientUrl = extendedContext.page?.getClientUrl?.() ?? '';
 * const apiUrl = `${clientUrl}/api/data/v9.2/entities`;
 * ```
 */
export interface ExtendedContext extends ComponentFramework.Context<IInputs> {
    /**
     * Page context with client URL accessor
     */
    page?: {
        /**
         * Get the client URL for the current Dataverse environment
         * @returns The base URL for the organization (e.g., "https://org.crm.dynamics.com")
         */
        getClientUrl?: () => string;
    };
}
