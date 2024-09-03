import libWOStatus from '../../MobileStatus/WorkOrderMobileStatusLibrary';
import libCommon from '../../../Common/Library/CommonLibrary';
import { isISUInstall } from '../../../Meter/ISUProcess';
import { WorkOrderLibrary as libWO } from '../../WorkOrderLibrary';
import IsMeterComponentEnabled from '../../../ComponentsEnablement/IsMeterComponentEnabled';
import NewMeterSectionLibrary from '../../../Meter/Common/NewMeterSectionLibrary';

export default async function AllowMeterCreate(context, replaceBinding) {
    if (IsMeterComponentEnabled(context)) {
        let woBinding = replaceBinding || await NewMeterSectionLibrary.getWorkOrderDetailedBindingObject(context);

        if (libWO.isWorkOrderInCreatedState(context, woBinding)) {
            return Promise.resolve(false);
        }

        let currentReadLink = woBinding['@odata.readLink'];
        let isLocal = libCommon.isCurrentReadLinkLocal(currentReadLink);
        return NewMeterSectionLibrary.isTechObjectStarted(context, woBinding).then(isStarted => {
            if (!isLocal && isStarted) {
                return libWOStatus.isOrderComplete(context).then(status => {
                    if (!status) {
                        return isISUInstall(woBinding.OrderISULinks);
                    }
                    return false;
                });
            }
            return false;
        });
    }

    return Promise.resolve(false);
}
