export default function DiscardReadings(context, replaceBinding) {
    if (context.getPageProxy) {
        context = context.getPageProxy();
    }
    const binding = replaceBinding || context.binding;
    let navPath = binding['@odata.readLink'];
    let queyOptions = '$expand=MeterReadings_Nav';
    if (binding['@odata.type'] === '#sap_mobile.OrderISULink') {
        navPath += '/Device_Nav';
    }
    return deleteReadings(context, navPath, queyOptions);
}

function deleteReadings(context, navPath, queyOptions) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', navPath, [], queyOptions).then(function(result) {
        if (result && result.getItem(0).MeterReadings_Nav.length > 0) {
            context.getClientData().binding = result.getItem(0).MeterReadings_Nav[0];
            return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterReadingsDiscard.action').then(function() {
                return deleteReadings(context, navPath, queyOptions);
            });
        } else {
            return Promise.resolve();
        }
    });
}
