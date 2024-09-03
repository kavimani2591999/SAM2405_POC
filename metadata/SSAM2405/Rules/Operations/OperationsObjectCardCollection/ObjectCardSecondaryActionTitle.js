import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import ObjectCardSecondaryButtonTitle from '../../OverviewPage/MyWorkSection/ObjectCardSecondaryButtonTitle';

export default function ObjectCardSecondaryActionTitle(context) {
    return IsOperationLevelAssigmentType(context) ? ObjectCardSecondaryButtonTitle(context) : '';
}
