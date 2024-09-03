import NewMeterSectionLibrary from '../../Meter/Common/NewMeterSectionLibrary';

export default function DisconnectionTypeIsVisible(context) {
    const binding = NewMeterSectionLibrary.getWorkOrderBinding(context, context.getPageProxy().binding);
    const { DISCONNECT } = NewMeterSectionLibrary.getMeterISOConstants(context);
    return binding.OrderISULinks[0].ISUProcess === DISCONNECT;
}
