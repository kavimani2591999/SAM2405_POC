import libEval from '../Common/Library/ValidationLibrary';


export default function EquipmentUpdateNav(context) {
    if (!libEval.evalIsEmpty(context.getBindingObject().DismantleDate)) {
        return context.executeAction('/SAPAssetManager/Actions/Equipment/Uninstall/DismantleFixConfirm.action').then(result => {
            return handleAction(result, context, '/SAPAssetManager/Actions/Equipment/Uninstall/UnInstallEquipmentDeleteChangeSet.action');
        });
    } else if (!libEval.evalIsEmpty(context.getBindingObject().InstallDate)) {
        return context.executeAction('/SAPAssetManager/Actions/Equipment/Uninstall/InstallFixConfirm.action').then(result => {
            return handleAction(result, context, '/SAPAssetManager/Actions/Equipment/Installation/EquipmentInstallationNav.action');
        });
    } else {
        return false;
    }
}

function handleAction(result, context, executeAction) {
    if (result.data === true) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments(\'' + context.getBindingObject().EquipId + '\')', [], '').then(function(results) {
            if (results && results.getItem(0)) {
                results.getItem(0).FromErrorArchive = true;
                context.setActionBinding(results.getItem(0));
            }
            return context.executeAction(executeAction);
        });
    } else {
        return false;
    }
}
