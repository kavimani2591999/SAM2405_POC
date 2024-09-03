import NewMeterSectionLibrary from '../Common/NewMeterSectionLibrary';

/**
* Hardcoding order type as far as we calling it from install button
* getting same as QAB action for this item
* @param {IClientAPI} clientAPI
*/
export default async function NewMeterListInstallToolbar(clientAPI) {
    const action = await NewMeterSectionLibrary.quickActionTargetValues(clientAPI, 'Action', undefined, 'INSTALL');
    return action && await clientAPI.executeAction(action);
}
