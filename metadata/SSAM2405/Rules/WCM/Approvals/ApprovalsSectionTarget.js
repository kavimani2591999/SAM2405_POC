import { canApproveRole, canIssueByHeaderStatus, getPermitsFilter, WCMTypeAbbrev } from './PendingApprovalsTarget';
import ApprovalsReadLink from './ApprovalsReadLink';
import Logger from '../../Log/Logger';
import { APPROVALS_FILTER } from './ApprovalsQueryOptions';


export default async function ApprovalsSectionTarget(context) {
    /** @type {WCMApplication | WCMDocumentHeader} */
    const binding = context.getPageProxy().binding;
    const cellBinding = {
        approvalsCanBeIssuedCount: 0,
    };
    if (binding['@odata.type'] !== context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue()) {
        return [cellBinding];
    }

    if (canApproveRole(context) && canIssueByHeaderStatus(binding) && binding.TrafficLight !== context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/TrafficLights/Approved.global').getValue()) {
        const processes = await getPendingApprovals(context);

        if (processes.length) {
            // [...new Set(processes.map(pr => pr.Permit))] is used to get list of unique permits from processes to avoid duplicates in query options
            const permitsAssignedToUser = await getPermitsAssignedToUser(context, binding, [...new Set(processes.map(pr => pr.Permit))]);

            if (permitsAssignedToUser.length) {
                // Count of processes that can be issued sequentially by the user
                let count = 0;
                for (let process of processes) {
                    if (!permitsAssignedToUser.some(item => item.Permit === process.Permit)) {
                        break;
                    }
                    count++;
                }

                cellBinding.approvalsCanBeIssuedCount = count;
            }
        }
    }

    return [cellBinding];
}

async function getPendingApprovals(context) {
    let processes = [];
    try {
        processes = await context.read('/SAPAssetManager/Services/AssetManager.service', ApprovalsReadLink(context), ['Permit'], `$filter=${APPROVALS_FILTER.pending}&$orderby=Counter`);
    } catch (error) {
        Logger.error('getPendingApprovals error', error);
    }

    return processes;
}

/** @param {WCMDocumentHeader | WCMApplication} binding  */
async function getPermitsAssignedToUser(context, binding, permits) {
    let permitsAssignedToUser = [];

    try {
        const filter = `$filter=${getPermitsFilter(context, WCMTypeAbbrev.WCMApplication, permits, binding.PlanningPlant)}`;
        permitsAssignedToUser = await context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMObjectApprovals', ['Permit'], filter);
    } catch (error) {
        Logger.error('getPermitsAssignedToUser error', error);
    }

    return permitsAssignedToUser;
}
