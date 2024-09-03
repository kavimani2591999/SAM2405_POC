import libPersona from '../../Persona/PersonaLibrary';

export default function WorkPermitDetailImage(context) {
    return libPersona.isNewHomeScreenEnabled(context) ? '$(PLT, /SAPAssetManager/Images/DetailImages/WorkPermit.png, /SAPAssetManager/Images/DetailImages/WorkPermit.android.png)' : undefined;
}
