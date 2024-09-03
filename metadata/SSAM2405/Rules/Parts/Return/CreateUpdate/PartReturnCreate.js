import isSerialized from '../../Issue/SerialParts/SerialPartsAreAllowed';
import issuedSerialNumberQuery from '../../Issue/SerialParts/SerialNumbersIssuedQuery';

/**
* If serialized material, only allow return if number serial numbers exist
* @param {IClientAPI} context
*/
export default function PartReturnCreate(context) {
    const pageProxy = context.getPageProxy();
    const binding = pageProxy.getActionBinding() || context.binding;

    let action = '/SAPAssetManager/Actions/Parts/PartReturnCreateChangeset.action';

    if (isSerialized(context, binding)) {
        return issuedSerialNumberQuery(context, binding).then((serialNumsArray) => {
            if (serialNumsArray && serialNumsArray.length > 0) {
                binding.serialNumsArray = serialNumsArray;
                pageProxy.setActionBinding(binding);
            } else {
                action = '/SAPAssetManager/Actions/Parts/PartReturnNoSerialNums.action';
            }
            return pageProxy.executeAction(action);
        });
    } else {
        return pageProxy.executeAction(action);
    }
}
