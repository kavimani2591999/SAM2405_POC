import libCom from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import WCMNotesLibrary from '../WCM/WCMNotes/WCMNotesLibrary';


export default function NotesViewCaption(context) {
    const WCMNoteType = libCom.getStateVariable(context, WCMNotesLibrary.noteTypeStateVarName);

    return libVal.evalIsEmpty(WCMNoteType) ?
        context.localizeText('notes') :
        WCMNotesLibrary.getNoteCaption(context, WCMNoteType);
}
