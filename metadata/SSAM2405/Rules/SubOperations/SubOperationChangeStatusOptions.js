import mobileStatusOverride from '../MobileStatus/MobileStatusUpdateOverride';
import common from '../Common/Library/CommonLibrary';
import { GlobalVar } from '../Common/Library/GlobalCommon';
import libSubOpMobile from './MobileStatus/SubOperationMobileStatusLibrary';
import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';
import libSuper from '../Supervisor/SupervisorLibrary';
import personaLib from '../Persona/PersonaLibrary';
import IsPhaseModelEnabled from '../Common/IsPhaseModelEnabled';

export default function SubOperationChangeStatusOptions(context, /** @type {MyWorkOrderSubOperation} */ subOperation) {
    const STARTED = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const COMPLETE = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const TRANSFER = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
    const REVIEW = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());

    // If operation level assignment, only allow confirm/unconfirm. Otherwise, do the whole mobile status shebang.
    if (common.getWorkOrderAssignmentType(context) !== '3') {  // not suboperation level
        return SuboperationConfirmOrUnconfirm(context, subOperation);
    }

    const queryOptions = IsPhaseModelEnabled(context) ? '$expand=NextOverallStatusCfg_Nav' : `$filter=UserPersona eq '${personaLib.getActivePersona(context)}'&$expand=NextOverallStatusCfg_Nav`;
    return Promise.all([
        libSubOpMobile.isAnySubOperationStarted(context),
        roleCheck(context),
        context.read('/SAPAssetManager/Services/AssetManager.service', `${subOperation['@odata.readLink']}/SubOpMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav`, [], queryOptions),
        context.read('/SAPAssetManager/Services/AssetManager.service', 'EAMOverallStatusConfigs', [], `$filter=MobileStatus eq '${STARTED}' and NextOverallStatusSeq_Nav/any(seq : seq/RoleType eq 'T') and ObjectType eq 'WO_OPERATION'&$expand=OverallStatusSeq_Nav`),  // Supervisor Mode: allow tech to back up to STARTED if work order is in REVIEW and status is local
    ])
        .then((/** @type {[Boolean, String, ObservableArray<EAMOverallStatusSeq>, ObservableArray<EAMOverallStatusSeq>]} */[anythingStarted, userRoleType, codes, localReviewCodes]) => {
            codes = Array.from(codes).filter(i => i.NextOverallStatusCfg_Nav);
            const toolbarItems = codes.map((/** @type {EAMOverallStatusSeq} */ element) => {
                const statusElement = element.NextOverallStatusCfg_Nav;
                // If there is a TranslationTextKey available, use that for the popover item. Otherwise, use the OverallStatusLabel.
                const transitionText = statusElement.TransitionTextKey ? context.localizeText(statusElement.TransitionTextKey) : statusElement.OverallStatusLabel;

                if (statusElement.MobileStatus === COMPLETE && (element.RoleType === userRoleType || personaLib.isFieldServiceTechnician(context))) {
                    return { 'Status': statusElement.MobileStatus, 'Title': transitionText, 'OnPress': '/SAPAssetManager/Rules/WorkOrders/SubOperations/NavOnCompleteSubOperationPage.js', 'TransitionType': element.TransitionType };
                } else if (statusElement.MobileStatus === TRANSFER && (element.RoleType === userRoleType || !libSuper.isSupervisorFeatureEnabled(context))) {
                    return transferToolbarItem(statusElement, transitionText, element, context);
                } else if (!(statusElement.MobileStatus === STARTED && anythingStarted) && (element.RoleType === userRoleType || personaLib.isFieldServiceTechnician(context))) {
                    // Add all other items to possible transitions as-is
                    // Omit Started if other work orders have been started
                    // Omit statuses not relevant to current role
                    return { 'Status': statusElement.MobileStatus, 'Title': transitionText, 'OnPress': mobileStatusOverride(context, statusElement, 'SubOpMobileStatus_Nav', '/SAPAssetManager/Rules/MobileStatus/SubOperationMobileStatusPostUpdate.js', subOperation), 'TransitionType': element.TransitionType };
                }
                return undefined;
            }).filter(i => !!i);


            if (userRoleType === 'T' && subOperation.SubOpMobileStatus_Nav.MobileStatus === REVIEW && localReviewCodes.length > 0 && subOperation.SubOpMobileStatus_Nav['@sap.isLocal']) {
                return [...toolbarItems, { 'Status': COMPLETE, 'Title': localReviewCodes.getItem(0).TransitionTextKey, 'OnPress': '/SAPAssetManager/Rules/WorkOrders/SubOperations/NavOnCompleteSubOperationPage.js', 'TransitionType': localReviewCodes.getItem(0).OverallStatusSeq_Nav.TransitionType }];
            }
            return toolbarItems;
        });
}

function transferToolbarItem(statusElement, transitionText, element, context) {
    return {
        'Status': statusElement.MobileStatus,
        'Title': transitionText,
        'TransitionType': element.TransitionType,
        'OnPress': {
            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
            'Properties': {
                'Title': context.localizeText('confirm_status_change'),
                'Message': context.localizeText('transfer_suboperation'),
                'OKCaption': context.localizeText('ok'),
                'CancelCaption': context.localizeText('cancel'),
                'OnOK': '/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationTransferNav.action',
            },
        },
    };
}

export function CanConfirmUnconfirmSuboperation(context, subOperation) {
    const STARTED = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const operationMobileStatus = MobileStatusLibrary.getMobileStatus(subOperation.WorkOrderOperation, context);
    const headerMobileStatus = MobileStatusLibrary.getMobileStatus(subOperation.WorkOrderOperation.WOHeader, context);
    return operationMobileStatus === STARTED || headerMobileStatus === STARTED;
}

/** @param {MyWorkOrderSubOperation} subOperation  */
export function SuboperationConfirmOrUnconfirm(context, subOperation) {
    if (CanConfirmUnconfirmSuboperation(context, subOperation)) {
        return MobileStatusLibrary.isMobileStatusConfirmed(context, undefined, subOperation.SubOperationNo).then(result => {
            if (result) {
                return [{ 'Title': context.localizeText('unconfirm'), 'OnPress': '/SAPAssetManager/Rules/SubOperations/MobileStatus/SubOperationUnconfirmStatus.js' }];
            } else {
                return [{ 'Title': context.localizeText('confirm'), 'OnPress': '/SAPAssetManager/Rules/SubOperations/MobileStatus/SubOperationCompleteStatus.js' }];
            }
        });
    }
    context.dismissActivityIndicator();
    return Promise.resolve();
}


/**
 * Checks for supervisor feature enablement and returns role if applicable
 * @returns {Promise<String>} 'T' if Technician, 'S' if Supervisor or feature disabled
 */
function roleCheck(context) {
    const supervisorEnabled = libSuper.isSupervisorFeatureEnabled(context);
    const auth_supervisor = common.getAppParam(context, 'USER_AUTHORIZATIONS', 'SupervisorRole');
    const user = GlobalVar.getUserSystemInfo().get('PERNO');

    if (supervisorEnabled) {
        switch (auth_supervisor) {
            case 'Y': // Supervisor role set in config panel
                return Promise.resolve('S');
            case 'N': // Technician role set in config panel
                return Promise.resolve('T');
            default: // Role not set in config panel. Check data
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserRoles', [], `$filter=PersonnelNo eq '${user}'`).then(function(results) {
                    if (results && results.length > 0) {
                        return results.getItem(0).Role;
                    }
                    // If role cannot be found, assume supervisor
                    return 'S';
                });
        }
    } else {
        // Supervisor isn't enabled
        return Promise.resolve('S');
    }
}
