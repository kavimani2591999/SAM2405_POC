
export default function NewMetersWithActivityListOnReturning(context) {
    const sectionedTable = context.getControls()[0];
    const edtSection = sectionedTable.getSections()[0];
    edtSection.redraw(true);
}
