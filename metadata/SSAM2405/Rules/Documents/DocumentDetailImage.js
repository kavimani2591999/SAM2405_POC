import DocumentTypeIcon from './DocumentTypeIcon';
import DocumentEditorIsImageFormat from './DocumentEditorIsImageFormat';
import DocumentPath from './DocumentPath';
import libDoc from './DocumentLibrary';
import libPersona from '../Persona/PersonaLibrary';

export default async function DocumentDetailImage(context) {
    const doc = libDoc.getDocumentFromBinding(context.binding);

    if (doc.ObjectType === 'URL' || !libPersona.isNewHomeScreenEnabled(context) || !DocumentEditorIsImageFormat(doc.FileName)) {
        return DocumentTypeIcon(context);
    }

    const readLink = doc['@odata.readLink'];
    const entitySet = readLink.split('(')[0];
    let serviceName = '/SAPAssetManager/Services/AssetManager.service';
    if (entitySet === 'EquipmentDocuments') {
        serviceName = '/SAPAssetManager/Services/OnlineAssetManager.service';
    }
    if (await context.isMediaLocal(serviceName, entitySet, readLink)) {
        const docPath = DocumentPath(context, doc);
        if (context.nativescript.fileSystemModule.File.exists(docPath)) {
            return docPath;
        }
    }

    return DocumentTypeIcon(context);
}
