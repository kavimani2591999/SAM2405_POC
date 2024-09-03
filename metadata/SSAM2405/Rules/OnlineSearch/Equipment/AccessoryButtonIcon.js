import IsAndroid from '../../Common/IsAndroid';
import libSearch from '../OnlineSearchLibrary';

/**
* If device is android and entity is available for download, display download icon, otherwise no icon
* @param {IClientAPI} context
*/
export default function AccessoryButtonIcon(context) {
    return IsAndroid(context) &&
        !libSearch.isOnlineEntityAvailableOffline(context, 'MyEquipments', 'EquipId') &&
        !libSearch.isCurrentListInSelectionMode(context) ?
        '$(PLT,\'\',/SAPAssetManager/Images/make_available_offline.android.png)' :
        '';
}
