import libCommon from '../../Common/Library/CommonLibrary';
import libMeter from '../../Meter/Common/MeterLibrary';
import NewMeterSectionLibrary from '../Common/NewMeterSectionLibrary';
import meterReplaceInstallUpdateNav from './MeterReplaceInstallUpdateNav';
import { meterWasReplacedWithInstallation } from '../../Meter/CreateUpdate/MeterReplaceInstall';

export default async function MeterReplaceUpdateNav(context) {
    const replaceBinding = NewMeterSectionLibrary.getMeterReplaceBinding(context);
    const binding = replaceBinding || context.binding;
    const hasInstalledMeter = meterWasReplacedWithInstallation(context, binding.EquipmentNum); 
    if (!hasInstalledMeter && binding.Device_Nav['@sap.isLocal']) {
        return meterReplaceInstallUpdateNav(context, replaceBinding);
    } else {
        libMeter.setMeterTransactionType(context);
        //set the CHANGSET flag to true
        libCommon.setOnChangesetFlag(context, true);
        if (replaceBinding) {
            const type = await NewMeterSectionLibrary.getMeterISUProcessType(context, replaceBinding);
            libMeter.setMeterTransactionType(context, type);
            context.setActionBinding(replaceBinding);
        }
        return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterCreateUpdateNav.action');
    }
}
