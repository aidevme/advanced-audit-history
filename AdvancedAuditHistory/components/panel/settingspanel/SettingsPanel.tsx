import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerHeaderTitle,
    Button,
    Label,
    Switch,
    Checkbox,
    Divider,
    TabList,
    Tab,
    Field,
    Persona
} from "@fluentui/react-components";
import { Icons } from '../../../tools/IconTools';
import { useSettingsPanelStyles } from './SettingsPanelStyles';
import { CustomColorPanel } from './components/CustomColorPanel';
import { ExceptionsPanel } from './components/ExceptionsPanel';
import { ControlContext } from '../../../context/control-context';
import { Attribute } from '../../../interfaces';
import * as React from "react";

interface ISettingsPanelProps {
    /** Whether the settings panel is open */
    isOpen: boolean;
    /** Callback fired when the panel should be closed */
    onClose: () => void;
    /** Array of entity attributes to display in exceptions panel */
    attributes: Attribute[];
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
const SettingsPanel: React.FC<ISettingsPanelProps> = ({ isOpen, onClose, attributes }) => {
    const styles = useSettingsPanelStyles();
    const { resources } = React.useContext(ControlContext);
    const [selectedTab, setSelectedTab] = React.useState<string>("display");
    const [showAuditDisabledFields, setShowAuditDisabledFields] = React.useState(true);
    const [enableAutoRefresh, setEnableAutoRefresh] = React.useState(false);
    const [showFieldIcons, setShowFieldIcons] = React.useState(true);
    const [compactView, setCompactView] = React.useState(false);
    const [enableGraph, setEnableGraph] = React.useState(false);
    const [enablePureview, setEnablePureview] = React.useState(false);
    const [userFilter, setUserFilter] = React.useState<string[]>([]);
    const [useCustomColors, setUseCustomColors] = React.useState(false);

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
            size="large"
        >
            <DrawerHeader>
                <DrawerHeaderTitle
                    action={
                        <Button
                            appearance="subtle"
                            aria-label="Close"
                            icon={<Icons.Dismiss24 />}
                            onClick={onClose}
                        />
                    }
                >
                    {resources.getString("settings-panel-title")}
                </DrawerHeaderTitle>
            </DrawerHeader>

            <DrawerBody>
                <div className={styles.drawerBodyContainer}>
                    <div className={styles.tabsScrollContainer}>
                        <div className={styles.tabContainer}>
                            <TabList
                                selectedValue={selectedTab}
                                onTabSelect={(_, data) => setSelectedTab(data.value as string)}
                                vertical
                            >
                                <Tab value="display">{resources.getString("settings-panel-tab-display")}</Tab>
                                <Tab value="refresh">{resources.getString("settings-panel-tab-refresh")}</Tab>
                                <Tab value="integrations">{resources.getString("settings-panel-tab-integrations")}</Tab>
                                <Tab value="exceptions">{resources.getString("settings-panel-tab-exceptions")}</Tab>
                                <Tab value="about">{resources.getString("settings-panel-tab-about")}</Tab>
                            </TabList>

                            <div className={styles.tabContent}>
                                {selectedTab === "display" && (
                                    <>
                                        <div className={styles.settingsGroup}>
                                            <Field>
                                                <div className={styles.settingRow}>
                                                    <div>
                                                        <Label>{resources.getString("settings-panel-show-field-icons-label")}</Label>

                                                    </div>
                                                    <Switch
                                                        checked={showFieldIcons}
                                                        onChange={(_, data) => setShowFieldIcons(data.checked)}
                                                    />
                                                </div>
                                                <Label size="small" className={styles.fieldDescription}>
                                                    {resources.getString("settings-panel-show-field-icons-description")}
                                                </Label>
                                            </Field>

                                            <Field>
                                                <div className={styles.settingRow}>
                                                    <div>
                                                        <Label>{resources.getString("settings-panel-show-non-auditable-fields-label")}</Label>

                                                    </div>
                                                    <Switch
                                                        checked={showAuditDisabledFields}
                                                        onChange={(_, data) => setShowAuditDisabledFields(data.checked)}
                                                    />
                                                </div>
                                                <Label size="small" className={styles.fieldDescription}>
                                                    {resources.getString("settings-panel-show-non-auditable-fields-description")}
                                                </Label>
                                            </Field>

                                            <Field>
                                                <div className={styles.settingRow}>
                                                    <div>
                                                        <Label>{resources.getString("settings-panel-use-custom-colors-label")}</Label>

                                                    </div>
                                                    <Switch
                                                        checked={useCustomColors}
                                                        onChange={(_, data) => setUseCustomColors(data.checked)}
                                                    />
                                                </div>
                                                <Label size="small" className={styles.fieldDescription}>
                                                    {resources.getString("settings-panel-use-custom-colors-description")}
                                                </Label>
                                            </Field>
                                            {useCustomColors && <CustomColorPanel />}
                                        </div>
                                    </>
                                )}

                                {selectedTab === "refresh" && (
                                    <>
                                        <div className={styles.settingsGroup}>
                                            <Field>
                                                <div className={styles.settingRow}>
                                                    <div>
                                                        <Label>{resources.getString("settings-panel-auto-refresh-label")}</Label>

                                                    </div>
                                                    <Switch
                                                        checked={enableAutoRefresh}
                                                        onChange={(_, data) => setEnableAutoRefresh(data.checked)}
                                                    />
                                                </div>
                                                <Label size="small" className={styles.fieldDescription}>
                                                    {resources.getString("settings-panel-auto-refresh-description")}
                                                </Label>
                                            </Field>
                                        </div>
                                    </>
                                )}

                                {selectedTab === "integrations" && (
                                    <>
                                        <div className={styles.settingsGroup}>
                                            <Field>
                                                <div className={styles.settingRow}>
                                                    <div>
                                                        <Label>{resources.getString("settings-panel-enable-graph-label")}</Label>

                                                    </div>
                                                    <Switch
                                                        checked={enableGraph}
                                                        onChange={(_, data) => setEnableGraph(data.checked)}
                                                    />
                                                </div>
                                                <Label size="small" className={styles.fieldDescription}>
                                                    {resources.getString("settings-panel-enable-graph-description")}
                                                </Label>
                                            </Field>

                                            <Field>
                                                <div className={styles.settingRow}>
                                                    <div>
                                                        <Label>{resources.getString("settings-panel-enable-pureview-label")}</Label>

                                                    </div>
                                                    <Switch
                                                        checked={enablePureview}
                                                        onChange={(_, data) => setEnablePureview(data.checked)}
                                                    />
                                                </div>
                                                <Label size="small" className={styles.fieldDescription}>
                                                    {resources.getString("settings-panel-enable-pureview-description")}
                                                </Label>
                                            </Field>
                                        </div>
                                    </>
                                )}

                                {selectedTab === "exceptions" && (
                                    <>
                                        <div className={styles.settingsGroup}>
                                            <ExceptionsPanel attributes={attributes} />
                                        </div>
                                    </>
                                )}

                                {selectedTab === "about" && (
                                    <>
                                        <div className={styles.aboutContainer}>
                                            <div className={styles.aboutContent}>
                                                <div className={styles.aboutTitle}>
                                                    {resources.getString("settings-panel-about-title")}
                                                </div>
                                                <div className={styles.aboutVersion}>{resources.getString("settings-panel-about-version")}</div>
                                                <div className={styles.aboutDescription}>
                                                    {resources.getString("settings-panel-about-description")}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={styles.buttonsContainer}>
                        <Button appearance="primary" onClick={handleSave}>
                            {resources.getString("settings-panel-button-save")}
                        </Button>
                        <Button appearance="secondary" onClick={handleCancel}>
                            {resources.getString("settings-panel-button-cancel")}
                        </Button>

                    </div>
                </div>
            </DrawerBody>
        </Drawer>
    );
};

export default SettingsPanel;
