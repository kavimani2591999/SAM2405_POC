import CommonLibrary from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

/**
 * Get value for storage bin for PurchaseRequisition
 * 
 * @param {IClientAPI} context 
 * @returns the value for storage bin or empty string
 */
export default function PurchaseRequisitionStorageBin(context) {
    const noBin = '';

    if (CommonLibrary.IsOnCreate(context) || libVal.evalIsEmpty(context.binding)) {
        return noBin;
    }

    const materialNum = context.binding.Material;
    const plant = context.binding.Plant;
    const storageLocation = context.binding.StorageLocation;

    if (IsValid( [ materialNum, plant, storageLocation ] )) {
        const queryOptions = `$expand=Material,MaterialSLocs&$filter=MaterialNum eq '${materialNum}' and Plant eq '${plant}'`;

        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialPlants', [], queryOptions).then(result => {
            if (result && result.length > 0) {
                const material = result.getItem(0);
                return material.MaterialSLocs && material.MaterialSLocs.length ? material.MaterialSLocs.find(k => k.StorageLocation === storageLocation).StorageBin : noBin;
            }
            return noBin;
        });
    }
    return noBin;
}

/**
 * check if there are undefined or empty values in array
 * @param {String[]} values 
 * @returns true if all values are correct
 */
function IsValid(values) {
    return values.every(v => v && v.length !== 0);
}
