import ValidationLibrary from '../../../../Common/Library/ValidationLibrary';
import { GetEquipmentIconImages, GetFlocIconImages } from '../../../../Common/TechnicalObjectListViewIconImages';
import EquipmentDetailsNav from '../../../../Equipment/EquipmentDetailsNav';
import FunctionalLocationDetailsNav from '../../../../FunctionalLocation/FunctionalLocationDetailsNav';
import OperationDetailsEquipmentEntitySets from '../../OperationDetailsEquipmentEntitySet';
import OperationDetailsFLOCEntitySet from '../../OperationDetailsFLOCEntitySet';

/**
 * @typedef AssetType
 * @prop {string} title
 * @prop {string} subhead
 * @prop {string} onPress
 * @prop {string} footnote
 * @prop {string[]} icons
 */

export class EquipmentFlocAssetLibrary {
    /** @param {IPageProxy & {binding: AssetType}} context  */
    static AssetDetailImage(context) {
        return context.binding.detailImage;
    }

    /** @param {IPageProxy & {binding: AssetType}} context  */
    static AssetTitle(context) {
        return context.binding.title;
    }

    /** @param {IPageProxy & {binding: AssetType}} context  */
    static AssetSubhead(context) {
        return context.binding.subhead;
    }

    /** @param {IPageProxy & {binding: AssetType}} context  */
    static AssetIcons(context) {
        return context.binding.icons;
    }

    /** @param {IPageProxy}} context  */
    static AssetOnPress(context) {
        return context.getPageProxy().getActionBinding().onPress(context);
    }

    /** @param {IPageProxy}} context  */
    static AssetFootnote(context) {
        return context.binding.footnote;
    }

    /** @param {IPageProxy & {binding: MyWorkOrderOperation}} context  */
    static WorkOrderOperationAssets(context) {
        return Promise.all([
            context.read('/SAPAssetManager/Services/AssetManager.service', OperationDetailsEquipmentEntitySets(context), [], '$select=EquipDesc,EquipId'),
            context.read('/SAPAssetManager/Services/AssetManager.service', OperationDetailsFLOCEntitySet(context), [], '$expand=FuncLocDocuments/Document'),
        ])
            .then((response) => prepareAssetsItems(context, response));
    }

    static WorkOrderAssets(context) {
        const binding = context.binding;
        return Promise.all([
            context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', [], `$filter=EquipId eq '${binding.HeaderEquipment}'`),
            context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', [], `$filter=FuncLocIdIntern eq '${binding.HeaderFunctionLocation}'`),
        ])
            .then((response) => prepareAssetsItems(context, response));
    }

    static WCMObjectsAssets(context) {
        const readLink = context.binding['@odata.readLink'];
        return Promise.all([
            context.read('/SAPAssetManager/Services/AssetManager.service', `${readLink}/MyEquipments`, []),
            context.read('/SAPAssetManager/Services/AssetManager.service', `${readLink}/MyFunctionalLocations`, []),
        ])
            .then((response) => prepareAssetsItems(context, response));
    }
}

/**
 * @param {MyFunctionalLocation} floc
 * @returns {Promise<AssetType>} */
function flocToAsset(context, floc) {
    return {
        ...floc,
        title: floc.FuncLocDesc,
        onPress: FunctionalLocationDetailsNav,
        preserveIconStackSpacing: false,
        subhead: floc.FuncLocId,
        detailImage: '$(PLT, /SAPAssetManager/Images/DetailImages/Floc.png, /SAPAssetManager/Images/DetailImages/Floc.android.png)',
        footnote: context.localizeText('functional_location'),
        icons: GetFlocIconImages(context, floc),
    };
}

/**
 * @param {IClientAPI} context
 * @param {MyEquipment} equipment
 * @returns {Promise<AssetType>} */
function equipmentToAsset(context, equipment) {
    return {
        ...equipment,
        title: equipment.EquipDesc,
        onPress: EquipmentDetailsNav,
        preserveIconStackSpacing: true,
        subhead: equipment.EquipId,
        detailImage: '$(PLT, /SAPAssetManager/Images/DetailImages/Equipment.png, /SAPAssetManager/Images/DetailImages/Equipment.android.png)',
        footnote: context.localizeText('equipment'),
        icons: GetEquipmentIconImages(context, equipment),
    };
}

function prepareAssetsItems(context, [equipment, floc]) {
    return [[equipment, equipmentToAsset], [floc, flocToAsset]]
    .map(([x, mapping]) => !ValidationLibrary.evalIsEmpty(x) && mapping(context, x.getItem(0)))
    .filter(x => !!x);
}
