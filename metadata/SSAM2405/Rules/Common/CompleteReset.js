import libCom from './Library/CommonLibrary';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import locationLib from '../LocationTracking/LocationTrackingLibrary';
import ApplicationSettings from './Library/ApplicationSettings';
import errorLib from './Library/ErrorLibrary';
import { getMapControlInOverViewPage } from '../UserPersonas/OverviewUserPersona';
import PersonaLibrary from '../Persona/PersonaLibrary';
import IsESRINameUserAuthEnabled from '../ESRI/IsESRINameUserAuthEnabled';
import EsriLibrary from '../ESRI/EsriLibrary';

export default function CompleteReset(clientAPI, setInitialSync = true) {
    // Clear cache settings in map before reset
    const mapControl = getMapControlInOverViewPage(clientAPI);
    if (libCom.isDefined(mapControl)) {
        const mapExtension = mapControl.getExtensions()[0];
        if (libCom.isDefined(mapExtension)) {
            mapExtension.clearUserDefaults();
        }
    }

    //Clear the esri named user authentication token
    if (userFeaturesLib.isFeatureEnabled(clientAPI,clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/GIS.global').getValue()) && IsESRINameUserAuthEnabled(clientAPI)) {
        EsriLibrary.ResetESRIAccessToken(clientAPI);
    }

    // Changing the flag back to false to execute Update action again on subsequent reset
    userFeaturesLib.diableAllFeatureFlags(clientAPI);
    ApplicationSettings.setBoolean(clientAPI, 'didSetUserGeneralInfos', false);
    ApplicationSettings.setBoolean(clientAPI, 'initialSync', setInitialSync);
    //Reset the backend version that was cache
    ApplicationSettings.remove(clientAPI, 'BackendVersion');

    // Reset Personalization configuration
    ApplicationSettings.remove(clientAPI, 'MeasuringPointView');
    ApplicationSettings.remove(clientAPI, 'InspectionCharacteristicView');
    ApplicationSettings.remove(clientAPI, 'MeterView');

    // Disable service and rsset user switch for location tracking feature
    locationLib.disableService(clientAPI);
    locationLib.setUserSwitch(clientAPI, '');

    // Clear error messages
    errorLib.clearError(clientAPI);
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'UserPersonas', [], '')
        .then(
            userPersonas => {
                if (userPersonas) {
                    Array.from(userPersonas).forEach((/** @type {UserPersona} */ userPersona) => PersonaLibrary.removeLayoutStylePreference(clientAPI, userPersona.UserPersona));
                }
        }).catch(() => {
            return Promise.resolve();
          });
}
