import CommonLibrary from '../../../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../../../Common/Library/ValidationLibrary';
import MobileStatusLibrary from '../../../../MobileStatus/MobileStatusLibrary';
import { NoteLibrary } from '../../../../Notes/NoteLibrary';
import PersonaLibrary from '../../../../Persona/PersonaLibrary';
import SubOperationEnableMobileStatus from '../../../../SubOperations/MobileStatus/SubOperationEnableMobileStatus';
import SubOperationMobileStatusLibrary from '../../../../SubOperations/MobileStatus/SubOperationMobileStatusLibrary';
import { CanConfirmUnconfirmSuboperation, SuboperationConfirmOrUnconfirm } from '../../../../SubOperations/SubOperationChangeStatusOptions';
import { SubOperationUpdate } from '../../../../SubOperations/SubOperationUpdateNav';
import SubOperationsListViewQueryOption from '../../../../SubOperations/SubOperationsListViewQueryOption';
import EnableNotificationCreate from '../../../../UserAuthorizations/Notifications/EnableNotificationCreate';
import EnableWorkOrderEdit from '../../../../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import WorkOrderMobileStatusLibrary from '../../../MobileStatus/WorkOrderMobileStatusLibrary';

function isOperationHeaderLevelAssignment(context) {
    return ['Header', 'Operation'].includes(CommonLibrary.getWorkOrderAssnTypeLevel(context));
}

export function isSuboperationLevelAssignment(context) {
    return CommonLibrary.getWorkOrderAssnTypeLevel(context) === 'SubOperation';
}

export class SubOperationObjectCards {

    static RelatedSuboperationCount(context, operation) {
        return Promise.resolve(SubOperationsListViewQueryOption(context))
            .then(queryoptions => context.count('/SAPAssetManager/Services/AssetManager.service', `${operation['@odata.readLink']}/SubOperations`, [], queryoptions));
    }

    static RelatedSuboperationFooterVisible(context) {
        return SubOperationObjectCards.RelatedSuboperationCount(context, context.getPageProxy().binding)
            .then(count => 0 < count);
    }

    /** @param {IPageProxy & {binding: MyWorkOrderOperation}} context  */
    static SubOperationsCardCollectionIsVisible(context) {
        return PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isFieldServiceTechnicianInCSMode(context);
    }

