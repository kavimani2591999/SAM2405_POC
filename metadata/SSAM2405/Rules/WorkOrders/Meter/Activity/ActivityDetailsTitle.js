import NewMeterSectionLibrary from '../../../Meter/Common/NewMeterSectionLibrary';

/**
* Getting title for ActivityType section in generic way
* Supported on WO, Operations, SubOperation levels
* @param {IClientAPI} clientAPI
*/
export default function ActivityDetailsTitle(clientAPI) {
    const woBinding = NewMeterSectionLibrary.getWorkOrderBinding(clientAPI);
    return woBinding?.DisconnectActivityType_Nav?.ActivityTypeDescription || '';
}
