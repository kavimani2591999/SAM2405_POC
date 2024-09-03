
import libMeter from '../../Meter/Common/MeterLibrary';
import NewMeterSectionLibrary from '../Common/NewMeterSectionLibrary';

export default function MeterDisconnectReconnectAllCaption(context) {
    const woBinding = NewMeterSectionLibrary.getWorkOrderBinding(context);
    let isuProcess = libMeter.getISUProcess(woBinding.OrderISULinks);

    if (isuProcess === 'DISCONNECT') {
        return context.localizeText('disconnect_all_meters');
    }
    return context.localizeText('reconnect_all_meters');
}
