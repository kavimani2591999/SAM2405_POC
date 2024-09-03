import FilterLibrary from '../../../Filter/FilterLibrary';
import FilterSettings from '../../../Filter/FilterSettings';
import SetOperationalItemsListCaption from './SetOperationalItemsListCaption';

/** @param {IPageProxy} context currently selected tab's pageproxy */
export default function TabPageOnLoaded(context) {
    const operationalItemsListPageproxy = context.evaluateTargetPathForAPI('#Page:OperationalItemsListViewPage');
    FilterSettings.applySavedFilterOnList(operationalItemsListPageproxy);
    SetOperationalItemsListCaption(context.getPageProxy());
    const operationalItemsListPage = context.evaluateTargetPath('#Page:OperationalItemsListViewPage');
    const sectionedTable = context.getControls().find(c => c.getType() === 'Control.Type.SectionedTable');
    if (sectionedTable === undefined) {  // first page onload: the sectionedtable may not be instantiated
        return;
    }
    FilterLibrary.setFilterActionItemText(context, operationalItemsListPage, sectionedTable);
    context.getPageProxy().getClientData().tabLoaded = true;
}
