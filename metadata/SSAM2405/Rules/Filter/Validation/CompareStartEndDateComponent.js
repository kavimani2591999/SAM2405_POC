import CommonLibrary from '../../Common/Library/CommonLibrary';
import compareStartEndDate from './CompareStartEndDate';
import RedrawFilterToolbar from '../RedrawFilterToolbar';

/**
* Determine what control is calling function then run live check of date changes at required fields
* @param {IClientAPI} context
*/
export default function CompareStartEndDateComponent(context) {
    const pageName = CommonLibrary.getPageName(context);
    const currentComponent = context.getName();

    RedrawFilterToolbar(context);

    if (pageName) {
        let dateSwitch, startDateControl, endDateControl;
        let values;
        switch (pageName) {
            case 'WorkOrderFilterPage':
                if (currentComponent === 'ReqStartDateFilter' || currentComponent === 'ReqEndDateFilter') {
                    dateSwitch = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:RequestStartDateSwitch');
                    startDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:ReqStartDateFilter');
                    endDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:ReqEndDateFilter');
                } else {
                    dateSwitch = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:DueDateSwitch');
                    startDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:DueStartDateFilter');
                    endDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:DueEndDateFilter');
                }
                break;
            case 'NotificationFilterPage':
                dateSwitch = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:CreationDateSwitch');
                startDateControl = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:StartDateFilter');
                endDateControl = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:EndDateFilter');
                break;
            case 'ServiceOrderFilterPage':
                values = getServiceOrderFilterPageValues(currentComponent, context);
                dateSwitch = values.dateSwitch;
                startDateControl = values.startDateControl;
                endDateControl = values.endDateControl;
                break;
            case 'ServiceRequestFilterPage':
                values = getServiceRequestFilterPageValues(currentComponent, context);
                dateSwitch = values.dateSwitch;
                startDateControl = values.startDateControl;
                endDateControl = values.endDateControl;
                break;
            default:
                break;
        }
        if (CommonLibrary.isDefined(dateSwitch) && CommonLibrary.isDefined(startDateControl) && CommonLibrary.isDefined(endDateControl)) {
            return compareStartEndDate(context, dateSwitch.getValue(), startDateControl.getValue(), endDateControl.getValue());
        }
    }
}

function getServiceRequestFilterPageValues(currentComponent, context) {
    let dateSwitch, startDateControl, endDateControl;

    if (currentComponent === 'ReqStartDateFilter' || currentComponent === 'ReqEndDateFilter') {
        dateSwitch = context.evaluateTargetPath('#Page:ServiceRequestFilterPage/#Control:RequestStartDateSwitch');
        startDateControl = context.evaluateTargetPath('#Page:ServiceRequestFilterPage/#Control:ReqStartDateFilter');
        endDateControl = context.evaluateTargetPath('#Page:ServiceRequestFilterPage/#Control:ReqEndDateFilter');
    } else {
        dateSwitch = context.evaluateTargetPath('#Page:ServiceRequestFilterPage/#Control:DueDateSwitch');
        startDateControl = context.evaluateTargetPath('#Page:ServiceRequestFilterPage/#Control:DueStartDateFilter');
        endDateControl = context.evaluateTargetPath('#Page:ServiceRequestFilterPage/#Control:DueEndDateFilter');
    }

    return {dateSwitch, startDateControl, endDateControl};
}

function getServiceOrderFilterPageValues(currentComponent, context) {
    let dateSwitch, startDateControl, endDateControl;

    if (currentComponent === 'ReqStartDateFilter' || currentComponent === 'ReqEndDateFilter') {
        dateSwitch = context.evaluateTargetPath('#Page:ServiceOrderFilterPage/#Control:RequestStartDateSwitch');
        startDateControl = context.evaluateTargetPath('#Page:ServiceOrderFilterPage/#Control:ReqStartDateFilter');
        endDateControl = context.evaluateTargetPath('#Page:ServiceOrderFilterPage/#Control:ReqEndDateFilter');
    } else {
        dateSwitch = context.evaluateTargetPath('#Page:ServiceOrderFilterPage/#Control:DueDateSwitch');
        startDateControl = context.evaluateTargetPath('#Page:ServiceOrderFilterPage/#Control:DueStartDateFilter');
        endDateControl = context.evaluateTargetPath('#Page:ServiceOrderFilterPage/#Control:DueEndDateFilter');
    }

    return {dateSwitch, startDateControl, endDateControl};
}
