export default function NewMeterListDoneVisible(clientAPI) {
    return clientAPI.getPageProxy().getControl('SectionedTable').getSections()[0]?.getSelectionMode() === 'Multiple';
}
