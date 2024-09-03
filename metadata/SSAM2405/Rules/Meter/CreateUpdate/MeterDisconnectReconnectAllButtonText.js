import MeterLibrary from '../Common/MeterLibrary';
import NewMeterSectionLibrary from '../Common/NewMeterSectionLibrary';

export default function MeterDisconnectReconnectAllButtonText(context) {
    const woBinding = NewMeterSectionLibrary.getWorkOrderBinding(context);
    const isuProcess = MeterLibrary.getISUProcess(woBinding.OrderISULinks);
    const { DISCONNECT } = NewMeterSectionLibrary.getMeterISOConstants(context);
    return isuProcess === DISCONNECT ? context.localizeText('disconnect_all') : context.localizeText('reconnect_all');
}
