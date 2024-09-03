import ApplicationSettings from './Library/ApplicationSettings';

export default function SetAppLaunchFinished(context) {
    return ApplicationSettings.setBoolean(context, 'onAppLaunch', false);
}
