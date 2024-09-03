import IsAndroid from '../../Common/IsAndroid';
import common from '../../Common/Library/CommonLibrary';

/**
* Selection change reaction
* @param {IClientAPI} clientAPI
*/
export default function NewMeterListSelectionChanged(clientAPI) {
    const tableSection = clientAPI.getPageProxy().getControls()[0].getSections()[0];
    const resetButton = clientAPI.getPageProxy().getToolbar().getToolbarControls()[1];
    const item = tableSection.getSelectionChangedItem();
    let selectedItems = common.getStateVariable(clientAPI, 'selectedMeters') || [];
    const itemBinding = item.binding;
    if (item.selected && itemBinding) {
        selectedItems.push(itemBinding);
    } else if (itemBinding) {
        selectedItems = selectedItems.filter(readlink => readlink['@odata.readLink'] !== itemBinding['@odata.readLink']);
    }
    common.setStateVariable(clientAPI, 'selectedMeters', selectedItems);
    if (IsAndroid(clientAPI)) {
        clientAPI.getPageProxy().getToolbar().redraw();
    } else {
        resetButton.redraw();
    }
}
