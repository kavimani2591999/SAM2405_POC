import libCom from '../../Common/Library/CommonLibrary';
import { cacheEntitySetsForOnlineSearchPage } from '../ExecuteNavToOnlineSearchPage';

/**
* Update list on download success
* @param {IClientAPI} context
*/
export default function DownloadSuccess(context) {
    const onlineSearchPage = context.evaluateTargetPathForAPI('#Page:OnlineSearch');
    onlineSearchPage.setActionBarItemVisible('SearchCriteria', true);
    libCom.removeStateVariable(context, 'OnlineSearchDownloadInProgress');

    libCom.clearFromClientData(context, ['MyEquipments', 'MyFunctionalLocations'], onlineSearchPage.getClientData());
    return cacheEntitySetsForOnlineSearchPage(context).then(() => {
        if (libCom.getPageName(context).includes('Details')) {
            libCom.setStateVariable(context, 'UpdateOnlineListOnReturn', true);
            return true;
        }
        const pageProxy = context.getPageProxy ? context.getPageProxy() : context;
        return pageProxy.getControl('SectionedTable').redraw();
    });
}
