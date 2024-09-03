import libCommon from '../../Common/Library/CommonLibrary';

export default function NewMeterListDoneEnabled(context) {
    const selectedItems = libCommon.getStateVariable(context, 'selectedMeters');
    return !!selectedItems && !!selectedItems.length;
}
