import { SplitReadLink } from '../../Common/Library/ReadLinkUtils';
import common from '../../Common/Library/CommonLibrary';
import { setToSBin } from '../Stock/Transfer/OnSLocToToSelected';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
/**
* Describe this function...
* This function is called from MaterialListPicker onChange event on the IssueOrReceiptCreateUpdate.page
* When Material is changed, then the BatchList needs to be updated if the Material is batched.
* @param {IClientAPI} context
*/
export default function UpdateMaterialPlantAndStorageLocationFields(context) {
    ResetValidationOnInput(context);
    let objectType = common.getStateVariable(context, 'IMObjectType');
    let move = common.getStateVariable(context, 'IMMovementType');
    let uom = context.getPageProxy().getControl('FormCellContainer').getControl('UOMSimple');
    if (context.getValue().length > 0) {
        let plant = context.getPageProxy().getControl('FormCellContainer').getControl('PlantSimple');
        let quantity = context.getPageProxy().getControl('FormCellContainer').getControl('QuantitySimple');
        let batchListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('BatchListPicker');
        let batchToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('BatchNumToListPicker');
        let autoSerialNumberSwitch = context.getPageProxy().getControl('FormCellContainer').getControl('AutoSerialNumberSwitch');
        let serialNumButton = context.getPageProxy().getControl('FormCellContainer').getControl('SerialPageNav');
        let storageBin = context.getPageProxy().getControl('FormCellContainer').getControl('StorageBinSimple');
        let plantToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('PlantToListPicker');
        let storageLocationToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationToListPicker');
        let valuation = context.getPageProxy().getControl('FormCellContainer').getControl('ValuationTypePicker');
        let valuationTo = context.getPageProxy().getControl('FormCellContainer').getControl('ValuationToPicker');
        let plantVaue = SplitReadLink(context.getValue()[0].ReturnValue).Plant;
        let uomValue = '';
        let serial = false;
        let storageBinValue = '';
        let batchIndicatorFlag = false;
        let quantityFlag = true;
        let quantityClear = true;
        let valuationItems = [];
        let valuationFlag = false;
        let batchToIndicatorFlag = false;
        let valuationToFlag = false;
        let query = '$expand=Material,MaterialValuation_Nav,Material/SerialNumbers';
        let entitySet = context.getValue()[0].ReturnValue;
        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], query).then(result => {
            let material;
            let materialPlant;
            if (result && result.length > 0) {
                materialPlant = result.getItem(0);
                material = materialPlant.MaterialNum;
                if (materialPlant.BatchIndicator === 'X') {
                    batchIndicatorFlag = true;
                }
                if (materialPlant.SerialNumberProfile !== '') {
                    serial = true;
                    quantityFlag = false;
                    common.setStateVariable(context, 'MaterialReadLink', materialPlant['@odata.readLink']);
                }
                if (materialPlant.ValuationCategory) {
                    valuationItems = materialPlant.MaterialValuation_Nav;
                    valuationFlag = true;
                }
                if (batchIndicatorFlag && (objectType !== 'ADHOC' || (objectType === 'ADHOC' && move === 'T'))) {
                    batchToIndicatorFlag = true;
                }
                if (valuationFlag && (objectType !== 'ADHOC' || (objectType === 'ADHOC' && move === 'T'))) {
                    valuationToFlag = true;
                }
                common.setStateVariable(context, 'SerialNumbers', { actual: null, initial: null });

                if (objectType === 'ADHOC') {
                    common.setStateVariable(context, 'BatchRequiredForFilterADHOC', batchIndicatorFlag);
                }
                storageBinValue = '';
                uomValue = materialPlant.Material.BaseUOM;
            }
            plant.setValue(plantVaue);
            valuation.setVisible(valuationFlag);
            valuationTo.setVisible(valuationToFlag);
            uom.setEditable(true);
            uom.setValue(uomValue);
            storageBin.setValue(storageBinValue);
            autoSerialNumberSwitch.setVisible(serial && move === 'R');
            serialNumButton.setVisible(serial);
            quantity.setEditable(quantityFlag);
            if (quantityClear) {
                quantity.setValue('');
            }

            // Refresh BatchListPicker depending upon GI or GR
            batchListPicker.setVisible(batchIndicatorFlag);
            if (batchIndicatorFlag && objectType === 'ADHOC' && (move === 'R' || move === 'I' || move === 'T') && material && materialPlant) {
                let batchQuery = "$filter=MaterialNum eq '" + material + "' and Plant eq '" + materialPlant.Plant + "'";
                let batchListSpecifier = batchListPicker.getTargetSpecifier();
                batchListSpecifier.setQueryOptions(batchQuery);
                batchListSpecifier.setEntitySet('MaterialBatches');
                batchListSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
                batchListPicker.setEditable(true);
                batchListPicker.setValue('');
                batchListPicker.setTargetSpecifier(batchListSpecifier);
                batchListPicker.redraw();
            }

            // if the movementType is 311 then there may not be a value for the plantToListPicker because the Plant is set by the From Plant
            // 311 is STO within same plant
            if (batchToListPicker && batchToIndicatorFlag && objectType === 'ADHOC' && move === 'T' && material && plantToListPicker.getValue().length > 0) {
                // logic for batchTo picklist will be for Goods Receipt and STO which uses MaterialBatches
                let batchQuery = "$filter=MaterialNum eq '" + material + "' and Plant eq '" + plantToListPicker.getValue()[0].ReturnValue + "'";
                let batchToListSpecifier = batchToListPicker.getTargetSpecifier();
                batchToListSpecifier.setQueryOptions(batchQuery);
                batchToListSpecifier.setEntitySet('MaterialBatches');
                batchToListSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
                batchToListPicker.setEditable(true);
                batchToListPicker.setVisible(batchToIndicatorFlag);
                batchToListPicker.setValue('');
                batchToListPicker.setTargetSpecifier(batchToListSpecifier);
                batchToListPicker.redraw();
            } // else set batchtolist to not visible??


            // if we have valuation items in the current material plant, then
            // we adding these items to the valuation type list picker
            // only for new case, old functionality stays same
            if (valuationItems.length && objectType === 'ADHOC') {
                let pickerItems = valuationItems.map(item => {
                    return {
                        'ReturnValue': item.ValuationType,
                        'DisplayValue': item.ValuationType,
                    };
                });
                valuation.setPickerItems(pickerItems);
                valuation.setEditable(true);
                if (batchToIndicatorFlag) {
                    valuationTo.setPickerItems(pickerItems);
                    valuationTo.setEditable(true);
                }
            } else {
                valuation.setPickerItems([]);
                valuation.setEditable(false);
                valuation.setValue('');
                valuationTo.setPickerItems([]);
                valuationTo.setEditable(false);
                valuationTo.setValue('');
            }
            let uomListPickerSpecifier = uom.getTargetSpecifier();
            uomListPickerSpecifier.setEntitySet('MaterialUOMs');
            uomListPickerSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
            uom.setTargetSpecifier(uomListPickerSpecifier);
            uom.redraw();

            if (storageLocationToListPicker.getValue().length && plantToListPicker.getValue().length) {
                let moveStorageBin = context.getPageProxy().getControl('FormCellContainer').getControl('ToStorageBinSimple');
                let slocToVal = storageLocationToListPicker.getValue()[0].ReturnValue;
                let plantToVal = plantToListPicker.getValue()[0].ReturnValue;
                if (plantToVal && slocToVal && material) {
                    return context.read(
                        '/SAPAssetManager/Services/AssetManager.service',
                        'MaterialSLocs',
                        [],
                        "$select=StorageBin&$filter=MaterialNum eq '" + material + "' and Plant eq '" + plantToVal + "' and StorageLocation eq '" + slocToVal + "'",
                    ).then((val) => {
                        if (val && val.length === 0) {
                            return context.read(
                                '/SAPAssetManager/Services/OnlineAssetManager.service',
                                'MaterialSLocs',
                                [],
                                "$select=StorageBin&$filter=MaterialNum eq '" + material + "' and Plant eq '" + plantToVal + "' and StorageLocation eq '" + slocToVal + "'",
                            ).then((value) => {
                                return setToSBin(value, moveStorageBin);
                            }).catch(() => {
                                return setToSBin([], moveStorageBin);
                            });
                        } else {
                            return setToSBin(val, moveStorageBin);
                        }
                    });
                } else {
                    moveStorageBin.setValue('');
                    moveStorageBin.setEditable(false);
                    moveStorageBin.redraw();
                    return true;
                }
            }
            return true;
        });
    } else {
        uom.setValue('');
        uom.setEditable(false);
    }
}
