import NewMeterSectionLibrary from './Common/NewMeterSectionLibrary';

export default function MetersListViewEntitySet(context) {
    if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        return context.binding['@odata.readLink'] + '/OrderISULinks';
    } else if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        const binding = NewMeterSectionLibrary.getWorkOrderBinding(context);
        return binding['@odata.readLink'] + '/OrderISULinks';
    } else if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderSubOperation') {
        return context.binding['@odata.readLink'] + '/WorkOrderOperation/WOHeader/OrderISULinks';
    } else {
        return context.binding['@odata.readLink'] + '/Devices_Nav';
    }
}
