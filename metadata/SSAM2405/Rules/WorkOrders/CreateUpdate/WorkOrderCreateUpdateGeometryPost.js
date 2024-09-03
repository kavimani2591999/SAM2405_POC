import GetGeometryType from '../../Geometries/GetGeometryType';
import GetObjectGroup from '../../Geometries/GetObjectGroup';
import ObjectKeyFromMap from '../../Geometries/ObjectKeyFromMap';
import GeometryType from '../../Geometries/GeometryType';
import IsGefEnabled from '../../Geometries/IsGefEnabled';
import libVal from '../../Common/Library/ValidationLibrary';
import GeometryValue from '../../Geometries/GeometryValue';
import { WorkOrderDetailsPageName } from '../Details/WorkOrderDetailsPageToOpen';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function WorkOrderCreateUpdateGeometryPost(context) {
    let binding = context.binding;
    let readLink;
    let workOrder;
    let objectKey;
    const workOrderDetailsPageName = WorkOrderDetailsPageName(context);

    if (CommonLibrary.getCurrentPageName(context) === 'WorkOrderCreateUpdatePage') {
        let previousPage = CommonLibrary.getPreviousPageName(context);
        if (previousPage !== workOrderDetailsPageName) {
            objectKey = binding.OrderId;
        }
        binding = context.evaluateTargetPathForAPI('#Page:-Previous').binding;
    } else if (context.currentPage.woBinding) {
        binding = context.currentPage.woBinding;
        context.currentPage.readLink = binding['@odata.editLink'];
        context.currentPage.objectKey = context.currentPage.woBinding.OrderId;
        workOrder = context.currentPage.woBinding;
        readLink = binding['@odata.editLink'];
    } else {
        objectKey = ObjectKeyFromMap(context);
        if (!libVal.evalIsEmpty(objectKey)) {
            readLink = 'MyWorkOrderHeaders(\'' + objectKey + '\')';
        } else {
            return false;
        }
    }
 
    if (!readLink) {
        readLink = binding['@odata.readLink'];
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', readLink + '/WOGeometries', [], '$expand=Geometry').then(function(results) {
        if (results && results.getItem(0)) {
            // geometry exisits, so this is an update case
            context.getPageProxy().setActionBinding(results.getItem(0).Geometry);
            return context.executeAction({'Name': '/SAPAssetManager/Actions/Geometries/GeometryUpdate.action', 'Properties': {
                'Headers': {
                    'OfflineOData.TransactionID': objectKey ? objectKey : `#Page:${workOrderDetailsPageName}/#Property:OrderId`,
                },
            }});
        } else {
            // geometry does not exist, so this is a create or delete case
            let geometryValue = GeometryValue(context);
            if (libVal.evalIsEmpty(geometryValue)) {
                // delete case, geometry and links already deleted, so nothing to do
                return Promise.resolve();
            }

            // Create case
            objectKey = workOrder ? '/SAPAssetManager/Rules/Geometries/ObjectKeyFromPage.js' :
                                    `#Page:${workOrderDetailsPageName}/#Property:OrderId`;
            const readLinks = workOrder ? '/SAPAssetManager/Rules/Geometries/ReadLinkFromPage.js' :
                                          `#Page:${workOrderDetailsPageName}/#Property:@odata.readLink`;
            const onSuccessHandler = workOrder ? '/SAPAssetManager/Rules/WorkOrders/CreateUpdate/WorkOrderCreateNewWOGeometry.js' :
                                                 '/SAPAssetManager/Rules/WorkOrders/CreateUpdate/WorkOrderCreateWOGeometry.js';
            const name = workOrder ? 'CreateNewGeometry' : 'CreateGeometry';

            const properties = {
                'Properties': {
                    'ObjectType': 'ORH',
                    'ObjectKey': objectKey,
                    'OutputFormat': 'json',
                    'GeometryValue': '/SAPAssetManager/Rules/Geometries/GeometryValueFromPage.js',
                },
                'CreateLinks': [{
                    'Property': 'WOHeader_Nav',
                    'Target': {
                        'EntitySet' : 'MyWorkOrderHeaders', 
                        'ReadLink' : readLinks,
                    },
                }],
                'OnSuccess': onSuccessHandler,
                'ActionResult': {
                    '_Name': name,
                },
            };

            return IsGefEnabled(context).then((enabled) => {
                if (enabled !== undefined && enabled === true) {
                    const objectGroupPromise = GetObjectGroup(context, 'ORH');
                    const geometryTypePromise = GetGeometryType(context, GeometryType(context));
                    return Promise.all([objectGroupPromise, geometryTypePromise]).then(function(promiseResults) {
                        properties.Properties.ObjectGroup = promiseResults[0];
                        properties.Properties.GeometryType = promiseResults[1];
                        return context.executeAction({'Name': '/SAPAssetManager/Actions/Geometries/GeometryCreate.action', 'Properties': properties}).then(() => {
                            if (context.currentPage.woBinding) {
                                context.currentPage.woBinding = null;
                            }
                        });
                    });
                }
                return context.executeAction({'Name': '/SAPAssetManager/Actions/Geometries/GeometryCreate.action', 'Properties': properties}).then(() => {
                    if (context.currentPage.woBinding) {
                        context.currentPage.woBinding = null;
                    }
                });
            });
        }
    });
}
