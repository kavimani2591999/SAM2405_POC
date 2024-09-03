import NewMeterSectionLibrary from '../../../Meter/Common/NewMeterSectionLibrary';

/**
* Getting entity set name based on related WO in generic way
* Supported on WO, Operations, Suboperations
* @param {IClientAPI} clientAPI
*/
export default function WorkOrderDetailsActivityEntity(clientAPI) {
    const woBinding = NewMeterSectionLibrary.getWorkOrderBinding(clientAPI);
    return `${woBinding['@odata.readLink']}/DisconnectActivity_Nav`;
}
