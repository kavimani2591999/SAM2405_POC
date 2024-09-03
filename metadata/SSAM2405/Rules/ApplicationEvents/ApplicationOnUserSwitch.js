import ApplicationSettings from '../Common/Library/ApplicationSettings';
import InitializeOnUserSwitch from './InitializeOnUserSwitch';
import IsESRINameUserAuthEnabled from '../ESRI/IsESRINameUserAuthEnabled';
import EsriLibrary from '../ESRI/EsriLibrary';

/**
* Function that executes when reset action is being called with Skip Reset set to true
* @param {IClientAPI} context
*/
export default async function ApplicationOnUserSwitch(context) {
    context.getGlobalSideDrawerControlProxy().setSelectedMenuItemByName('OverviewBlank');
    let provider = context.getODataProvider('/SAPAssetManager/Services/AssetManager.service');
    let storeParameters = provider.getOfflineParameters();
    let headers = storeParameters.getCustomHeaders();
    if (headers) {
        headers.UserSwitch = true;
    } else {
        headers = {'UserSwitch':true};
    }
    storeParameters.setCustomHeaders(headers);
    ApplicationSettings.setBoolean(context,'didUserSwitchDeltaCompleted', false);
    context.showActivityIndicator(context.localizeText('download_progress'));
    if (IsESRINameUserAuthEnabled(context)) {
        await EsriLibrary.openEsriUserLoginPage(context);
    }
    return InitializeOnUserSwitch(context).finally(() => {
        context.dismissActivityIndicator();
    });
}
