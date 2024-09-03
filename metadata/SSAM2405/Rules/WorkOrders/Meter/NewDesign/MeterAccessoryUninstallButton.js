import NewMeterSectionLibrary from '../../../Meter/Common/NewMeterSectionLibrary';

export default function MeterAccessoryUninstallButton(clientAPI) {
    const label = NewMeterSectionLibrary.getUninstallAccessoryTargetValues(clientAPI, clientAPI.binding, 'Label');
    // if no label available - still returning 'Uninstall' value, which wouldn't be clickable
    return label || NewMeterSectionLibrary.uninstallAccValues(clientAPI, 'Label');
}
