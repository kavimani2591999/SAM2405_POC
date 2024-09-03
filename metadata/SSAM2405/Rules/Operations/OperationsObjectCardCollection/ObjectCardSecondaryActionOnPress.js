import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import ObjectCardSecondaryButtonOnPress from '../../OverviewPage/MyWorkSection/ObjectCardSecondaryButtonOnPress';

export default function ObjectCardSecondaryActionOnPress(context) {
    return IsOperationLevelAssigmentType(context) ? ObjectCardSecondaryButtonOnPress(context) : null;
}
