import ApplicationSettings from '../Common/Library/ApplicationSettings';
import isWindows from '../Common/IsWindows';
export default class {
    /*
    * check if measuring point is a classical view
    */
    static isMeasuringPointListView(context) {
        let value = this.getMeasuringPointView(context);
        return (value === 1 || isWindows(context));
    }

    /*
    * check if inspection characteristics is a classical view
    */
    static isInspectionCharacteristicsListView(context) {
        let value = this.getInspectionCharacteristicsView(context);
        return (value === 1 || isWindows(context));
    }

    /*
    * set measuring point view
    */
    static setMeasuringPointView(context, value) {
        ApplicationSettings.remove(context, 'MeasuringPointView');
        ApplicationSettings.setNumber(context, 'MeasuringPointView', value);
    }

    /*
    * set inspection characteristics view
    */
    static setInspectionCharacteristicsView(context, value) {
        ApplicationSettings.remove(context, 'InspectionCharacteristicView');
        ApplicationSettings.setNumber(context, 'InspectionCharacteristicView', value);
    }
    
    /*
    * set inspection characteristics view
    */
    static setPersistFilterPreference(context, value) {
        ApplicationSettings.remove(context, 'PersistFilter');
        ApplicationSettings.setBoolean(context, 'PersistFilter', value);
    }

     /*
    * get measuring point view
    */
     static getMeasuringPointView(context) {
        return ApplicationSettings.getNumber(context, 'MeasuringPointView', 0);
    }

    /*
    * get inspection characteristics view
    */
    static getInspectionCharacteristicsView(context) {
        return ApplicationSettings.getNumber(context, 'InspectionCharacteristicView', 0);
    }
    
    /*
    * get current Persist Filter preference
    */
    static getPersistFilterPreference(context) {
        return ApplicationSettings.getBoolean(context, 'PersistFilter', true);
    }

    /*
    * get meter screen view
    */
    static getMeterView(context) {
        return ApplicationSettings.getNumber(context, 'MeterView', 0);
    }
}
