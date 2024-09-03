import IsNewLayoutEnabled from '../../Common/IsNewLayoutEnabled';
import MeterReadingMultipleNav from './MeterReadingMultipleNav';

export default function MeterReadingMultipleNavWrapper(context) {
    if (IsNewLayoutEnabled(context)) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=Device_Nav/DeviceCategory_Nav,Device_Nav/Equipment_Nav,Device_Nav/RegisterGroup_Nav').then(function(result) {
            let binding = result.getItem(0);
            binding.ErrorObject = context.binding.ErrorObject;
            binding.BatchEquipmentNum = context.binding.EquipmentNum;
            binding.DeviceLink = binding.Device_Nav;
            binding.FromSingleRegister = context.binding.Register;
    
            for (const header of context.binding.ErrorObject.CustomHeaders) {
                if (header.Name === 'transaction.omdo_id') {
                    binding.transactionOmdoId = header.Value;
                }
                
                if (header.Name === 'OfflineOData.TransactionID') {
                    binding.BatchEquipmentNum = header.Value;
                }
            }
    
            context.setActionBinding(binding);
            return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/NewDesign/InstallMeterNav.action');
        });
    }

    return MeterReadingMultipleNav(context);
}
