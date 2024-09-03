import CommonLibrary from '../Common/Library/CommonLibrary';

export default function SyncErrorCloseIsVisible(context) {
    let previousPage = CommonLibrary.getPreviousPageName(context);
    if (previousPage === 'ErrorArchiveAndSync' || context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().SlideOutMenu) {
        return false;
    }
    return true;
}
