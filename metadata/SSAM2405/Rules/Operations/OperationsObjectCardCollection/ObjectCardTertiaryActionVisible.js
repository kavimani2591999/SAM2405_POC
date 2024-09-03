import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import ObjectCardTertiaryButtonVisible from '../../OverviewPage/MyWorkSection/ObjectCardTertiaryButtonVisible';

export default function ObjectCardTertiaryActionVisible(context) {
    return IsOperationLevelAssigmentType(context) ? ObjectCardTertiaryButtonVisible(context) : false;
}
