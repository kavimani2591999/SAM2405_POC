
export default class MeasuringPointsEDTErrorHandler {

    constructor() {
        // object of errors {key: errorMessage}
        // the key is a combination of a section index, a row index and a cell name: 0-3-ValuationCode
        this.errors = {};

        this.sectionIndex = 0;
        this.rowIndex = 0;
    }

    getSectionIndex() {
        return this.sectionIndex;
    }

    setSectionIndex(index) {
        this.sectionIndex = index;
    }

    setRowIndex(index) {
        this.rowIndex = index;
    }

    generateKey(cellName) {
        if (!cellName) return '';
        return this.sectionIndex + '-' + this.rowIndex + '-' + cellName;
    }

    addErrorMessage(key, message) {
        this.errors[key] = message;
    }

    hasErrors() {
        return !!Object.keys(this.errors).length;
    }

    hideErrors(sections) {
        for (let index = 0; index < sections.length; index++) {
            let section = sections[index];

            if (section._context.element.definition._data.Class === 'EditableDataTableViewExtension') {
                let sectionExtension = section.getExtensions().length ? section.getExtensions()[0] : null;

                if (sectionExtension) {
                    let cells = sectionExtension.getAllCells();
                    cells.forEach(cell => {
                        cell.clearValidation();
                    });
                }
            }
        }
    }

    hideErrorForCell(section, rowIndex, controlName) {
        let sectionExtension = section.getExtensions().length ? section.getExtensions()[0] : null;
     
        if (sectionExtension) {
            let cell = sectionExtension.getRowCellByName(rowIndex, controlName);
            if (cell) {
                cell.clearValidation();
            }
        }
    }

    showErrors(sections) {
        Object.keys(this.errors).forEach(errorKey => {
            let edtSectionIndex = Number(errorKey.split('-')[0]);
            let rowIndex = Number(errorKey.split('-')[1]);
            let controlName = errorKey.split('-')[2];
            let sectionIndex = (edtSectionIndex + 1) * 2;
            let section = sections[sectionIndex];
            let sectionExtension = section.getExtensions().length ? section.getExtensions()[0] : null;
            
            if (sectionExtension) {
                let cell = sectionExtension.getRowCellByName(rowIndex, controlName);
                if (cell) {
                    cell.applyValidation(this.errors[errorKey]);
                }
            }
        });
    }
}
