import { WorkOrderDetailsPageName } from '../Details/WorkOrderDetailsPageToOpen';

export default function WorkOrderIdPath(context) {
    return `#Page:${WorkOrderDetailsPageName(context)}/#Property:OrderId`;
}
