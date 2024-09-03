import CommonLibrary from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import FilterLibrary from '../../Filter/FilterLibrary';
import { DQBAndFilterSafe } from '../Common/DataQueryBuilderUtils';
import { GetSearchStringFilterTerm } from '../Common/ListPageQueryOptionsHelper';
import SetLOTOCertificatesListCaption from './LOTOCertificates/SetLOTOCertificatesListCaption';
import SafetyCertificatesLibrary, { WCMCertificateMobileStatuses } from './SafetyCertificatesLibrary';

/** @param {ISectionedTableProxy} context  */
export default function LOTOCertificatesListViewQueryOption(context) {
    const pageName = CommonLibrary.getPageName(context);
    const retDQB = context.dataQueryBuilder().expand('WCMApplicationDocuments,WCMDocumentPartners,WCMDocumentPartners/Employee_Nav,WCMDocumentItems/PMMobileStatus');

    if (!ValidationLibrary.evalIsEmpty(LOTOCertificatePreFilters[pageName])) {
        const preFilter = SafetyCertificatesLibrary.createQueryStringFromCriterias(LOTOCertificatePreFilters[pageName]);
        retDQB.filter(preFilter);
    }
    SetLOTOCertificatesListCaption(context.getPageProxy());

    FilterLibrary.setFilterActionItemText(context, context.evaluateTargetPath('#Page:LOTOCertificatesListViewPage'), context);

    const stringSearchFilterTerm = GetSearchStringFilterTerm(context, context.searchString.toLowerCase(), ['WCMDocument', 'ShortText'], 'WCMDocumentHeader');
    DQBAndFilterSafe(retDQB, stringSearchFilterTerm);

    return retDQB;
}

export const LOTOCertificatePreFilters = Object.freeze({
    all_items: [...SafetyCertificatesLibrary.getLOTOCertificatesFiltersCriteria()],
    tagging: [...SafetyCertificatesLibrary.getLOTOCertificatesFiltersCriteria(), {
        field: 'PMMobileStatus/MobileStatus',
        values: [WCMCertificateMobileStatuses.InitialStatus, WCMCertificateMobileStatuses.Tag, WCMCertificateMobileStatuses.Tagprint],
    }],
    untagging: [...SafetyCertificatesLibrary.getLOTOCertificatesFiltersCriteria(), {
        field: 'PMMobileStatus/MobileStatus',
        values: [WCMCertificateMobileStatuses.Untag, WCMCertificateMobileStatuses.Tagged],
    }],
});
