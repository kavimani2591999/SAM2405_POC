
import libCom from '../Common/Library/CommonLibrary';
export default function DataSubscriptions(context) {
    let pageName = libCom.getPageName(context);
    let defaultDataSubs = [];
    switch (pageName) {
        case 'NotificationsListViewPage':
            return [
                'MyWorkOrderHeaders',
                'MyNotificationHeaders',
                'MyNotificationActivities',
                'MyNotificationItems',
                'MyNotificationTasks',
                'MyNotificationItemActivities',
                'MyNotificationItemCauses',
                'MyNotificationItemTasks',
                'MyNotifHeaderLongTexts',
                'UserPreferences',
                'MyEquipments',
                'PMMobileStatuses',
                'CatsTimesheetOverviewRows',
                'ConfirmationOverviewRows',
                '/SAPAssetManager/Services/AssetManager.service',
            ];
        case 'OverviewPage':
        case 'OverviewPageNew':
            return [
                'MyWorkOrderSubOperations',
                'MyWorkOrderHeaders',
                'MyNotificationHeaders',
                'MyWorkOrderOperations',
                'UserPreferences',
                'MyEquipments',
                'UserFeatures',
                '/SAPAssetManager/Services/AssetManager.service',
            ];
        case 'SideMenuDrawer':
            return [
                'MyWorkOrderSubOperations',
                'MyWorkOrderHeaders',
                'MyNotificationHeaders',
                'MyWorkOrderOperations',
                'UserPreferences',
                'MyEquipments',
                'ErrorArchive',
                'UserFeatures',
                'Confirmations',
                'S4ServiceItems',
                'S4ServiceConfirmations',
                'S4ServiceRequests',
                '/SAPAssetManager/Services/AssetManager.service',
            ];
        case 'WorkOrdersListViewPage':
            return [
                'PMMobileStatuses',
                'MyWorkOrderHeaderLongTexts',
                'UserTimeEntries',
                'MyWorkOrderPartners',
                '/SAPAssetManager/Services/AssetManager.service',
            ];
        case 'WorkPermitsListViewPage':
            return [
                'WCMApplications',
                'WCMDocumentHeaders',
                'WCMDocumentItems',
                'MyEquipments',
                'MyFunctionalLocations',
                '/SAPAssetManager/Services/AssetManager.service',
            ];
        case 'OperationalItemsListViewPage':
            return [
                'WCMDocumentItems',
                'WCMDocumentHeaders',
                'PMMobileStatuses',
                '/SAPAssetManager/Services/AssetManager.service',
            ];
        case 'MeterDetailsPage':
        case 'PeriodicMeterDetailsPage':
            if (context.binding.ISUProcess !== 'INSTALL') {
                defaultDataSubs.push('Devices', 'DeviceGoodsMovements');
            }
            defaultDataSubs.push('MeterReadings');
            return defaultDataSubs;
        default:
            return defaultDataSubs;
        }
}
