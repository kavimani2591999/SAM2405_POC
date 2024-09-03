import MDKVersionInfo from '../UserProfile/MDKVersionInfo';
import Logger from '../Log/Logger';
import ApplicationSettings from '../Common/Library/ApplicationSettings';
import PersonaLibrary from '../Persona/PersonaLibrary';
import isWindows from '../Common/IsWindows';

/**
* Updates App Information for cloud reporting metrics.
* Checks if App Info has changed or does not exist.
* Updates App Info if nonexistent or changed, then
* Does a fake entity update on UserGeneralInfos
* so a record is generated with updated app info in
* the header.
* @param {IClientAPI} context
*/
export default async function UpdateAppInformation(context) {

    const appName = 'SAP Service and Asset Manager'; // This should be the hardcoded app name
    const appVersion = context.getVersionInfo()['Application Version'];
    const backendVersion = await readBackendVersion(context);

    const mdkVersion = MDKVersionInfo(context);
    const platform = (function() {
        if (context.nativescript?.platformModule?.isIOS) {
            return 'ios';
        } else if (context.nativescript?.platformModule?.isAndroid) {
            return 'android';
        } else if (context.nativescript?.applicationModule?.windows) {
            return 'windows';
        } else {
            return 'unknown';
        }
    })();

    let personas = getPersonas(context);
    let xappinfo = `name=${appName};version=${appVersion};backend-version=${backendVersion};persona=${personas.join()};mdk-version=${mdkVersion};platform=${platform}`;
    return xappinfo;
}

function getPersonas(context) {
    let userpersonas = PersonaLibrary.getPersonas(context);
    let personas = [];
    for (let i = 0; i < userpersonas.length; i++) {
        switch (userpersonas[i]) {
            case 'MAINTENANCE_TECHNICIAN_STD':
            case 'MAINTENANCE_TECHNICIAN':
            case 'FIELD_SERVICE_TECHNICIAN_PRO':
            case 'FIELD_SERVICE_TECHNICIAN':
            case 'SAFETY_TECHNICIAN':
            case 'INVENTORY_CLERK':
                personas.push(userpersonas[i]);
                break;
            default:
                personas.push('CUS_PERSONA');
                break;
        }
    }
    return personas;
}

function readBackendVersion(context) {
    if (context.isDemoMode()) {
        return Promise.resolve('');
    }

    let version = ApplicationSettings.getString(context, 'BackendVersion');
    if (version) {
        return Promise.resolve(version);
    }

    let query = '$filter=SystemSettingName eq \'S4CORE\' or SystemSettingName eq \'S4MERP\' or SystemSettingName eq \'SMERP\'';

    return context.executeAction('/SAPAssetManager/Actions/OData/OpenOnlineService.action')
        .then(() => context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'UserSystemInfos', [], query))
        .then((results) => {
            const config = findConfig(context,results);
            
            if (config) {
                version = config.SystemSettingName + ' ' + config.SystemSettingValue;
                ApplicationSettings.setString(context, 'BackendVersion', version);
                return version;
            } else {
                return '';
            }
        })
        .catch((error) => {
            Logger.error('readBackendVersion', error);
            return '';
        });
}

function findConfig(context, results) {
    const configNames = ['S4CORE', 'S4MERP', 'SMERP'];
    if (results?.length > 0) {
        for (const name of configNames) {
            //Array.find() is not supported in windows so we used Array.filter()[0] instead 
            const config = isWindows(context)? results.filter(item => item.SystemSettingName === name)[0]: results.find(item => item.SystemSettingName === name);
            if (config) {
                return config;
            }
        }

    }
    return null;
}

