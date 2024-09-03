import libPersona from '../../Persona/PersonaLibrary';

export default function OperationalItemDetailImage(context) {
    return libPersona.isNewHomeScreenEnabled(context) ? '$(PLT, /SAPAssetManager/Images/DetailImages/OperationalItem.png, /SAPAssetManager/Images/DetailImages/OperationalItem.android.png)' : undefined;
}
