import NewMeterSectionLibrary from '../Common/NewMeterSectionLibrary';
import MeterReadingsUpdateNav from '../MeterReadingsUpdateNav';

/**
* Nav to take readings with custom binding
* @param {IClientAPI} context
*/
export default function MeterReadingsFromDetailsNav(context) {
    const replaceBinding = NewMeterSectionLibrary.getMeterReplaceBinding(context);
    return MeterReadingsUpdateNav(context, replaceBinding);
}
