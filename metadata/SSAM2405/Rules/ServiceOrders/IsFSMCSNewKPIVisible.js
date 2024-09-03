import IsFSMCSSectionVisible from './IsFSMCSSectionVisible';
import libMobile from '../MobileStatus/MobileStatusLibrary';
import IsOperationLevelAssigmentType from '../WorkOrders/Operations/IsOperationLevelAssigmentType';
import IsNewLayoutEnabled from '../Common/IsNewLayoutEnabled';

export default function IsFSMCSNewKPIVisible(context) {
    let isOperationLevel = IsOperationLevelAssigmentType(context);
    let isHeaderLevel = libMobile.isHeaderStatusChangeable(context);
    return IsFSMCSSectionVisible(context) && (isHeaderLevel || isOperationLevel) && IsNewLayoutEnabled(context);
}
