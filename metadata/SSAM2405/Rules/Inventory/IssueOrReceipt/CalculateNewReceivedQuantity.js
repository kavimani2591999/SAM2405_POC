import libCom from '../../Common/Library/CommonLibrary';
import { MovementTypes } from '../Common/Library/InventoryLibrary';
export default function CalculateNewReceivedQuantity(context) {

    //When updating the local inventory item, add new quantity minus the old quantity (if this is an edit) to existing received or withdrawn quantity
    let type = libCom.getStateVariable(context, 'IMObjectType');
    let move = libCom.getStateVariable(context, 'IMMovementType');
    const tempItem = libCom.getStateVariable(context, 'TempItem');

    const binding = context.binding.TempItem_ReceivedQuantity !== undefined && context.binding || tempItem;

    if (type === 'PO') {
        if ((binding.TempLine_MovementType === MovementTypes.t103) || (binding.TempLine_MovementType === MovementTypes.t107)
            || (binding.TempLine_MovementType === MovementTypes.t104) || (binding.TempLine_MovementType === MovementTypes.t108)
            || (!binding.TempLine_MovementType)) {
            return Number(binding.TempItem_ReceivedQuantity);
        } else {
            return Number(binding.TempItem_ReceivedQuantity) + Number(binding.TempLine_QuantityInBaseUOM) - Number(binding.TempLine_OldQuantity);
        }
    } else if (type === 'RES' || type === 'PRD') {
        return Number(binding.TempItem_ReceivedQuantity) + Number(binding.TempLine_QuantityInBaseUOM) - Number(binding.TempLine_OldQuantity);
    } else if (type === 'STO') {
        if (move === 'I') {
            return Number(binding.TempItem_ReceivedQuantity); //Issue, so do not update received
        }
        //Receipt
        return Number(binding.TempItem_ReceivedQuantity) + Number(binding.TempLine_QuantityInBaseUOM) - Number(binding.TempLine_OldQuantity);
    }
}
