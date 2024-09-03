
export default function OperationalItemDetailsOnCustomEventDataReceived(context) {
    const { Data, EventType } = context.getAppEventData();
    if (EventType === 'RedrawOperationalItemDetailsPage' && Data) {
        context.getControl('SectionedTable').redraw();
        context.getToolbar().redraw();
    }
}
