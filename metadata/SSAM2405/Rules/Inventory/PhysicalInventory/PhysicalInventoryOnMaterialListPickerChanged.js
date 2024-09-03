import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import refreshControls from '../PhysicalInventory/Count/ZeroCountOnChange';
import getBin from './Count/GetStorageBinAndBatchEnabled';
import libCom from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryOnMaterialListPickerChanged(context) {
    ResetValidationOnInput(context);
    let plant;
    let storageLocation;
    let material;

    if (context.getValue().length > 0) {
        // If PhysicalInventory Item page, then use binding values
        // otherwise use page proxy control values
        let currentPage = libCom.getPageName(context);
        if ( currentPage === 'PhysicalInventoryItemCreateUpdatePage') {
            plant = libCom.getStateVariable(context, 'PhysicalInventoryItemPlant');
            storageLocation = libCom.getStateVariable(context, 'PhysicalInventoryItemStorageLocation');
        } else {
            plant = libCom.getListPickerValue(context.getPageProxy().getControl('FormCellContainer').getControl('PlantLstPkr').getValue());
            storageLocation = libCom.getListPickerValue(context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationPicker').getValue());
    
        }
        material = context.getValue()[0].ReturnValue;
        let uomListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('UOMListPicker');
        let uomListPickerSpecifier = uomListPicker.getTargetSpecifier();
        if (material) {
            uomListPickerSpecifier.setQueryOptions(`$filter=MaterialNum eq '${material}'&$orderby=UOM`);
            uomListPickerSpecifier.setEntitySet('MaterialUOMs');
            uomListPickerSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
            uomListPicker.setEditable(true);
            uomListPicker.setTargetSpecifier(uomListPickerSpecifier);
            uomListPicker.redraw();
        }

        return refreshControls(context).then(() => {
            let binControl = context.getPageProxy().getControl('FormCellContainer').getControl('StorageBinSimple');
            return getBin(context).then(function(result) {
                if (result[0]) {
                    binControl.setValue(result[0]);
                } else {
                    binControl.setValue('');
                }

                // Reset Batch list
                // When Material is changed, check if Batch is visible, editable and update query options for new list
                let batchListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('BatchListPicker');
                if (plant && storageLocation && material) {
                    let batchQuery = "$filter=MaterialNum eq '" + material + "' and Plant eq '" + plant + "' and StorageLocation eq '" + storageLocation + "'";
                    let batchListSpecifier = batchListPicker.getTargetSpecifier();
                    batchListSpecifier.setQueryOptions(batchQuery);
                    batchListSpecifier.setEntitySet('MaterialBatchStockSet');
                    batchListSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
                    batchListPicker.setTargetSpecifier(batchListSpecifier);
                    batchListPicker.setValue('');
                    //Batch is editable if either batch (result[1]) or valuation (result[2]) enabled materials
                    if (result[1] || result[2]) { 
                        batchListPicker.setEditable(true);
                    } else {
                        batchListPicker.setEditable(false);
                    }
                } else {
                    batchListPicker.setValue('');
                    batchListPicker.setEditable(false);
                }
                return true;
            });
        });
    }
}

