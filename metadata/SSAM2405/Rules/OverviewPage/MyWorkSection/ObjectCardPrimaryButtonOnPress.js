import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import WorkOrderChangeStatusOptions from '../../WorkOrders/MobileStatus/WorkOrderChangeStatusOptions';
import OperationChangeStatusOptions from '../../Operations/MobileStatus/OperationChangeStatusOptions';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import SubOperationChangeStatusOptions from '../../SubOperations/SubOperationChangeStatusOptions';
import libCom from '../../Common/Library/CommonLibrary';
import IsFSMS4SectionVisible from '../../ServiceOrders/IsFSMS4SectionVisible';
import IsServiceOrderLevel from '../../ServiceOrders/IsServiceOrderLevel';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function ObjectCardPrimaryButtonOnPress(context) {
    const binding = context.getPageProxy().getActionBinding();
    const APPROVE = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ApproveParameterName.global').getValue());
    let getStatusOptionsPromise;

    if (IsFSMS4SectionVisible(context)) {
        if (IsServiceOrderLevel(context)) {
            getStatusOptionsPromise = WorkOrderChangeStatusOptions(context, binding);
        } else {
            getStatusOptionsPromise = S4ServiceLibrary.getAvailableStatusesServiceItem(context);
        }
    } else if (IsOperationLevelAssigmentType(context)) {
            //My Operation Primary Button
            getStatusOptionsPromise = OperationChangeStatusOptions(context, binding);
    } else if (IsSubOperationLevelAssigmentType(context)) {
            //My SubOperation Primary Button
            getStatusOptionsPromise = SubOperationChangeStatusOptions(context, binding);
    } else {
            //My Work Order Primary Button
            getStatusOptionsPromise = WorkOrderChangeStatusOptions(context, binding);
    }

    libCom.setStateVariable(context, 'IsOnOperationBinding', binding);
    libCom.removeStateVariable(context, 'ApproveBindingBackup');
    return getStatusOptionsPromise.then(items => {
        for (const element of items) {
            if (element.TransitionType === 'P') {
                context.getPageProxy().setActionBinding(binding);
                if (element.Status === APPROVE) {
                    libCom.setStateVariable(context, 'ApproveBindingBackup', binding);
                }
                return context.executeAction(element.OnPress);
            }
        }
        return '';
    });
}
