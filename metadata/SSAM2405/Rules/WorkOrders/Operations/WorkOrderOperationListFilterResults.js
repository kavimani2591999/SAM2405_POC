
import libCommon from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import phaseFilterResult from '../../PhaseModel/PhaseModelFilterPickerResult';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import PhaseLibrary from '../../PhaseModel/PhaseLibrary';

export default function WorkOrderOperationListFilterResults(context) {
    let clientData = context.evaluateTargetPath('#Page:WorkOrderOperationsListViewPage/#ClientData');
    let filterResults = GetWorkOrderOperationListFilterCriteria(context, true);
    const mobileStatusFilter = filterResults.find(c => c.name === 'OperationMobileStatus_Nav/MobileStatus');

    if (clientData.OperationFastFiltersClass) {
        filterResults = filterResults.concat(clientData.OperationFastFiltersClass.getFastFilterValuesFromFilterPage(context, mobileStatusFilter.filterItems));
    }

    libCommon.removeStateVariable(context, 'OPERATIONS_DATE_FILTER');

    return filterResults.filter(c => !!c);
}

export function GetWorkOrderOperationListFilterCriteria(context, saveToClientData = false) {
    let result1 = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:SortFilter/#Value');
    let result2 = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:MobileStatusFilter/#Value');
    let result3 = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:MyOperationsFilter/#Value');
    let result4 = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:AssignmentFilter/#FilterValue');
    let result5 = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:TypeFilter/#FilterValue');

    let filterResults = [result1, result2, result3, result4, result5];

    if (IsPhaseModelEnabled(context)) {
        let execuationStage = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ExecuationStageFilter/#Value');
        filterResults.push(execuationStage);
        let phase = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:PhaseFilter/#Value');
        let result = phaseFilterResult(context, 'PhaseFilter', phase);
        if (result) filterResults.push(result);

        PhaseLibrary.addPhaseControlFilterResult(context, 'WorkOrderOperationsFilterPage', filterResults);
        PhaseLibrary.addPhaseControlKeyFilterResult(context, 'WorkOrderOperationsFilterPage', filterResults);
    }

    const scheduledEarliestStartDate = GetDateFilter(context, 'ScheduledEarliestStartDateSwitch', 'ScheduledEarliestStartDateStartFilter', 
    'ScheduledEarliestStartDateEndFilter', 'SchedEarliestStartDate', context.localizeText('scheduled_earliest_start_date'), 
    saveToClientData, 'scheduledEarliestStartDateStart', 'scheduledEarliestStartDateEnd');

    const scheduledEarliestEndDate = GetDateFilter(context, 'ScheduledEarliestEndDateSwitch', 'ScheduledEarliestEndDateStartFilter', 
    'ScheduledEarliestEndDateEndFilter', 'SchedEarliestEndDate', context.localizeText('scheduled_earliest_end_date'), 
    saveToClientData, 'scheduledEarliestEndDateStart', 'scheduledEarliestEndDateEnd');

    const scheduledLatestStartDate = GetDateFilter(context, 'ScheduledLatestStartDateSwitch', 'ScheduledLatestStartDateStartFilter', 
    'ScheduledLatestStartDateEndFilter', 'SchedLatestStartDate', context.localizeText('scheduled_latest_start_date'), 
    saveToClientData, 'scheduledLatestStartDateStart', 'scheduledLatestStartDateEnd');

    const scheduledLatestEndDate = GetDateFilter(context, 'ScheduledLatestEndDateSwitch', 'ScheduledLatestEndDateStartFilter', 
    'ScheduledLatestEndDateEndFilter', 'SchedLatestEndDate', context.localizeText('scheduled_latest_end_date'), 
    saveToClientData, 'scheduledLatestEndDateStart', 'scheduledLatestEndDateEnd');

    filterResults = filterResults.concat([scheduledEarliestStartDate, scheduledEarliestEndDate, scheduledLatestStartDate, scheduledLatestEndDate]);

    return filterResults.filter(c => !!c);
}

function GetDateFilter(context, switchCtrlName, startCtrlName, endCtrlName, filterProp, fastFilterLabel, saveToClientData = false, clientDataStartProp, clientDataEndProp) {
    let clientData = context.evaluateTargetPath('#Page:WorkOrderOperationsListViewPage/#ClientData');
    let dateSwitch = context.evaluateTargetPath(`#Page:WorkOrderOperationsFilterPage/#Control:${switchCtrlName}`);

    if (dateSwitch.getValue() === true) {
        let startDate = libCommon.getFieldValue(context, startCtrlName);
        let sdate = (startDate === '') ? new Date() : new Date(startDate);
        let odataDate = new ODataDate(sdate);
        let odataStartDate =  odataDate.toDBDateString(context);
    
        let endDate = libCommon.getFieldValue(context, endCtrlName);
        let edate = (endDate === '') ? new Date() : new Date(endDate);
        odataDate = new ODataDate(edate);
        let odataEndDate =  odataDate.toDBDateString(context);
    
        let dateFilter = [`${filterProp} ge datetime'${odataStartDate}' and ${filterProp} le datetime'${odataEndDate}'`];
        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true, fastFilterLabel, [`${context.formatDatetime(sdate)} - ${context.formatDatetime(edate)}`]);
       
        if (saveToClientData && clientDataStartProp && clientDataEndProp) {
            clientData.creationDateSwitch = dateSwitch.getValue();
            clientData[clientDataStartProp] = odataStartDate;
            clientData[clientDataEndProp] = odataEndDate;
        }

        return dateFilterResult;
    }

    return null;
}
