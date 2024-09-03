import { WorkOrderOperationDetailsPageNameToOpen } from '../../WorkOrders/Operations/Details/WorkOrderOperationDetailsPageToOpen';

export default function OperationAssignNav(context) {
    const pagePath = `#Page:${WorkOrderOperationDetailsPageNameToOpen(context)}`;

    context.evaluateTargetPathForAPI(pagePath).getClientData().IsUnAssign=false;
    context.evaluateTargetPathForAPI(pagePath).getClientData().IsReAssign=false;
    context.evaluateTargetPathForAPI(pagePath).getClientData().IsAssign=true;
    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/OperationAssignNav.action');
}
