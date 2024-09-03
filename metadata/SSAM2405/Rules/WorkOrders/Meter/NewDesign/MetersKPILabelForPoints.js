import NewMeterSectionLibrary from '../../../Meter/Common/NewMeterSectionLibrary';

/**
* Getting i18n value based on order type
* @param {IClientAPI} clientAPI
*/
export default function MetersKPILabelForPoints(clientAPI) {
    return NewMeterSectionLibrary.kpiHeaderTargetValues(clientAPI, 'Label', clientAPI.getPageProxy()?.binding);
}
