import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import WorkOrderChangeStatusOptions from '../../WorkOrders/MobileStatus/WorkOrderChangeStatusOptions';
import OperationChangeStatusOptions from '../../Operations/MobileStatus/OperationChangeStatusOptions';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import SubOperationChangeStatusOptions from '../../SubOperations/SubOperationChangeStatusOptions';
import libCom from '../../Common/Library/CommonLibrary';
import IsFSMS4SectionVisible from '../../ServiceOrders/IsFSMS4SectionVisible';
import IsServiceOrderLevel from '../../ServiceOrders/IsServiceOrderLevel';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function ObjectCardSecondaryButtonOnPress(context) {
    const binding = context.getPageProxy().getActionBinding();

    let getStatusOptionsPromise;
    if (IsFSMS4SectionVisible(context)) {
        if (IsServiceOrderLevel(context)) {
            getStatusOptionsPromise = WorkOrderChangeStatusOptions(context, binding);
        } else {
            getStatusOptionsPromise = S4ServiceLibrary.getAvailableStatusesServiceItem(context);
        }
    } else {
        if (IsOperationLevelAssigmentType(context)) {
            //My Operation Secondary Button
            getStatusOptionsPromise = OperationChangeStatusOptions(context, binding);
        } else if (IsSubOperationLevelAssigmentType(context)) {
            //My SubOperation Secondary Button
            getStatusOptionsPromise = SubOperationChangeStatusOptions(context, binding);
        } else {
            //My Work Order Secondary Button
            getStatusOptionsPromise = WorkOrderChangeStatusOptions(context, binding);
        }
    }
    libCom.setStateVariable(context, 'IsOnOperationBinding', binding);
    return getStatusOptionsPromise.then(items => {
        sortStatusesByTransitionType(items);
        for (let status of items) {
            if (status.TransitionType === 'S' || status.TransitionType === 'N') {
                context.getPageProxy().setActionBinding(binding);
                return context.executeAction(status.OnPress);
            }
        }
        return '';
    });
}

export function sortStatusesByTransitionType(statuses) {
    if (!statuses || statuses.length === 0) return;

    statuses.sort((a, b) => {
        if (a.TransitionType < b.TransitionType) {
            return -1;
        }
        if (a.TransitionType > b.TransitionType) {
            return 1;
        }
        return 0;
    });
}
