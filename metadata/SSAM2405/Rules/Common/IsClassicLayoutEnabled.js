import libPersona from '../Persona/PersonaLibrary';

export default function IsClassicLayoutEnabled(context) {
    return !libPersona.isNewHomeScreenEnabled(context);
}
