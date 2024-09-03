import pageToolbar from './DetailsPageToolbarClass';
import isRTL from '../IsRTL';
import IsWindows from '../IsWindows';

export default function IsMiddleSpaceVisible(context) {
    if (IsWindows(context)) {
        return false;
    }

    let toolbarItems = pageToolbar.getInstance().getToolbarItems(context);
    let negativeButton = toolbarItems.find(item => item.TransitionType === 'N');
    
    if (negativeButton) return !isRTL(context);

    return toolbarItems.length === 2;
}
