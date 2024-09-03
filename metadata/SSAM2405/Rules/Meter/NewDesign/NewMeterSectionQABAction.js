import NewMeterSectionLibrary from '../Common/NewMeterSectionLibrary';

export default async function NewMeterSectionQABAction(context) {
    const action = await NewMeterSectionLibrary.quickActionTargetValues(context, 'Action', context.getPageProxy()?.binding);
    return action && await context.executeAction(action);
}
