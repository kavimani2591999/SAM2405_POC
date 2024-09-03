import Logger from '../Log/Logger';
import libCommon from '../Common/Library/CommonLibrary';
import IsESRINameUserAuthEnabled from '../ESRI/IsESRINameUserAuthEnabled';
import EsriLibrary from '../ESRI/EsriLibrary';

export default function TokenRequest(context) {

    if (IsESRINameUserAuthEnabled(context)) {
        if (EsriLibrary.CheckIfESRIAccessTokenExpired(context)) {
            return EsriLibrary.refreshEsriToken(context);
        } else {
            return {
                access_token: EsriLibrary.getEsriAccessToken(context),
                expires_in: EsriLibrary.getEsriAccessTokenExpireTime(context),
            };
        }
    }
    if (!libCommon.isOnlineServiceInitialized(context)) {
        return context.executeAction('/SAPAssetManager/Actions/OData/OpenOnlineService.action')
            .then(() => {
                return getAuthToken(context);
            }).catch(error => {
                Logger.error(`Failed to open Online OData Service: ${error}`);
                return null;
            });
    }
    return getAuthToken(context);
}

function getAuthToken(context) {
    return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'OauthTokens', [], '$filter=ParameterGroup eq \'EXTERNALCONNECTIONS\'')
        .then(result => {
            if (result && result.getItem(0) && result.getItem(0).OauthToken) {
                let item = result.getItem(0);
                let obj = {};
                obj.access_token = item.OauthToken;
                obj.expires_in = item.ExpiresIn;

                return obj;
            }
            Logger.error('Failed to retrieve a valid token');
            return null;
        }).catch(error => {
            Logger.error(`Failed to complete the online read: ${error}`);
            return null;
        });
}
