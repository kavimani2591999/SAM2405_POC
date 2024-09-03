import libCommon from '../../Common/Library/CommonLibrary';
import libMeter from '../../Meter/Common/MeterLibrary';
import NewMeterSectionLibrary from '../Common/NewMeterSectionLibrary';

export default function MeterRemoveUpdateNav(context) {
    const replaceBinding = NewMeterSectionLibrary.getMeterReplaceBinding(context);
    libMeter.setMeterTransactionType(context, 'DISCONNECT');

    //set the CHANGSET flag to true
    libCommon.setOnChangesetFlag(context, true);
    if (replaceBinding) {
        context.setActionBinding(replaceBinding);
        context.getClientData().MeterDetailsUpdateDisabled = true;
    }
    return context.executeAction('/SAPAssetManager/Actions/Meters/MeterDisconnectNav.action');
}
