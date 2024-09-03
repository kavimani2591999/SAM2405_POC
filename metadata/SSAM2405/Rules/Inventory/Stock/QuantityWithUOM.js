/**
* Get the Material with quantity
* @param {IClientAPI} context
*/
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
export default function QuantityWithUOM(context) {
    if (!context.binding) {
        return '';
    }
    
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Materials', [], `$filter=MaterialNum eq '${context.binding.MaterialNum}'`).then(Material =>{
        return (context.binding.UnrestrictedQuantity !== undefined) ? `${context.binding.UnrestrictedQuantity} ${ValidationLibrary.evalIsEmpty(Material) ? '' : Material.getItem(0).BaseUOM}` : `${context.binding.UnrestrictedQty} ${ValidationLibrary.evalIsEmpty(Material) ? '' : Material.getItem(0).BaseUOM}`;
      
    });
}
