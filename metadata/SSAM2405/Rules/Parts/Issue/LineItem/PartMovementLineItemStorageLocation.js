import libPart from '../../PartLibrary';

export default function PartMovementLineItemStorageLocation(pageClientAPI) {
    
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libPart.partMovementLineItemCreateUpdateSetODataValue(pageClientAPI, 'StorageLocation');
}
