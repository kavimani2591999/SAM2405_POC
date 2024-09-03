import libPersona from '../../../Persona/PersonaLibrary';

export default function WorkApprovalNumberOfColumns(context) {
    return libPersona.isNewHomeScreenEnabled(context) ? 1 : 2;
}
