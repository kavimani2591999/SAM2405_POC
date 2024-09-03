import EsriTokenSecureStorage from '../SecureStorage/EsriTokenSecureStorage';

export default function GetESRIAccessToken(context) {
    let secureStorage = EsriTokenSecureStorage.getInstance(context);
    return secureStorage.getAccessTokenOrDefault();
}
