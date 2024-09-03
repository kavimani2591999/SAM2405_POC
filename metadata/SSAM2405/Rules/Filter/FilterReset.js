import Logger from '../Log/Logger';
import filterLib from '../Filter/FilterLibrary';
import FilterSettings from './FilterSettings';
import commonLib from '../Common/Library/CommonLibrary';

export default function FilterReset(context) {
    try {
        filterLib.setDefaultFilter(context.getPageProxy(), true);
        if (!commonLib.getPageName(context).includes('Online')) {
            FilterSettings.resetFilters(context);
        }
    } catch (exception) {
        /**Implementing our Logger class*/
        Logger.error('Filter', `FilterReset error: ${exception}`);
    }
}
