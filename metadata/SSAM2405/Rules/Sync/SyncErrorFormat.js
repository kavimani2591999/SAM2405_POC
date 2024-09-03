import errorVal from '../Common/Library/ErrorLibrary';

export default function SyncErrorFormat(context) {
    const section = context.getName();
    const property = context.getProperty();
    switch (section) {
        case 'SyncErrorObjectTable':
            switch (property) {
                case 'Title':
                    return errorVal.getErrorMessage(context);
                case 'Subhead':
                   return '';
                case 'Description':
                    return '';
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return errorVal.getErrorMessage(context);
}
