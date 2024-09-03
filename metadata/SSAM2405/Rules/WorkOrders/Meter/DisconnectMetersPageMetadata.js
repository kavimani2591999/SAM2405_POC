import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

export default function DisconnectMetersPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Meter/MetersListViewWithActivity.page');
	return ModifyListViewTableDescriptionField(context, page, 'DisconnectionObject');
}
