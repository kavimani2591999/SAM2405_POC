import MeterLibrary from '../Common/MeterLibrary';
import NewMeterSectionLibrary from '../Common/NewMeterSectionLibrary';

export default function MeterDisconnectReconnectAllButtonVisible(context) {
    const woBinding = NewMeterSectionLibrary.getWorkOrderBinding(context);
    return NewMeterSectionLibrary.isTechObjectStarted(context, woBinding)
        .then((isStarted) => isStarted && setStatusForToolbarActions(context, woBinding));
}

function setStatusForToolbarActions(context, binding) {
    const isuProcess = MeterLibrary.getISUProcess(binding.OrderISULinks);

    return context.read('/SAPAssetManager/Services/AssetManager.service', binding.DisconnectActivity_Nav[0]['@odata.readLink'], [], '').then(disconnectActivityResult => {
        if (disconnectActivityResult && disconnectActivityResult.getItem(0)) {
            const disconnectActivity = disconnectActivityResult.getItem(0);

            const { DISCONNECT, RECONNECT } = NewMeterSectionLibrary.getMeterISOConstants(context);
            if (isuProcess === DISCONNECT && disconnectActivity.ActivityStatus !== '10') {
                return false;
            }
            if (isuProcess === RECONNECT && disconnectActivity.ActivityStatus !== '20') { 
                return false;
            }

            return context.read('/SAPAssetManager/Services/AssetManager.service', 'DisconnectionObjects', [], `$filter=DisconnectActivity_Nav/OrderId eq '${binding.OrderId}'&$expand=Device_Nav`).then(disconnectResult => {
                const isAllDeviceProcessed = disconnectResult.every((item) => {
                    return item.Device_Nav.DeviceBlocked === (isuProcess === DISCONNECT);
                });

                return !isAllDeviceProcessed;
            });
        }

        return false;
    });
}
