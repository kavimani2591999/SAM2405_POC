import QABSettings from '../../../QAB/QABSettings';

export default class ServiceRequestQABSettings extends QABSettings {
    async generateChips() {
        const chips = [
            this._createAddServiceOrderChip({
                'Label': this._context.localizeText('add_service_order'),
            }),
            await this._createDownloadDocumentsChip(),
        ];

        return super.generateChips(chips);
    }
}
