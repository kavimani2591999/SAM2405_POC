import EsriTokenSecureStorage from '../SecureStorage/EsriTokenSecureStorage';

export default function GetESRIRefreshToken(context) {
    return EsriTokenSecureStorage.getInstance(context).getRefreshTokenOrDefault();
}
