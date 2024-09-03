import NewMeterSectionLibrary from '../../../Meter/Common/NewMeterSectionLibrary';
import userFeaturesLib from '../../../UserFeatures/UserFeaturesLibrary';

export default function HideDisconnectSection(context) {
    const woBinding = NewMeterSectionLibrary.getWorkOrderBinding(context, context.getPageProxy().binding);
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
        let isDisconnect = woBinding.OrderISULinks[0].ISUProcess === 'DISCONNECT' || woBinding.OrderISULinks[0].ISUProcess === 'RECONNECT';
        // If section is Meter List don't show on Disconnect
        if (context.getName() === 'MeterList') {
            return !isDisconnect;
        } else {
            return isDisconnect;
        }
    } 
    return false;
}
