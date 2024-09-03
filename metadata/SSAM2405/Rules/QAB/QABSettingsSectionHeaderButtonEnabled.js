import { QABSettingsPage } from './QABSettings';
import libVal from '../Common/Library/ValidationLibrary';

export default function QABSettingsSectionHeaderButtonEnabled(context) {
    const sectionName = context.getName();

    return !libVal.evalIsEmpty(QABSettingsPage.getSectionItemsNames(context, sectionName));
}
