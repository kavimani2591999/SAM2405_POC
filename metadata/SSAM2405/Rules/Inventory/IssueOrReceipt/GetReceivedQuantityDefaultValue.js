import GetReceivedQuantity from './GetReceivedQuantity';

export default function GetReceivedQuantityDefaultValue(context) {
    return GetReceivedQuantity(context) || '';
}
