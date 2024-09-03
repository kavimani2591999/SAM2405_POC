import WCMNotesLibrary from '../WCM/WCMNotes/WCMNotesLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import noteFieldCaption from '../Supervisor/TechnicianRole/NoteFieldCaption';

export default function NoteCreateUpdateSectionCaption(context) {
    const noteTextTypeWCM = WCMNotesLibrary.getNoteTextTypeForCreation(context);
    if (!libVal.evalIsEmpty(noteTextTypeWCM)) {
        return WCMNotesLibrary.getNoteCaption(context, noteTextTypeWCM);
    }

    return noteFieldCaption(context);
}
