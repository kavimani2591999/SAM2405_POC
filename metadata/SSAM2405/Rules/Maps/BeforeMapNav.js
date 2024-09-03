import CommonLibrary from '../Common/Library/CommonLibrary';
import EsriLibrary from '../ESRI/EsriLibrary';
import GetESRIAccessToken from '../ESRI/GetESRIAccessToken';
import IsESRINameUserAuthEnabled from '../ESRI/IsESRINameUserAuthEnabled';

export default function BeforeMapNav(clientAPI, navAction) {
    let openMapAction = '/SAPAssetManager/Actions/Extensions/MapNav.action';
    if (navAction) openMapAction = navAction;

    if (IsESRINameUserAuthEnabled(clientAPI) && !GetESRIAccessToken(clientAPI)) {
        CommonLibrary.setStateVariable(clientAPI, 'EsriErrorCaseCallbackAction', openMapAction);
        return EsriLibrary.openEsriUserLoginPage(clientAPI);
    }

    return clientAPI.executeAction(openMapAction);
}
