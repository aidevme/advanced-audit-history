import { IInputs } from "../generated/ManifestTypes";

/**
 * Extended Navigation interface with undocumented PCF methods
 * navigateTo exists at runtime but is not included in official PCF SDK types
 */
interface ExtendedNavigation extends ComponentFramework.Navigation {
    navigateTo(pageInput: unknown, navigationOptions?: unknown): Promise<void>;
}

const popupOtions = {
    height: { value: 85, unit: "%" },
    width: { value: 90, unit: "%" },
    target: 2,
    position: 1
}

export const useNavigation = (context: ComponentFramework.Context<IInputs>) => {
    const openForm = async (entityName: string, id?: string): Promise<void> => {
        const pageInput = {
            entityName: entityName,
            entityId: id,
            pageType: "entityrecord"
        }

        // Cast to extended interface to access navigateTo method
        // This method maintains control state alive during navigation
        const navigation = context.navigation as ExtendedNavigation;
        await navigation.navigateTo(pageInput, popupOtions);
    }

    const openConfirmationDialog = async (): Promise<boolean> => {
        const response = await context.navigation.openConfirmDialog(
            {
                title: context.resources.getString("restore-title"),
                text: context.resources.getString("restore-description"),
                confirmButtonLabel: context.resources.getString("confirm-button"),
                cancelButtonLabel: context.resources.getString("cancel-button"),
            }
        );

        return response.confirmed;
    }

    return {
        openForm,
        openConfirmationDialog
    }
}