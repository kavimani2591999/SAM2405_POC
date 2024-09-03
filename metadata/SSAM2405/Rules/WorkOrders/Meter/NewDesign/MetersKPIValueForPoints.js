import NewMeterSectionLibrary from '../../../Meter/Common/NewMeterSectionLibrary';

/**
* Get items count
* @param {IClientAPI} context
*/
export default function MetersKPIValueForPoints(context) {
    return NewMeterSectionLibrary.kpiHeaderTargetValues(context, 'Value', context.getPageProxy()?.binding);
}
