import FilterLibrary from '../../../Filter/FilterLibrary';
import FilterSettings from '../../../Filter/FilterSettings';
import SetLOTOCertificatesListCaption from './SetLOTOCertificatesListCaption';

/** @param {IPageProxy} context currently selected tab's pageproxy */
export default function TabPageOnLoaded(context) {
    const LOTOCertificatesListPageProxy = context.evaluateTargetPathForAPI('#Page:LOTOCertificatesListViewPage');
    FilterSettings.applySavedFilterOnList(LOTOCertificatesListPageProxy);
    SetLOTOCertificatesListCaption(context.getPageProxy());
    const LOTOCertificatesListPage = context.evaluateTargetPath('#Page:LOTOCertificatesListViewPage');
    const sectionedTable = context.getControls().find(c => c.getType() === 'Control.Type.SectionedTable');
    if (sectionedTable === undefined) {  // first page onload: the sectionedtable may not be instantiated
        return;
    }
    FilterLibrary.setFilterActionItemText(context, LOTOCertificatesListPage, sectionedTable);
}
