import QABSettings from '../../QAB/QABSettings';
import IsServiceItemOrderNotCompleted from '../ServiceItems/IsServiceItemOrderNotCompleted';
import AddConfirmationToServiceItemEnabled from '../ServiceItems/AddConfirmationToServiceItemEnabled';
import MeasuringPointsTakeReadingsIsVisible from '../../Measurements/Points/MeasuringPointsTakeReadingsIsVisible';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default class ServiceOrderQABSettings extends QABSettings {
    async generateChips() {
        const chips = [
            this._createChip({
                'Label': this._context.localizeText('add_item'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddItem.png,/SAPAssetManager/Images/QABAddItem.android.png)',
                'IsEnabled': true,
                'IsButtonEnabled': await IsServiceItemOrderNotCompleted(this._context),
                'IsButtonVisible': true,
                'Action': '/SAPAssetManager/Rules/ServiceItems/CreateUpdate/CreateServiceItemNav.js',
                '_Name': 'ADD_ITEM',
            }),
            this._createChip({
                'Label': this._context.localizeText('add_travel_expense'),
                'IsEnabled': false,
                'IsButtonEnabled': false,
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddExpense.png,/SAPAssetManager/Images/QABAddExpense.android.png)',
                'IsButtonVisible': false,
                'Action': '/SAPAssetManager/Rules/ServiceItems/CreateUpdate/CreateTravelExpenseServiceItemNav.js',
                '_Name': 'ADD_TRAVEL_EXPENSE',
            }),
            this._createChip({
                'Label': this._context.localizeText('confirm_item'),
                'IsEnabled': true,
                'IsButtonEnabled': await AddConfirmationToServiceItemEnabled(this._context),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABConfirmItem.png,/SAPAssetManager/Images/QABConfirmItem.android.png)',
                'IsButtonVisible': true,
                'Action': '/SAPAssetManager/Rules/ServiceConfirmations/CreateUpdate/ServiceConfirmationCreateNav.js',
                '_Name': 'CONFIRM_ITEM',
            }),
            await this._createTakeReadingsChip(),
            await this._createDownloadDocumentsChip(),
        ];

        return super.generateChips(chips);
    }

    async _createTakeReadingsChip() {
        const PMMeasurementEnabled = userFeaturesLib.isFeatureEnabled(this._context, this._context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMMeasurement.global').getValue());

        return super._createTakeReadingsChip({
            'IsEnabled': PMMeasurementEnabled,
            'IsButtonEnabled': await MeasuringPointsTakeReadingsIsVisible(this._context),
            'IsButtonVisible': PMMeasurementEnabled,
        });
    }
}
