import Logger from '../Log/Logger';
import OnlineSearchLibrary from '../OnlineSearch/OnlineSearchLibrary';
import { navigateOnRead } from './FunctionalLocationDetailsNav';

export default function NavToFunctionalLocationDetails(context) {
    let pageProxy = context.getPageProxy();
    const actionContext = pageProxy.getActionBinding();

    if (OnlineSearchLibrary.isOnlineEntityAvailableOffline(pageProxy, 'MyFunctionalLocations', 'FuncLocId')) {
        return navigateOnRead(context, `MyFunctionalLocations('${actionContext.FuncLocIdIntern}')`);
    }

    const queryOpts = '$expand=FuncLocSystemStatus,FuncLocUserStatus,FuncLocClass,FuncLocDocument,FuncLocPartner';
    return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', actionContext['@odata.readLink'], [], queryOpts)
        .then(results => {
            pageProxy.setActionBinding(results.getItem(0));
            return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/OnlineFunctionalLocationDetailsNav.action');
        })
        .catch(error => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryOnlineFunctionalLocation.global').getValue(), error);
        });
}
