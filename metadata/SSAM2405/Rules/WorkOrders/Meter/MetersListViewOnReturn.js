import libMeter from '../../Meter/Common/MeterLibrary';
import NewMeterSectionLibrary from '../../Meter/Common/NewMeterSectionLibrary';

export default function MetersListViewOnReturn(context) {
    let action = '/SAPAssetManager/Actions/Meters/ClosePageReconnect.action';
    context.evaluateTargetPathForAPI('#Page:-Previous').setActionBarItemVisible(0, false);
    
    const { DISCONNECT } = NewMeterSectionLibrary.getMeterISOConstants(context);
    const isuLinks = context.binding?.OrderISULinks || context.binding?.WOHeader?.OrderISULinks;
    if (isuLinks &&libMeter.getISUProcess(isuLinks) === DISCONNECT) {
        action = '/SAPAssetManager/Actions/Meters/ClosePageDisconnect.action';
    }

    return context.executeAction(action);
}
