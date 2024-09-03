import ObjectCardPrimaryButtonOnPress from '../../OverviewPage/MyWorkSection/ObjectCardPrimaryButtonOnPress';
import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import OperationChangeStatusOptions from '../MobileStatus/OperationChangeStatusOptions';
import libVal from '../../Common/Library/ValidationLibrary';

export default async function ObjectCardPrimaryActionOnPress(context) {
    const binding = context.getPageProxy().getActionBinding();
    
    if (IsOperationLevelAssigmentType(context)) {
        return ObjectCardPrimaryButtonOnPress(context);
    }

    const options = await OperationChangeStatusOptions(context, binding);

    if (libVal.evalIsEmpty(options)) {
        return null;
    } else {
        context.getPageProxy().setActionBinding(binding);
        return context.executeAction(options[0].OnPress);
    }
}
