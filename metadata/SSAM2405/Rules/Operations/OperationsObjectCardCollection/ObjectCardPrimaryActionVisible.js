import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import ObjectCardPrimaryButtonVisible from '../../OverviewPage/MyWorkSection/ObjectCardPrimaryButtonVisible';
import OperationChangeStatusOptions from '../MobileStatus/OperationChangeStatusOptions';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

export default async function ObjectCardPrimaryActionVisible(context) {
    const options = await OperationChangeStatusOptions(context);

    if (libMobile.isMobileStatusChangeAllowedForLocalObjects(context)) { //Check to see if this record is local and restricted from changing status
        if (IsOperationLevelAssigmentType(context)) {
            return ObjectCardPrimaryButtonVisible(context);
        }
        return options.length > 0;
    }
    return false;
}
