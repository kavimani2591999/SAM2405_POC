import libSearch from './OnlineSearchLibrary';

export default function SelectAllButtonVisible(context) {
    // multi-select mode is disabled for 2405 release
    return false && libSearch.selectDeselectButtonVisible(context, true);
}
