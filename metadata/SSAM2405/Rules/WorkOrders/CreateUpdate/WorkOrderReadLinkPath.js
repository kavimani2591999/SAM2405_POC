import { WorkOrderDetailsPageName } from '../Details/WorkOrderDetailsPageToOpen';

export default function WorkOrderReadLinkPath(context) {
    return `#Page:${WorkOrderDetailsPageName(context)}/#Property:@odata.readLink`;
}
