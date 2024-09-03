import enableAttachmentCreate from '../../UserAuthorizations/Attachments/EnableAttachmentCreate';
import enableAttachment from '../../UserAuthorizations/Attachments/EnableAttachment';
import libCom from '../../Common/Library/CommonLibrary';
import PersonaLibrary from '../../Persona/PersonaLibrary';

/**
* Disable edit for WCM operator
* Disable floc edit if it is not local and attachments are disabled
* Disable edit if Enable.FL.Edit parameter is set to N
*/
export default function FunctionalLocationEditEnabled(context) {
    if (PersonaLibrary.isWCMOperator(context) || libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.FL.Edit') === 'N') {
        return false;
    }
    return (context.binding['@sap.isLocal'] || (enableAttachmentCreate(context) && enableAttachment(context)));
}
