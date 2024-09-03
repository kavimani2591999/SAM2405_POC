import Logger from '../Log/Logger';
import libDoc from '../Documents/DocumentLibrary';
import libCom from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import DocumentsIsVisible from '../Documents/DocumentsIsVisible';
import EnableNotificationCreate from '../UserAuthorizations/Notifications/EnableNotificationCreate';
import MeasuringPointsTakeReadingsIsVisible from '../Measurements/Points/MeasuringPointsTakeReadingsIsVisible';
import IsGISEnabled from '../Maps/IsGISEnabled';
import IsS4Visible from '../S4RelatedHistories/IsS4Visible';
import IsOnlineSearchEnabled from '../OnlineSearch/IsOnlineSearchEnabled';
import NetworkLib from '../Common/Library/NetworkMonitoringLibrary';
import PersonaLibrary from '../Persona/PersonaLibrary';
import EnableWorkOrderCreate from '../UserAuthorizations/WorkOrders/EnableWorkOrderCreate';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

class QABSettingsHelpers {
    constructor(context) {
        this._context = context;
    }

    /**
     * Create QAB chip
     * @param {Object?} props QAB chip properties
     * @param {String} props.Label Chip label. Used in QAB extension and as label on QAB settings page, must be set if it is not Settings button
     * @param {String} props.Icon Chip icon. Used in QAB extension only, must be set since all buttons displayed with icon
     * @param {Boolean} props.IsIconVisible Chip icon visibility. Used in QAB extension only, hardcoded as true since all buttons displayed with icon
     * @param {Boolean} props.IsButtonVisible Chip button visibility. Used in QAB extension only, determines if button is visible or not
     * @param {Boolean} props.IsButtonEnabled Chip button enabled. Used in QAB extension only, determines if button is enabled or not, hardcoded as true since all visbile buttons should be enabled
     * @param {String} props.Action Chip action. Used in QAB extension only, determines action to be executed on button press
     * @param {Boolean} props.IsButtonVisibleBySettings Chip button visibility by settings. Used only in purpose to determine button visiblity by settings
     * @param {String} props._Name Chip name. Used only for settings as unique key of button, must be unique per page
     * @param {Boolean} props.IsEnabled Chip enabled. Determines if chip is enabled or not by feature, app param and etc
     * @returns
     */
    _createChip(props = {}) {
        return { ...{
            'IsIconVisible': true,
            'IsButtonEnabled': true,
            'IsButtonVisibleBySettings': true,
        }, ...props};
    }

    _createAddNotificationChip(props = {}) {
        const enableCreate = EnableNotificationCreate(this._context);

        return this._createChip({ ...{
            'Label': this._context.localizeText('create_notification'),
            'Icon': '$(PLT,/SAPAssetManager/Images/QABAddNotification.png,/SAPAssetManager/Images/QABAddNotification.android.png)',
            'IsEnabled': enableCreate,
            'IsButtonEnabled': enableCreate,
            'IsButtonVisible': enableCreate,
            'Action': '/SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateChangeSetNav.js',
            '_Name': 'ADD_NOTIFICATION',
        }, ...props});
    }

    _createAddWorkOrderChip(props = {}) {
        const enableCreate =  EnableWorkOrderCreate(this._context);

        return this._createChip({ ...{
            'Label': this._context.localizeText('create_workorder'),
            'Icon': '$(PLT,/SAPAssetManager/Images/QABAddWO.png,/SAPAssetManager/Images/QABAddWO.android.png)',
            'IsEnabled': enableCreate,
            'IsButtonEnabled': enableCreate,
            'IsButtonVisible': enableCreate,
            'Action': '/SAPAssetManager/Rules/WorkOrders/CreateUpdate/WorkOrderCreateNav.js',
            '_Name': 'ADD_WORK_ORDER',
        }, ...props});
    }

    _createAddNotificationChipWCMDetailsPage() {
        return this._createAddNotificationChip({
            'Label': this._context.localizeText('add_notification'),
            'Action': '/SAPAssetManager/Rules/WCM/QAB/WCMQABCreateNotification.js',
        });
    }

    _createViewMapChip(props = {}) {
        const isMapEnabled = IsGISEnabled(this._context);

        return this._createChip({ ...{
            'Label': this._context.localizeText('view_map'),
            'Icon': '$(PLT,/SAPAssetManager/Images/QABViewMap.png,/SAPAssetManager/Images/QABViewMap.android.png)',
            'IsEnabled': true,
            'IsButtonEnabled': isMapEnabled,
            'IsButtonVisible': true,
            'Action': '',
            '_Name': 'VIEW_MAP',
        }, ...props});
    }

