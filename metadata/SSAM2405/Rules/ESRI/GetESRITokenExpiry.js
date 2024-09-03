import EsriTokenSecureStorage from '../SecureStorage/EsriTokenSecureStorage';

export default function GetESRITokenExpiry(context) {
    return EsriTokenSecureStorage.getInstance(context).getExpiresInOrDefault();
}
