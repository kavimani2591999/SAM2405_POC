import libSearch from '../OnlineSearchLibrary';

export default async function StatusFilterOptions(control) {
    let filterValue = [];
    const statusOptions = getStatusOptionsByEntityType(control);
    
    const systemStatusRecords = await control.read('/SAPAssetManager/Services/AssetManager.service', 'SystemStatuses', [], `$filter=${statusOptions.map(opt => `SystemStatus eq '${opt}'`).join(' or ')}`);
    systemStatusRecords.forEach(i => {
        filterValue.push({
            ReturnValue: i.SystemStatus,
            DisplayValue: i.StatusText,
        });
    });

    return {
        name: 'SysStatus',
        values: filterValue,
    };
}

function getStatusOptionsByEntityType(control) {
    const activeTab = libSearch.getCurrentTabName(control);
    const equipmentTabName = control.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/EquipmentTab.global').getValue();
    const funcLocTabName = control.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/FuncLocTab.global').getValue();

    switch (activeTab) {
        case equipmentTabName:
            return ['I0099', 'I0100', 'I0116', 'I0184'];
        case funcLocTabName:
            return ['I0013', 'I0076', 'I0098', 'I0320'];
        default:
            return [];
    }
}
