import { WorkOrderDetailsPageName } from '../../WorkOrders/Details/WorkOrderDetailsPageToOpen';

export default function WorkOrderUnAssignNav(context) {
    const pagePath = `#Page:${WorkOrderDetailsPageName(context)}`;
    
    context.evaluateTargetPathForAPI(pagePath).getClientData().IsReAssign=false;
    context.evaluateTargetPathForAPI(pagePath).getClientData().IsAssign=false;
    context.evaluateTargetPathForAPI(pagePath).getClientData().IsUnAssign=true;
    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignNav.action');
}
