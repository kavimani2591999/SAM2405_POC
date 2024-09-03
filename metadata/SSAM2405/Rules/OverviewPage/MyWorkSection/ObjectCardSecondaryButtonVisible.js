import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import libPersona from '../../Persona/PersonaLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsFSMS4SectionVisible from '../../ServiceOrders/IsFSMS4SectionVisible';
import { sortStatusesByTransitionType } from './ObjectCardSecondaryButtonOnPress';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import IsServiceOrderLevel from '../../ServiceOrders/IsServiceOrderLevel';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';

export default function ObjectCardSecondaryButtonVisible(context) {
    if (!libMobile.isMobileStatusChangeAllowedForLocalObjects(context)) {
        return false;
    }

    if (libWO.isWorkOrderInCreatedState(context)) {
        return false;
    }

    let roleType = CommonLibrary.getStateVariable(context, 'UserRoleType');
    let persona = libPersona.getActivePersona(context);
    let overallStatusSeq_Nav;
    if (IsFSMS4SectionVisible(context)) {
        if (IsServiceOrderLevel(context)) {
            overallStatusSeq_Nav = context.binding.MobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
        } else {
            return S4ServiceLibrary.getAvailableStatusesServiceItem(context).then(items =>{
                for (let statuses of items) {
                    if (statuses.TransitionType === 'S' || statuses.TransitionType === 'N') {
                        return true;
                    }
                }
                return false;
            });
        }
    } else {
        //My Operation Secondary Button
        if (IsOperationLevelAssigmentType(context)) {
            //check for PhaseModel
            if (IsPhaseModelEnabled(context) && CommonLibrary.getPersonnelNumber() !==  context.binding.PersonNum) {
                return false;
            }
            overallStatusSeq_Nav = context.binding.OperationMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
        } else if (IsSubOperationLevelAssigmentType(context)) {
        //My SubOperation Secondary Button
            overallStatusSeq_Nav = context.binding.SubOpMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
        } else {
        //My Work Order Secondary Button
            overallStatusSeq_Nav = context.binding.OrderMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
        }
    }
    sortStatusesByTransitionType(overallStatusSeq_Nav);
    for (let status of overallStatusSeq_Nav) {
        if (status.RoleType === roleType && status.UserPersona === persona && (status.TransitionType === 'S' || status.TransitionType === 'N')) {
            return true;
        }
    }
    return false;
}
