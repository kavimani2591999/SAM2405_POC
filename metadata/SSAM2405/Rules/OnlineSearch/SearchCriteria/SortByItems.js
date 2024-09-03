import libSearch from '../OnlineSearchLibrary';

export default function SortByItems(context) {
    const activeTab = libSearch.getCurrentTabName(context);
    const equipmentTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/EquipmentTab.global').getValue();
    const funcLocTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/FuncLocTab.global').getValue();
    const commonItems = [
        {
            ReturnValue: 'PlanningPlant',
            DisplayValue: '$(L,plant)',
        },
        {
            ReturnValue: 'SysStatus',
            DisplayValue: '$(L,status)',
        },
    ];
    switch (activeTab) {
        case equipmentTabName:
            return [
                {
                    ReturnValue: 'EquipId',
                    DisplayValue: '$(L,ID)',
                },
                {
                    ReturnValue: 'EquipDesc',
                    DisplayValue: '$(L,description)',
                },
                {
                    ReturnValue: 'MaintWorkCenter',
                    DisplayValue: '$(L,workcenter)',
                },
                ...commonItems,
            ];
        case funcLocTabName:
            return [
                {
                    ReturnValue: 'FuncLocId',
                    DisplayValue: '$(L,ID)',
                },
                {
                    ReturnValue: 'FuncLocDesc',
                    DisplayValue: '$(L,description)',
                },
                {
                    ReturnValue: 'WorkCenter',
                    DisplayValue: '$(L,workcenter)',
                },
                ...commonItems,
            ];
        default:
            return [];
    }
}
