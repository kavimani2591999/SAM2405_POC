import libCommon from '../../../Common/Library/CommonLibrary';
import NewMeterSectionLibrary from '../../../Meter/Common/NewMeterSectionLibrary';

export default function ActivityDetailsNav(context) {
    const woBinding = NewMeterSectionLibrary.getWorkOrderBinding(context, context.getPageProxy().binding);
    let queryOption = '$expand=DisconnectActivityType_Nav,DisconnectActivityStatus_Nav,WOHeader_Nav/OrderMobileStatus_Nav,WOHeader_Nav/OrderISULinks';
    return libCommon.navigateOnRead(context.getPageProxy(), '/SAPAssetManager/Actions/WorkOrders/Meter/Activity/ActivityDetailsNav.action', woBinding.DisconnectActivity_Nav[0]['@odata.readLink'], queryOption);
}
