import libPersona from '../../Persona/PersonaLibrary';

export default function WorkOrderDetailsPageToOpen(context) {
    return IsWorkOrderDetailsWithObjectCardsPageEnabled(context) ? '/SAPAssetManager/Pages/WorkOrders/WorkOrderDetailsWithObjectCards.page' : '/SAPAssetManager/Pages/WorkOrders/WorkOrderDetails.page';
}

export function WorkOrderDetailsPageName(context) {
    return IsWorkOrderDetailsWithObjectCardsPageEnabled(context) ? 'WorkOrderDetailsWithObjectCardsPage' : 'WorkOrderDetailsPage';
}

export function IsWorkOrderDetailsWithObjectCardsPageEnabled(context) {
    return libPersona.isNewHomeScreenEnabled(context) && (libPersona.isMaintenanceTechnician(context) || libPersona.isFieldServiceTechnicianInCSMode(context) || libPersona.isWCMOperator(context));
}
