import appSettings from '../Common/Library/ApplicationSettings';
import libVal from '../Common/Library/ValidationLibrary';
import libCom from '../Common/Library/CommonLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import isWindows from '../Common/IsWindows';

export default class {
    /*
     * Checks if a persona is maintenance technician
     */
    static isMaintenanceTechnician(context) {
        const MT = context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/MTPersonaName.global').getValue();
        return this.getActivePersonaCode(context) === MT;
    }

    /*
     * Checks if a persona is maintenance technician
     */
    static isMaintenanceTechnicianStd(context) {
        const MTStd = context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/MTStdPersonaName.global').getValue();
        return this.getActivePersonaCode(context) === MTStd;
    }

    /**
    * Checks if a persona is inventory clerk
    */
    static isInventoryClerk(context) {
        return (this.getActivePersonaCode(context) === context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/IMPersonaName.global').getValue());
    }

    /**
    * Checks if a persona is field service technician
    */
    static isFieldServiceTechnician(context) {
        const FST = context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/FSTPersonaName.global').getValue();
        const FSTPro = context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/FSTProPersonaName.global').getValue();
        return [FST, FSTPro].includes(this.getActivePersonaCode(context));
    }

    /**
    * Checks if a persona is field service technician in customer service mode
    */
    static isFieldServiceTechnicianInCSMode(context) {
        return this.isFieldServiceTechnician(context) && !IsS4ServiceIntegrationEnabled(context);
    }

    static isFieldServiceTechnicianProInCSMode(context) {
        return this.isFieldServiceTechnicianPro(context) && !IsS4ServiceIntegrationEnabled(context);
    }

    /**
    * Checks if a persona is field service technician pro version
    */
    static isFieldServiceTechnicianPro(context) {
        return (this.getActivePersonaCode(context) === context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/FSTProPersonaName.global').getValue());
    }

    /**
    * Checks if a persona is WCM operator
    */
    static isWCMOperator(context) {
        return (this.getActivePersonaCode(context) === context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/WCMPersonaName.global').getValue());
    }

    /**
    * Checks if a persona is Custom persona
    */
    static isCustomPersona(context) {
        return (this.getActivePersonaCode(context) === context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/CUSPersonaName.global').getValue());
    }

    /**
    * Check if persona is enabled and available for switch
    */
    static checkPersonaEnabled(context, personaCode) {
        let isEnabled = false;
        const personaCount = appSettings.getNumber(context, 'PersonaCount');
        if (libVal.evalIsNumeric(personaCount)) {
            for (let index = 0; index < personaCount; index++) {
                let actualPersonaCode = appSettings.getString(context, `PersonaCode-${index}`);
                if (personaCode === actualPersonaCode) {
                    isEnabled = true;
                }
            }
        }
        return isEnabled;
    }

    /**
    * Returns a persona based overview page
    */
    static getPersonaOverviewPage(context) {
        if (this.isMaintenanceTechnician(context)) {
            if (this.isNewHomeScreenEnabled(context)) {
                return '/SAPAssetManager/Pages/OverviewNew.page';
            } else {
                return '/SAPAssetManager/Pages/Overview.page';
            }
        } else if (this.isMaintenanceTechnicianStd(context)) {
            return '/SAPAssetManager/Pages/OverviewMTStd.page';
        } else if (this.isInventoryClerk(context)) {
            return '/SAPAssetManager/Pages/Inventory/InventoryOverview.page';
        } else if (this.isFieldServiceTechnician(context)) {
            if (this.isNewHomeScreenEnabled(context)) {
                return '/SAPAssetManager/Pages/FieldService/FieldServiceOverviewNew.page';
            } else {
                return '/SAPAssetManager/Pages/FieldService/FieldServiceOverview.page';
            }
        } else if (this.isWCMOperator(context)) {
            return '/SAPAssetManager/Pages/WCM/WCMOverview.page';
        }
        //default is maintenance technician
        return '/SAPAssetManager/Pages/Overview.page';
    }

    /**
    * Returns the overview page name based on persona for storing state variables
    */
    static getPersonaOverviewStateVariablePage(context) {
        if (this.isMaintenanceTechnician(context)) {
            if (this.isNewHomeScreenEnabled(context)) {
                return context.getGlobalDefinition('/SAPAssetManager/Globals/DefaultMessages/DefaultStateVariablePageMTPersonaNew.global').getValue();
            } else {
                return context.getGlobalDefinition('/SAPAssetManager/Globals/DefaultMessages/DefaultStateVariablePage.global').getValue();
            }
        } else if (this.isInventoryClerk(context)) {
            return context.getGlobalDefinition('/SAPAssetManager/Globals/DefaultMessages/DefaultStateVariablePageIMPersona.global').getValue();
        } else if (this.isFieldServiceTechnician(context)) {
            if (this.isNewHomeScreenEnabled(context)) {
                return context.getGlobalDefinition('/SAPAssetManager/Globals/DefaultMessages/DefaultStateVariablePageSTPersonaNew.global').getValue();
            } else {
                return context.getGlobalDefinition('/SAPAssetManager/Globals/DefaultMessages/DefaultStateVariablePageSTPersona.global').getValue();
            }
        } else if (this.isWCMOperator(context)) {
            return context.getGlobalDefinition('/SAPAssetManager/Globals/DefaultMessages/DefaultStateVariablePageWCMPersona.global').getValue();
        } else if (this.isMaintenanceTechnicianStd(context)) {
            return context.getGlobalDefinition('/SAPAssetManager/Globals/DefaultMessages/DefaultStateVariablePageMTStdPersona.global').getValue();
        }
        //default is maintenance technician
        return context.getGlobalDefinition('/SAPAssetManager/Globals/DefaultMessages/DefaultStateVariablePage.global').getValue();
    }

    /**
    * Sets the active persona
    */
    static setActivePersonaCode(context, activePersonaCode) {
        appSettings.setString(context, 'ActivePersonaCode', activePersonaCode);
    }
    static setActivePersona(context, activePersona) {
        appSettings.setString(context, 'ActivePersona', activePersona);
    }

    /**
    * Gets the active persona
    */
    static getActivePersonaCode(context) {
        return appSettings.getString(context, 'ActivePersonaCode');
    }
    static getActivePersona(context) {
        return appSettings.getString(context, 'ActivePersona');
    }

    static getPersonas(context) {
        return appSettings.getString(context, 'Personas').split(',');
    }

    /**
    * Gets active persona value by active persona code
    */
    static getActivePersonaByCode(context, activePersonaCode = this.getActivePersonaCode(context)) {
        const userPersonas = libCom.getStateVariable(context, 'UserPersonasData');
        if (userPersonas) {
            const activePersonaObject = userPersonas.find(item => item.PersonaCode === activePersonaCode);
            return activePersonaObject.UserPersona;
        }
        return '';
    }

    /**
   * Gets active persona value by active persona code
   */
    static getActivePersonaDescByCode(context, activePersonaCode = this.getActivePersonaCode(context)) {
        const userPersonas = libCom.getStateVariable(context, 'UserPersonasData');
        if (userPersonas) {
            const activePersonaObject = userPersonas.find(item => item.PersonaCode === activePersonaCode);
            return activePersonaObject.PersonaCodeDesc;
        }
        return '';
    }

    /**
    * Initializes a default persona during initial sync
    * userPersonas: Results from reading UserPersonas entityset
    */
    static initializePersona(context, userPersonas) {
        let defaultPersonaCode;
        let defaultPersona;
        let personas = [];
        if (userPersonas && userPersonas.length > 0) {
            appSettings.remove(context, 'PersonaCount');
            appSettings.setNumber(context, 'PersonaCount', userPersonas.length);
            libCom.setStateVariable(context, 'UserPersonasData', userPersonas);
            for (let index = 0; index < userPersonas.length; index++) {
                let personaItem = userPersonas.getItem(index);
                if (personaItem.FlagDefault === 'X') {
                    defaultPersonaCode = personaItem.PersonaCode;
                    defaultPersona = personaItem.UserPersona;
                }
                appSettings.remove(context, 'PersonaCode-' + index);
                appSettings.remove(context, 'Persona-' + index);
                appSettings.setString(context, 'PersonaCode-' + index, personaItem.PersonaCode);
                appSettings.setString(context, 'Persona-' + index, personaItem.UserPersona);
                personas.push(personaItem.UserPersona);
            }
            appSettings.setString(context, 'Personas', personas.join());
            // Logger.info(`results: ${userPersonas.length}`);
        }
        if (appSettings.getNumber(context, 'PersonaCount') > 1) {
            if (defaultPersonaCode) {
                this.setActivePersonaCode(context, defaultPersonaCode);
                this.setActivePersona(context, defaultPersona);
            } else {
                let MTPersona = userPersonas.find(persona => (persona.PersonaCode === context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/MTPersonaName.global').getValue() || persona.PersonaCode === context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/MTStdPersonaName.global').getValue())); // if there is MT among user's personas, set it as default
                if (MTPersona) {
                    this.setActivePersonaCode(context, MTPersona.PersonaCode);
                    this.setActivePersona(context, MTPersona.UserPersona);
                } else {
                    this.setActivePersonaCode(context, appSettings.getString(context, 'PersonaCode-0')); // if no, just set the first one
                    this.setActivePersona(context, appSettings.getString(context, 'Persona-0'));
                }
            }
        } else {
            this.setActivePersonaCode(context, appSettings.getString(context, 'PersonaCode-0'));
            this.setActivePersona(context, appSettings.getString(context, 'Persona-0'));
        }
    }

    /**
    * Sets user switch value for new home screen layout. this is a persona specific setting
    */
    static setLayoutStylePreference(context, flag = LayoutStyleValues.Classic) {
        return appSettings.setString(context, `${this.getActivePersona(context)}_LayoutStyleSwitch`, flag);
    }

    /**
    * Gets user switch value for new home screen layout
    */
    static getLayoutStylePreference(context) {
        return appSettings.getString(context, `${this.getActivePersona(context)}_LayoutStyleSwitch`);
    }

    /**
    * Gets user switch value for new home screen layout
    */
    static removeLayoutStylePreference(context, userPersona) {
        return appSettings.remove(context, `${userPersona}_LayoutStyleSwitch`);
    }

    /**
    * Checks if switch value for new home screen layout is enabled
    */
    static isNewHomeScreenEnabled(context) {
        return this.getLayoutStylePreference(context) === LayoutStyleValues.New;
    }

    /**
    * Sets new home screen layout switch value to enabled for MT
    */
    static setUpUserDefaultHomeScreen(context) {
        if ((this.isMaintenanceTechnician(context) || this.isFieldServiceTechnician(context) || this.isWCMOperator(context)) && !isWindows(context)) {
            if (!this.getLayoutStylePreference(context)) {
                this.setLayoutStylePreference(context, LayoutStyleValues.New);
            }
        } else {
            this.setLayoutStylePreference(context, LayoutStyleValues.Classic);
        }
    }
}

export const LayoutStyleValues = Object.freeze({
    New: 'new',
    Classic: 'classic',
});
