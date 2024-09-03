import CommonLibrary from '../Common/Library/CommonLibrary';
import libPersona from '../Persona/PersonaLibrary';

export default function EquipmentDetailImage(context) {
    const pageName = CommonLibrary.getPageName(context);

    if (libPersona.isNewHomeScreenEnabled(context)) {
        return pageName.includes('Online') ?
            '$(PLT, /SAPAssetManager/Images/DetailImages/EquipmentOnline.png, /SAPAssetManager/Images/DetailImages/EquipmentOnline.android.png)' :
            '$(PLT, /SAPAssetManager/Images/DetailImages/Equipment.png, /SAPAssetManager/Images/DetailImages/Equipment.android.png)';
    }

    return undefined;
}
