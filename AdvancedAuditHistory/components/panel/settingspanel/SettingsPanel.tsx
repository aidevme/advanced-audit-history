import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerHeaderTitle,
    Button,
    Label,
    Switch,
    Divider,
    TabList,
    Tab,
    makeStyles
} from "@fluentui/react-components";
import { Dismiss24Regular } from "@fluentui/react-icons";
import * as React from "react";

const useSettingsPanelStyles = makeStyles({
    tabContainer: {
        display: 'flex',
        gap: '16px',
        height: '100%'
    },
    tabContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        paddingLeft: '16px'
    }
});

interface ISettingsPanelProps {
    /** Whether the settings panel is open */
    isOpen: boolean;
    /** Callback fired when the panel should be closed */
    onClose: () => void;
}

/**
 * SettingsPanel component provides a drawer-based settings interface for configuring audit history options.
 * 
 * @remarks
 * Uses FluentUI Drawer component for a consistent side panel experience.
 * Allows users to configure various display and filtering options for audit history.
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <SettingsPanel
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 * />
 * ```
 */
const SettingsPanel: React.FC<ISettingsPanelProps> = ({ isOpen, onClose }) => {
    const styles = useSettingsPanelStyles();
    const [selectedTab, setSelectedTab] = React.useState<string>("display");
    const [showAuditDisabledFields, setShowAuditDisabledFields] = React.useState(true);
    const [enableAutoRefresh, setEnableAutoRefresh] = React.useState(false);
    const [showFieldIcons, setShowFieldIcons] = React.useState(true);
    const [compactView, setCompactView] = React.useState(false);

    const handleSave = () => {
        // TODO: Implement settings save functionality
        console.log("Settings saved:", {
            showAuditDisabledFields,
            enableAutoRefresh,
            showFieldIcons,
            compactView
        });
        onClose();
    };

    const handleCancel = () => {
        // Reset settings or just close
        onClose();
    };

    return (
        <Drawer
            open={isOpen}
            onOpenChange={(_, { open }) => !open && onClose()}
            position="end"
            size="medium"
        >
            <DrawerHeader>
                <DrawerHeaderTitle
                    action={
                        <Button
                            appearance="subtle"
                            aria-label="Close"
                            icon={<Dismiss24Regular />}
                            onClick={onClose}
                        />
                    }
                >
                    Settings
                </DrawerHeaderTitle>
            </DrawerHeader>

            <DrawerBody>
                <div className={styles.tabContainer}>
                    <TabList
                        selectedValue={selectedTab}
                        onTabSelect={(_, data) => setSelectedTab(data.value as string)}
                        vertical
                    >
                        <Tab value="display">Display Options</Tab>
                        <Tab value="refresh">Data Refresh</Tab>
                        <Tab value="features">Features</Tab>
                        <Tab value="about">About</Tab>
                    </TabList>

                    <div className={styles.tabContent}>
                        {selectedTab === "display" && (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <Label>Show Field Type Icons</Label>
                                            <div style={{ fontSize: 12, color: '#605E5C' }}>
                                                Display icons indicating field types in dropdown
                                            </div>
                                        </div>
                                        <Switch
                                            checked={showFieldIcons}
                                            onChange={(_, data) => setShowFieldIcons(data.checked)}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <Label>Compact View</Label>
                                            <div style={{ fontSize: 12, color: '#605E5C' }}>
                                                Reduce spacing for more compact display
                                            </div>
                                        </div>
                                        <Switch
                                            checked={compactView}
                                            onChange={(_, data) => setCompactView(data.checked)}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <Label>Show Non-Auditable Fields</Label>
                                            <div style={{ fontSize: 12, color: '#605E5C' }}>
                                                Include fields with audit disabled in dropdown
                                            </div>
                                        </div>
                                        <Switch
                                            checked={showAuditDisabledFields}
                                            onChange={(_, data) => setShowAuditDisabledFields(data.checked)}
                                        />
                                    </div>
                                </div>

                                <Divider />

                                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 'auto' }}>
                                    <Button appearance="secondary" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                    <Button appearance="primary" onClick={handleSave}>
                                        Save
                                    </Button>
                                </div>
                            </>
                        )}

                        {selectedTab === "refresh" && (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <Label>Auto Refresh</Label>
                                            <div style={{ fontSize: 12, color: '#605E5C' }}>
                                                Automatically refresh audit data every 60 seconds
                                            </div>
                                        </div>
                                        <Switch
                                            checked={enableAutoRefresh}
                                            onChange={(_, data) => setEnableAutoRefresh(data.checked)}
                                        />
                                    </div>
                                </div>

                                <Divider />

                                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 'auto' }}>
                                    <Button appearance="secondary" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                    <Button appearance="primary" onClick={handleSave}>
                                        Save
                                    </Button>
                                </div>
                            </>
                        )}

                        {selectedTab === "features" && (
                            <>
                                <div style={{ fontSize: 12, color: '#605E5C' }}>
                                    <div style={{ fontSize: 16, fontWeight: 600, color: '#323130', marginBottom: 8 }}>
                                        Available Features
                                    </div>
                                    <div style={{ marginTop: 16 }}>
                                        <Label weight="semibold">Core Capabilities:</Label>
                                        <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 1.8 }}>
                                            <li><strong>Comprehensive Audit Tracking</strong> - View detailed audit history with field-level changes</li>
                                            <li><strong>Advanced Search & Filtering</strong> - Filter by users, action types, date ranges, and field changes</li>
                                            <li><strong>Multiple View Types</strong> - Switch between Card and Timeline views</li>
                                            <li><strong>Export Capabilities</strong> - Export audit data to Excel, CSV, or PDF formats</li>
                                            <li><strong>Security Validation</strong> - Built-in permission checks and audit enablement verification</li>
                                            <li><strong>Localization Support</strong> - Available in 20+ languages</li>
                                        </ul>
                                    </div>
                                    <div style={{ marginTop: 16 }}>
                                        <Label weight="semibold">Coming Soon:</Label>
                                        <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 1.8 }}>
                                            <li><strong>Analytics Dashboard</strong> - Visualize audit trends and patterns</li>
                                            <li><strong>Power Automate Integration</strong> - Trigger flows based on audit events</li>
                                            <li><strong>Power BI Integration</strong> - Deep analytics and reporting</li>
                                            <li><strong>Bulk Restore</strong> - Restore multiple field values from audit history</li>
                                        </ul>
                                    </div>
                                </div>

                                <Divider />

                                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 'auto' }}>
                                    <Button appearance="primary" onClick={onClose}>
                                        Close
                                    </Button>
                                </div>
                            </>
                        )}

                        {selectedTab === "about" && (
                            <>
                                <div style={{ fontSize: 12, color: '#605E5C' }}>
                                    <div style={{ fontSize: 16, fontWeight: 600, color: '#323130', marginBottom: 8 }}>
                                        Advanced Audit History Control
                                    </div>
                                    <div style={{ marginBottom: 4 }}>Version 2.0.0</div>
                                    <div style={{ marginTop: 16, lineHeight: 1.5 }}>
                                        Enterprise-grade audit tracking for Dynamics 365 and Power Platform.
                                    </div>
                                    <div style={{ marginTop: 16 }}>
                                        <Label weight="semibold">Features:</Label>
                                        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                                            <li>Comprehensive audit history visualization</li>
                                            <li>Advanced filtering and search capabilities</li>
                                            <li>Analytics dashboard with trend analysis</li>
                                            <li>Multiple view types (Card, Timeline)</li>
                                            <li>Security validation and access control</li>
                                        </ul>
                                    </div>
                                </div>

                                <Divider />

                                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 'auto' }}>
                                    <Button appearance="primary" onClick={onClose}>
                                        Close
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </DrawerBody>
        </Drawer>
    );
};

export default SettingsPanel;
