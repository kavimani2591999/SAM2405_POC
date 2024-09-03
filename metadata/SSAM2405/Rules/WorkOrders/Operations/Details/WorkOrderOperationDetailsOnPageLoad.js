import WorkOrderCompleted from '../../Details/WorkOrderDetailsOnPageLoad';
import Logger from '../../../Log/Logger';
import WorkOrderOperationDetailsToolbarVisibility from './WorkOrderOperationDetailsToolbarVisibility';

export default function WorkOrderOperationDetailsOnPageLoad(pageClientAPI) {
    // handle the action bar items visiblity based on Work Order status
    return WorkOrderCompleted(pageClientAPI)
        .then(() => WorkOrderOperationDetailsToolbarVisibility(pageClientAPI))
        .then((visibility) => {
            try {
                pageClientAPI.getToolbar()?.setVisible(visibility);
            } catch (error) {
                Logger.error('Toolbar visibility', error);
            }
        });
}
