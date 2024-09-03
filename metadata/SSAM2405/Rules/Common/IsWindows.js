export default function IsWindows(context) {
    if (context.nativescript?.applicationModule?.windows) {
        return true;
    }
    return false;
}
