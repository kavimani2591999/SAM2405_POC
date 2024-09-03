import EquipmentDetailsNav from '../../Equipment/EquipmentDetailsNav';
import { navigateOnRead } from '../../FunctionalLocation/FunctionalLocationDetailsNav';

export default function NavigateToOfflineDetails(context) {
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
        if (context.binding['@odata.type'] === '#sap_mobile.Equipment') {
            return EquipmentDetailsNav(context);
        }
        return navigateOnRead(context, `MyFunctionalLocations('${context.binding.FuncLocIdIntern}')`);
    });
}
