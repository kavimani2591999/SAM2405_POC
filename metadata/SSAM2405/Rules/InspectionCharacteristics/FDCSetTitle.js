import isWindows from '../Common/IsWindows';

export default function FDCSetTitle(context, contextProxy, ButtonStackLib, ButtonName, section, text) {
    if (!isWindows(context)) {
        ButtonStackLib.setTitle(contextProxy, ButtonName, text);
    } else {
        section.getControl(ButtonName).setTitle(text);
    }
}
