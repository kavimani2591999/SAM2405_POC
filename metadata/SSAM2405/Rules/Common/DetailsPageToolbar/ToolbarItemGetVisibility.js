import ToolbarGetStatusOptions from './ToolbarGetStatusOptions';
import pageToolbar from './DetailsPageToolbarClass';
import common from '../Library/CommonLibrary';
import IsBusinessObjectChangeable from './IsBusinessObjectChangeable';

export default function ToolbarItemGetVisibility(context) {
    // we can't change mobile status of an object if we are not on the right level assignment, so avoid doing these steps
    if (!IsBusinessObjectChangeable(context)) {
        return false;
    }

    const buttonName = context.getName();
    const toolbar = pageToolbar.getInstance();
    const possibleActions = toolbar.getToolbarItems(context);

    if (!common.isDefined(possibleActions)) {
        return ToolbarGetStatusOptions(context)
            .then(items => toolbar.generatePossibleToolbarItems(context, items))
            .then(() => toolbar.getToolbarItemVisibility(context, buttonName));
    } else {
        return toolbar.getToolbarItemVisibility(context, buttonName);
    }
}
