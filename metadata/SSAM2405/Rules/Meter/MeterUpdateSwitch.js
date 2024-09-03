import MeterLibrary from './Common/MeterLibrary';
import NewMeterSectionLibrary from './Common/NewMeterSectionLibrary';
import MeterUpdateNav from './MeterUpdateNav';

export default async function MeterUpdateSwitch(context) {
    if (context.binding['@odata.type'] === '#sap_mobile.DisconnectionObject') {
        const transactionType = await NewMeterSectionLibrary.getMeterISUProcessType(context);
        MeterLibrary.setMeterTransactionType(context, transactionType);
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [],'$expand=DisconnectDoc_Nav,DisconnectActivity_Nav/WOHeader_Nav/OrderISULinks,Device_Nav/DeviceCategory_Nav/Material_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,Device_Nav/DeviceLocation_Nav').then(function(orderISULink) {
            if (orderISULink.getItem(0)) {
                context.setActionBinding(orderISULink.getItem(0));
            }
        }).finally(() => {
            return context.executeAction('/SAPAssetManager/Actions/Meters/MeterDisconnectNav.action');
        });
    }

    return MeterUpdateNav(context);
}
