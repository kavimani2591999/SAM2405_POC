import libMobStatus from '../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import OperationsEntitySet from '../../WorkOrders/Operations/OperationsEntitySet';
import { OperationConstants } from '../../WorkOrders/Operations/WorkOrderOperationLibrary';

export default async function ConfirmAllButtonVisible(context) {
    const binding = context.getPageProxy().binding;
    const filterPlus = libCommon.isAppParameterEnabled(context, 'MOBILESTATUS', 'EnableOnLocalBusinessObjects') ? '' : " and not substringof('L', OperationNo)"; //Exclude locals if parameter restricts them

    if (libMobStatus.isHeaderStatusChangeable(context) && (libMobStatus.getMobileStatus(binding, context) === libMobStatus.getMobileStatusValueConstants(context).STARTED)) {
        return !!(await libCommon.getEntitySetCount(context, OperationsEntitySet(context, binding), `$filter=${OperationConstants.notFinallyConfirmedFilter() + filterPlus}`));
    }
    return false;
}
