import FilterSettings from './FilterSettings';
import { GetEquipmentListFilterCriteria } from '../Equipment/EquipmentListFilterResults';
import libCom from '../Common/Library/CommonLibrary';
import { GetConfirmationListFilterCriteria } from '../Confirmations/List/Filter/ConfirmationListFilterResults';
import ExpensesListFilterResults from '../Expenses/ExpensesListFilterResults';
import FSMFilteringResult from '../Forms/FSM/FSMFilteringResult';
import { GetFLOCFilteringCriteria } from '../FunctionalLocation/FLOCFilteringResult';
import { GetInventorySearchFilterCriteria } from '../Inventory/Search/InventorySearchFilterResults';
import { GetStockSearchFilterCriteria } from '../Inventory/Stock/StockSearchFilterResults';
import { GetNotificationListFilterCriteria } from '../Notifications/NotificationListFilterResults';
import { GetServiceOrderListFilterCritetia } from '../ServiceOrders/ListView/Filter/ServiceOrderListFilterResults';
import { GetServiceRequestListFilterCriteria } from '../ServiceOrders/ListView/Filter/ServiceRequestListFilterResults';
import { GetServiceItemListFilterCriteria } from '../ServiceOrders/Item/Filter/ServiceItemListFilterResults';
import SafetyCertificatesListViewFilterResults from '../WCM/SafetyCertificates/SafetyCertificatesListViewFilterResults';
import WorkApprovalsListViewFilterResults from '../WCM/WorkApprovals/List/WorkApprovalsListViewFilterResults';
import WorkPermitFilterResults from '../WCM/WorkPermitFilter/WorkPermitFilterResults';
import OperationalItemsFilterResult from '../WCM/OperationalItems/ListView/OperationalItemsFilterResult';
import { GetWorkOrderListFilterCriteria } from '../WorkOrders/WorkOrderListFilterResults';
import { GetInspectionLotListFilterCriteria } from '../WorkOrders/InspectionLot/InspectionLotListFilterResults';
import { GetWorkOrderOperationListFilterCriteria } from '../WorkOrders/Operations/WorkOrderOperationListFilterResults';
import { GetSubOperationsListFilterCriteria } from '../WorkOrders/SubOperationsListFilterResults';

export default async function SaveFilterAsDefault(context) {
    const pageProxy = context.getPageProxy();
    const pageName = libCom.getPageName(pageProxy);
    let filterResults;

    switch (pageName) {
        case 'EquipmentFilterPage':
            filterResults = GetEquipmentListFilterCriteria(pageProxy);
            break;
        case 'ConfirmationListFilterPage':
            filterResults = GetConfirmationListFilterCriteria(pageProxy);
            break;
        case 'DocumentFilterPage':
            filterResults = [context.evaluateTargetPath('#Page:DocumentFilterPage/#Control:SortFilter/#Value')];
            break;
        case 'SubEquipmentFilterPage':
            filterResults = [
                context.evaluateTargetPath('#Page:SubEquipmentFilterPage/#Control:SortFilter/#Value'),
                context.evaluateTargetPath('#Page:SubEquipmentFilterPage/#Control:StatusFilter/#Value'),
            ];
            break;
        case 'ExpensesFilterPage':
            filterResults = ExpensesListFilterResults(pageProxy);
            break;
        case 'FSMFilterPage':
            filterResults = FSMFilteringResult(pageProxy);
            break;
        case 'RouteFilterPage':
            filterResults = [
                context.evaluateTargetPath('#Page:RouteFilterPage/#Control:SortFilter/#Value'),
                context.evaluateTargetPath('#Page:RouteFilterPage/#Control:MobileStatusFilter/#Value'),
            ];
            break;
        case 'FunctionalLocationFilterPage':
            filterResults = GetFLOCFilteringCriteria(pageProxy);
            break;
        case 'InventorySearchFilterPage':
            filterResults = GetInventorySearchFilterCriteria(pageProxy);
            break;
        case 'StockSearchFilter': 
            filterResults = GetStockSearchFilterCriteria(pageProxy);
            break;
        case 'MeasuringPointsListFilterPage':
            filterResults = [
                context.evaluateTargetPath('#Page:MeasuringPointsListFilterPage/#Control:CounterFilter/#Value'),
                context.evaluateTargetPath('#Page:MeasuringPointsListFilterPage/#Control:ValCodeFilter/#Value'),
            ];
            break;
        case 'NotificationFilterPage':
            filterResults = GetNotificationListFilterCriteria(pageProxy);
            break;
        case 'ServiceOrderFilterPage':
            filterResults = GetServiceOrderListFilterCritetia(pageProxy);
            break;
        case 'ServiceRequestFilterPage':
            filterResults = GetServiceRequestListFilterCriteria(pageProxy);
            break;
        case 'ServiceItemFilterPage':
            filterResults = GetServiceItemListFilterCriteria(pageProxy);
            break;
        case 'SafetyCertificatesFilterPage':
            filterResults = SafetyCertificatesListViewFilterResults(pageProxy);
            break;
        case 'WorkApprovalsFilterPage':
            filterResults = WorkApprovalsListViewFilterResults(pageProxy);
            break;
        case 'WorkPermitsFilterPage':
            filterResults = WorkPermitFilterResults(pageProxy);
            break;
        case 'OperationalItemsListFilter':
            filterResults = OperationalItemsFilterResult(pageProxy);
            break;
        case 'WorkOrderFilterPage':
            filterResults = GetWorkOrderListFilterCriteria(pageProxy);
            break;
        case 'InspectionLotFilterPage':
            filterResults = GetInspectionLotListFilterCriteria(pageProxy);
            break;
        case 'WorkOrderOperationsFilterPage':
            filterResults = GetWorkOrderOperationListFilterCriteria(pageProxy);
            break;
        case 'PRTDocumentFilterPage':
            filterResults = [context.evaluateTargetPath('#Page:PRTDocumentFilterPage/#Control:SortFilter/#Value')];
            break;
        case 'SubOperationsFilterPage':
            filterResults = GetSubOperationsListFilterCriteria(pageProxy);
            break;
        default:
            filterResults = [];
    }

    await FilterSettings.onSettingsSave(context, filterResults);
}
