import ToolbarRefresh from '../../Common/DetailsPageToolbar/ToolbarRefresh';
import Logger from '../../Log/Logger';
import ProgressTrackerOnDataChanged from '../../TimelineControl/ProgressTrackerOnDataChanged';
import WorkOrderDetailsToolbarVisibility from './WorkOrderDetailsToolbarVisibility';
import QABRedrawExtension from '../../QAB/QABRedrawExtension';

export default function WorkOrderDetailsOnPageReturning(context) {
    QABRedrawExtension(context);

    const sectionedTableControl = context.getPageProxy().getControl('SectionedTable');

    // Redraw EDT section for new meter list section only
    const newMeterListUninstallSection = sectionedTableControl.getSection('NewMeterListUninstallSection');
    newMeterListUninstallSection?.redraw();

    const operationsObjectCardCollectionSection = sectionedTableControl.getSection('OperationsObjectCardCollection');
    operationsObjectCardCollectionSection?.redraw(true);

    return ToolbarRefresh(context).then(() => {
        return WorkOrderDetailsToolbarVisibility(context).then(visibility => {
            try {
                context.getToolbar().setVisible(visibility);
            } catch (error) {
                Logger.error('Toolbar visibility', error);
            }
            return ProgressTrackerOnDataChanged(context).then(() => {
                return context.redraw();
            });
        });
    });
}
