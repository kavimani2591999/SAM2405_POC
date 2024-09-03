import CommonLibrary from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import LoadPersonaOverview from '../Persona/LoadPersonaOverview';
import PersonaLibrary from '../Persona/PersonaLibrary';
import PersonalizationPreferences from './PersonalizationPreferences';
import isWindows from './../Common/IsWindows';

export default function UserPreferencesUpdate(context) {
    try {
        let resultPromise = context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');  // close the modal with cancel to clear all pending actions
        const fcContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
        const [layout, reading, checklists, filters] = ['LayoutSeg', 'ReadingsScreenSeg', 'CheckListScreenSeg', 'FilterSwitch'].map(controlName => fcContainer.getControl(controlName));
        if (reading) {
            PersonalizationPreferences.setMeasuringPointView(context, CommonLibrary.getControlValue(reading));
        }
        if (checklists) {
            PersonalizationPreferences.setInspectionCharacteristicsView(context, CommonLibrary.getControlValue(checklists));
        }
        if (filters) {
            PersonalizationPreferences.setPersistFilterPreference(context, CommonLibrary.getControlValue(filters));
        }
        if (!isWindows(context)) {
            if (layout) {
                const oldValue = PersonaLibrary.getLayoutStylePreference(context);
                const newValue = CommonLibrary.getControlValue(layout);
                if (oldValue !== newValue) {
                    PersonaLibrary.setLayoutStylePreference(context, newValue);
                    resultPromise = resultPromise
                        .then(() => context.showActivityIndicator(context.localizeText('switching_home_screen_layout')))
                        .then(activityIndicatorId => LoadPersonaOverview(context)
                            .then(() => context.dismissActivityIndicator(activityIndicatorId)))
                        .then(() => getSectionedTableOnOverviewPage(context)?.redraw());  // Reload the sectioned table on the persona overview
                }
            }
        }
        return resultPromise;
    } catch (error) {  // in case a sync fails halfway
        Logger.debug('USER PREFERENCES', error);
        return undefined;
    }
}

function getSectionedTableOnOverviewPage(context) {
    const overviewPageName = PersonaLibrary.getPersonaOverviewStateVariablePage(context);
    const overviewPage = context.evaluateTargetPathForAPI('#Page:' + overviewPageName);
    return overviewPage?.getControls()?.find(c => c.getType() === 'Control.Type.SectionedTable');
}
