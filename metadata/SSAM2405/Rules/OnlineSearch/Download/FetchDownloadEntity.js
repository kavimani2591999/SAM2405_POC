
/**
* Download the online entity (equipment/floc) that was uploaded with OnDemandObjectCreate
* @param {IClientAPI} context
*/
export default function FetchDownloadEntity(context) {
    const pageProxy = context.getPageProxy();
    let binding = pageProxy.binding;
    if (!binding?.['@odata.readLink']) {
        binding = pageProxy.getActionBinding();
    }
    if (binding) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Inventory/Fetch/FetchDownloadDocuments.action',
            'Properties': {
                'DefiningRequests': [{
                    'Name': 'My' + binding['@odata.readLink'].split('(')[0],
                    'Query': 'My' + binding['@odata.readLink'],
                }],
                'OnSuccess': '/SAPAssetManager/Rules/OnlineSearch/Download/DownloadSuccess.js',
                'OnFailure':  '',
            },
        });
    }
    return Promise.reject();
}
