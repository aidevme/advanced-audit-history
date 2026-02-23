/**
 * Helper for rendering attribute type icons in the dropdown.
 */

import * as React from "react";
import { Icons } from "./IconTools";

/**
 * Returns the icon element for a given attribute type name.
 *
 * @param attributeTypeName - The attribute type name
 * @returns React element for the icon
 */
export const getAttributeTypeIcon = (attributeTypeName?: string): JSX.Element => {
    switch (attributeTypeName) {
        case "UniqueidentifierType":
            return <Icons.UniqiueIdentifier />;
        case "StringType":
            return <Icons.TextField />;
        case "MemoType":
            return <Icons.MultipleTextField />;
        // Numbers
        case "IntegerType":
            return <Icons.WholeNumber />;
        case "DecimalType":
            return <Icons.DecimalNumber />;
        case "DoubleType":
            return <Icons.FloatingPointNumber />;
        case "BigIntType":
            return <Icons.WholeNumber />;
        case "DateTimeType":
            return <Icons.Calendar16 />;
        // Currency type
        case "MoneyType":
            return <Icons.Currency />;
        // Choice fields: Choice, Picklist, Boolean
        case "PicklistType":
            return <Icons.Choice />;
        case "BooleanType":
            return <Icons.YesNo />;
        // File and Image types - using Document icon as placeholder
        case "FileType":
            return <Icons.File />;
        case "ImageType":
            return <Icons.Image />;
        // Lookup and Customer types
        case "LookupType":
            return <Icons.Lookup />;
        case "CustomerType":
            return <Icons.Customer />;
        case "OwnerType":
            return <Icons.Owner />;

        case "StateType":
            return <Icons.Choice />;
        case "StatusType":
            return <Icons.Choice />;
        // Default value for unsupported or undefined types
        default:
            return <Icons.Question />;
    }
};
