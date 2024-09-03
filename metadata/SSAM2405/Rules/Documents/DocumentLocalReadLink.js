import libCom from '../Common/Library/CommonLibrary';

export default function DocumentLocalReadLink(context) {
    let newCounter = context.getClientData().readLinkCounter;
    let docReadLink = '';
    if (newCounter === 'NaN'|| newCounter === undefined) {
        newCounter = 0;
    }
    // fill docReadLink
    if (context.getClientData().mediaReadLinks) {
        docReadLink = libCom.getTargetPathValue(context, '#ClientData/#Property:mediaReadLinks/#index:' + newCounter);
    } else {
        context.getClientData().mediaReadLinks = libCom.getStateVariable(context, 'mediaReadLinks');
        docReadLink = libCom.getTargetPathValue(context, '#ClientData/#Property:mediaReadLinks/#index:' + newCounter);
    }
    context.getClientData().readLinkCounter = newCounter + 1;
    return docReadLink;
}
