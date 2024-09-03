import { WorkOrderDetailsPageName } from '../../WorkOrders/Details/WorkOrderDetailsPageToOpen';

export default function WorkOrderAssignNav(context) {
    const pagePath = `#Page:${WorkOrderDetailsPageName(context)}`;

    context.evaluateTargetPathForAPI(pagePath).getClientData().IsUnAssign=false;
    context.evaluateTargetPathForAPI(pagePath).getClientData().IsReAssign=false;
    context.evaluateTargetPathForAPI(pagePath).getClientData().IsAssign=true;
    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignNav.action');
}
