import NewMeterSectionLibrary from '../Common/NewMeterSectionLibrary';

export default function NewMeterSeeAllNavAction(clientAPI) {
    return NewMeterSectionLibrary.seeAllNavAction(clientAPI, clientAPI.getPageProxy()?.binding);
}
