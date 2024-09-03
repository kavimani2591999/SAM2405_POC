import libPersona from '../Persona/PersonaLibrary';

export default function WorkOrderDetailImage(context) {
    return libPersona.isNewHomeScreenEnabled(context) ? '$(PLT, /SAPAssetManager/Images/DetailImages/WO.png, /SAPAssetManager/Images/DetailImages/WO.android.png)' : undefined;
}