    async _createDownloadDocumentsChip(props = {}) {
        const documentsIsVisible = DocumentsIsVisible(this._context);
        const enable = libCom.getAppParam(this._context, 'USER_AUTHORIZATIONS', 'Enable.MD.Create') === 'Y';
        const noAvailableDocuments = await libDoc.checkIfNoDocumentsAvailableForDownload(this._context);

        return this._createChip({ ...{
            'Label': this._context.localizeText('qab_download_documents'),
            'Icon': '$(PLT,/SAPAssetManager/Images/QABDonwloadAttachments.png,/SAPAssetManager/Images/QABDonwloadAttachments.android.png)',
            'IsEnabled': enable,
            'IsButtonEnabled': enable && documentsIsVisible && !noAvailableDocuments,
            'IsButtonVisible': enable,
            'Action': '/SAPAssetManager/Rules/Documents/DownloadDocuments/DownloadDocumentsNav.js',
            '_Name': 'DOWNLOAD_DOCUMENTS',
        }, ...props});
    }

    _createRecordTimeChip(props = {}) {
        return this._createChip({ ...{
            'Label': this._context.localizeText('record_time'),
            'Icon': '$(PLT,/SAPAssetManager/Images/QABAddTime.png,/SAPAssetManager/Images/QABAddTime.android.png)',
            'IsEnabled': true,
            'IsButtonEnabled': true,
            'IsButtonVisible': true,
            'Action': '',
            '_Name': 'RECORD_TIME',
        }, ...props});
    }

    async _createTakeReadingsChip(props = {}) {
        const PMMeasurementEnabled = userFeaturesLib.isFeatureEnabled(this._context, this._context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMMeasurement.global').getValue());
        const enable = libCom.getAppParam(this._context, 'USER_AUTHORIZATIONS', 'Enable.MD.Create') === 'Y' && ((PersonaLibrary.isMaintenanceTechnician(this._context) || PersonaLibrary.isFieldServiceTechnicianInCSMode(this._context)));
        return this._createChip({ ...{
            'Label': this._context.localizeText('take_readings'),
            'Icon': '$(PLT,/SAPAssetManager/Images/QABTakeReadings.png,/SAPAssetManager/Images/QABTakeReadings.android.png)',
            'IsEnabled': enable && PMMeasurementEnabled,
            'IsButtonEnabled': enable && await MeasuringPointsTakeReadingsIsVisible(this._context),
            'IsButtonVisible': enable && PMMeasurementEnabled,
            'Action': '/SAPAssetManager/Rules/Measurements/Points/MeasuringPointsDataEntryNavWrapper.js',
            '_Name': 'TAKE_READINGS',
        }, ...props});
    }

    _createAddServiceOrderChip(props = {}) {
        const enable = IsS4Visible(this._context);

        return this._createChip({ ...{
            'Label': this._context.localizeText('qab_create_service_order'),
            'Icon': '$(PLT,/SAPAssetManager/Images/QABAddWO.png,/SAPAssetManager/Images/QABAddWO.android.png)',
            'IsButtonVisible': enable,
            'IsButtonEnabled': enable,
            'IsEnabled': enable,
            'Action': '/SAPAssetManager/Rules/ServiceOrders/CreateUpdate/ServiceOrderCreateNav.js',
            '_Name': 'ADD_SERVICE_ORDER',
        }, ...props});
    }

    _createAddServiceRequestChip(props = {}) {
        const enable = IsS4Visible(this._context);

        return this._createChip({...{
            'Label': this._context.localizeText('qab_create_service_request'),
            'Icon': '$(PLT,/SAPAssetManager/Images/QABAddNotification.png,/SAPAssetManager/Images/QABAddNotification.android.png)',
            'IsButtonVisible': enable,
            'IsButtonEnabled': enable,
            'IsEnabled': enable,
            'Action': '/SAPAssetManager/Rules/ServiceOrders/CreateUpdate/ServiceRequestCreateNav.js',
            '_Name': 'ADD_SERVICE_REQUEST',
        }, ...props});
    }

    _createAddServiceConfirmationChip(props = {}) {
        return this._createChip({ ...{
            'Label': this._context.localizeText('qab_create_service_confirmation'),
            'Icon': '$(PLT,/SAPAssetManager/Images/QABAddConfirmation.png,/SAPAssetManager/Images/QABAddConfirmation.android.png)',
            'IsButtonVisible': true,
            'IsButtonEnabled': true,
            'IsEnabled': true,
            'Action': '/SAPAssetManager/Rules/ServiceConfirmations/CreateUpdate/ServiceConfirmationCreateNav.js',
            '_Name': 'ADD_SERVICE_CONFIRMATION',
        }, ...props});
    }

    _createAddWCMNoteChip(props = {}) {
        return this._createChip({ ...{
            'Label': this._context.localizeText('add_note'),
            'Icon': '$(PLT,/SAPAssetManager/Images/QABAddNote.png,/SAPAssetManager/Images/QABAddNote.android.png)',
            'IsButtonVisible': true,
            'IsEnabled': true,
            'Action': '/SAPAssetManager/Rules/WCM/WCMNotes/WCMNoteAddNav.js',
            '_Name': 'ADD_WCM_NOTE',
        }, ...props});
    }

    _onlineSearch(props = {}) {
        const enable = IsOnlineSearchEnabled(this._context) &&
            (PersonaLibrary.isFieldServiceTechnicianPro(this._context) ||
            PersonaLibrary.isMaintenanceTechnician(this._context));
        const isNetworkConnected = NetworkLib.isNetworkConnected(this._context);

        return this._createChip({ ...{
            'Label': this._context.localizeText('online_search'),
            'Icon': '$(PLT,/SAPAssetManager/Images/QABOnlineSearch.png,/SAPAssetManager/Images/QABOnlineSearch.android.png)',
            'IsEnabled': enable,
            'IsButtonEnabled': isNetworkConnected && enable,
            'IsButtonVisible': enable,
            'Action': '/SAPAssetManager/Rules/OnlineSearch/ExecuteNavToOnlineSearchPage.js',
            '_Name': 'ONLINE_SEARCH',
        }, ...props});
    }
}

export default class QABSettings extends QABSettingsHelpers {
    constructor(context, preferenceName, extensionName = 'QuickActionBarExtensionSection') {
        super(context.constructor.name === 'PageProxy' ? context : context.getPageProxy());

        this._extension = null;
        this._chips = [];
        this._extensionName = extensionName;
        this._preferenceName = preferenceName || this.getPreferenceName();

        this._saveInstance();
    }

