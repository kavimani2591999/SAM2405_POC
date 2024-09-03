import isAndroid from '../Common/IsAndroid';
import IsWindows from '../Common/IsWindows';

export default function FilterText(context) {
    if (isAndroid(context)) {
        return context.localizeText('apply');
    } else if (IsWindows(context)) {
        return context.localizeText('filter');
    } else {
        return 'Apply';
    }
}
