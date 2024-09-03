import QABSettings from '../../QAB/QABSettings';
import libPersona from '../../Persona/PersonaLibrary';
import EnableWorkOrderCreateFromWorkOrder from '../../UserAuthorizations/WorkOrders/EnableWorkOrderCreateFromWorkOrder';
import EnableNotificationCreateFromWorkOrder from '../../UserAuthorizations/Notifications/EnableNotificationCreateFromWorkOrder';
import IsGISEnabled from '../../Maps/IsGISEnabled';
import IsViewMapButtonVisible from '../../QAB/IsViewMapButtonVisible';
import EnableOperationCreate from '../../UserAuthorizations/WorkOrders/EnableOperationCreate';
import NewMeterSectionLibrary from '../../Meter/Common/NewMeterSectionLibrary';
import IsMeterComponentEnabled from '../../ComponentsEnablement/IsMeterComponentEnabled';

export default class WorkOrderQABSettings extends QABSettings {
    async generateChips() {
        let chips = [];

        if (libPersona.isWCMOperator(this._context)) {
            chips = [
                this._createAddNotificationChipWCMDetailsPage(),
                await this._createDownloadDocumentsChip(),
            ];
        } else {
            const isMT = libPersona.isMaintenanceTechnician(this._context);
            const meterEnabled = IsMeterComponentEnabled(this._context);

            chips = [
                this._createChip({
                    'Label': meterEnabled ? await NewMeterSectionLibrary.quickActionTargetValues(this._context, 'Label') : '',
                    'Icon': meterEnabled ? await NewMeterSectionLibrary.quickActionTargetValues(this._context, 'Icon') : '',
                    'IsEnabled': meterEnabled && await NewMeterSectionLibrary.newObjectCellSectionVisible(this._context, 'QAB'),
                    'IsButtonVisible': true,
                    'IsButtonVisibleBySettings': false,
                    'Action': meterEnabled ? await NewMeterSectionLibrary.quickActionTargetValues(this._context, 'Action') : '',
                    '_Name': 'METER_QAB_ACTION',
                }),
                isMT ?
                    this._createAddWorkOrderChip({
                        'Label': this._context.localizeText('add_order'),
                        'IsButtonEnabled': await EnableWorkOrderCreateFromWorkOrder(this._context),
                        'Action': '/SAPAssetManager/Rules/WorkOrders/FollowUpWorkOrderCreateNav.js',
                    }) :
                    this._createChip({
                        'Label': this._context.localizeText('add_operation'),
                        'Icon': '$(PLT,/SAPAssetManager/Images/QABAddOperation.png,/SAPAssetManager/Images/QABAddOperation.android.png)',
                        'IsButtonEnabled': await EnableOperationCreate(this._context),
                        'IsEnabled': true,
                        'Action': '/SAPAssetManager/Rules/WorkOrders/Operations/CreateUpdate/WorkOrderOperationCreateNav.js',
                        '_Name': 'CREATE_OPERATION',
                    }),
                this._createAddNotificationChip({
                    'Label': this._context.localizeText('add_notification'),
                    'IsButtonEnabled': await EnableNotificationCreateFromWorkOrder(this._context),
                    'Action': '/SAPAssetManager/Rules/WorkOrders/WorkOrderNotificationCreateNav.js',
                }),
                await this._createTakeReadingsChip(),
                await this._createDownloadDocumentsChip(),
                this._createViewMapChip({
                    'IsEnabled': IsGISEnabled(this._context),
                    'Action': '/SAPAssetManager/Rules/WorkOrders/WorkOrderMapNav.js',
                    'IsButtonEnabled': await IsViewMapButtonVisible(this._context),
                    'IsButtonVisible': IsGISEnabled(this._context),
                }),
            ];
        }

        return super.generateChips(chips);
    }
}
