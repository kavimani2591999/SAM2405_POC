import libSearch from './OnlineSearchLibrary';

export default function ItemActiveInSelectMode(context) {
    // multi-select mode is disabled for 2405 release
    return false && libSearch.isCurrentListInSelectionMode(context);
}
