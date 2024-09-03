import NewMeterSectionLibrary from '../Common/NewMeterSectionLibrary';
import MeterUpdateNav from '../MeterUpdateNav';

/**
* Nav to edit screens not from Meter details
* @param {IClientAPI} context
*/
export default function MeterEditFromDetailsNav(context) {
    const replaceBinding = NewMeterSectionLibrary.getMeterReplaceBinding(context);
    return MeterUpdateNav(context, replaceBinding);
}
