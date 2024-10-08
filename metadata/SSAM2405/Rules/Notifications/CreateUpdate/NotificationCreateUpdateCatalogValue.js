import common from '../../Common/Library/CommonLibrary';
import { SplitReadLink } from '../../Common/Library/ReadLinkUtils';

export default function NotificationCreateUpdateCatalogValue(context) {

    let failureGroupListPicker = common.getTargetPathValue(context, '#Control:QMCodeGroupListPicker/#Value');
    let failureGroupReadLink = common.getListPickerValue(failureGroupListPicker);

    if (failureGroupReadLink) {
        let failureGroupObject = SplitReadLink(failureGroupReadLink);
        return decodeURIComponent(failureGroupObject.Catalog);
    }
    return '';
}
