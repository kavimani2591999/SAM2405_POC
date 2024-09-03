import Logger from '../Log/Logger';
import appSettings from '../Common/Library/ApplicationSettings';
import IsESRINameUserAuthEnabled from './IsESRINameUserAuthEnabled';
import EsriLibrary from './EsriLibrary';
import validationLibrary from '../Common/Library/ValidationLibrary';
import libCom from '../Common/Library/CommonLibrary';
import isGISEnabled from '../Maps/IsGISEnabled';

/**
* Reads ESRI parameters from the AppParameters
* Redirects to ESRI login page
* @param {IClientAPI} clientAPI
*/
export default function ESRIUserLogin(clientAPI) {
    if (libCom.isInitialSync(clientAPI) && !appSettings.getBoolean(clientAPI, 'IsEsriLoginExecuted', false) && isGISEnabled(clientAPI)) {
        let currentToken = EsriLibrary.getEsriAccessToken(clientAPI);
        if (validationLibrary.evalIsEmpty(currentToken)) {
            return clientAPI.executeAction('/SAPAssetManager/Actions/OData/CreateOnlineOData.action').then(() => { 
                let gis = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ESRI/GIS.global').getValue();
                
                return clientAPI.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'AppParameters', [], `$filter=ParamGroup eq '${gis}'`).then((results) => { 
                    SaveEsriParamsToAppSettings(clientAPI, results);

                    if (IsESRINameUserAuthEnabled(clientAPI)) {
                        return EsriLibrary.openEsriUserLoginPage(clientAPI);
                    }

                    return true;
                }).catch(function(err) {
                    Logger.error(`ESRIUserLogin - Failed to read Online app parameters: ${err}`);
                    return false;
                });
            }).catch(function(err) {
                Logger.error(`ESRIUserLogin - Failed to initialize Online OData Service: ${err}`);
                return false;
            });
        }
    }
    return true;
}

function SaveEsriParamsToAppSettings(clientAPI, params) {
    if (params?.length) {
        for (let index = 0; index < params.length; index++) {
            appSettings.remove(clientAPI, params.getItem(index).ParameterName);
            appSettings.setString(clientAPI, params.getItem(index).ParameterName, params.getItem(index).ParamValue);
            Logger.info(`parameter name: ${params.getItem(index).ParameterName}, parameter name: ${params.getItem(index).ParamValue}`);
        }
    }
}
