import GetMaterialName from '../Common/GetMaterialName';
import GetItemTextOrMaterialName from '../Common/GetItemTextOrMaterialName';

export default function GetMaterialDescription(context, dividerStr = '') {
    if (context.binding) {
        const binding = context.binding;
        const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);

        if (type === 'MaterialDocItem') {
            if (!binding.Material) {
                if (binding.PurchaseOrderItem_Nav) {
                    return binding.PurchaseOrderItem_Nav.ItemText;
                } else if (binding.StockTransportOrderItem_Nav) {
                    return binding.StockTransportOrderItem_Nav.ItemText;
                }
            }
        } else if (type === 'PurchaseOrderItem' || type === 'InboundDeliveryItem' || type === 'ReservationItem' || type === 'StockTransportOrderItem' || type === 'ProductionOrderComponent') {
            return GetItemTextOrMaterialName(context);
        }

        return getMaterialName(context, dividerStr, type, binding);
    }

    return '';
}

function getMaterialName(context, prevDividerStr, type, binding) {
    let dividerStr = prevDividerStr;
    return GetMaterialName(context).then((result) => {
        if (result && dividerStr.length === 0) {
            dividerStr = ' - ';
        }
        if (type === 'MaterialDocItem' || type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem' || type === 'PhysicalInventoryDocItem') {
            return binding.Material + dividerStr + result;
        }
        return binding.MaterialNum + dividerStr + result;
    });
}
