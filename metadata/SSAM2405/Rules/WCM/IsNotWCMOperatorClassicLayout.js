import PersonaLibrary from '../Persona/PersonaLibrary';
import libPersona from '../Persona/PersonaLibrary';
export default function IsNotWCMOperatorClassicLayout(context) {
    return !libPersona.isWCMOperator(context) || PersonaLibrary.isNewHomeScreenEnabled(context);
}
