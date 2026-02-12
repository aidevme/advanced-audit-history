import { Button, Dropdown, Option, OptionOnSelectData, SelectionEvents } from "@fluentui/react-components";
import * as React from "react";
import Select, { ActionMeta, MultiValue, SingleValue, StylesConfig } from 'react-select'
import { Attribute } from "../../interfaces/attributes";
import { useContext, useMemo, useState } from "react";
import { ArrowClockwiseRegular, ArrowSortDownLinesRegular, ArrowSortUpLinesRegular, Calendar16Regular } from '@fluentui/react-icons';
import { ControlContext } from "../../context/control-context";
import { DatePicker } from 'antd';
import * as dayjs from "dayjs";
import { PickerLocale } from "antd/es/date-picker/generatePicker";
import { isNullOrEmpty } from "../../utils/utils";

interface IProps {
    order: 'descending' | 'ascending'
    attributes: Attribute[],
    onFieldsChanged: (attributes: string[]) => void,
    onRefresh: () => void;
    onAuditSortOrderChanged: (order: 'descending' | 'ascending') => void,
    onDateRangeSelected: (dateRange: DateRange) => void
}

interface AttributeOption {
    value: string;
    label: string;
}

export interface DateRange {
    startDate?: Date;
    endDate?: Date;
}

const searchBoxStyles: StylesConfig<AttributeOption> = {
    container: (provided) => ({
        ...provided,
        width: '100%',
    }),
};

const { RangePicker } = DatePicker;

const Header = ({ order, attributes, onFieldsChanged, onDateRangeSelected, onRefresh, onAuditSortOrderChanged }: IProps) => {
    const { resources } = useContext(ControlContext);
    
    const onFieldSelected = (options: SingleValue<AttributeOption> | MultiValue<AttributeOption>, _: ActionMeta<AttributeOption>) => {
        const selectedOptions = (options as MultiValue<AttributeOption>)?.map((o: {value: string, label: string}) => {
            return o.value
        });

        onFieldsChanged(selectedOptions);
    }

    const handleDateChange = (dateStrings: [string, string]) => {
        const startDate = isNullOrEmpty(dateStrings[0]) ? undefined : new Date(dateStrings[0]);
        startDate?.setHours(0, 0, 0, 0);
        const endDate = isNullOrEmpty(dateStrings[1]) ? undefined : new Date(dateStrings[1]);
        startDate?.setHours(0, 0, 0, 0);
        onDateRangeSelected({ startDate, endDate })
    };

    const sortedAttributes = useMemo(() => {
        return attributes.filter((item) => item.displayName)
        .sort((a, b) => a.displayName!.localeCompare(b.displayName!))
        .map((attribute) => ({
            value: attribute.logicalName,
            label: attribute.displayName || attribute.logicalName,
        }))
    }, [attributes])

    const onOrderChanged = () => {
        onAuditSortOrderChanged(order == "ascending" ? "descending" : "ascending")
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 8}}>
            <Select 
                options={sortedAttributes}
                isMulti={true}
                isClearable={true}
                closeMenuOnSelect={false}
                onChange={onFieldSelected}
                styles={searchBoxStyles}
                placeholder={resources.getString("dropdown-placeholder")}
            />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
                    <RangePicker
                        allowClear
                        placeholder={[resources.getString("start-date"), resources.getString("end-date")]}
                        onChange={(_, dateStrings) => handleDateChange(dateStrings)}
                    />
                    <Button
                        icon={ order == "ascending" ? <ArrowSortDownLinesRegular /> : <ArrowSortUpLinesRegular />} 
                        onClick={onOrderChanged} 
                        appearance="outline"
                        >
                        {
                            order == "ascending" ? 
                            resources.getString("sort-descending") 
                            : resources.getString("sort-ascending")
                        }
                    </Button>
                </div>
                <Button onClick={onRefresh} icon={<ArrowClockwiseRegular />} />
            </div>
        </div>
    );
}

export default Header;