import libMeter from '../../Meter/Common/MeterLibrary';
import NewMeterSectionLibrary from '../Common/NewMeterSectionLibrary';

export default function DisconnectMeterQueryOptions(context) {
    const woBinding = NewMeterSectionLibrary.getWorkOrderBinding(context);
    const { DISCONNECT } = NewMeterSectionLibrary.getMeterISOConstants(context);
    let deviceBlockedFlag = libMeter.getISUProcess(woBinding.OrderISULinks) !== DISCONNECT;
    let sectionTableProxy = context.getControls()[0] || context;
    let queryBuilder = sectionTableProxy.dataQueryBuilder();
    queryBuilder.expand('DisconnectDoc_Nav,DisconnectActivity_Nav/WOHeader_Nav/OrderISULinks,Device_Nav');
    queryBuilder.filter(`DisconnectActivity_Nav/OrderId eq '${woBinding.OrderId}' and Device_Nav/DeviceBlocked eq ${deviceBlockedFlag}`);
    return queryBuilder.build();
}
