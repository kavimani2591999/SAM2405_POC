import libPart from '../../PartLibrary';

export default function PartReturnEnable(context) {
    const binding = context.getPageProxy().getActionBinding() || context.binding;
    return libPart.getLocalQuantityIssued(context, binding).then(localQty => {
        if (binding.WithdrawnQuantity + localQty > 0) {
            return true;
        }
        return false;
    });
}
