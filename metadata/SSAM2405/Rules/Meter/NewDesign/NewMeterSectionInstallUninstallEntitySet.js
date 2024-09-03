import NewMeterSectionLibrary from '../Common/NewMeterSectionLibrary';

/**
* Extension doesn't support MDK props in the sting, so need to call a rule to resolve this
* @param {IClientAPI} clientAPI
*/
export default function NewMeterSectionInstallUninstallEntitySet(clientAPI) {
    const binding = NewMeterSectionLibrary.getWorkOrderBinding(clientAPI, clientAPI.getPageProxy().binding);
    
    if (binding['@odata.readLink']) {
        return `${binding['@odata.readLink']}/OrderISULinks`;
    }
    // return default value if no meters available
    return '{{#Property:@odata.readLink}}/OrderISULinks';
}
