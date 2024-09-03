import ConfirmationsIsEnabled from '../Confirmations/ConfirmationsIsEnabled';
import TimeSheetsIsEnabled from '../TimeSheets/TimeSheetsIsEnabled';

export default function IsTimeSectionEnabled(context) {
    // Check if either the time sheet or labor time is enabled AND MT is enabled
    return (ConfirmationsIsEnabled(context) || TimeSheetsIsEnabled(context));
}
