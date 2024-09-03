//import libCom from '../Common/Library/CommonLibrary';
//import FSMOverviewOnPageReturning from '../OverviewPage/FSMOverviewOnPageReturning';
import dateChanged from './ActualDateChanges';

/**
* Changing ActualDate state variable when calendar section changes on new FSM overview
* @param {IClientAPI} context
*/
export default function CalendarDateChanged(context) {
    //Keeping this calendar specific file so we don't lose it.  Old datePicker control will use this so it isn't flagged as orphan.  Adjust this once calendar control is implemented
    return dateChanged(context);
    /*
    let sectionedTable = context.getPageProxy().getControls()[0];
    let dateControlSection = sectionedTable.getSection('CalendarSection');
    if (dateControlSection) {
        let date = context.getSelectedDate();
        if (date) {
            let newDate =  new Date(new Date(date).setHours(0,0,0,0));
            libCom.setStateVariable(context, 'ActualDate', newDate);
            return libCom.createOverviewRow(context, newDate).then(() => {
                context.currentPage.redraw();
                // Refresh the map view
                FSMOverviewOnPageReturning(context.getPageProxy());
                return Promise.resolve();
            });
        }
    }
    */
}
