import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerHeaderTitle,
    Button,
    Label,
    Switch,
    Divider
} from "@fluentui/react-components";
import { Dismiss24Regular } from "@fluentui/react-icons";
import * as React from "react";

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
    const [showAuditDisabledFields, setShowAuditDisabledFields] = React.useState(false);
    const [enableAutoRefresh, setEnableAutoRefresh] = React.useState(false);
    const [showFieldIcons, setShowFieldIcons] = React.useState(true);
    const [compactView, setCompactView] = React.useState(false);

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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Display Settings Section */}
                    <div>
                        <Label weight="semibold" style={{ fontSize: 16, marginBottom: 12, display: 'block' }}>
                            Display Options
                        </Label>
                        
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
                    </div>

                    <Divider />

                    {/* Data Refresh Settings Section */}
                    <div>
                        <Label weight="semibold" style={{ fontSize: 16, marginBottom: 12, display: 'block' }}>
                            Data Refresh
                        </Label>
                        
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
                    </div>

                    <Divider />

                    {/* About Section */}
                    <div>
                        <Label weight="semibold" style={{ fontSize: 16, marginBottom: 12, display: 'block' }}>
                            About
                        </Label>
                        <div style={{ fontSize: 12, color: '#605E5C' }}>
                            <div>Advanced Audit History Control</div>
                            <div>Version 2.0.0</div>
                            <div style={{ marginTop: 8 }}>
                                Enterprise-grade audit tracking for Dynamics 365
                            </div>
                        </div>
                    </div>
                </div>
            </DrawerBody>
        </Drawer>
    );
};

export default SettingsPanel;
