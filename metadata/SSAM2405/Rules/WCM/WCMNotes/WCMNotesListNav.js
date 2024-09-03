import WCMNotesLibrary from './WCMNotesLibrary';
import WCMNoteDetailsNav from './WCMNoteDetailsNav';

export default async function WCMNotesListNav(context) {
    const list  = await WCMNotesLibrary.getListNoteTypesByObjectType(context);

    if (list.length === 1) {
        return WCMNoteDetailsNav(context, list[0]);
    }

    const actionBinding = {
        objectBinding: context.getPageProxy().binding,
        sectionsBinding: [],
    };

    const sectionTemplate = {
        'Header': {
            'Caption': '/SAPAssetManager/Rules/WCM/WCMNotes/WCMNoteCaption.js',
        },
        'SimplePropertyCell': {
            'KeyName': '/SAPAssetManager/Rules/WCM/WCMNotes/WCMNoteSectionValue.js',
            'AccessoryType': 'disclosureIndicator',
            'OnPress': '/SAPAssetManager/Rules/WCM/WCMNotes/WCMNoteDetailsNav.js',
        },
        'Layout': {
            'NumberOfColumns': 1,
        },
        '_Type': 'Section.Type.SimplePropertyCollection',
    };

    const page = context.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/WCM/WCMNotes/WCMNotesList.page');

    page.Controls[0].Sections = list.reduce((acc, textType, idx) => {
        actionBinding.sectionsBinding.push(textType);
        const newSection = JSON.parse(JSON.stringify(sectionTemplate));

        const section = Object.assign(newSection, {Target: `{sectionsBinding/${idx}}`, _Name: `${textType}Section`});
        acc.push(section);

        return acc;
    }, []);
    
    context.getPageProxy().setActionBinding(actionBinding);
    
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/WCM/WCMNotes/WCMNotesListNav.action',
        'Properties': {
            'PageMetadata': page,
        },
    });
}
