import ApprovalsReadLink from './ApprovalsReadLink';
import ApprovalsQueryOptions from './ApprovalsQueryOptions';
import libCommon from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import { WCMSystemStatuses } from '../SafetyCertificates/SafetyCertificatesLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export const WCMTypeAbbrev = Object.freeze({
    WCMApplication: 'WA',
    WCMDocumentHeader: 'WD',
});

export default async function PendingApprovalsTarget(context) {
    /** @type {WCMApplication | WCMDocumentHeader} */
    const binding = context.getPageProxy().binding;
    const tCertificate = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentHeader.global').getValue();
    const tPermit = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue();

    const objectType = {
        [tCertificate]: WCMTypeAbbrev.WCMDocumentHeader,
        [tPermit]: WCMTypeAbbrev.WCMApplication,
    }[binding['@odata.type']];

    return context.read('/SAPAssetManager/Services/AssetManager.service', ApprovalsReadLink(context), [], ApprovalsQueryOptions('pending'))
        .then((/** @type {WCMApprovalProcess} */ processes) => {
            if (ValidationLibrary.evalIsEmpty(processes)) {
                return [];
            }

            // only workpermit approval issue is supported for now
            const isWorkPermit = tPermit === binding['@odata.type'];
            const isIssueActionEnabled = canApproveRole(context) && isWorkPermit && canIssueByHeaderStatus(binding);
            const lowestPendingCounter = processes.getItem(0).Counter;  // processes are sorted by Counter, and all are pending

            return Promise.all(Array.from(processes, async (/** @type {WCMApprovalProcess} */ p) => {
                let canBeIssued = false;
                if (isIssueActionEnabled) {
                    const isLowestPendingCounter = p.Counter === lowestPendingCounter;

                    if (isLowestPendingCounter) {
                        canBeIssued = await HasWCMObjectApproval(context, objectType, p.Permit, binding.PlanningPlant);
                    }
                }

                return { ...p, canBeIssued };
            }));
        });
}

async function HasWCMObjectApproval(context, objectType, permit, planningPlant) {
    try {
        const objectApprovalsCount = await libCommon.getEntitySetCount(context, 'WCMObjectApprovals', `$filter=${getPermitsFilter(context, objectType, permit, planningPlant)}`);
        return !!objectApprovalsCount;
    } catch (error) {
        Logger.error(`Error while getting WCMObjectApprovals count: ${error}`);
    }
    return false;
}

/**
 * Get filter string for permits
 * @param {ClientAPI} context
 * @param {String} objectType
 * @param {String|Array<String>} permit
 * @param {String} planningPlant
 * @returns {String}
 */
export function getPermitsFilter(context, objectType, permits, planningPlant) {
    const permitFilterStr = (typeof permits === 'string' ? [permits] : permits).map(prmt => `Permit eq '${prmt}'`).join(' or ');
    return `ObjectType eq '${objectType}' and (${permitFilterStr}) and PlanningPlant eq '${planningPlant}' and Agent eq '${libCommon.getSapUserName(context)}'`;
}

/** @param {WCMDocumentHeader | WCMApplication} binding  */
export function canIssueByHeaderStatus(binding) {
    return binding.ActualSystemStatus === WCMSystemStatuses.Prepared;
}

export function canApproveRole(context) {
    return libCommon.getAppParam(context, 'USER_AUTHORIZATIONS', 'WCMApprovalRole') === 'Y';
}
