import EquipmentSearchCriteriaValidation from '../Equipment/EquipmentSearchCriteriaValidation';
import FuncLocSearchCriteriaValidation from '../FuncLoc/FuncLocSearchCriteriaValidation';
import libSearch from '../OnlineSearchLibrary';

export default function SearchCriteriaValidation(context) {
    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    const activeTab = libSearch.getCurrentTabName(context);
    const equipmentTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/EquipmentTab.global').getValue();
    const funcLocTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/FuncLocTab.global').getValue();

    switch (activeTab) {
        case equipmentTabName:
            return EquipmentSearchCriteriaValidation(context);
        case funcLocTabName:
            return FuncLocSearchCriteriaValidation(context);
        default:
            return null;
    }
}
