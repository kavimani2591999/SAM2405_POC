import EquipmentQueryOptions from './EquipmentQueryOptions';

export default function EquipmentCount(sectionProxy) {
    if (sectionProxy.getPageProxy().binding
                        && (sectionProxy.getPageProxy().binding['@odata.type'] === '#sap_mobile.S4ServiceOrder'
                        || sectionProxy.getPageProxy().binding['@odata.type'] === '#sap_mobile.S4ServiceRequest'
                        || sectionProxy.getPageProxy().binding['@odata.type'] === '#sap_mobile.S4ServiceConfirmation'
                        || sectionProxy.getPageProxy().binding['@odata.type'] === '#sap_mobile.S4ServiceItem')) {
        let countFromBinding = sectionProxy.binding ? sectionProxy.binding.length : 0;

        if (countFromBinding === undefined) {
            switch (sectionProxy.getPageProxy().binding['@odata.type']) {
                case '#sap_mobile.S4ServiceOrder':
                case '#sap_mobile.S4ServiceItem':
                case '#sap_mobile.S4ServiceRequest':
                case '#sap_mobile.S4ServiceConfirmation':    
                    return sectionProxy.count('/SAPAssetManager/Services/AssetManager.service', `${sectionProxy.getPageProxy().binding['@odata.readLink']}/RefObjects_Nav`, "$filter=EquipID ne ''").then((count) => {
                        sectionProxy.getPageProxy().getClientData().EquipmentTotalCount = count;
                        return count;
                    });
                default:
                    // This code is wrong, but it was here before, so leave as default fallback case
                    return sectionProxy.count('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', EquipmentQueryOptions(sectionProxy)).then((count) => {
                        sectionProxy.getPageProxy().getClientData().EquipmentTotalCount = count;
                        return count;
                    });
            }

        } else {
            return Promise.resolve(countFromBinding);
        }
    } else {
        return sectionProxy.count('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', '').then((count) => {
            sectionProxy.getPageProxy().getClientData().EquipmentTotalCount = count;
            return count;
        });
    }
}
