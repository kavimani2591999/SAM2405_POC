import libCommon from '../Common/Library/CommonLibrary';
import libSearch from './OnlineSearchLibrary';

export default function DeselectAllItems(context) {
    const pageProxy = libSearch.getCurrentTabPage(context);
    const table = pageProxy.getControls()[0].getSections()[0];
    table.deselectAllItems();

    libCommon.setStateVariable(context, 'selectedItems', []);

    context.getToolbar().redraw();

    context.setActionBarItemVisible('SelectAll', true);
    context.setActionBarItemVisible('DeselectAll', false);
}
