import IsNewLayoutEnabled from '../../../Common/IsNewLayoutEnabled';
import MeterLibrary from '../../Common/MeterLibrary';

export default function IsDiscardMeterButtonVisible(context) {
    const INSTALL = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/InstallMeterType.global').getValue();
 
    return IsNewLayoutEnabled(context) && MeterLibrary.isLocal(context.binding) 
        && MeterLibrary.isProcessed(context.binding) && context.binding.ISUProcess === INSTALL;
}
