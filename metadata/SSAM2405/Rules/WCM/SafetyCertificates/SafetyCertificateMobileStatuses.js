import { GetMobileStatusFilterItemsByObjectType } from '../OperationalItems/ListView/OperationalItemsStatusesFilter';
import { LOTOCertificatePreFilters } from './LOTOCertificatesListViewQueryOption';
import { WCMDocumentHeaderMobileStatusType } from './SafetyCertificatesLibrary';


/** @param {IClientAPI & {binding: import('./LOTOCertificates/LOTOCertificatesFilterNav').LOTOCertificatesListFilterBinding}} context  */
export default function SafetyCertificateMobileStatuses(context) {
    const allowedStatuses = new Set(((LOTOCertificatePreFilters[context.binding && context.binding.selectedTab] || []).find(c => c.field === 'PMMobileStatus/MobileStatus') || {}).values || []);
    return GetMobileStatusFilterItemsByObjectType(context, WCMDocumentHeaderMobileStatusType, allowedStatuses);
}
