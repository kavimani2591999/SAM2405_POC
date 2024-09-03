import isSupervisorSectionVisibleForWO from '../../Supervisor/SupervisorRole/IsSupervisorSectionVisibleForWO';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function IsAssignEnableWorkOrder(context, actionBinding) {
    const binding = actionBinding || context.binding;

    return isSupervisorSectionVisibleForWO(context).then(function(visible) {
        if (visible) {
            let PartnerFunction = 'VW';
            return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/WOPartners', [], `$filter=PartnerFunction eq '${PartnerFunction}'`).then(function(results) {
                if (results && results.length > 0) {
                    return false;
                }
                return true;
            });
        }
        return false;
    });
}
