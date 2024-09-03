import ApplicationSettings from '../Common/Library/ApplicationSettings';

export default function GetTokenPath(clientAPI) {
    let clientID = ApplicationSettings.getString(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ESRI/ClientID.global').getValue(), '');
    let redirectURI = ApplicationSettings.getString(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ESRI/RedirectURI.global').getValue(), '');
	let authCode = ApplicationSettings.getString(clientAPI, 'AUTH_CODE', '');
    let path = `/token?client_id=${clientID}&redirect_uri=${redirectURI}&grant_type=authorization_code&code=${authCode}`;
    return path;
}
