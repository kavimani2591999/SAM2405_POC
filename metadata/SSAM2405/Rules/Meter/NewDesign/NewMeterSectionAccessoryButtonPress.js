import { ValueResolver } from 'mdk-core/utils/ValueResolver';
import NewMeterSectionLibrary from '../Common/NewMeterSectionLibrary';

export default async function NewMeterSectionAccessoryButtonPress(context) {
    const binding = context._control?.constructor?.name === 'EditableDataTableCell' ? context.binding : context.getPageProxy().getActionBinding();
    context.currentPage.context.clientData.meterLink = binding?.['@odata.readLink'];
    context.currentPage.context.clientData.ActivityReason = binding?.Device_Nav?.ActivityReason;

    const action = await NewMeterSectionLibrary.accessoryButtonTargetValues(context, 'Action', binding);
    if (action) {
        if (action.includes('.js')) {
            return ValueResolver.resolveValue(action, context.currentPage.context);
        } else {
            return context.executeAction(action);
        }
    }
    return Promise.resolve();
}
