export class MapControlDelegate {

    public static initWithExtension(controlExtension): MapControlDelegate {
        return new MapControlDelegate();
    }

    private _dataService: any;
    private _controlExtension: any;

    public setControlExtension(controlExtension) {
        // intentional no-op
    }

    public getObjects(params, type) {
        // intentional no-op
    }

    public getObjectActions(dictionary, filter) {
        // intentional no-op
    }

    public runAction(actionInfoJsonString, type) {
        // intentional no-op
    }

    public leaveEditMode(editModeInfo, callBackInfo) {
        // intentional no-op
    }

    public runNavigation() {
        // intentional no-op
    }

    public resetPaging() {
        // intentional no-op
    }

    protected fetchBusinessObjects(params, type) {
        // intentional no-op
    }

    protected fetchConfig(params, type) {
        // intentional no-op
    }

    protected getLocalizedValue(key, params): any {
        // intentional no-op
    }
}