    getExtension() {
        if (libVal.evalIsEmpty(this._extension)) {
            let extensionSection = libCom.getSectionByName(this._context, this._extensionName);
            if (libVal.evalIsEmpty(extensionSection)) {
                const pageContext = this._context.evaluateTargetPathForAPI(`#Page:${this._preferenceName.split('-')[1]}`);
                extensionSection = libCom.getSectionByName(pageContext, this._extensionName);
            }

            try {
                this._extension = extensionSection.getExtensions()[0];
            } catch (error) {
                Logger.error('QABSettings get extension error', error);
            }
        }
        return this._extension;
    }

    redrawExtension() {
        const extension = this.getExtension();
        if (!libVal.evalIsEmpty(extension)) {
            extension.onCreate();
        }
    }

    getPreferenceName() {
        if (libVal.evalIsEmpty(this._preferenceName)) {
            this._preferenceName = `${PersonaLibrary.getActivePersona(this._context)}-${libCom.getPageName(this._context)}`;
        }

        return this._preferenceName;
    }

    getQABSettings() {
        const preferenceGroup = this._context.getGlobalDefinition('/SAPAssetManager/Globals/QAB/PreferenceGroup.global').getValue();
        return this._context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', [], `$filter=PreferenceGroup eq '${preferenceGroup}' and PreferenceName eq '${this.getPreferenceName()}'`);
    }

    async generateChips(chips = []) {
        const defaultChips = [{
            'IsIconVisible': true,
            'Icon': '$(PLT,/SAPAssetManager/Images/QABSettings.png,/SAPAssetManager/Images/QABSettings.android.png)',
            'IsButtonVisible': true,
            'IsButtonEnabled': true,
            'Action': '/SAPAssetManager/Rules/QAB/QABSettingsPageNav.js',
            '_Name': 'SETTINGS',
        }];

        this._chips = chips.filter(chip => chip.IsEnabled);

        try {
            const result = await this.getQABSettings();
            const settingsRecord = result.getItem(0);
            const settingsNotCreated = libVal.evalIsEmpty(settingsRecord);
            const visibleChipsList = settingsNotCreated ? undefined : JSON.parse(settingsRecord.PreferenceValue).VISIBLE;

            this._chips = this._chips.map((chip) => {
                let isButtonVisibleBySettings = settingsNotCreated ? chip.IsButtonVisibleBySettings : visibleChipsList.includes(chip._Name);
                let isButtonVisible = isButtonVisibleBySettings && chip.IsButtonVisible;

                return {...chip, IsButtonVisible: isButtonVisible, IsButtonVisibleBySettings: isButtonVisibleBySettings};
            });
        } catch (error) {
            this._chips = [];
            Logger.error('QABSettings generate chips error', error);
        }

        if (this._chips.every(item => !item.IsButtonVisible)) {
            defaultChips[0].Label = this._context.localizeText('qab_add_quick_actions');
        }

        return defaultChips.concat(this._chips);
    }

