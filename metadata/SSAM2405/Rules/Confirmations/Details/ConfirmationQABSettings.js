import QABSettings from '../../QAB/QABSettings';

export default class ConfirmationQABSettings extends QABSettings {
    async generateChips() {
        const chips = [
            this._createAddServiceConfirmationChip({
                'Label': this._context.localizeText('confirm_item'),
            }),
            await this._createDownloadDocumentsChip(),
        ];

        return super.generateChips(chips);
    }
}
