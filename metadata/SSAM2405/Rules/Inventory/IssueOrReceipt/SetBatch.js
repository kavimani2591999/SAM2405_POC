import libCom from '../../Common/Library/CommonLibrary';
import { SplitReadLink } from '../../Common/Library/ReadLinkUtils';
/**
* Describe this function...
* @param {IClientAPI} context
*/


// set to empty after transf type, material change and online search.
export default function SetBatch(context) {
    let page = context.getPageProxy();
    let batchListPkr = page.evaluateTargetPathForAPI('#Control:BatchLstPkr');
    let batchSimple = page.evaluateTargetPathForAPI('#Control:BatchSimple');
    let onlineSwitch = page.evaluateTargetPath('#Control:OnlineSwitch').getValue();
    resetBatchValue(context, batchListPkr, batchSimple);
    if (context.getValue().length) {
        let materialPickerValue = context.getValue()[0].ReturnValue;
        let readLink = SplitReadLink(materialPickerValue);
        let service = onlineSwitch ? '/SAPAssetManager/Services/OnlineAssetManager.service' : '/SAPAssetManager/Services/AssetManager.service';
        let query = getQueryValue(onlineSwitch, readLink);
        let entity = getEntityValue(onlineSwitch, materialPickerValue);

        context.read(service, entity, [], query).then(res => {
            if (res.getItem(0).BatchIndicator === 'X') {
                let batchReadLink = materialPickerValue + '/MaterialPlant/MaterialBatch_Nav';
                context.read('/SAPAssetManager/Services/AssetManager.service', batchReadLink, [], '').then(result => {
                    if (result.length) {
                        let batchListPkrSpecifier = batchListPkr.getTargetSpecifier();
                        batchListPkr.setVisible(true);
                        batchListPkrSpecifier.setEntitySet(batchReadLink);
                        batchListPkr.setTargetSpecifier(batchListPkrSpecifier);
                    } else {
                        batchSimple.setVisible(true);
                    }
                }).catch(() => {
                    batchListPkr.setVisible(false);
                    batchSimple.setVisible(true);
                });
            } else {
                batchListPkr.setVisible(false);
                batchSimple.setVisible(false);
            }
        });
    } else {
        batchListPkr.setVisible(false);
        batchSimple.setVisible(false);
    }
}

function resetBatchValue(context, batchListPkr, batchSimple) {
    if (libCom.getStateVariable(context, 'BatchLstPkrNoReset')) {
        libCom.removeStateVariable(context, 'BatchLstPkrNoReset');
    } else {
        batchListPkr.setValue('');
        batchSimple.setValue('');
    }
}

function getEntityValue(onlineSwitch, materialPickerValue) {
    return onlineSwitch ? 'MaterialSLocs' : materialPickerValue;
}

function getQueryValue(onlineSwitch, readLink) {
    return onlineSwitch ? `$filter=Plant eq '${readLink.Plant}' and StorageLocation eq '${readLink.StorageLocation}' and MaterialNum eq '${readLink.MaterialNum}'` : ''; 
}
