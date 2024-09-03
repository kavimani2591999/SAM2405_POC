export default function DiscardGoodsMovement(context, replaceBinding) {
    if (context.getPageProxy) {
        context = context.getPageProxy();
    }
    const binding = replaceBinding || context.binding;
    let navPath = binding['@odata.readLink'];
    let queyOptions = '$expand=GoodsMovement_Nav';
    if (binding['@odata.type'] === '#sap_mobile.OrderISULink') {
        navPath += '/Device_Nav';
    }
    return deleteGoodsMovement(context, navPath, queyOptions);
}

function deleteGoodsMovement(context, navPath, queyOptions) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', navPath, [], queyOptions).then(function(result) {
        if (result && result.getItem(0).GoodsMovement_Nav.length > 0) {
            context.getClientData().binding = result.getItem(0).GoodsMovement_Nav[0];
            return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterGoodsMovementDiscard.action').then(function() {
                return deleteGoodsMovement(context, navPath, queyOptions);
            });
        } else {
            return Promise.resolve();
        }
    });
}
