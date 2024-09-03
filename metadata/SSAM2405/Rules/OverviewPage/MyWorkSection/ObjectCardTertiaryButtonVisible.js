import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import libPersona from '../../Persona/PersonaLibrary';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsFSMS4SectionVisible from '../../ServiceOrders/IsFSMS4SectionVisible';

export default function ObjectCardTertiaryButtonVisible(context) {
    let roleType = CommonLibrary.getStateVariable(context, 'UserRoleType');
    let persona = libPersona.getActivePersona(context);
    let overallStatusSeq_Nav, mobileStatus;
    const COMPLETE = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const REVIEW = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());

    if (IsFSMS4SectionVisible(context)) {
        overallStatusSeq_Nav = context.binding.MobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
        let layout = getButtonLayout(overallStatusSeq_Nav, roleType, persona);

        return layout.secondary && layout.negative;
    } else {
        //My Operation Tertiary Button
        if (IsOperationLevelAssigmentType(context)) {
            overallStatusSeq_Nav = context.binding.OperationMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
            mobileStatus = context.binding.OperationMobileStatus_Nav.MobileStatus;
        } else if (IsSubOperationLevelAssigmentType(context)) {
        //SubOperation Tertiary Button
            overallStatusSeq_Nav = context.binding.SubOpMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
            mobileStatus = context.binding.SubOpMobileStatus_Nav.MobileStatus;
        } else {
        //My Work Order Tertiary Button
            overallStatusSeq_Nav = context.binding.OrderMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
            mobileStatus = context.binding.OrderMobileStatus_Nav.MobileStatus;
        }
    }
    let layout = getButtonLayout(overallStatusSeq_Nav, roleType, persona);
    for (const element of overallStatusSeq_Nav) {
        let toStatus = element.NextOverallStatusCfg_Nav.MobileStatus;
        if (element.RoleType === roleType && element.UserPersona === persona && element.TransitionType === 'T') {
            if (roleType === 'S' && toStatus === COMPLETE && mobileStatus === REVIEW) return false; //Don't show COMPLETE if this is a supervisor review
            return true;
        }
        if (layout.secondary && layout.negative && element.RoleType === roleType && element.UserPersona === persona && element.TransitionType === 'S') { //Handle third button on overflow if negative was used
            if (roleType === 'S' && toStatus === COMPLETE && mobileStatus === REVIEW) return false; //Don't show COMPLETE if this is a supervisor review
            return true;
        }
    }
    return false;
}

/**
 * Check if we have negative and secondary button statuses
 * @param {*} overallStatusSeq_Nav 
 * @param {*} roleType 
 * @param {*} persona 
 * @returns 
 */
function getButtonLayout(overallStatusSeq_Nav, roleType, persona) {
    let obj = {};
    for (const element of overallStatusSeq_Nav) {
        if (element.RoleType === roleType && element.UserPersona === persona && element.TransitionType === 'S') {
            obj.secondary = true;
        } else if (element.RoleType === roleType && element.UserPersona === persona && element.TransitionType === 'N') {
            obj.negative = true;
        }
    }
    return obj;
}

