import queryOptions from '../../Return/CreateUpdate/PartIssuedSerialNumQueryOptions';
import isSerialized from './SerialPartsAreAllowed';
import libCom from '../../../Common/Library/CommonLibrary';

export default function SerialNumbersIssuedQuery(context, bindingObject) {
    const binding = bindingObject || context.binding;    
    if (isSerialized(context, binding)) { //only proceed if serialized material
        return getIssuedSerialNums(context, binding).then((issuedSerialNums) => { //get all of the issued serial number entries 
            if (issuedSerialNums && issuedSerialNums.length > 0) {
                return getReturnedSerialNums(context, binding).then((returnedSerialNums) => { //get all of the returned serial number entries
                    if (returnedSerialNums && returnedSerialNums.length > 0) {
                        let currentIssuedSerialNums = getCurrentIssuedSerialNums(issuedSerialNums, returnedSerialNums); //compare the two collections and determine the ones that are currently issued as they could have been returned
                        return buildJsonObjectArray(currentIssuedSerialNums);
                    } else {
                        return buildJsonObjectArray(issuedSerialNums);
                    }
                });
            }
            return [];  
        });
    }
}

function getIssuedSerialNums(context, bindingObject) {

    let goodsIssueMovementType = libCom.getAppParam(context, 'WORKORDER', 'MovementType');
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MatDocItemSerialNums', ['SerialNum', 'MaterialDocNumber'], queryOptions(context, goodsIssueMovementType, bindingObject)).then((allIssuedSerialNumRecords) => {
        let allIssuedSerialNums = [];
        if (allIssuedSerialNumRecords && allIssuedSerialNumRecords.length > 0) {
            for (let i=0; i < allIssuedSerialNumRecords.length; i++) {
                allIssuedSerialNums.push(
                    {
                        'SerialNum': allIssuedSerialNumRecords.getItem(i).SerialNum,
                        'MaterialDocNumber': allIssuedSerialNumRecords.getItem(i).MaterialDocNumber,
                    },
                );
            }
        }

        return allIssuedSerialNums;
    });
}

function getReturnedSerialNums(context, bindingObject) {

    let goodsReturnMovementType = libCom.getAppParam(context, 'WORKORDER', 'GoodsReturnMovementType');

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MatDocItemSerialNums', ['SerialNum', 'MaterialDocNumber'], queryOptions(context, goodsReturnMovementType, bindingObject)).then((allReturnedSerialNumRecords) => {
        let allReturnedSerialNums = [];
        if (allReturnedSerialNumRecords && allReturnedSerialNumRecords.length > 0) {
            for (let i=0; i < allReturnedSerialNumRecords.length; i++) {
                allReturnedSerialNums.push(
                    {
                        'SerialNum': allReturnedSerialNumRecords.getItem(i).SerialNum,
                        'MaterialDocNumber': allReturnedSerialNumRecords.getItem(i).MaterialDocNumber,
                    },
                );
            }
        }

        return allReturnedSerialNums;
    });
}

function getCurrentIssuedSerialNums(issuedSerialNums, returnedSerialNums) {

    for (let i=0; i < issuedSerialNums.length; i++) {
        for (let returnedSerialNumobject of returnedSerialNums) {
            if (issuedSerialNums[i].SerialNum === returnedSerialNumobject.SerialNum) {
                if (returnedSerialNumobject.MaterialDocNumber > issuedSerialNums[i].MaterialDocNumber) { //if the Return happened after Issue then, it would have a higher MaterialDocNumber hence, remove this entry from array
                    issuedSerialNums[i] = undefined;
                    break;
                }
            }
        }
    }

    return issuedSerialNums;
}

function buildJsonObjectArray(serialNums) {

    let jsonResult = [];

    for (let serialNum of serialNums) {
        if (serialNum) {
            jsonResult.push(
                {
                    'DisplayValue': `${serialNum.SerialNum}`,
                    'ReturnValue': `${serialNum.SerialNum}`,
                },
            );
        }
    }

    return jsonResult;
}
