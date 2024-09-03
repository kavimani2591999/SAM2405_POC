import ObjectCardPrimaryButtonTitle from '../../OverviewPage/MyWorkSection/ObjectCardPrimaryButtonTitle';
import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import OperationChangeStatusOptions from '../MobileStatus/OperationChangeStatusOptions';
import libVal from '../../Common/Library/ValidationLibrary';
import {isSuboperationLevelAssignment} from '../../WorkOrders/Operations/Details/SubOperationObjectCard/SubOperationObjectCards';

export default async function ObjectCardPrimaryActionTitle(context) {
    if (IsOperationLevelAssigmentType(context)) {
        return ObjectCardPrimaryButtonTitle(context);
    }
    const options = await OperationChangeStatusOptions(context);
    return libVal.evalIsEmpty(options) || isSuboperationLevelAssignment(context) ? '' : options[0].Title;
}
