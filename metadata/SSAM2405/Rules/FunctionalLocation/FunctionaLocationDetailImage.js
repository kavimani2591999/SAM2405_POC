import CommonLibrary from '../Common/Library/CommonLibrary';
import libPersona from '../Persona/PersonaLibrary';

export default function FunctionaLocationDetailImage(context) {
    const pageName = CommonLibrary.getPageName(context);

    if (libPersona.isNewHomeScreenEnabled(context)) {
        return pageName.includes('Online') ?
            '$(PLT, /SAPAssetManager/Images/DetailImages/FlocOnline.png, /SAPAssetManager/Images/DetailImages/FlocOnline.android.png)' :
            '$(PLT, /SAPAssetManager/Images/DetailImages/Floc.png, /SAPAssetManager/Images/DetailImages/Floc.android.png)';
    }

    return undefined;
}
