import CommonLibrary from '../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../LCNC/ModifyListViewSearchCriteria';
import Logger from '../Log/Logger';
import documentFilter from './DocumentFilter';

export default function DocumentsBDSQueryOption(context, top) {
    let searchString = '';

    let queryOpts = {
        'expand' : 'Document',
        'orderby' : 'Document/FileName',
        'filter' : documentFilter(context),
    };

    if (top) {
        queryOpts.top = top;
    }

    if ((searchString = context.searchString)) {
        let qob = context.dataQueryBuilder();
        qob.expand(queryOpts.expand).orderBy(queryOpts.orderby);

        qob.filter(`${queryOpts.filter} and ${getSearchQuery(context, searchString)}`);
        if (queryOpts.top) {
            qob.top(queryOpts.top);
        }
        return qob;
    } else {
        let params = [];
        for (let key in queryOpts) {
            params.push(`$${key}=${queryOpts[key]}`);
        }
        Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), 'QueryOption: ' + params.join('&'));
        return params.join('&');
    }

}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['Document/FileName', 'Document/Description', 'Document/FileSize'];
        ModifyListViewSearchCriteria(context, 'Document', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
