export default function NewMeterListMultipleModeDisabled(clientAPI) {
    return clientAPI.getPageProxy().getControl('SectionedTable')?.getSections()[0].getSelectionMode() !== 'Multiple';
}
