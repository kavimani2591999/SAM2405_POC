import EquipmentDetailsNav from '../../Equipment/EquipmentDetailsNav';
import { EquipmentLibrary as libEquipment } from '../../Equipment/EquipmentLibrary';
import Logger from '../../Log/Logger';
import libSearch from '../OnlineSearchLibrary';

/**
* Navigates to either offline or online equipment details page based on whether equipment is available offline or not
* @param {IClientAPI} context
*/
export default function OnlineSearchEquipmentDetailsNav(context) {
    let pageProxy = context.getPageProxy();
    if (libSearch.isOnlineEntityAvailableOffline(pageProxy, 'MyEquipments', 'EquipId')) {
        return EquipmentDetailsNav(context);
    }
    
    const actionContext = pageProxy.getActionBinding();
    const queryOpts = libEquipment.onlineEquipmentDetailsQueryOptions();

    context.showActivityIndicator();
    return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', actionContext['@odata.readLink'], [], queryOpts).then(results => {
        pageProxy.setActionBinding(results.getItem(0));
        return context.executeAction('/SAPAssetManager/Actions/Equipment/OnlineEquipmentDetailsNav.action');
    }, error => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryEquipment.global').getValue(), error);
    }).finally(() => context.dismissActivityIndicator());
}
