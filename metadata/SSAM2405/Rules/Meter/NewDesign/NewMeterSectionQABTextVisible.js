import NewMeterSectionLibrary from '../Common/NewMeterSectionLibrary';

export default function NewMeterSectionQABTextVisible(clientAPI) {
    return NewMeterSectionLibrary.newObjectCellSectionVisible(clientAPI, 'QAB', clientAPI.getPageProxy()?.binding);
}
