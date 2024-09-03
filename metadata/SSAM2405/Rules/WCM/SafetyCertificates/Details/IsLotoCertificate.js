import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import SafetyCertificatesLibrary from '../SafetyCertificatesLibrary';

export default function IsLotoCertificate(context) {
    const safetyCertificates = context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentSafetyCertificatesODataType.global').getValue();
    return context.binding && context.binding['@odata.type'] === safetyCertificates ?
        context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/WCMDocumentUsages`, [], '')
            .then((/** @type {ObservableArray<WCMDocumentUsage>} */ result) => !ValidationLibrary.evalIsEmpty(result) && SafetyCertificatesLibrary.LOTOCertificateUsageTypes.includes(result.getItem(0).Specification)) :
        Promise.resolve(false);
}
