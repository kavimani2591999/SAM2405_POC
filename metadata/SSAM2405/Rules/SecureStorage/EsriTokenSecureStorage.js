import { FoundationPluginManager } from 'extension-SAMFoundation';
import validationLibrary from '../Common/Library/ValidationLibrary';

export default class EsriTokenSecureStorage {

    constructor() {
        this._instance = null;
        this._storage = null;
    }

    static getInstance(context) {
        if (validationLibrary.evalIsEmpty(this._instance)) {
            this._instance = new this();
            this._instance.initializeSecureStorage(context);
        }
        return this._instance;
    }

    initializeSecureStorage(context) {
        let defaultConfig = this.getStorageConfig(context);
        if (this._storage) {
            this._storage.updateConfig(defaultConfig);
        } else {
            this._storage = FoundationPluginManager.newSecureStorage(defaultConfig);
        }
    }

    getStorageConfig(context) {
        let userId = context.getAppClientData().UserId; //user email address
        userId = userId.split('@')[0];

        const storageName = 'EsriToken_' + userId;
        const storageAlias = 'EsriAliasToken_' + userId;
        const defaultConfig = JSON.stringify({
            'storage_name': storageName,
            'storage_alias': storageAlias,
            'entities': [
                {
                    'key': EsriTokenSecureStorage.KEY_ACCESS_TOKEN,
                    'type': 'STRING',
                    'is_cache_enable': false,
                },
                {
                    'key': EsriTokenSecureStorage.KEY_REFRESH_TOKEN,
                    'type': 'STRING',
                    'is_cache_enable': false,
                },
                {
                    'key': EsriTokenSecureStorage.KEY_EXPIRES_AT,
                    'type': 'STRING',
                    'is_cache_enable': true,
                },
                {
                    'key': EsriTokenSecureStorage.KEY_EXPIRES_IN,
                    'type': 'STRING',
                    'is_cache_enable': true,
                },
            ],
        });

        return defaultConfig;
    }

    saveAccessToken(token) {
        if (this._storage) {
            this._storage.putStringValue(EsriTokenSecureStorage.KEY_ACCESS_TOKEN, token);
        }
    }

    getAccessTokenOrDefault(defaultValue = '') {
        if (this._storage) {
            return this._storage.getStringValueOrDefault(EsriTokenSecureStorage.KEY_ACCESS_TOKEN, defaultValue);
        }
        return defaultValue;
    }

    getAccessToken() {
        if (this._storage) {
            return this._storage.getStringValue(EsriTokenSecureStorage.KEY_ACCESS_TOKEN);
        }
        return '';
    }

    saveRefreshToken(token) {
        if (this._storage) {
            this._storage.putStringValue(EsriTokenSecureStorage.KEY_REFRESH_TOKEN, token);
        }
    }

    getRefreshTokenOrDefault(defaultValue = '') {
        if (this._storage) {
            return this._storage.getStringValueOrDefault(EsriTokenSecureStorage.KEY_REFRESH_TOKEN, defaultValue);
        }
        return defaultValue;
    }

    saveExpiresAt(time) {
        if (this._storage) {
            this._storage.putStringValue(EsriTokenSecureStorage.KEY_EXPIRES_AT, String(time));
        }
    }

    getExpiresAtOrDefault(defaultValue = '0') {
        if (this._storage) {
            return this._storage.getStringValueOrDefault(EsriTokenSecureStorage.KEY_EXPIRES_AT, defaultValue);
        }
        return defaultValue;
    }

    saveExpiresIn(time) {
        if (this._storage) {
            this._storage.putStringValue(EsriTokenSecureStorage.KEY_EXPIRES_IN, String(time));
        }
    }

    getExpiresInOrDefault(defaultValue = '0') {
        if (this._storage) {
            return this._storage.getStringValueOrDefault(EsriTokenSecureStorage.KEY_EXPIRES_IN, defaultValue);
        }
        return defaultValue;
    }
}

EsriTokenSecureStorage.KEY_ACCESS_TOKEN = 'ACCESS_TOKEN';
EsriTokenSecureStorage.KEY_REFRESH_TOKEN = 'REFRESH_TOKEN';
EsriTokenSecureStorage.KEY_EXPIRES_AT = 'EXPIRES_AT';
EsriTokenSecureStorage.KEY_EXPIRES_IN = 'EXPIRES_IN';
