import libCommon from '../../Common/Library/CommonLibrary';
import MeterLibrary from '../Common/MeterLibrary';
import NewMeterSectionLibrary from '../Common/NewMeterSectionLibrary';

export default function MeterReadingRecorded(context, isLocal=false) {
    let equipment = context.binding.EquipmentNum;
    let register = context.binding.RegisterNum;
    let localFilter = '';

    const meterTransactionType = MeterLibrary.getMeterTransactionType(context);
    const {REP_INST} = NewMeterSectionLibrary.getMeterISOConstants(context);
    if (meterTransactionType === REP_INST) {
        return '';
    }

    if (!libCommon.isDefined(equipment)) { //Switch to linked equipment (replace/install)
        if (context.getPageProxy() && context.getPageProxy().binding) {
            let deviceLink = context.getPageProxy().binding.DeviceLink;
            if (deviceLink) {
                equipment = deviceLink.EquipmentNum;
            }
        }
    }
    if (!libCommon.isDefined(equipment)) {
        try {
            equipment = context.evaluateTargetPathForAPI('#Page:MeterDetailsPage').binding.EquipmentNum;
            if (!equipment) {
                // check ClientData if no data found
                throw false;
            }
        } catch (err) {
            const binding = context.getClientData().binding || {};
            equipment = binding.EquipmentNum;
        }
    }

    if (!libCommon.isDefined(equipment) && libCommon.getStateVariable(context, 'METERREADINGOBJ')) {
        equipment = libCommon.getStateVariable(context, 'METERREADINGOBJ').BatchEquipmentNum;
    }
    if (isLocal) { //Only show local readings on FDC reading screen
        localFilter = ' and sap.islocal()';
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', ['MeterReadingRecorded'], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'${localFilter}&$orderby=MeterReadingDate desc, MeterReadingTime desc`).then(function(result) {
        if (result && result.length > 0) {
            return result.getItem(0).MeterReadingRecorded;
        } else {
            return '';
        }
    });
}
