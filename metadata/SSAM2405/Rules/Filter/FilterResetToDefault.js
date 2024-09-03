import FilterLibrary from './FilterLibrary';
import FilterSettings from './FilterSettings';


export default function FilterResetToDefault(context) {
    FilterLibrary.filterResetToDefaults(context);
    FilterSettings.resetFilters(context);
}
