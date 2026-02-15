/**
 * Extended Mode interface for PCF runtime properties not in official SDK types.
 * 
 * @remarks
 * This interface extends the standard ComponentFramework.Mode to include
 * undocumented properties that exist at runtime but are not in the TypeScript
 * type definitions.
 * 
 * Properties:
 * - isAuthoringMode: Indicates if the control is running in the test harness
 * - contextInfo: Contains entity context information (entityId, entityTypeName)
 */
export interface ExtendedMode extends ComponentFramework.Mode {
    /**
     * Indicates whether the control is running in authoring/test harness mode.
     * 
     * @remarks
     * This property is undefined in live environments and true in the test harness.
     * Use `!== true` to detect live environments.
     */
    isAuthoringMode?: boolean;

    /**
     * Provides context information about the current entity record.
     * 
     * @remarks
     * Available in live environments when control is bound to a form.
     * May be undefined in test harness or standalone scenarios.
     */
    contextInfo?: {
        /** GUID of the current entity record */
        entityId?: string;
        /** Logical name of the current entity (e.g., "account", "contact") */
        entityTypeName?: string;
    };
}
