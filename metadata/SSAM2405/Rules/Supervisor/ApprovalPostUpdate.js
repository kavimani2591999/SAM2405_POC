import libMobile from '../MobileStatus/MobileStatusLibrary';
import NavOnCompleteWorkOrderPage from '../WorkOrders/NavOnCompleteWorkOrderPage';
import NavOnCompleteOperationPage from '../WorkOrders/Operations/NavOnCompleteOperationPage';
import libCom from '../Common/Library/CommonLibrary';

/**
* Display warning dialog and open complete modal page after supervisor approved business object
* @param {IClientAPI} context
*/
export default function ApprovalPostUpdate(context) {
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusSuccessMessage.action').then(() => {
        return context.executeAction('/SAPAssetManager/Actions/Supervisor/AutoCompleteWarningDialog.action').then(() => {
            let backupBinding = libCom.getStateVariable(context, 'ApproveBindingBackup');
            if (backupBinding) {
                context.getPageProxy().setActionBinding(backupBinding);
                libCom.removeStateVariable(context, 'ApproveBindingBackup');
            }
            if (libMobile.isHeaderStatusChangeable(context)) {
                return NavOnCompleteWorkOrderPage(context);
            } else {
                return NavOnCompleteOperationPage(context);
            }
        });
    });
}
