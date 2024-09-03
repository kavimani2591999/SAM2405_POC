import isWindows from '../Common/IsWindows';

/**
* Open the feedback survey
* @param {IClientAPI} context
*/
export default function Feedback(context) {
    return isWindows(context)? context.nativescript.utilsModule.openUrl(context.getGlobalDefinition('/SAPAssetManager/Globals/Feedback/FeedbackURL.global').getValue()): context.executeAction('/SAPAssetManager/Actions/Feedback/FeedbackNav.action');
}
