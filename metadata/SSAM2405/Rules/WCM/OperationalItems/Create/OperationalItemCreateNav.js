import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ValidationLibrary, { IntegerDirectivePartial, MaxLengthDirectivePartial, RequiredDirectivePartial } from '../../../Common/Library/ValidationLibrary';
import { WCMCertificateMobileStatuses } from '../../SafetyCertificates/SafetyCertificatesLibrary';

/** only open the create page, if the certificate has 'change' mobile status
 * @param {IPageProxy & {binding: WCMDocumentHeader}} context  */
export default function OperationalItemCreateNav(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/PMMobileStatus`, [], '')
        .then((/** @type {ObservableArray<PMMobileStatus>} */ status) => {
            const mobileStatus = !ValidationLibrary.evalIsEmpty(status) && status.getItem(0).MobileStatus;
            if (mobileStatus === WCMCertificateMobileStatuses.Change) {
                context.setActionBinding({
                    PlanningPlant: context.binding.PlanningPlant,
                    WCMDocument: context.binding.WCMDocument,
                    item: {},
                    isEdit: false,
                });
                return context.executeAction('/SAPAssetManager/Actions/WCM/OperationalItems/OperationalItemCreateNav.action');
            }
            const errorMessage = context.localizeText(mobileStatus === WCMCertificateMobileStatuses.Prepared ?
                'cannot_add_operational_item_until_revoke_prepared' :
                'cannot_add_operational_item_since_certificate_beyond_prepared');
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Common/GenericErrorDialog.action',
                'Properties': {
                    'Title': context.localizeText('add_operational_item'),
                    'Message': errorMessage,
                    'OKCaption': context.localizeText('ok'),
                },
            });
        });
}

const ItemCategories = Object.freeze({
    EquipmentCategory: 'E',
    FlocCategory: 'F',
});

export class OperationalItemCreateCodeBehind {

    /** Validates the fields in the page,
     * then prepares a WCMDocumentItem from the control values (and the binding properties),
     * then creates the new WCMDocumentItem with links to the parent WCMDocumentHeader and to the technical object
     * @param {IPageProxy} context  */
    static async DoneButtonPressed(context) {
        const isValid = await ValidateFields(context).then(isValids => isValids.every(i => !!i));
        if (!isValid) {
            return context.executeAction('/SAPAssetManager/Actions/Forms/FSM/FormValidationErrorBanner.action');
        }
        const sectionedTable = GetSectionedTable(context);

        /** @type {WCMDocumentItem} */
        const opItem = {
            WCMDocument: context.binding.WCMDocument,
            Sequence: await GetLocalSequenceNumber(context, context.binding.WCMDocument),
            ...GetOpItemFromControls(sectionedTable),
        };

        opItem[{ [ItemCategories.EquipmentCategory]: 'Equipment', [ItemCategories.FlocCategory]: 'FuncLoc' }[opItem.ItemCategoryCC]] = opItem.TechObject;
        opItem.ShortText = await GetShortText(context, opItem);
        await SetPrintFormat(context, context.binding.PlanningPlant, opItem);

        return CreateOperationalItem(context, opItem)
            .then(() => context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action'))
            .then(() => context.executeAction('/SAPAssetManager/Actions/WCM/OperationalItems/OperationalItemCreateSuccessToast.action'));
    }

    /** @param {IPageProxy} context  */
    static CancelPressed(context) {
        const prop2ControlName = GetProp2ControlName();
        /// Object.fromEntries() does not work in Chakra Javascript engine for Windows. Windows MDK recommended Array.from() instead 
        const opItem =  Array.from(prepareValues(Object.entries(context.binding.item).filter(([key]) => key in prop2ControlName))).reduce((acc, [ key, val ]) => Object.assign(acc, { [key]: val }), {});
        const sectionedTable = GetSectionedTable(context);
        const controlsOpItem = GetOpItemFromControls(sectionedTable);
        const isUnchanged = Object.entries(controlsOpItem).every(([k, v]) => opItem[k] === v);
        return context.executeAction(isUnchanged ? '/SAPAssetManager/Actions/Page/CancelPage.action' : '/SAPAssetManager/Actions/Page/ConfirmCancelPage.action');
    }

    /** @param {IControlProxy} context  */
    static ItemCategoryValues(context) {
        const allowedCategories = Object.values(ItemCategories);
        const terms = allowedCategories.map(c => `ItemCategoryCC eq '${c}'`).join(' or ');
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMItemCategories', [], `$filter=${terms}`)
            .then(result => ValidationLibrary.evalIsEmpty(result) ? [] : Array.from(result, (/** @type {WCMItemCategory} */ x) => ({ DisplayValue: x.ItemCategoryText, ReturnValue: x.ItemCategoryCC })));
    }

    /** @param {ISegmentedFormCellProxy} controlProxy  */
    static ItemCategoryControlOnChange(controlProxy) {
        const sectionedTable = GetSectionedTable(controlProxy.getPageProxy());
        /** @type {IListPickerFormCellProxy} */
        const techObjectControl = sectionedTable.getControl('TechnicalObjectControl');
        const isVisible = techObjectControl.visible;
        let promise = ResetControls(sectionedTable, ['TechnicalObjectControl']);
        if (!isVisible) {
            promise = promise.then(() => ResetControls(sectionedTable, ['SwitchingLocationControl', 'PhysicalLocationControl']));
        }
        return promise
            .then(() => {
                const planningPlant = controlProxy.getPageProxy().binding.PlanningPlant;
                const itemCategory = controlProxy.getValue()[0].ReturnValue;
                const [entitySet, displayValue, returnValue, queryOptions] = {
                    [ItemCategories.EquipmentCategory]: ['MyEquipments', '{EquipDesc} ({EquipId})', '{EquipId}', `$filter=PlanningPlant eq '${planningPlant}'&$orderby=EquipDesc`],
                    [ItemCategories.FlocCategory]: ['MyFunctionalLocations', '{FuncLocDesc} ({FuncLocId})', '{FuncLocIdIntern}', `$filter=PlanningPlant eq '${planningPlant}'&$orderby=FuncLocDesc`],
                }[itemCategory];
                const targetSpec = TechnicalObjectTargetSpecifier(techObjectControl.getTargetSpecifier(), entitySet, displayValue, returnValue, queryOptions);
                techObjectControl.setTargetSpecifier(targetSpec, true);
            })
            .then(() => OperationalItemCreateCodeBehind.ValidateControlOnChange(controlProxy));
    }

    /** @param {IListPickerFormCellProxy} controlProxy  */
    static TechnicalObjectControlOnChange(controlProxy) {
        const sectionedTable = GetSectionedTable(controlProxy.getPageProxy());
        /** @type {ISectionProxy} */
        const opGroupSection = sectionedTable.getSection('OperationalGroupFormCellSection');
        if (opGroupSection.getVisible()) {
            return OperationalItemCreateCodeBehind.ValidateControlOnChange(controlProxy);
        }
        return Promise.resolve(opGroupSection.setVisible(true, true))
            .then(() => ResetControls(sectionedTable, ['OperationalGroupControl']))
            .then(() => OperationalItemCreateCodeBehind.ValidateControlOnChange(controlProxy));
    }

    /** @param {ISegmentedFormCellProxy} controlProxy  */
    static OperationalGroupControlOnChange(controlProxy) {
        const sectionedTable = GetSectionedTable(controlProxy.getPageProxy());
        /** @type {ISectionProxy} */
        const taggingCondSection = sectionedTable.getSection('TaggingConditionSection');
        if (taggingCondSection.getVisible()) {  // keep prev. form data
            return ResetControls(sectionedTable, ['TaggingConditionPicker', 'TaggingTypeControl', 'UntaggingConditionPicker', 'UntaggingTypeControl', 'TaggingSequenceNote', 'UntaggingSequenceNote', 'BlockingTypePicker', 'PhysicalBlockingRequiredSwitch'])
                .then(() => {
                    setConditionPickerItems(sectionedTable);
                });
        }
        return Promise.resolve(taggingCondSection.setVisible(true, true))
            .then(() => ResetControls(sectionedTable, ['TaggingConditionPicker', 'TaggingSequenceNote', 'TaggingCommentNote', 'TagRequiredSlider', 'LockNote']))
            .then(() => {
                setConditionPickerItems(sectionedTable);
            })
            .then(() => OperationalItemCreateCodeBehind.ValidateControlOnChange(controlProxy));
    }

    static TagUntagConditionTypeValues(controlProxy) {
        return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'WCMSwitchingDatas', [], `$filter=PlanningPlant eq '${controlProxy.getPageProxy().binding.PlanningPlant}'`)
            .then(results => [...new Set(Array.from(results, (/** @type {WCMSwitchingData}*/ x) => [x.UntaggingType, x.TaggingType]).flat())])
            .then(results => results.map(x => ({ DisplayValue: x, ReturnValue: x })));
    }

    /** @param {IListPickerFormCellProxy} controlProxy  */
    static TaggingConditionPickerItems(controlProxy) {
        return OperationalItemCreateCodeBehind.GetWCMSwitchingDataTagUntagCondPickerItems(controlProxy, 'TaggingCond');
    }

    /** @param {IListPickerFormCellProxy} controlProxy  */
    static GetWCMSwitchingDataTagUntagCondPickerItems(controlProxy, propName) {
        const sectionedTable = GetSectionedTable(controlProxy.getPageProxy());
        if (ValidationLibrary.evalIsEmpty(sectionedTable)) {
            return [];
        }

        const opGroup = GetControlValue(sectionedTable.getControl('OperationalGroupControl'));
        return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'WCMSwitchingDatas', [], `$filter=OpGroup eq '${opGroup}' and PlanningPlant eq '${controlProxy.getPageProxy().binding.PlanningPlant}'`)
            .then(results => [...new Set(results.map((/** @type {WCMSwitchingData}*/ x) => x[propName]))])
            .then(taggingConditions => taggingConditions.map(tc => `OpCondition eq '${tc}'`).join(' or '))
            .then(filterTerm => controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'WCMOpConditions', [], `$filter=${filterTerm}&$orderby=OpConditionText`))
            .then(results => [...new Map(results.map((/** @type {WCMOpCondition} */ x) => [x.OpCondition, { DisplayValue: x.OpConditionText, ReturnValue: x.OpCondition }])).values()]);
    }

    /** @param {IListPickerFormCellProxy} controlProxy  */
    static TaggingConditionPickerOnChange(controlProxy) {
        const sectionedTable = GetSectionedTable(controlProxy.getPageProxy());
        const opGroup = GetControlValue(sectionedTable.getControl('OperationalGroupControl'));
        const untaggingCondSection = sectionedTable.getSection('UntaggingConditionSection');
        let promise = untaggingCondSection.getVisible() ? Promise.resolve() :  // keep prev. form data
            Promise.all(['UntaggingConditionSection', 'BlockingSection'].map(name => sectionedTable.getSection(name).setVisible(true, true)))
                .then(() => ResetControls(sectionedTable, ['UntaggingConditionPicker', 'UntaggingSequenceNote', 'UntaggingCommentNote', 'BlockingTypePicker', 'PhysicalBlockingRequiredSwitch']));

        if (ValidationLibrary.evalIsEmpty(controlProxy.getValue())) {
            promise = promise.then(() => ResetControls(sectionedTable, ['TagRequiredSlider', 'TaggingTypeControl', 'UntaggingTypeControl']));
        } else {
            promise = promise
                .then(() => controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'WCMSwitchingDatas', [], `$filter=TaggingCond eq '${GetControlValue(controlProxy)}' and OpGroup eq '${opGroup}' and PlanningPlant eq '${controlProxy.getPageProxy().binding.PlanningPlant}'`))
                .then(result => {
                    /** @type {WCMSwitchingData} */
                    const switchingData = result.getItem(0);
                    const [ttype, uttype, tagRequired] = ['TaggingTypeControl', 'UntaggingTypeControl', 'TagRequiredSlider'].map(controlName => sectionedTable.getControl(controlName));
                    [ttype, uttype].forEach((/** @type {IControlProxy} */ i) => i.setVisible(true));
                    return Promise.all([
                        sectionedTable.getControl('UntaggingConditionPicker').setValue(switchingData.UntagCond),
                        ttype.setValue(switchingData.TaggingType),
                        uttype.setValue(switchingData.UntaggingType),
                        tagRequired.setValue(switchingData.TagRequired === 'X'),
                    ]);
                });
        }

        return promise.then(() => OperationalItemCreateCodeBehind.ValidateControlOnChange(controlProxy));
    }

    /** @param {ISimplePropertyFormCellProxy | INoteFormCellProxy} controlProxy  */
    static ValidateControlOnChange(controlProxy) {
        return GetValidatorsForControl(controlProxy)
            .then(validators => runValidatorsForControl(controlProxy, validators));
    }
}

function GetOpItemFromControls(sectionedTable) {
    /// Object.fromEntries() does not work in Chakra Javascript engine for Windows. Windows MDK recommended Array.from() instead 
    return Array.from(prepareValues(Object
        .entries(GetProp2ControlName())
        .map(([propName, controlName]) => ([propName, GetControlValue(sectionedTable.getControl(controlName))])))).reduce((acc, [ key, val ]) => Object.assign(acc, { [key]: val }), {});
}

/** @return {WCMDocumentItem} */
function GetProp2ControlName() {
    return {
        ItemCategoryCC: 'ItemCategoryControl',
        TechObject: 'TechnicalObjectControl',
        SwitchingLoc: 'SwitchingLocationControl',
        Location: 'PhysicalLocationControl',
        OpGroup: 'OperationalGroupControl',
        TaggingCond: 'TaggingConditionPicker',
        TaggingType: 'TaggingTypeControl',
        TagSequence: 'TaggingSequenceNote',
        TaggingComment: 'TaggingCommentNote',
        TagRequired: 'TagRequiredSlider',
        LockNumber: 'LockNote',
        UntagCond: 'UntaggingConditionPicker',
        UntaggingType: 'UntaggingTypeControl',
        UntSequence: 'UntaggingSequenceNote',
        UntagComment: 'UntaggingCommentNote',
        BlockingType: 'BlockingTypePicker',
        PhysBlocking: 'PhysicalBlockingRequiredSwitch',
    };
}

/** converts true values to X, falses to '', then removes every falsy or empty valued tuple
 * @param {Array<[string, string | number | boolean]>} propName2value  */
function prepareValues(propName2value) {
    return propName2value
        .map(([propName, value]) => ([propName, convertBool(value)]))
        .filter(([, controlValue]) => !ValidationLibrary.evalIsEmpty(controlValue));
}

/** @param {string | number | boolean} value could be anything, this'll convert trues to 'X' and falses to '' */
function convertBool(value) {
    if (value === true) {
        return 'X';
    } else if (value === false) {
        return '';
    }
    return value;
}

/** @param {IClientAPI} context  */
function GetLocalSequenceNumber(context, WCMDocumentId) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `WCMDocumentHeaders('${WCMDocumentId}')/WCMDocumentItems`, [], '$orderby=Sequence desc')
        .then(result => ValidationLibrary.evalIsEmpty(result) ? 10 : Number(result.getItem(0).Sequence) + 10)  // sequences are incremented by 10
        .then(lastSequence => lastSequence.toString().padStart(6, '0'));  // sequences are 0 padded to be of length 6
}

/** @param {IListPickerFormCellTargetProxy} context  */
function TechnicalObjectTargetSpecifier(context, entitySet, displayValue, returnValue, queryOptions) {
    context.setEntitySet(entitySet);
    context.setDisplayValue(displayValue);
    context.setReturnValue(returnValue);
    context.setQueryOptions(queryOptions);
    context.setService('/SAPAssetManager/Services/AssetManager.service');
    return context;
}

/** @param {WCMDocumentItem} opItem */
function SetPrintFormat(context, planningPlant, opItem) {
    const tag2PrintFormat = {
        PrintCategoryTag: '4',
        PrintCategoryUntag: '5',
    };
    if (opItem.TagRequired) {
        return Promise.all(
            [tag2PrintFormat.PrintCategoryTag, tag2PrintFormat.PrintCategoryUntag]
                .map(printCategory => context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMPrintFormatTags', [], `$filter=PrintCategory eq '${printCategory}' and PlanningPlant eq '${planningPlant}'`)
                    .then((/** @type {WCMPrintFormatTag} */ res) => res.getItem(0).PrintFormat)),
        ).then(([printFormatTag, printFormatUntag]) => {
            opItem.PrintFormatTag = printFormatTag;
            opItem.PrintFormatUntag = printFormatUntag;
        });
    }
    return Promise.resolve();
}

/**
 * @param {IClientAPI} context
 * @param {WCMDocumentItem} opItem
 */
function GetShortText(context, opItem) {
    if (opItem.ItemCategoryCC === ItemCategories.EquipmentCategory) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `MyEquipments('${opItem.Equipment}')`, ['EquipDesc'], '').then(res => res.getItem(0).EquipDesc);
    } else if (opItem.ItemCategoryCC === ItemCategories.FlocCategory) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `MyFunctionalLocations('${opItem.FuncLoc}')`, ['FuncLocDesc'], '').then(res => res.getItem(0).FuncLocDesc);
    }
    return Promise.resolve('');
}

function GetReadLinkObj(property, entitySet, readLink) {
    return {
        'Property': property,
        'Target':
        {
            'EntitySet': entitySet,
            'ReadLink': readLink,
        },
    };
}

/**
 * @param {WCMDocumentItem} opItem
 */
function GetOdataLinks(opItem) {
    const createLinks = [GetReadLinkObj('WCMDocumentHeaders', 'WCMDocumentHeaders', `WCMDocumentHeaders('${opItem.WCMDocument}')`)];
    if (opItem.Equipment) {
        createLinks.push(GetReadLinkObj('MyEquipments', 'MyEquipments', `MyEquipments('${opItem.Equipment}')`));
    }
    if (opItem.FuncLoc) {
        createLinks.push(GetReadLinkObj('MyFunctionalLocations', 'MyFunctionalLocations', `MyFunctionalLocations('${opItem.FuncLoc}')`));
    }
    return createLinks;
}

/**
 * @param {IClientAPI} context
 * @param {WCMDocumentItem} opItem
 */
function CreateOperationalItem(context, opItem) {
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Common/GenericCreate.action',
        'Properties': {
            'Target':
            {
                'EntitySet': 'WCMDocumentItems',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
            'Properties': {
                ...opItem,
            },
            'RequestOptions': {
                'TransactionID': opItem.WCMDocument,
                'RemoveCreatedEntityAfterUpload': true,
            },
            'CreateLinks': GetOdataLinks(opItem),
        },
    });
}

function setConditionPickerItems(sectionedTable) {
    return Promise.all([
        SetTaggingConditionPickerItems(sectionedTable),
        SetUntaggingConditionPickerItems(sectionedTable),
        SetTaggingUnTaggingTypePickerItems(sectionedTable, 'TaggingTypeControl'),
        SetTaggingUnTaggingTypePickerItems(sectionedTable, 'UntaggingTypeControl'),
    ]);
}

async function SetTaggingConditionPickerItems(sectionedTable) {
    /** @type {IListPickerFormCellProxy} */
    const taggingCondpicker = sectionedTable.getControl('TaggingConditionPicker');
    return taggingCondpicker.setPickerItems(await OperationalItemCreateCodeBehind.TaggingConditionPickerItems(taggingCondpicker));
}

async function SetTaggingUnTaggingTypePickerItems(sectionedTable, controlName) {
    /** @type {IListPickerFormCellProxy} */
    const taggingTypeControl = sectionedTable.getControl(controlName);
    return taggingTypeControl.setPickerItems(await OperationalItemCreateCodeBehind.TagUntagConditionTypeValues(taggingTypeControl));
}

async function SetUntaggingConditionPickerItems(sectionedTable) {
    /** @type {IListPickerFormCellProxy} */
    const untaggingCondpicker = sectionedTable.getControl('UntaggingConditionPicker');
    return untaggingCondpicker.setPickerItems(await OperationalItemCreateCodeBehind.GetWCMSwitchingDataTagUntagCondPickerItems(untaggingCondpicker, 'UntagCond'));
}

/**
 * @param {IListPickerFormCellProxy | IFormCellProxy} control
 * @returns {null | undefined | string} */
function GetControlValue(control) {
    const cType = control.getType();
    if (['Control.Type.FormCell.SegmentedControl', 'Control.Type.FormCell.ListPicker'].includes(cType)) {
        const value = control.getValue();
        return ValidationLibrary.evalIsEmpty(value) ? undefined : value[0].ReturnValue;
    }
    return control.getValue();
}

function defaultObject(targetInstance, ctor) {
    return new Proxy(targetInstance, {
        get(target, prop) {
            if (!(prop in target)) {
                target[prop] = ctor();
            }
            return target[prop];
        },
    });
}

/**
 * @param {IControlProxy} controlProxy */
function GetValidatorsForControl(controlProxy) {
    const pageProxy = controlProxy.getPageProxy();
    const controlName = controlProxy.getName();
    return Promise.all([GetFieldLengthLimits(pageProxy), GetNumericTypeControlNames(pageProxy), GetRequiredControlNames(pageProxy)])
        .then(([limits, numerics, required]) => {
            return [
                numerics.includes(controlName) ? IntegerDirectivePartial(controlProxy) : undefined,
                (controlName in limits) ? MaxLengthDirectivePartial(controlProxy, limits[controlName]) : undefined,
                required.includes(controlName) ? RequiredDirectivePartial(controlProxy) : undefined,
            ].filter(i => !!i);
        });
}

/**
 * @param {IPageProxy} context */
function GetValidators(context) {
    const sectionedTable = GetSectionedTable(context.getPageProxy());
    return Promise.all([GetFieldLengthLimits(context), GetNumericTypeControlNames(context), GetRequiredControlNames(context)])
        .then(([limits, numerics, required]) => {
            const validators = {};
            const validatorsProxy = defaultObject(validators, () => []);
            numerics.forEach(controlName => validatorsProxy[controlName].push(IntegerDirectivePartial(sectionedTable.getControl(controlName))));
            Object.entries(limits).forEach(([controlName, limit]) => validatorsProxy[controlName].push(MaxLengthDirectivePartial(sectionedTable.getControl(controlName), limit)));
            required.forEach(controlName => validatorsProxy[controlName].push(RequiredDirectivePartial(sectionedTable.getControl(controlName))));
            return validators;
        });
}

/**
 * @param {IPageProxy} context
 * @returns {Promise<string[]>} */
function GetRequiredControlNames(context) {
    const clientData = context.getClientData();
    if (ValidationLibrary.evalIsEmpty(clientData.requiredControlNames)) {
        clientData.requiredControlNames = Promise.resolve((['ItemCategoryControl', 'TechnicalObjectControl', 'OperationalGroupControl', 'TaggingConditionPicker']));
    }
    return clientData.requiredControlNames;
}

/**
 * @param {IPageProxy} context
 * @returns {Promise<string[]>} */
function GetNumericTypeControlNames(context) {
    const clientData = context.getClientData();
    if (ValidationLibrary.evalIsEmpty(clientData.numericControlNames)) {
        clientData.numericControlNames = Promise.resolve((['TaggingSequenceNote', 'UntaggingSequenceNote']));
    }
    return clientData.numericControlNames;
}

/**
 * @param {IPageProxy} context
 * @returns {Promise<Object<string, number>>} */
function GetFieldLengthLimits(context) {
    const clientData = context.getClientData();
    if (ValidationLibrary.evalIsEmpty(clientData.fieldLengthLimits)) {
        clientData.fieldLengthLimits = Promise.resolve({
            SwitchingLocationControl: 40,  // values are from the CSDL xml
            PhysicalLocationControl: 40,
            TaggingSequenceNote: 5,
            TaggingCommentNote: 40,
            LockNote: 5,
            UntaggingSequenceNote: 5,
            UntaggingCommentNote: 40,
        });
    }
    return clientData.fieldLengthLimits;
}

/** @param {IPageProxy} context */
function ValidateFields(context) {
    const sectionedTable = GetSectionedTable(context.getPageProxy());
    return GetValidators(context)
        .then(validators => Promise.all(Object.entries(validators).map(([controlName, directives]) => runValidatorsForControl(sectionedTable.getControl(controlName), directives))));
}

/** @param {_DirectiveBase[]} directives  */
function runValidatorsForControl(control, directives) {
    return directives.reduce((promiseChain, currentValidator) => promiseChain.then(isValid => isValid ? currentValidator.applyError() : false), Promise.resolve(true))
        .then(isValid => {
            if (isValid) {
                CommonLibrary.clearValidationOnInput(control);
            }
            return isValid;
        });
}

/** @return {ISectionedTableProxy} */
function GetSectionedTable(pageProxy) {
    return pageProxy.getControl('FormCellContainer');
}

/** @param {ISectionedTableProxy} sectionedTable  */
function ResetControls(sectionedTable, controlNames) {
    const controlEmptyValues = {
        'Control.Type.FormCell.SegmentedControl': '',
        'Control.Type.FormCell.ListPicker': '',
        'Control.Type.FormCell.SimpleProperty': '',
        'Control.Type.FormCell.Note': '',
        'Control.Type.FormCell.Switch': false,
    };
    return Promise.all(
        controlNames
            .map(n => sectionedTable.getControl(n))
            .map((/** @type {IControlProxy} */ control) => Promise.all([control.setVisible(true, true), control.setValue(controlEmptyValues[control.getType()])])),
    );
}
