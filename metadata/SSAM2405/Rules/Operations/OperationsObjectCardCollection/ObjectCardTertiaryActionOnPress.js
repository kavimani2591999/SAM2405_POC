import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import ObjectCardTertiaryButtonOnPress from '../../OverviewPage/MyWorkSection/ObjectCardTertiaryButtonOnPress';

export default function ObjectCardTertiaryActionOnPress(context) {
    return IsOperationLevelAssigmentType(context) ? ObjectCardTertiaryButtonOnPress(context) : null;
}
