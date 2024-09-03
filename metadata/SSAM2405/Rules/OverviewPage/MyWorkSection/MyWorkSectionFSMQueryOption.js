import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import MyWorkSectionFSMFilterQuery from './MyWorkSectionFSMFilterQuery';
import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import UserFeaturesLibrary from '../../UserFeatures/UserFeaturesLibrary';

//My Work Section Query Option
export default function MyWorkSectionQueryOption(context) {
    let orderBy;
    let expand;
    let top = '$top=50';
    let entitySet;

    return MyWorkSectionFSMFilterQuery(context).then(filter => {
        if (IsOperationLevelAssigmentType(context)) {
            //My Operation Query
            orderBy = '$orderby=OperationMobileStatus_Nav/MobileStatus desc,PersonNum,WOHeader/DueDate';
            expand = '$expand=Confirmations,OperationMobileStatus_Nav,OperationMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav/NextOverallStatusCfg_Nav,OperationLongText,WOHeader,UserTimeEntry_Nav,WOHeader/WOPriority,EquipmentOperation,EquipmentOperation/Location_Nav,FunctionalLocationOperation,FunctionalLocationOperation/Location_Nav,Tools,WOOprDocuments_Nav';
            entitySet = 'MyWorkOrderOperations';
            if (UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
                expand += ',WOHeader/OrderISULinks,WOHeader/DisconnectActivity_Nav';
            }
            libCom.setStateVariable(context, 'OPERATIONS_FILTER', { entity: entitySet, query: filter, localizeTextX: 'operations_x', localizeTextXX: 'operations_x_x' });
        } else if (IsSubOperationLevelAssigmentType(context)) {
            //My SubOperation Query
            orderBy = '$orderby=SubOpMobileStatus_Nav/MobileStatus desc,PersonNum,WorkOrderOperation/WOHeader/DueDate';
            expand = '$expand=Confirmations,SubOpMobileStatus_Nav,SubOpMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav/NextOverallStatusCfg_Nav,SubOperationLongText,WorkOrderOperation,WorkOrderOperation/WOHeader,UserTimeEntry_Nav,WorkOrderOperation/WOHeader/WOPriority,EquipmentSubOperation,EquipmentSubOperation/Location_Nav,FunctionalLocationSubOperation,FunctionalLocationSubOperation/Location_Nav';
            entitySet = 'MyWorkOrderSubOperations';
            if (UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
                expand += ',WorkOrderOperation/WOHeader/OrderISULinks,WorkOrderOperation/WOHeader/DisconnectActivity_Nav';
            }
            libCom.setStateVariable(context, 'OPERATIONS_FILTER', { entity: entitySet, query: filter, localizeTextX: 'operations_x', localizeTextXX: 'operations_x_x' });
        } else {
            //My Work Order Query
            orderBy = '$orderby=OrderMobileStatus_Nav/MobileStatus desc,WOPartners/PersonnelNum,DueDate,Priority,MarkedJob/PreferenceValue';
            expand = '$expand=Confirmations,Equipment,Equipment/Location_Nav,FunctionalLocation,FunctionalLocation/Location_Nav,WOPriority,Components,OrderMobileStatus_Nav,OrderMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav/NextOverallStatusCfg_Nav,MarkedJob,HeaderLongText,WOPartners';
            if (UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
                expand += ',OrderISULinks,DisconnectActivity_Nav';
            }
            entitySet = 'MyWorkOrderHeaders';
            libCom.setStateVariable(context, 'WORKORDER_FILTER', filter);
        }
        filter = filter + '&' + orderBy + '&' + expand + '&' + top;

        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], filter).then(result => {
            if (result) {
                return result;
            }
            return [];
        }).catch(error => {
            Logger.error(error);
        });
    });
}
