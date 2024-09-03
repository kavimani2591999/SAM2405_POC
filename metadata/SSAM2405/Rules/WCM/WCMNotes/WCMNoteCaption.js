import WCMNotesLibrary from './WCMNotesLibrary';
import libCom from '../../Common/Library/CommonLibrary';

export default function WCMNoteCaption(context) {
    const textType = libCom.getStateVariable(context, WCMNotesLibrary.noteTypeStateVarName) || WCMNotesLibrary.getTextTypeBySection(context);
    return WCMNotesLibrary.getNoteCaption(context, textType);
}
