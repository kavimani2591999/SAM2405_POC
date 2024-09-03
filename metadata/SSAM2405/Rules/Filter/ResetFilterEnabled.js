import libCom from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import FilterSettings from './FilterSettings';

export default async function ResetFilterEnabled(context) {
    try {
        const pageProxy = context.getPageProxy();
        const savedFilter = await FilterSettings.readFilterSettings(pageProxy);
        let parsedFilterCriteria = savedFilter && FilterSettings.parseFilterCriteriaString(pageProxy, savedFilter.PreferenceValue);
        parsedFilterCriteria = parsedFilterCriteria.filter(c => libCom.isDefined(c.filterItems));
    
        return parsedFilterCriteria && parsedFilterCriteria.length;
    } catch (err) {
        Logger.error('Reset filter button', `ResetFilterEnabled error: ${err}`);
        return false;
    }
}
