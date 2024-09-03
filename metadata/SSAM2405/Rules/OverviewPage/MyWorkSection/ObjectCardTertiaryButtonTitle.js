import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import libPersona from '../../Persona/PersonaLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsFSMS4SectionVisible from '../../ServiceOrders/IsFSMS4SectionVisible';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';

export default function ObjectCardTertiaryButtonTitle(context) {
    let roletype = CommonLibrary.getStateVariable(context, 'UserRoleType');
    let persona = libPersona.getActivePersona(context);
    let overallStatusSeq_Nav;

    if (IsFSMS4SectionVisible(context)) {
        overallStatusSeq_Nav = context.binding.MobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
        let layout = getButtonLayout(overallStatusSeq_Nav, roletype, persona);
    
        if (layout.secondary && layout.negative) {
            let toStatus = layout.nextOverallStatusCfg_Nav.TransitionTextKey ? layout.nextOverallStatusCfg_Nav.TransitionTextKey : layout.nextOverallStatusCfg_Nav.OverallStatusLabel;
            return context.localizeText(toStatus);
        } else {
            return '';
        }
    } else {
        //My Operation Secondary Button
        if (IsOperationLevelAssigmentType(context)) {
            overallStatusSeq_Nav = context.binding.OperationMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
        } else if (IsSubOperationLevelAssigmentType(context)) {
            overallStatusSeq_Nav = context.binding.SubOpMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
        } else {
        //My Work Order Secondary Button
            overallStatusSeq_Nav = context.binding.OrderMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
        }
    }
    let layout = getButtonLayout(overallStatusSeq_Nav, roletype, persona);
    for (const element of overallStatusSeq_Nav) {
        if (element.RoleType === roletype && element.UserPersona === persona && element.TransitionType === 'T') {
            let toStatus = element.NextOverallStatusCfg_Nav.TransitionTextKey ? element.NextOverallStatusCfg_Nav.TransitionTextKey : element.NextOverallStatusCfg_Nav.OverallStatusLabel;
            return context.localizeText(toStatus);
        }
        //Handle third button on overflow if negative was used
        if (layout.secondary && layout.negative && element.RoleType === roletype && element.UserPersona === persona && element.TransitionType === 'S') {
            let toStatus = element.NextOverallStatusCfg_Nav.TransitionTextKey ? element.NextOverallStatusCfg_Nav.TransitionTextKey : element.NextOverallStatusCfg_Nav.OverallStatusLabel;
            return context.localizeText(toStatus);
        }
    }
    return '';
}

/**
 * 
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
            obj.nextOverallStatusCfg_Nav = element.NextOverallStatusCfg_Nav;
        } else if (element.RoleType === roleType && element.UserPersona === persona && element.TransitionType === 'N') {
            obj.negative = true;
        }
    }
    return obj;
}
