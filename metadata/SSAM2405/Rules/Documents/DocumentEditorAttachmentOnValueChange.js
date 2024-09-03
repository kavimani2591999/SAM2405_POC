import attachmentFileName from './DocumentEditorAttachmentFileName';
import saveAttachment from './DocumentEditorSaveAttachment';
import isImageFormat from './DocumentEditorIsImageFormat';
import attachmentEditorOpen from './DocumentEditorAttachmentOpen';
import isPdfFormat from './DocumentEditorIsPdfFormat';

export default function DocumentEditorAttachmentOnValueChange(context) {
    const attachmentCount = context.getValue().length;

    if (!context.getClientData().attachmentCount) {
        context.getClientData().attachmentCount = 0;
    }

    if (attachmentCount > context.getClientData().attachmentCount) {
        const attachmentIndex = attachmentCount - 1;
        const attachment = context.getValue()[attachmentIndex];
        const fileName = attachmentFileName(attachment);
        if (isImageFormat(fileName) || isPdfFormat(fileName)) {
            context.getClientData().attachmentCount = attachmentCount;
            const directory = saveAttachment(context, attachment, fileName);
            return attachmentEditorOpen(context, fileName, directory, { AttachmentIndex: attachmentIndex });
        }
    }

    context.getClientData().attachmentCount = attachmentCount;
    return Promise.resolve();
}
