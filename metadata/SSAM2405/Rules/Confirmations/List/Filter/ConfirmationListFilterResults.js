export default function ConfirmationListFilterResults(context) {
    let statusLstPickerValues = context.evaluateTargetPath('#Page:ConfirmationListFilterPage/#Control:StatusLstPicker/#Value');
    let clientData = context.evaluateTargetPath('#Page:S4ConfirmationsListViewPage/#ClientData');
    clientData.statusLstPickerValues = statusLstPickerValues.map(val => val.ReturnValue);

    return GetConfirmationListFilterCriteria(context);
}

export function GetConfirmationListFilterCriteria(context) {
    let result1 = context.evaluateTargetPath('#Page:ConfirmationListFilterPage/#Control:SortFilter/#Value');
    let result2 = context.evaluateTargetPath('#Page:ConfirmationListFilterPage/#Control:AssignedToPicker/#FilterValue');
    let statusLstPickerValues = context.evaluateTargetPath('#Page:ConfirmationListFilterPage/#Control:StatusLstPicker/#Value');
    let filterResults = [result1, result2];
    
    if (statusLstPickerValues.length) {
        statusLstPickerValues = statusLstPickerValues
            .map(val => val.ReturnValue)
            .forEach(filterValue => filterResults.push(context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, [filterValue], true)));
    }

    return filterResults;
}
