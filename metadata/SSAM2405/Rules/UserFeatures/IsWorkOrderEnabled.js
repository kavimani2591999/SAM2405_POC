import UserFeaturesLibrary from './UserFeaturesLibrary';

export default function IsWorkOrderEnabled(clientAPI) {
    return UserFeaturesLibrary.isFeatureEnabled(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMWorkOrder.global').getValue()) || 
        UserFeaturesLibrary.isFeatureEnabled(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/WCMWorkOrder.global').getValue());
}
