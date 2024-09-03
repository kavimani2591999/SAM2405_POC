import ApplicationSettings from '../Common/Library/ApplicationSettings';
import CommonLibrary from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import IsSyncInProgress from '../Sync/IsSyncInProgress';
import EsriTokenSecureStorage from '../SecureStorage/EsriTokenSecureStorage';
import validationLibrary from '../Common/Library/ValidationLibrary';

export default class EsriLibrary {
    static async openEsriUserLoginPage(clientAPI) {
        let url = EsriLibrary.getEsriAuthenticationURL(clientAPI);
        if (!url || !EsriLibrary.isValidURL(url)) {
            Logger.error(`ESRIUserLogin - invalid url: ${url}`);
            await EsriLibrary.showErrorMessage(clientAPI, clientAPI.localizeText('invalid_url', [url]));
        }
        Logger.info(`ESRIUserLogin - url: ${url}`);
        await clientAPI.nativescript.utilsModule.openUrl(url);
        ApplicationSettings.setBoolean(clientAPI, 'IsEsriLoginExecuted', true);
        return Promise.resolve();
    }

    static getEsriAuthenticationURL(clientAPI) {
        let authorizeURI = ApplicationSettings.getString(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ESRI/AuthorizeURI.global').getValue(), '');
        let clientID = ApplicationSettings.getString(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ESRI/ClientID.global').getValue(), '');
        let redirectURI = ApplicationSettings.getString(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ESRI/RedirectURI.global').getValue(), '');
        return authorizeURI + `?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code&expiration=432000`;
    }

    static fetchGeometries(clientAPI) {
        return clientAPI.executeAction('/SAPAssetManager/Actions/OData/OpenOnlineService.action').then(() => {
            return clientAPI.executeAction('/SAPAssetManager/Actions/ESRI/UpdateBackendWithSyncRequests.action').then(() => {
                if (!IsSyncInProgress(clientAPI)) {
                    return clientAPI.executeAction('/SAPAssetManager/Actions/SyncInitializeProgressBannerMessage.action').then(() => {
                        let action = CommonLibrary.getStateVariable(clientAPI, 'EsriErrorCaseCallbackAction');
                        EsriLibrary.resetEsriFlow(clientAPI);
                        return action ? clientAPI.executeAction(action) : Promise.resolve();
                    });
                }
                return Promise.reject(clientAPI.localizeText('sync_in_progress_banner'));
            }).catch((error) => {
                throw error;
            });
        }).catch((error) => {
            throw error;
        });
    }

    static async showErrorMessage(clientAPI, error) {
        await clientAPI.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericErrorDialog.action',
            'Properties': {
                'Title': clientAPI.localizeText('error'),
                'Message': error,
                'OKCaption': clientAPI.localizeText('ok'),
            },
        })
        .then(async () => {
            await EsriLibrary.resetEsriFlow(clientAPI);
        });
    }
    
    static async onEsriFailed(clientAPI, error) {
        await clientAPI.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
            'Properties': {
                'Title': clientAPI.localizeText('esri_login_failed'),
                'Message': error,
                'CancelCaption': clientAPI.localizeText('cancel'),
                'OKCaption': clientAPI.localizeText('retryButtonString'),
            },
        })
        .then(async (result) => {
            if (result.data === true) {
                await EsriLibrary.openEsriUserLoginPage(clientAPI);
            } else {
                await EsriLibrary.resetEsriFlow(clientAPI);
            }
        });
    }

    static resetEsriFlow(clientAPI) {
        CommonLibrary.removeStateVariable(clientAPI, 'EsriErrorCaseCallbackAction');
        return Promise.resolve();
    }

    static isValidURL(url) {
        let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[\\/:;&a-z\\d%_.~+=-]*)?$','i'); // query string
        return !!pattern.test(url);
    }

    static getEsriAccessToken(clientAPI) {
        let secureStorage = EsriTokenSecureStorage.getInstance(clientAPI);
        return secureStorage.getAccessTokenOrDefault();
    }

    static getEsriAccessTokenExpireTime(clientAPI) {
        let secureStorage = EsriTokenSecureStorage.getInstance(clientAPI);
        return secureStorage.getExpiresAtOrDefault();
    }

    static async refreshEsriToken(context) {
        let secureStorage = EsriTokenSecureStorage.getInstance(context);
        await context.executeAction('/SAPAssetManager/Actions/ESRI/GetESRIRefreshToken.action')
            .then(async result => {
                if (result?.data && result.data.access_token && result.data.expires_in) {
                    secureStorage.saveAccessToken(result.data.access_token);
                    secureStorage.saveExpiresAt(new Date().getTime() + result.data.expires_in * 1000);
                    secureStorage.saveExpiresIn(result.data.expires_in);
                    await context.executeAction('/SAPAssetManager/Actions/OData/OpenOnlineService.action');
                    await context.executeAction('/SAPAssetManager/Actions/ESRI/UpdateBackendWithESRIAccessToken.action');
                    return {
                        access_token: result.data.access_token,
                        expires_in: secureStorage.getExpiresInOrDefault(),
                    };
                }
                return null;
            })
            .catch(error => {
                Logger.error('RefreshEsriToken', error);
                return null;
            });
    }

    static async FetchESRIAccessToken(clientAPI) {
        let result = await clientAPI.executeAction('/SAPAssetManager/Actions/ESRI/GetESRIAccessToken.action');
        let secureStorage = EsriTokenSecureStorage.getInstance(clientAPI);

        if (result?.data && validationLibrary.evalIsEmpty(result.data.error)) {
            const accessData = result.data;
            Logger.info('FetchESRIAccessToken is successful');
            if (accessData.access_token) {
                secureStorage.saveAccessToken(accessData.access_token);
            }
            if (accessData.refresh_token) {
                secureStorage.saveRefreshToken(accessData.refresh_token);
            }
            if (accessData.expires_in) {
                Logger.info(`FetchESRIAccessToken - expires_in: ${accessData.expires_in}`);
                Logger.info(`FetchESRIAccessToken - expires_in * 1000: ${accessData.expires_in * 1000}`);
                let timestamp = new Date().getTime() + accessData.expires_in * 1000;
                Logger.info(`FetchESRIAccessToken - Expires at timestamp - "new Date().getTime() + accessData.expires_in * 1000": ${timestamp}`);
                secureStorage.saveExpiresAt(timestamp);
                secureStorage.saveExpiresIn(accessData.expires_in);
            }
            return Promise.resolve();
        } else {
            Logger.error(`FetchESRIAccessToken - error: ${result.data.error.error_description}`);
            throw new Error(result.data.error.error_description);
        }
    }

    static ResetESRIAccessToken(clientAPI) {
        let secureStorage = EsriTokenSecureStorage.getInstance(clientAPI);
        secureStorage.saveAccessToken('');
        secureStorage.saveRefreshToken('');
        secureStorage.saveExpiresAt(0);
        secureStorage.saveExpiresIn(0);
        ApplicationSettings.remove(clientAPI, 'IsEsriLoginExecuted');
    }

    static async UpdateBackendESRIAccessToken(clientAPI) {
        await clientAPI.executeAction('/SAPAssetManager/Actions/OData/OpenOnlineService.action');
        await clientAPI.executeAction('/SAPAssetManager/Actions/ESRI/UpdateBackendWithESRIAccessToken.action');
        let initialSync = CommonLibrary.isInitialSync(clientAPI);
        if (!initialSync) {
            return EsriLibrary.fetchGeometries(clientAPI);
        }
        return Promise.resolve();
    }

    static CheckIfESRIAccessTokenExpired(clientAPI) {
        if (!validationLibrary.evalIsEmpty(this.getEsriAccessToken(clientAPI))) {
            let currentTime = new Date().getTime();
            Logger.info(`CheckIfESRIAccessTokenExpired - Current timestamp: ${currentTime}`);
            let currentExpiresAtValue = this.getEsriAccessTokenExpireTime(clientAPI);
            Logger.info(`CheckIfESRIAccessTokenExpired - Expires at timestamp: ${currentExpiresAtValue}`);
            Logger.info(`CheckIfESRIAccessTokenExpired - (currentTime >= currentExpiresAtValue): ${(currentTime >= currentExpiresAtValue)}`);
            return (currentTime >= currentExpiresAtValue);
        }
        return false;
    }
}
