import ApplicationSettings from '../Common/Library/ApplicationSettings';
import EsriTokenSecureStorage from '../SecureStorage/EsriTokenSecureStorage';

export default function GetRefreshTokenPath(clientAPI) {
    let clientID = ApplicationSettings.getString(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ESRI/ClientID.global').getValue(), '');
	let refreshToken = EsriTokenSecureStorage.getInstance(clientAPI).getRefreshTokenOrDefault();
    let path = `/token?client_id=${clientID}&grant_type=refresh_token&refresh_token=${refreshToken}`;
    return path;
}
