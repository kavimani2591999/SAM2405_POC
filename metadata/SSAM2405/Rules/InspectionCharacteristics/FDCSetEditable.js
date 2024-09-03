import isWindows from '../Common/IsWindows';

export default function FDCSetEditable(context, contextProxy, ButtonStackLib, ButtonName, section, state) {
    if (!isWindows(context)) {
        ButtonStackLib.setEditable(contextProxy, ButtonName, state);
    } else {
        section.getControl(ButtonName).setEditable(state);
    }
}