    navToSettingsPage() {
        this._context.setActionBinding({
            items: this._chips,
            selectedItemsMapping: this._chips.reduce((acc, item) => {
                if (item.IsButtonVisibleBySettings) {
                    acc[item._Name] = true;
                }

                return acc;
            }, {}),
            QABSettingsInstance: this,
        });
        return this._context.executeAction('/SAPAssetManager/Actions/QAB/QABSettingsPageNav.action');
    }

    _saveInstance() {
        this._context.getClientData().QABSettingsInstance = this;
    }

}
export class QABSettingsPage {
    static get typeVisible() {
        return 'VISIBLE';
    }

    static get typeNonVisible() {
        return 'NON_VISIBLE';
    }

    static pageOnLoaded(context) {
        context.getClientData().selectedItemsMapping = context.binding.selectedItemsMapping;
    }

    static getSelectedItemsMapping(context) {
        const pageProxy = context.getPageProxy();
        return pageProxy.getClientData().selectedItemsMapping || pageProxy.binding.selectedItemsMapping;
    }

    static getItems(context) {
        return context.getPageProxy().binding.items;
    }

    static getSectionTarget(context, type) {
        const selectedItemsMapping = this.getSelectedItemsMapping(context);

        let result = this.getItems(context).filter(item => {
            return type === this.typeVisible ? selectedItemsMapping[item._Name] : !selectedItemsMapping[item._Name];
        });

        if (context.searchString) {
            result = result.filter(item => {
                return item.Label.toLowerCase().includes(context.searchString.toLowerCase());
            });
        }

        this.setSectionItemsNames(context, type, result.map(item => item._Name));

        return result;
    }

    static getSectionItemsNames(context, type) {
        return context.getPageProxy().getClientData()[type];
    }

    static setSectionItemsNames(context, type, names) {
        context.getPageProxy().getClientData()[type] = names;
    }

    static getItemAccessoryType(context) {
        const selectedItemsMapping = this.getSelectedItemsMapping(context);
        return selectedItemsMapping[context.binding._Name] ? 'checkmark' : 'none';
    }

    static itemOnPress(context) {
        const pageProxy = context.getPageProxy();
        const selectedItemsMapping = this.getSelectedItemsMapping(context);
        const binding = pageProxy.getActionBinding();
        const name = binding._Name;

        if (selectedItemsMapping[name]) {
            delete selectedItemsMapping[name];
        } else {
            selectedItemsMapping[name] = true;
        }

        pageProxy.getClientData().selectedItemsMapping = selectedItemsMapping;
        context.redraw();
    }

    static isSectionVisible(context, type) {
        const selectedItemsMapping = this.getSelectedItemsMapping(context);

        return this.getItems(context).some(item => {
            return type === this.typeVisible ? selectedItemsMapping[item._Name] : !selectedItemsMapping[item._Name];
        });
    }

    static selectDeselectAllOnPress(context, type) {
        const pageProxy = context.getPageProxy();
        const pageClientData = pageProxy.getClientData();
        const names = this.getSectionItemsNames(context, type);

        if (!libVal.evalIsEmpty(names)) {
            pageClientData.selectedItemsMapping = names.reduce((acc, name) => {
                if (type === this.typeNonVisible) {
                    acc[name] = true;
                } else {
                    delete acc[name];
                }

                return acc;
            }, pageClientData.selectedItemsMapping || {});

            pageProxy.getControls()[0].redraw();
        }
    }

    static async onSaveOnPress(context) {
        const pageProxy = context.getPageProxy();
        const clientData = pageProxy.getClientData();
        const selectedItemsMapping = this.getSelectedItemsMapping(context);
        const QABSettingsInstance = pageProxy.binding.QABSettingsInstance;

        clientData.preferenceName = QABSettingsInstance.getPreferenceName();
        clientData.preferenceValue = JSON.stringify({VISIBLE: Object.keys(selectedItemsMapping)});

        pageProxy.showActivityIndicator();

        try {
            const result = await QABSettingsInstance.getQABSettings();
            const settingsRecord = result.getItem(0);
            let promise;

            if (libVal.evalIsEmpty(settingsRecord)) {
                promise = pageProxy.executeAction('/SAPAssetManager/Actions/QAB/QABSettingsCreate.action');
            } else {
                clientData.readLink = settingsRecord['@odata.readLink'];
                promise = pageProxy.executeAction('/SAPAssetManager/Actions/QAB/QABSettingsUpdate.action');
            }

            await promise;
            await pageProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
            QABSettingsInstance.redrawExtension();
        } catch (error) {
            Logger.error('QABSettings on save settings error', error);
            clientData.Error = pageProxy.localizeText('update_failed');
            pageProxy.executeAction({
                'Name': '/SAPAssetManager/Actions/ErrorBannerMessage.action',
                'Properties': {
                    'Message': pageProxy.localizeText('update_failed'),
                },
            });
        } finally {
            pageProxy.dismissActivityIndicator();
        }
    }
}
