import PersonaLibrary from '../../../Persona/PersonaLibrary';

export default function WorkOrderOperationDetailsPageToOpen(context) {
    return isNewOperationDetailsToOpen(context) ? '/SAPAssetManager/Pages/WorkOrders/Operations/WorkOrderOperationDetailsWithObjectCards.page' : '/SAPAssetManager/Pages/WorkOrders/Operations/WorkOrderOperationDetails.page';
}

export function WorkOrderOperationDetailsPageNameToOpen(context) {
    return isNewOperationDetailsToOpen(context) ? 'WorkOrderOperationDetailsWithObjectCards' : 'WorkOrderOperationDetailsPage';
}

function isNewOperationDetailsToOpen(context) {
    return PersonaLibrary.isNewHomeScreenEnabled(context) && (PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isFieldServiceTechnicianInCSMode(context) || PersonaLibrary.isWCMOperator(context));
}
