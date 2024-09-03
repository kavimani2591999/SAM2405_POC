import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';

export default function CurrentServiceOrderDate(context) {  
    return libWO.getActualDate(context);
}
