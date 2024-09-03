import REUSABLE_FAST_FILTERS, { WCMDocumentHeaderFastFilters } from '../../Common/ReusableFastFilters';
import libAssignedTo from '../../Common/AssignedToLibrary';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ModifyListViewTableDescriptionField from '../../../LCNC/ModifyListViewTableDescriptionField';

// map the tab captions to the quickfilters
export const IsolationCertificatesSubPageFastFilters = Object.freeze({
    all_items: [REUSABLE_FAST_FILTERS.VERY_HIGH_PRIORITY, WCMDocumentHeaderFastFilters.TAG_PRINTED, WCMDocumentHeaderFastFilters.UNTAG, REUSABLE_FAST_FILTERS.APPROVED],
    tagging: [REUSABLE_FAST_FILTERS.VERY_HIGH_PRIORITY, WCMDocumentHeaderFastFilters.TAG, WCMDocumentHeaderFastFilters.TAG_PRINTED, REUSABLE_FAST_FILTERS.APPROVED],
    untagging: [REUSABLE_FAST_FILTERS.VERY_HIGH_PRIORITY, WCMDocumentHeaderFastFilters.TAGGED, WCMDocumentHeaderFastFilters.UNTAG, REUSABLE_FAST_FILTERS.APPROVED],
});

const IsolationCertificatesSubPageObjectCellDescriptions = Object.freeze({
    all_items: '/SAPAssetManager/Rules/WCM/SafetyCertificates/LOTOCertificates/OperationalItemsAll.js',
    tagging: '/SAPAssetManager/Rules/WCM/SafetyCertificates/LOTOCertificates/OperationalItemsTaggedAll.js',
    untagging: '/SAPAssetManager/Rules/WCM/SafetyCertificates/LOTOCertificates/OperationalItemsUntaggedAll.js',
});

/** @param {IPageProxy} context  */
export default function ConstructLOTOCertificatesListViewTabs(context) {
    return Object.entries(IsolationCertificatesSubPageFastFilters).map(([caption, fastfilters]) => {
        const isPartnerEnabled = libAssignedTo.IsAssignedToVisibleByAssignmentsCertificate(CommonLibrary.getWCMDocumentAssignmentTypes(context));
        const filters = (isPartnerEnabled ? [
            {
                ...REUSABLE_FAST_FILTERS.ASSIGNED_TO_ME,
                ReturnValue: libAssignedTo.GetAssignedToMeReturnValue('WCMDocumentPartners'),
            },
        ] : []).concat(...fastfilters);

        return {
            '_Name': `${caption}`,
            'Caption': context.localizeText(caption),
            'PageMetadata': GetTab(context, filters, caption, IsolationCertificatesSubPageObjectCellDescriptions[caption]),
            'OnPress': '/SAPAssetManager/Rules/WCM/SafetyCertificates/LOTOCertificates/TabPageOnPressed.js',
            '_Type': 'Control.Type.TabItem',
        };
    });
}

function GetTab(context, fastfilters, caption, objcellDescription) {
    let page = {
        'Caption': caption,
        'OnLoaded': '/SAPAssetManager/Rules/WCM/SafetyCertificates/LOTOCertificates/TabPageOnLoaded.js',
        'Controls': [
            {
                'Sections': [
                    {
                        'Search': {
                            'Enabled': true,
                            'Delay': 500,
                            'MinimumCharacterThreshold': 3,
                            'Placeholder': '$(L,search)',
                            'BarcodeScanner': true,
                        },
                        'Header': {
                            'UseTopPadding': false,
                        },
                        'ObjectCell': {
                            'AccessoryType': 'disclosureIndicator',
                            'Title': '{ShortText}',
                            'Icons': '/SAPAssetManager/Rules/WCM/SafetyCertificates/SafetyCertificatesIcons.js',
                            'OnPress': '/SAPAssetManager/Rules/WCM/SafetyCertificates/Details/CertificateDetailsNav.js',
                            'PreserveIconStackSpacing': true,
                            'Subhead': '{WCMDocument}',
                            'Footnote': '/SAPAssetManager/Rules/WCM/Common/EquipmentOrFunclocDescriptionOrEmpty.js',
                            'StatusText': '/SAPAssetManager/Rules/WCM/Common/PriorityStatusText.js',
                            'SubstatusText': "$(DV, '/SAPAssetManager/Rules/WCM/SafetyCertificates/Details/SafetyCertificateMobileStatusTextOrEmpty.js', '-')",
                            'Description': objcellDescription,
                            'Styles':
                            {
                                'StatusText': '/SAPAssetManager/Rules/Priority/WCMPriorityStatusStyle.js',
                            },
                            '_Type': 'Control.Type.ObjectCell',
                        },
                        'Target': {
                            'EntitySet': '/SAPAssetManager/Rules/WCM/SafetyCertificates/RelatedSafetyCertificates.js',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                            'QueryOptions': '/SAPAssetManager/Rules/WCM/SafetyCertificates/LOTOCertificatesListViewQueryOption.js',
                        },
                        'EmptySection': {
                            'Caption': '$(L,wcm_no_certificates)',
                            'HidesFooter': true,
                        },
                        'Visible': true,
                        '_Name': 'SafetyCertificates',
                        '_Type': 'Section.Type.ObjectTable',
                    },
                ],
                'FilterFeedbackBar': {
                    '_Type': 'Control.Type.FilterFeedbackBar',
                    '_Name': 'FilterFeedback',
                    'ShowAllFilters': true,
                    'FastFilters': fastfilters,
                },
                'Filters': '/SAPAssetManager/Rules/WCM/SafetyCertificates/WCMDocumentHeaderDefaultSort.js',
                '_Type': 'Control.Type.SectionedTable',
                '_Name': 'SectionedTable',
            },
        ],
        '_Type': 'Page',
        '_Name': caption,
        'DataSubscriptions': ['PMMobileStatuses', 'WCMDocumentHeaders'],
    };

    ModifyListViewTableDescriptionField(context.getPageProxy(), page, 'WCMDocumentHeader');

    return page;
}
