import ModifyListViewTableDescriptionField from '../LCNC/ModifyListViewTableDescriptionField';

export default function NewMetersListPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Meter/NewMetersListView.page');
    let entityType = 'Device';
    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        entityType = 'OrderISULink';
    }
	return ModifyListViewTableDescriptionField(context, page, entityType);
}
