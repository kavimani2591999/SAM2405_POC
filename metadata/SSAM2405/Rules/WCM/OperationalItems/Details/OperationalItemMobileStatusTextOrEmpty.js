import ValidationLibrary from '../../../Common/Library/ValidationLibrary';

export default function OperationalItemMobileStatusTextOrEmpty(context) {
    return GetMobileStatusLabelOrNull(context, context.binding)
        .then(labelOrNull => labelOrNull || '');
}

export function GetMobileStatusLabelOrNull(context, wcmDocmuentItem) {
    return (wcmDocmuentItem.PMMobileStatus ? Promise.resolve(wcmDocmuentItem.PMMobileStatus) : GetWCMDocumentItemMobileStatus(context, wcmDocmuentItem))
        .then(pmMobileStatus => pmMobileStatus ? GetMobileStatusLabel(context, pmMobileStatus.MobileStatus, 'WCMDOCITEM') : null);
}

export function GetWCMDocumentItemMobileStatus(context, wcmDocumentItem) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', wcmDocumentItem['@odata.readLink'] + '/PMMobileStatus', [], '')
        .then(pmMobileStatus => ValidationLibrary.evalIsEmpty(pmMobileStatus) ? null : pmMobileStatus.getItem(0));  // single element is expected
}

/** retrieves the MobileStatusLabel by the mobilestatuscode and objectType, cached into the page's clientData
 * @param {IControlProxy | IPageProxy} context
 * @param {string} pmMobileStatusCode
 * @param {string} objectType
 * @returns {Promise<string>}
 */
export async function GetMobileStatusLabel(context, pmMobileStatusCode, objectType) {
    const encodedParams = `${pmMobileStatusCode}_${objectType}`;
    const clientData = context.getPageProxy().getClientData();
    if (!(encodedParams in clientData)) {
        clientData[encodedParams] = context.read('/SAPAssetManager/Services/AssetManager.service', 'MobileStatusMappings', [], `$filter=ObjectType eq '${objectType}' and MobileStatus eq '${pmMobileStatusCode}'`)
            .then(mobileStatusMappings => clientData[encodedParams] = ValidationLibrary.evalIsEmpty(mobileStatusMappings) ? null : mobileStatusMappings.getItem(0).MobileStatusLabel);
    }
    return clientData[encodedParams];
}
