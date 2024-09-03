import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import libPersona from '../../Persona/PersonaLibrary';
import Logger from '../../Log/Logger';
import libCommon from '../../Common/Library/CommonLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import IsFSMS4SectionVisible from '../../ServiceOrders/IsFSMS4SectionVisible';
import IsServiceOrderLevel from '../../ServiceOrders/IsServiceOrderLevel';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';

export default function ObjectCardPrimaryButtonVisible(context) {
    try {
        if (!libMobile.isMobileStatusChangeAllowedForLocalObjects(context)) {
            return false;
        }

        if (libWO.isWorkOrderInCreatedState(context)) {
            return false;
        }

        let roletype = libCommon.getStateVariable(context, 'UserRoleType');
        let mobileStatus;
        const STARTED = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        const REVIEW = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
        const RECEIVED = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
        let startedCount = libCommon.getStateVariable(context, 'StartedCount');

        let persona = libPersona.getActivePersona(context);
        let overallStatusSeq_Nav;
        if (IsFSMS4SectionVisible(context)) {
            let startedquery = `$filter=MobileStatus_Nav/MobileStatus eq '${STARTED}'`;
            overallStatusSeq_Nav = context.binding.MobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
            mobileStatus = context.binding.MobileStatus_Nav.MobileStatus;
            if (IsServiceOrderLevel(context)) {
                //check for any Service Orders that can be accepted
                const serviceOrderReceived = 'S4_SRV_ORDER: RECEIVED';
                for (const element of overallStatusSeq_Nav) {
                    if (element.RoleType === roletype && element.UserPersona === persona && element.TransitionType === 'P' && element.FromStatus === serviceOrderReceived) {
                        return true;
                    }
                }
                //Service Orders that have already been accepted
                return countStartedOrders(context, 'S4ServiceOrders', startedquery, overallStatusSeq_Nav, roletype, persona, mobileStatus);
            } else {
                for (const element of overallStatusSeq_Nav) {
                    if (element.RoleType === roletype && element.UserPersona === persona && element.TransitionType === 'P' && mobileStatus === RECEIVED) {
                        return true;
                    }
                }
                return countStartedOrders(context, 'S4ServiceItems', startedquery, overallStatusSeq_Nav, roletype, persona, mobileStatus);
            }
        } else {
            if (IsOperationLevelAssigmentType(context)) {
                //check for PhaseModel
                if (IsPhaseModelEnabled(context) && libCommon.getPersonnelNumber() !==  context.binding.PersonNum) {
                    return false;
                }
                overallStatusSeq_Nav = context.binding.OperationMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
                mobileStatus = context.binding.OperationMobileStatus_Nav.MobileStatus;
            } else if (IsSubOperationLevelAssigmentType(context)) {
                overallStatusSeq_Nav = context.binding.SubOpMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
                mobileStatus = context.binding.SubOpMobileStatus_Nav.MobileStatus;
            } else {
                overallStatusSeq_Nav = context.binding.OrderMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
                mobileStatus = context.binding.OrderMobileStatus_Nav.MobileStatus;
            }
        }

        //Supervisor section for Pending Review non-local Orders
        if (roletype === 'T' && mobileStatus === REVIEW && Object.prototype.hasOwnProperty.call(context.binding.OperationMobileStatus_Nav, '@sap.isLocal')) {
            return true;
        } else if (roletype === 'T' && mobileStatus === REVIEW && !libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink'])) {
            return false;
        }

        for (const element of overallStatusSeq_Nav) {
            if (element.RoleType === roletype && element.UserPersona === persona && element.TransitionType === 'P') {
                if (!(element?.NextOverallStatusCfg_Nav?.MobileStatus === STARTED && startedCount)) { //Allow accept or other primary non-start status
                    return true;
                }
                return !(startedCount > 0 && mobileStatus !== STARTED);
            }
        }
        return false;
    } catch (error) {
        Logger.error('ObjectCardPrimaryButtonVisible', error);
        return false;
    }
}

export function countStartedOrders(context, entityset, startedquery, overallStatusSeq_Nav, roletype, persona, mobileStatus) {
    const STARTED = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    return context.count('/SAPAssetManager/Services/AssetManager.service', entityset, startedquery).then(results =>{
        let startedCount = results;
        for (const element of overallStatusSeq_Nav) {
            if (element.RoleType === roletype && element.UserPersona === persona && element.TransitionType === 'P') {
                return !(startedCount > 0 && mobileStatus !== STARTED);
            }
        }
        return false;
    });
}
