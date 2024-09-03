import Logger from '../../Log/Logger';
import MeasuringPointFDCIsVisible from '../../Measurements/Points/MeasuringPointFDCIsVisible';
import UserSystemStatusesVisible from './UserSystemStatusesVisible';
import WorkOrderDetailsPageToOpen from '../../WorkOrders/Details/WorkOrderDetailsPageToOpen';
import IsNewLayoutEnabled from '../../Common/IsNewLayoutEnabled';
import IsMeterComponentEnabled from '../../ComponentsEnablement/IsMeterComponentEnabled';
import NewMeterSectionLibrary from '../../Meter/Common/NewMeterSectionLibrary';
import IsAndroid from '../../Common/IsAndroid';

export default function WorkOrderDetailsPageMetadata(clientAPI) {
    return addKPIViewInPageHeader(clientAPI).then((page) => {
        return UserSystemStatusesVisible(clientAPI, page).then(updatedPage => {
            return modifyUninstallMeterEDTTable(clientAPI, updatedPage);
        });
    });
}

function addKPIViewInPageHeader(clientAPI) {
    let page = clientAPI.getPageDefinition(WorkOrderDetailsPageToOpen(clientAPI));

    return MeasuringPointFDCIsVisible(clientAPI, clientAPI.getActionBinding())
        .then(visible => {
            if (visible) {
                let sections = page.Controls[0].Sections;
                let pageHeader = sections[0].ObjectHeader;

                if (pageHeader && !pageHeader.KPIView) {
                    pageHeader.KPIView = {
                        'Label': '/SAPAssetManager/Rules/Analytics/KPIPointDesc.js',
                        'LeftMetric': '',
                        'RightMetric': '/SAPAssetManager/Rules/Measurements/Points/MeasuringPointReadingsTakenKPI.js',
                    };
                }
                return Promise.resolve(page);
            } else {
                return addKPIMeterViewInPageHeader(clientAPI, page);
            }
        })
        .catch(error => {
            Logger.error('addKPIViewInPageHeader', error);
            return Promise.resolve(page);
        });
}

function addKPIMeterViewInPageHeader(clientAPI, page) {
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
        });
    }
    return page;
}

export async function modifyUninstallMeterEDTTable(clientAPI, page) {
    const uninstallMeterSection = page.Controls[0].Sections.find(section => section._Name === 'NewMeterListUninstallSection');

    if (uninstallMeterSection && IsMeterComponentEnabled(clientAPI)) {
        let count = await countOrderIsuLinks(clientAPI);

        if (count === 0) {
            uninstallMeterSection.Height = IsAndroid(clientAPI) ? 45 : -1;
            uninstallMeterSection.Header.Caption = clientAPI.localizeText('meters');
            uninstallMeterSection.ExtensionProperties = {};
            uninstallMeterSection._Type = 'Section.Type.ObjectTable';
            uninstallMeterSection.ObjectCells = [];
        } else {
            if (count > 2) count = 2; // the details page displays a maximum of two items

            if (IsAndroid(clientAPI)) {
                const rowHight = 80;
                uninstallMeterSection.Height = 70 + (count * rowHight);
            } else {
                const rowHight = 95;
                uninstallMeterSection.Height = 60 + (count * rowHight);
            }
        }

        return page;
    }

    return Promise.resolve(page);
}

function countOrderIsuLinks(clientAPI) {
    const binding = NewMeterSectionLibrary.getWorkOrderBinding(clientAPI, clientAPI.getActionBinding());
    const entitySet = `${binding['@odata.readLink']}/OrderISULinks`;

    return clientAPI.count('/SAPAssetManager/Services/AssetManager.service', entitySet, '$filter=sap.entityexists(Device_Nav)')
        .catch(() => {
            return 0;
        });
}
