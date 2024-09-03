import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import ObjectCardTertiaryButtonTitle from '../../OverviewPage/MyWorkSection/ObjectCardTertiaryButtonTitle';

export default function ObjectCardTertiaryActionTitle(context) {
    return IsOperationLevelAssigmentType(context) ? ObjectCardTertiaryButtonTitle(context) : '';
}
