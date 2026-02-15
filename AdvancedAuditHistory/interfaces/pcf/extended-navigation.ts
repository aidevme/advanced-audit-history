/**
 * Extended Navigation interface for undocumented PCF navigation methods.
 * 
 * @remarks
 * This interface extends the standard ComponentFramework.Navigation to include
 * the navigateTo method which exists at runtime but is not in the official
 * TypeScript type definitions.
 * 
 * The navigateTo method is useful for maintaining control state during
 * navigation operations, unlike the standard openForm method.
 */
export interface ExtendedNavigation extends ComponentFramework.Navigation {
    /**
     * Navigates to a specific page with popup options.
     * 
     * @param pageInput - Page input parameters (entityName, entityId, pageType)
     * @param navigationOptions - Optional navigation options (height, width, target, position)
     * @returns Promise that resolves when navigation completes
     * 
     * @remarks
     * This method maintains the control's state alive during navigation,
     * which is beneficial for maintaining context in PCF controls.
     * 
     * @example
     * ```typescript
     * const navigation = context.navigation as ExtendedNavigation;
     * await navigation.navigateTo(
     *   { entityName: 'account', entityId: guid, pageType: 'entityrecord' },
     *   { height: { value: 80, unit: '%' }, width: { value: 70, unit: '%' } }
     * );
     * ```
     */
    navigateTo(pageInput: unknown, navigationOptions?: unknown): Promise<void>;
}
