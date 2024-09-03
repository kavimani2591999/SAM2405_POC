import libCom from '../../Common/Library/CommonLibrary';

/**
* Start download of an online entity (equipment/floc)
* Show error toast message, if download is already in progress
* @param {IClientAPI} context
*/
export default function DownloadToDevice(context) {
    if (!libCom.getStateVariable(context, 'OnlineSearchDownloadInProgress')) {
        disableActionsOnDownload(context);
        libCom.setStateVariable(context, 'OnlineSearchDownloadInProgress', true);
    
        return context.executeAction('/SAPAssetManager/Actions/OnlineSearch/DownloadInProgress.action');
    }

    return context.executeAction('/SAPAssetManager/Actions/OnlineSearch/DownloadInProgressErrorDialog.action');
}

function disableActionsOnDownload(context) {
    if (libCom.getPageName(context).includes('Details')) {
        context.getPageProxy().setActionBarItemVisible('Download', false);
    } else {
        const onlineSearchPage = context.evaluateTargetPathForAPI('#Page:OnlineSearch');
        onlineSearchPage.setActionBarItemVisible('SearchCriteria', false);
    }
}
