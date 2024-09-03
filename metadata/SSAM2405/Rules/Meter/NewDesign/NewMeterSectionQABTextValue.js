import NewMeterSectionLibrary from '../Common/NewMeterSectionLibrary';

export default function NewMeterSectionQABTextValue(context) {
    return NewMeterSectionLibrary.quickActionTargetValues(context, 'Label', context.getPageProxy()?.binding);
}