    /** @param {IPageProxy & {binding: MyWorkOrderOperation}} context  */
    static async SubOperationOverflowButtons(context) {
        if (isOperationHeaderLevelAssignment(context)) {  // when the user is on header level or operation level assignment, then we should have "Edit", "Add Note", "Add Notification" options
            return [
                {
                    '_Name': 'SuboperationsEdit',
                    'Title': '$(L,edit)',
                    'Visible': '/SAPAssetManager/Rules/UserAuthorizations/WorkOrders/EnableWorkOrderEdit.js',
                    'OnPress': '/SAPAssetManager/Rules/WorkOrders/Operations/Details/SubOperationObjectCard/OperationSubOperationUpdate.js',
                },
                {
                    '_Name': 'SuboperationsAddNote',
                    'Title': '$(L, add_note)',
                    'OnPress': '/SAPAssetManager/Rules/WorkOrders/Operations/Details/SubOperationObjectCard/OperationSubOperationAddNote.js',
                    'Visible': '/SAPAssetManager/Rules/WorkOrders/Operations/Details/SubOperationObjectCard/IsSuboperationAddNoteVisible.js',
                },
                {
                    '_Name': 'SuboperationsAddNotification',
                    'Title': '$(L,add_notification)',
                    'OnPress': '/SAPAssetManager/Rules/SubOperations/SubOperationNotificationCreateNav.js',
                    'Visible': '/SAPAssetManager/Rules/WorkOrders/Operations/Details/SubOperationObjectCard/IsSuboperationAddNotificationVisible.js',
                },
            ];
        } else if (isSuboperationLevelAssignment(context)) { // when the user is on the Sub-Operation Level Assignment, then it should follow the same as the overview screen,
            return [
                {
                    '_Name': 'Tertiary Button',
                    'Title': '/SAPAssetManager/Rules/OverviewPage/MyWorkSection/ObjectCardTertiaryButtonTitle.js',
                    'Visible': '/SAPAssetManager/Rules/OverviewPage/MyWorkSection/ObjectCardTertiaryButtonVisible.js',
                    'OnPress': '/SAPAssetManager/Rules/OverviewPage/MyWorkSection/ObjectCardTertiaryButtonOnPress.js',
                },
                {
                    '_Name': 'TakeReadings',
                    'Title': '$(L,take_readings)',
                    'Visible': '/SAPAssetManager/Rules/OverviewPage/MyWorkSection/ObjectCardReadingButtonVisible.js',
                    'OnPress': '/SAPAssetManager/Rules/Measurements/Points/MeasuringPointsDataEntryNavWrapper.js',
                },
                {
                    '_Name': 'AddOrder',
                    'Title': '$(L,add_order)',
                    'Visible': '/SAPAssetManager/Rules/OverviewPage/MyWorkSection/ObjectCardOrderButtonVisible.js',
                    'OnPress': '/SAPAssetManager/Rules/OverviewPage/MyWorkSection/ObjectCardOrderCreate.js',
                },
                {
                    '_Name': 'AddNotification',
                    'Title': '$(L,add_notification)',
                    'Visible': '/SAPAssetManager/Rules/OverviewPage/MyWorkSection/ObjectCardNotificationButtonVisible.js',
                    'OnPress': '/SAPAssetManager/Rules/OverviewPage/MyWorkSection/ObjectCardNotificationCreate.js',
                },
                {
                    '_Name': 'Parts',
                    'Title': '$(L,parts)',
                    'Visible': '/SAPAssetManager/Rules/OverviewPage/MyWorkSection/ObjectCardPartVisible.js',
                    'OnPress': '/SAPAssetManager/Actions/Parts/PartsListViewNav.action',
                },
                {
                    '_Name': 'AddTime',
                    'Title': '$(L,record_time)',
                    'Visible': '/SAPAssetManager/Rules/OverviewPage/MyWorkSection/ObjectCardTimeVisible.js',
                    'OnPress': '/SAPAssetManager/Rules/OverviewPage/MyWorkSection/ObjectCardTimeCreate.js',
                },
            ];
        }
        return [];
    }

    /** @param {ISectionedTableProxy & {binding: MyWorkOrderSubOperation}} context  */
    static isWoChangeable(context) {
        return Promise.all([
            CommonLibrary.isCurrentReadLinkLocal(context.binding['@odata.readLink']),
            WorkOrderMobileStatusLibrary.isOrderComplete(context),
        ]).then(([isLocal, isWOComplete]) => isLocal || !isWOComplete);
    }

    /** @param {IClientAPI & {binding: MyWorkOrderOperation}} context  */
    static OperationSubOperationUpdate(context) {
        return SubOperationUpdate(context, context.getPageProxy().getActionBinding());
    }

