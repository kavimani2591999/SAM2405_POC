import QABSettings from '../QAB/QABSettings';
import EnableNotificationCreate from '../UserAuthorizations/Notifications/EnableNotificationCreate';
import IsPhaseModelEnabled from '../Common/IsPhaseModelEnabled';
import EnableNotificationCreateFromWorkOrderOperation from '../UserAuthorizations/Notifications/EnableNotificationCreateFromWorkOrderOperation';
import IsAddConfirmationButtonVisible from '../QAB/IsAddConfirmationButtonVisible';
import libPersona from '../Persona/PersonaLibrary';
import IsAddConfirmationButtonVisibleOnOperationDetails from '../QAB/IsAddConfirmationButtonVisibleOnOperationDetails';
import IsMeterComponentEnabled from '../ComponentsEnablement/IsMeterComponentEnabled';
import NewMeterSectionLibrary from '../Meter/Common/NewMeterSectionLibrary';

export default class WorkOrderOperationQABSettings extends QABSettings {
    async generateChips() {
        const meterEnabled = IsMeterComponentEnabled(this._context);
            
        const chips = [
            this._createChip({
                'Label': meterEnabled ? await NewMeterSectionLibrary.quickActionTargetValues(this._context, 'Label') : '',
                'Icon': meterEnabled ? await NewMeterSectionLibrary.quickActionTargetValues(this._context, 'Icon') : '',
                'IsEnabled': meterEnabled && await NewMeterSectionLibrary.newObjectCellSectionVisible(this._context, 'QAB'),
                'IsButtonVisible': true,
                'IsButtonVisibleBySettings': false,
                'Action': meterEnabled ? await NewMeterSectionLibrary.quickActionTargetValues(this._context, 'Action') : '',
                '_Name': 'METER_QAB_ACTION',
            }),
            this._createAddNotificationChip({
                'Label': this._context.localizeText('add_notification'),
                'IsEnabled': EnableNotificationCreate(this._context) && !IsPhaseModelEnabled(this._context),
                'IsButtonEnabled': await EnableNotificationCreateFromWorkOrderOperation(this._context),
                'IsButtonVisible': EnableNotificationCreate(this._context) && !IsPhaseModelEnabled(this._context),
                'Action': '/SAPAssetManager/Rules/Operations/WorkOrderOperationNotificationCreateNav.js',
            }),
            this._createAddServiceConfirmationChip({
                'Label': this._context.localizeText('add_service_confirmation'),
                'IsEnabled': libPersona.isMaintenanceTechnician(this._context) && IsAddConfirmationButtonVisible(this._context),
                'IsButtonEnabled': await IsAddConfirmationButtonVisibleOnOperationDetails(this._context),
                'IsButtonVisible': libPersona.isMaintenanceTechnician(this._context) && IsAddConfirmationButtonVisible(this._context),
                'Action': '/SAPAssetManager/Rules/Confirmations/CreateUpdate/ConfirmationCreateFromOperation.js',
            }),
            await this._createTakeReadingsChip(),
            await this._createDownloadDocumentsChip(),
        ];

        return super.generateChips(chips);
    }
}
