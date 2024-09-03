import IsNewLayoutEnabled from '../Common/IsNewLayoutEnabled';
import EnableAttachmentCreate from '../UserAuthorizations/Attachments/EnableAttachmentCreate';

export default function DocumentsSectionAddNewVisible(context) {
    return IsNewLayoutEnabled(context) && EnableAttachmentCreate(context);
}
