import PersonaLibrary from '../Persona/PersonaLibrary';

export default function EnableTimeRecords(context) {
    return PersonaLibrary.isFieldServiceTechnicianInCSMode(context);
}
