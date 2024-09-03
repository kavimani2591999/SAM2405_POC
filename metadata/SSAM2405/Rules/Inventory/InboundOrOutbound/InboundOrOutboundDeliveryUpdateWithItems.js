import libCom from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import updateHeaderStatus from '../InboundOrOutbound/InboundOrOutboundUpdateHeaderStatus';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

export default function InboundOrOutboundDeliveryUpdateWithItems(context) {
    let type = libCom.getStateVariable(context, 'IMObjectType');

    // Convenience Declarations
    const DeliveriesEntitySet = (type === 'IB' ? 'InboundDeliveries' : 'OutboundDeliveries');
    const DeliveryItemsEntitySet = (type === 'IB' ? 'InboundDeliveryItems' : 'OutboundDeliveryItems');
    const expand = (type === 'IB' ? 'InboundDelivery_Nav,InboundDeliverySerial_Nav,MaterialPlant_Nav&$orderby=Item' : 'OutboundDelivery_Nav,OutboundDeliverySerial_Nav,MaterialPlant_Nav&$orderby=Item');
    const DocumentCategory = (type === 'IB' ? '7' : 'J');
    
    return context.executeAction({'Name': '/SAPAssetManager/Actions/Inventory/InboundDelivery/InboundDeliveryUpdate.action', 'Properties': {
        'Target': {
            'EntitySet': DeliveriesEntitySet,
            'Service': '/SAPAssetManager/Services/AssetManager.service',
            'ReadLink': context.binding['@odata.readLink'],
        },
        'Properties': {
            'ActualGoodsMvtDate': new ODataDate().toDBDateTimeString(context),
            'DocumentCategory' : DocumentCategory,
            'GoodsMvtStatus': 'C',
        },
        'Headers': {
            'OfflineOData.TransactionID': context.binding.DeliveryNum,
        },
    }}).then(() => {
        return context.read('/SAPAssetManager/Services/AssetManager.service', DeliveryItemsEntitySet, [], `$filter=DeliveryNum eq '${context.binding.DeliveryNum}'&$expand=${expand}`).then(function(results) {
            let items = [];
            if (results && results.length > 0) {
                items = updateDeliveryItems(results, context, DeliveryItemsEntitySet);
            }
            return Promise.all(items).then(() => {
                return updateHeaderStatus(context, context.binding.DeliveryNum);
            });
        });
    }).then(() => {
        return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentCreateSuccessMessage.action').then(() => {
            if (libCom.getPageName(context) === 'InboundOutboundListPage') {
                libCom.setStateVariable(context, 'BulkUpdateItem', 1);
                return navigateToInboundOutboundDetailsPage(context);       
            }
            return undefined;   
        });
    });
}

function updateDeliveryItems(results, context, DeliveryItemsEntitySet) {
    let items = [];
    for (let index = 0; index < results.length; index++) {
        let itemBinding = results.getItem(index);
        if (!Object.prototype.hasOwnProperty.call(itemBinding,'@sap.isLocal') && Number(itemBinding.PickedQuantity) === 0) {
            let props = {
                'Plant': itemBinding.Plant,
                'StorageLocation': itemBinding.StorageLocation,
                'PickedQuantity': itemBinding.Quantity,
                'UOM': itemBinding.UOM,
                'Batch': itemBinding.Batch,
                'StorageBin': itemBinding.StorageBin,
            };

            // Update Delivery Item
            items.push(context.executeAction({'Name': '/SAPAssetManager/Actions/Inventory/InboundDelivery/InboundDeliveryUpdate.action', 'Properties': {
                'Target': {
                    'EntitySet': DeliveryItemsEntitySet,
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink': itemBinding['@odata.readLink'],
                },
                'Properties': props,
                'Headers': {
                    'OfflineOData.TransactionID': context.binding.DeliveryNum,
                },
            }}));
        }
    }
    return items;
}

function navigateToInboundOutboundDetailsPage(context) {
    const type = libCom.getStateVariable(context, 'IMObjectType');
    const navAction = (type === 'IB') ? '/SAPAssetManager/Actions/Inventory/Inbound/InboundDeliveryDetailNav.action' : '/SAPAssetManager/Actions/Inventory/OutboundDelivery/OutboundDeliveryDetailNav.action';
    context.getPageProxy().setActionBinding(context.getPageProxy().getActionBinding());
    return context.executeAction(navAction);
}
