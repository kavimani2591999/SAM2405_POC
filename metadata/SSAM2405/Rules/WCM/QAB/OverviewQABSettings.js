import QABSettings from '../../QAB/QABSettings';
import IsGISEnabled from '../../Maps/IsGISEnabled';

export default class OverviewQABSettings extends QABSettings {
    generateChips() {
        const chips = [
            this._createChip({
                'Label': this._context.localizeText('tagging'),
                'IsEnabled': true,
                'IsButtonEnabled': true,
                'Icon': '$(PLT,/SAPAssetManager/Images/QABTagging.png,/SAPAssetManager/Images/QABTagging.android.png)',
                'IsButtonVisible': true,
                'Action': '/SAPAssetManager/Rules/WCM/OperationalItems/ListView/OperationalItemsTaggingListViewNav.js',
                '_Name': 'TAGGING',
            }),
            this._createChip({
                'Label': this._context.localizeText('untagging'),
                'IsEnabled': true,
                'IsButtonEnabled': true,
                'Icon': '$(PLT,/SAPAssetManager/Images/QABUntagging.png,/SAPAssetManager/Images/QABUntagging.android.png)',
                'IsButtonVisible': true,
                'Action': '/SAPAssetManager/Rules/WCM/OperationalItems/ListView/OperationalItemsUntaggingListViewNav.js',
                '_Name': 'UNTAGGING',
            }),
            this._createAddNotificationChip(),
            this._createChip({
                'Label': this._context.localizeText('add_reminder'),
                'IsEnabled': true,
                'IsButtonEnabled': true,
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddReminder.png,/SAPAssetManager/Images/QABAddReminder.android.png)',
                'IsButtonVisible': true,
                'Action': '/SAPAssetManager/Rules/Reminders/ReminderCreateNav.js',
                '_Name': 'ADD_REMINDER',
            }),
            this._createViewMapChip(),
        ];

        return super.generateChips(chips);
    }

    _createViewMapChip() {
        const isMapEnabled = IsGISEnabled(this._context);
        return super._createViewMapChip({
            'IsEnabled': true,
            'IsButtonEnabled': isMapEnabled,
            'IsButtonVisible': true,
            'Action': '/SAPAssetManager/Rules/Maps/BeforeMapSideMenuNav.js',
        });
    }
}
