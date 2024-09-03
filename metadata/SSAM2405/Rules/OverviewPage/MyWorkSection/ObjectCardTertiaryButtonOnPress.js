import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import WorkOrderChangeStatusOptions from '../../WorkOrders/MobileStatus/WorkOrderChangeStatusOptions';
import OperationChangeStatusOptions from '../../Operations/MobileStatus/OperationChangeStatusOptions';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import SubOperationChangeStatusOptions from '../../SubOperations/SubOperationChangeStatusOptions';
import IsFSMS4SectionVisible from '../../ServiceOrders/IsFSMS4SectionVisible';
import IsServiceOrderLevel from '../../ServiceOrders/IsServiceOrderLevel';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function ObjectCardTertiaryButtonOnPress(context) {
    const binding = context.getPageProxy().getActionBinding();

    let getStatusOptionsPromise;
    if (IsFSMS4SectionVisible(context)) {
        if (IsServiceOrderLevel(context)) {
            getStatusOptionsPromise = WorkOrderChangeStatusOptions(context, binding);
        } else {
            getStatusOptionsPromise = S4ServiceLibrary.getAvailableStatusesServiceItem(context);
        }
        return getStatusOptionsPromise.then(items => {
            for (const element of items) {
                if (element.TransitionType === 'S') {
                    context.getPageProxy().setActionBinding(binding);
                    return context.executeAction(element.OnPress);
                }
            }
            return '';
        });
    } else {
        if (IsOperationLevelAssigmentType(context)) {
            //My Operation Tertiary Button
            getStatusOptionsPromise = OperationChangeStatusOptions(context, binding);
        } else if (IsSubOperationLevelAssigmentType(context)) {
            //My SubOperation Tertiary Button
            getStatusOptionsPromise = SubOperationChangeStatusOptions(context, binding);
        } else {
            //My Work Order Tertiary Button
            getStatusOptionsPromise = WorkOrderChangeStatusOptions(context, binding);
        }
    }
    return getStatusOptionsPromise.then(items => {
        let negative;
        for (const element of items) {
            if (element.TransitionType === 'N') negative = true;                
        }
        for (const element of items) {
            if (element.TransitionType === 'T' || (element.TransitionType === 'S' && negative)) { //Handle third button on overflow if negative was used
                context.getPageProxy().setActionBinding(binding);
                return context.executeAction(element.OnPress);
            }
        }
        return '';
    });
}
