import CommonLibrary from '../../../../Common/Library/CommonLibrary';

export default function NotificationItemActivitiesCount(clientAPI) {
    const readLink = clientAPI.getPageProxy().binding['@odata.readLink'];
    return CommonLibrary.getEntitySetCount(clientAPI, readLink + '/ItemActivities', '');
}
