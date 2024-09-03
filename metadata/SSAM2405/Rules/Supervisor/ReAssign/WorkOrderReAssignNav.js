import { WorkOrderDetailsPageName } from '../../WorkOrders/Details/WorkOrderDetailsPageToOpen';

export default function WorkOrderReAssignNav(context) {
    const pagePath = `#Page:${WorkOrderDetailsPageName(context)}`;

    context.evaluateTargetPathForAPI(pagePath).getClientData().IsUnAssign=false;
    context.evaluateTargetPathForAPI(pagePath).getClientData().IsAssign=false;
    context.evaluateTargetPathForAPI(pagePath).getClientData().IsReAssign=true;
    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignNav.action');
}
