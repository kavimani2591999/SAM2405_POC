import SubEquipmentCount from '../../Equipment/SubEquipment/SubEquipmentCount';

export default async function OnlineEquipmentListViewPageMetadata(context) {
    let page = context.getPageDefinition('/SAPAssetManager/Pages/OnlineSearch/EquipmentListView.page');

    let count = await SubEquipmentCount(context);
    page.Caption = context.localizeText('equipment_x', [count]);

    page.Controls[0].Sections[0].Target.QueryOptions = `$filter=FuncLocIdIntern eq '${context.binding.FuncLocIdIntern}'&$expand=SystemStatus`;
    page.Controls[0].Sections[0].Visible=true;
    page.Controls[0].Sections[1].Visible=false;

    return page;
}
