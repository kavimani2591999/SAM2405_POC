/**
 * Get the object specific query if one exists for a list of functional locations under a parent object
 * @param {*} context 
 * @returns 
 */
export default function flocFilterByType(context) {
    let binding = context.getPageProxy().binding || {};

    if (binding?.['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
    return `(WorkOrderHeader/any( wo: wo/OrderId eq '${binding.OrderId}' ) or WorkOrderOperation/any(wo: wo/OrderId eq '${binding.OrderId}' ) or WorkOrderSubOperation/any( wo: wo/OrderId eq '${binding.OrderId}'))`;
    }
    if (binding?.['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        return `(S4RefObject_Nav/any(so: so/ObjectID eq '${binding.ObjectID}' and so/ItemNo eq '000000'))`; //Header only, no item
    }
    if (binding?.['@odata.type'] === '#sap_mobile.S4ServiceRequest') {
        return `(S4RequestRefObj_Nav/any(so: so/ObjectID eq '${binding.ObjectID}' ))`;
    }
    if (binding?.['@odata.type'] === '#sap_mobile.S4ServiceConfirmation') {
        return `(S4ServiceConfirmationRefObj_Nav/any(so: so/ObjectID eq '${binding.ObjectID}' ))`;
    }
    if (binding?.['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        return `(S4RefObject_Nav/any(so: so/ObjectID eq '${binding.ObjectID}' and so/ItemNo eq '${binding.ItemNo}' ))`;
    }

    return '';
}
