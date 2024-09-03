import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';

/**
 * @param {IClientAPI} context
 * @param {MyWorkOrderSubOperation} subOperation */
export default function SubOperationEnableMobileStatus(context, subOperation) {

    //We don't allow local mobile status changes if App Parameter MOBILESTATUS - EnableOnLocalBusinessObjects = N
    const isLocal = libCommon.isCurrentReadLinkLocal(subOperation['@odata.readLink']);
    if (isLocal && !libCommon.isAppParameterEnabled(context, 'MOBILESTATUS', 'EnableOnLocalBusinessObjects')) {
        return Promise.resolve(false);
    }

    //We don't allow mobile status changes if sub operation related to work order in Created state
    if (libWO.isWorkOrderInCreatedState(context, subOperation)) {
        return Promise.resolve(false);
    }

    const started = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const transfer = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
    const complete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const rejected = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
    let mobileStatus = libMobile.getMobileStatus(subOperation, context);

    if (libMobile.isSubOperationStatusChangeable(context)) {
        if (mobileStatus === transfer || mobileStatus === complete || mobileStatus === rejected) {
            return Promise.resolve(false);
        } else if (mobileStatus === started) {
            return Promise.resolve(true);
        } else {
            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderSubOperations', `$filter=SubOpMobileStatus_Nav/MobileStatus eq '${started}'`)
                .then(startedOperationCount => !isLocal || startedOperationCount === 0);
        }
    } else if (libMobile.isOperationStatusChangeable(context)) {
        //Enable sub-operation status changes only if operation is started.
        const operationObj = subOperation.WorkOrderOperation;
        if (operationObj) {
            mobileStatus = libMobile.getMobileStatus(operationObj, context);
            return Promise.resolve(mobileStatus === started);
        }
    }
    const headerMobileStatus = libMobile.getMobileStatus(subOperation.WorkOrderOperation.WOHeader, context);
    return Promise.resolve(headerMobileStatus === started);
}
