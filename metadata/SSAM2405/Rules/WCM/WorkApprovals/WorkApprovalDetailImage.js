import libPersona from '../../Persona/PersonaLibrary';

export default function WorkApprovalDetailImage(context) {
    return libPersona.isNewHomeScreenEnabled(context) ? '$(PLT, /SAPAssetManager/Images/DetailImages/WorkApproval.png, /SAPAssetManager/Images/DetailImages/WorkApproval.android.png)' : undefined;
}
