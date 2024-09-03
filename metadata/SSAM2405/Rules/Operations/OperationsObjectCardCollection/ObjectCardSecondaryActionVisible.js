import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import ObjectCardSecondaryButtonVisible from '../../OverviewPage/MyWorkSection/ObjectCardSecondaryButtonVisible';

export default function ObjectCardSecondaryActionVisible(clientAPI) {
    return IsOperationLevelAssigmentType(clientAPI) ? ObjectCardSecondaryButtonVisible(clientAPI) : false;
}
