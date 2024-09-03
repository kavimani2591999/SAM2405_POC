import IsNewLayoutEnabled from '../../Common/IsNewLayoutEnabled';
import IsMeterComponentEnabled from '../../ComponentsEnablement/IsMeterComponentEnabled';
import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';
import Logger from '../../Log/Logger';
import NewMeterSectionLibrary from '../../Meter/Common/NewMeterSectionLibrary';
import { modifyUninstallMeterEDTTable } from '../../WCM/WorkOrderDetails/WorkOrderDetailsPageMetadata';
import WorkOrderOperationDetailsPageToOpen from './Details/WorkOrderOperationDetailsPageToOpen';

export default function WorkOrderOperationDetailsPageMetadata(clientAPI) {
    return addKPIViewInPageHeader(clientAPI).then((page) => {
        return ModifyKeyValueSection(clientAPI, page, 'WorkOrderOperationDetailsSection').then(updatedPage => {
            return modifyUninstallMeterEDTTable(clientAPI, updatedPage);
        });
    });
}

function addKPIViewInPageHeader(clientAPI) {
    let page = clientAPI.getPageDefinition(WorkOrderOperationDetailsPageToOpen(clientAPI));

    if (IsMeterComponentEnabled(clientAPI)) {
        return NewMeterSectionLibrary.newObjectCellSectionVisible(clientAPI, 'KPI', clientAPI.getActionBinding()).then((res) => {
            if (res && IsNewLayoutEnabled(clientAPI)) {
                let sections = page.Controls[0].Sections;
                let pageHeader = sections[0].ObjectHeader;
                if (pageHeader && !pageHeader.KPIView) {
                    pageHeader.KPIView = {
                        'Label': '/SAPAssetManager/Rules/WorkOrders/Meter/NewDesign/MetersKPILabelForPoints.js',
                        'LeftMetric': '',
                        'RightMetric': '/SAPAssetManager/Rules/WorkOrders/Meter/NewDesign/MetersKPIValueForPoints.js',
                    };
                }
            }
            return page;
        }).catch(error => {
            Logger.error('addKPIViewInPageHeader', error);
            return Promise.resolve(page);
        });
    }
    return Promise.resolve(page);
}
