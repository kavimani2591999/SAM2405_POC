import CommonLibrary from '../../../Common/Library/CommonLibrary';
import IsMeterComponentEnabled from '../../../ComponentsEnablement/IsMeterComponentEnabled';
import NewMeterSectionLibrary from '../../../Meter/Common/NewMeterSectionLibrary';

/**
* Getting visibility of section based on targer page and section
* @param {IClientAPI} clientAPI
*/
export default function ShowNewMeterSectionDetails(clientAPI) {
    if (IsMeterComponentEnabled(clientAPI)) {
        const pageName = CommonLibrary.getPageName(clientAPI);
        const assignmentLevel = CommonLibrary.getWorkOrderAssnTypeLevel(clientAPI);
        switch (pageName) {
            case 'WorkOrderDetailsWithObjectCardsPage':
                if (assignmentLevel === 'Header') {
                    return _getVisibilityBasedOnSectionName(clientAPI);
                }
                return false;
            case 'WorkOrderOperationDetailsWithObjectCards':
                if (assignmentLevel === 'Operation') {
                    return _getVisibilityBasedOnSectionName(clientAPI);
                }
                return false;
            // add suboperation case when new suboperation page is ready
            default:
                return false;
        }
    }
    return false;
}

function _getVisibilityBasedOnSectionName(clientAPI) {
    const sectionName = clientAPI.getName();
    if (sectionName) {
        const targetSection = NewMeterSectionLibrary.sectionToTargetName(sectionName);
        return NewMeterSectionLibrary.newObjectCellSectionVisible(clientAPI, targetSection, clientAPI.getPageProxy()?.binding);
    }
    return false;
}
