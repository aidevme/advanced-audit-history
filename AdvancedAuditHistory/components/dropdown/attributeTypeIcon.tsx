/**
 * Helper for rendering attribute type icons in the dropdown.
 */

import * as React from "react";
import { Icons } from "../../tools/IconTools";

/**
 * Returns the icon element for a given attribute type name.
 *
 * @param attributeTypeName - The attribute type name
 * @returns React element for the icon
 */
export const getAttributeTypeIcon = (attributeTypeName?: string): JSX.Element => {
    switch (attributeTypeName) {
        case "UniqueIdentifierType":
            return <Icons.UniqiueIdentifier />;
        case "StringType":
            return <Icons.TextField />;
        case "MemoType":
            return <Icons.MultipleTextField />;
        case "IntegerType":
            return <Icons.MultipleTextField />;
        case "DoubleType":
            return <Icons.MultipleTextField />;
        case "PicklistType":
            return <Icons.Choice />;
        default:
            return <Icons.Question />;
    }
};