    /** @param {IClientAPI & {binding: MyWorkOrderOperation}} context  */
    static OperationSubOperationAddNote(context) {
        const subOperation = context.getPageProxy().getActionBinding();
        // below part from NoteCreateNav.js
        CommonLibrary.setOnCreateUpdateFlag(context, 'CREATE');
        CommonLibrary.setOnChangesetFlag(context, false);
        if (!NoteLibrary.didSetNoteTypeTransactionForBindingType(context, subOperation)) {
            return Promise.resolve();
        }
        return NoteLibrary.noteDownload(context, subOperation['@odata.readLink'] + '/SubOperationLongText').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteCreateNav.action');
        });
    }

    /** @param {ISectionedTableProxy} context  */
    static IsSuboperationAddNoteVisible(context) {
        return Promise.all([
            SubOperationObjectCards.isWoChangeable(context),
            EnableWorkOrderEdit(context, context.binding),
        ]).then(([isWoChangeable, workorderEditable]) => isWoChangeable && workorderEditable);
    }

    /** @param {ISectionedTableProxy} context  */
    static IsSuboperationAddNotificationVisible(context) {
        return Promise.all([
            SubOperationObjectCards.isWoChangeable(context),
            EnableWorkOrderEdit(context, context.binding),
            EnableNotificationCreate(context),
        ]).then(([isWoChangeable, workorderEditable, notificationCreatable]) => isWoChangeable && workorderEditable && notificationCreatable);
    }

    /** @param {ISectionedTableProxy & {binding: MyWorkOrderOperation}} context  */
    static SubOperationPrimaryAction(context) {
        if (isOperationHeaderLevelAssignment(context)) {
            return {
                '_Name': 'SeeDetailsButton',
                'Title': '/SAPAssetManager/Rules/WorkOrders/Operations/Details/SubOperationObjectCard/SubOperationObjectCardPrimaryButtonTitle.js',
                'Visible': '/SAPAssetManager/Rules/WorkOrders/Operations/Details/SubOperationObjectCard/SubOperationObjectCardPrimaryButtonIsVisible.js',
                'OnPress': '/SAPAssetManager/Rules/WorkOrders/Operations/Details/SubOperationObjectCard/SubOperationObjectCardPrimaryButtonOnPress.js',
            };
        }
        return {
            '_Name': 'Primary Button',
            'Title': '/SAPAssetManager/Rules/OverviewPage/MyWorkSection/ObjectCardPrimaryButtonTitle.js',
            'Visible': '/SAPAssetManager/Rules/OverviewPage/MyWorkSection/ObjectCardPrimaryButtonVisible.js',
            'OnPress': '/SAPAssetManager/Rules/OverviewPage/MyWorkSection/ObjectCardPrimaryButtonOnPress.js',
        };
    }

    /** @param {IBindableSectionProxy & {binding: MyWorkOrderSubOperation}} context  */
    static async SubOperationObjectCardPrimaryButtonTitle(context) {
        return SubOperationObjectCards.GetSubOperationToolbarItems(context, context.binding)
            .then(items => ValidationLibrary.evalIsEmpty(items) ? '' : items[0].Title);
    }

    /** @param {IBindableSectionProxy & {binding: MyWorkOrderSubOperation}} context  */
    static SubOperationObjectCardPrimaryButtonIsVisible(context) {
        return Promise.all([
            SubOperationEnableMobileStatus(context, context.binding),
            SubOperationObjectCards.GetSubOperationToolbarItems(context, context.binding),
        ])
            .then(([isVisible, items]) => isVisible && !ValidationLibrary.evalIsEmpty(items));
    }

    /** @param {IBindableSectionProxy & {binding: MyWorkOrderOperation}} context this gets the section's context, unlike the others. suboperation is in the actionbinding */
    static SubOperationObjectCardPrimaryButtonOnPress(context) {
        return SubOperationObjectCards.GetSubOperationToolbarItems(context, context.getPageProxy().getActionBinding())
            .then(items => {
                if (ValidationLibrary.evalIsEmpty(items)) {
                    return undefined;
                }
                context.getPageProxy().getClientData().currentObject = context.getPageProxy().getActionBinding();
                return context.executeAction(items[0].OnPress);
            });
    }

    /**
     * @param {IBindableSectionProxy} context
     * @param {MyWorkOrderSubOperation} subOperation
     * @returns {Promise<any[]>} whatever SubOperationChangeStatusOptions returns */
    static GetSubOperationToolbarItems(context, subOperation) {
        const clientData = context.getPageProxy().getClientData();
        clientData.SubOperationObjectCardCache = clientData.SubOperationObjectCardCache ?? {};
        const key = `${subOperation.OrderId}_${subOperation.OperationNo}_${subOperation.SubOperationNo}`;
        clientData.SubOperationObjectCardCache[key] = clientData.SubOperationObjectCardCache[key] ?? SuboperationConfirmOrUnconfirm(context, context.binding);
        return clientData.SubOperationObjectCardCache[key];
    }

    /** @param {IPageProxy & {binding: MyWorkOrderOperation}} context  */
    static SubOperationSecondaryAction(context) {
        return isOperationHeaderLevelAssignment(context) ? {
            '_Name': 'SeeDetailsButton',
            'Title': 'secondary',
            'Visible': false,
        } : {
            '_Name': 'Secondary Button',
            'Title': '/SAPAssetManager/Rules/OverviewPage/MyWorkSection/ObjectCardSecondaryButtonTitle.js',
            'Visible': '/SAPAssetManager/Rules/OverviewPage/MyWorkSection/ObjectCardSecondaryButtonVisible.js',
            'OnPress': '/SAPAssetManager/Rules/OverviewPage/MyWorkSection/ObjectCardSecondaryButtonOnPress.js',
        };
    }

    /** @param {IPageProxy & {binding: MyWorkOrderOperation}} context  */
    static async SubOperationsConfirmAllVisible(context) {
        return Promise.all([
            isSuboperationLevelAssignment(context),
            SubOperationObjectCards._GetSubOperationsConfirmableSuboperations(context, context.getPageProxy().binding),
        ]).then(([isSubOpAssnmnt, confirmableSuboperation]) => {
            return !isSubOpAssnmnt && (0 < confirmableSuboperation.length);
        });
    }

    /** @param {IPageProxy & {binding: MyWorkOrderOperation}} context  */
    static SubOperationsConfirmAllOnPress(context) {
        return SubOperationObjectCards._GetSubOperationsConfirmableSuboperations(context, context.getPageProxy().binding)
            .then(subOperationsToConfirm => SubOperationMobileStatusLibrary.completeSubOperations(context, subOperationsToConfirm));
    }

    /** @returns {Promise<MyWorkOrderSubOperation[]>} */
    static _GetSubOperationsConfirmableSuboperations(context, operation) {
        return Promise.resolve(SubOperationsListViewQueryOption(context))
            .then(queryoptions => context.read('/SAPAssetManager/Services/AssetManager.service', `${operation['@odata.readLink']}/SubOperations`, [], queryoptions))
            .then((/** @type {ObservableArray<MyWorkOrderSubOperation>} */ suboperations) => Array.from(suboperations))
            .then(suboperations => suboperations.filter(subOperation => CanConfirmUnconfirmSuboperation(context, subOperation)))  // is header/parent operation started?
            .then(suboperations => Promise.all(suboperations.map(subOperation => Promise.all([subOperation, SubOperationEnableMobileStatus(context, subOperation)])))
                .then(result => result.filter(([, isVisible]) => isVisible).map(([subop]) => subop)))  // is suboperation toolbar visible?
            .then(suboperations => Promise.all(suboperations.map(subOperation => MobileStatusLibrary.isMobileStatusConfirmed(context, subOperation, subOperation.SubOperationNo).then(isConfirmed => ([subOperation, isConfirmed])))))
            .then((/** @type {Array<[MyWorkOrderSubOperation, bool]>} */ suboperations_isconfirmed) => suboperations_isconfirmed.filter(([, isConfirmed]) => !isConfirmed).map(([subOperation]) => subOperation));  // only the not already confirmed ones can be confirmed
    }

    /** @param {IClientAPI & {binding: MyWorkOrderOperation}} context  */
    static OperationRelatedSuboperations(context) {
        context.getPageProxy().getClientData().SubOperationObjectCardCache = {};  // reset this cache upon section redraw, in case we already changed their  mobstatus -> change the buttons
        return `${context.binding['@odata.readLink']}/SubOperations`;
    }
}
