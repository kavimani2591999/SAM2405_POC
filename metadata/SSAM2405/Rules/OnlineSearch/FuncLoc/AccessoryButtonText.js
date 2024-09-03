import IsIOS from '../../Common/IsIOS';
import libSearch from '../OnlineSearchLibrary';

/**
* If device is ios and entity is available for download, display 'download' text, otherwise no text
* @param {IClientAPI} context
*/
export default function AccessoryButtonText(context) {
    return IsIOS(context) &&
        !libSearch.isOnlineEntityAvailableOffline(context, 'MyFunctionalLocations', 'FuncLocId') &&
        !libSearch.isCurrentListInSelectionMode(context) ?
        context.localizeText('download') :
        '';
}
