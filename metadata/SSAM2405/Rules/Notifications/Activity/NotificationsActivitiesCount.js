import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function NotificationActivitiesCount(clientAPI) {
    const readLink = clientAPI.getPageProxy().binding['@odata.readLink'];
    return CommonLibrary.getEntitySetCount(clientAPI, readLink + '/Activities', '');
}
