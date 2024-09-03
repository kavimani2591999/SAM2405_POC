import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function SubEquipmentCount(context) {
    let odataType = context.getPageProxy().binding['@odata.type'];
    let entitySet = 'MyEquipments';
    let queryOptions = '';
    let service;
    if (odataType === '#sap_mobile.MyFunctionalLocation') {
        entitySet = context.getPageProxy().binding['@odata.readLink'] + '/Equipments';
    } else if (odataType === '#sap_mobile.MyEquipment') {
        let equipId = context.getPageProxy().binding.EquipId;
        queryOptions = `$filter=SuperiorEquip eq '${equipId}'`;
    } else if (odataType === '#sap_mobile.FunctionalLocation') {
        entitySet = 'Equipments';
        queryOptions = `$filter=FuncLocIdIntern eq '${context.getPageProxy().binding.FuncLocIdIntern}'`;
        service = '/SAPAssetManager/Services/OnlineAssetManager.service';
    }
    return CommonLibrary.getEntitySetCount(context, entitySet, queryOptions, service).then(count => {
        context.getPageProxy().getClientData().SubEquipmentTotalCount = count;
        return count;
    });
}
