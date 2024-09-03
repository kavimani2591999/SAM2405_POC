/**
 * Get the object specific query if one exists for a list of equipment under a parent object
 * @param {*} context 
 * @returns 
 */
export default function equipmentFilterByType(context) {
    let binding = context.getPageProxy().binding || {};

    if (binding?.['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
        return `FuncLocId eq '${binding.FuncLocId}'`;
    }
    if (binding?.['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        return `EquipId eq '${binding.HeaderEquipment}'`;
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
