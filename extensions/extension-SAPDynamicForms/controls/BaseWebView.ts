import { EventHandler } from 'mdk-core/EventHandler';
import { IContext } from 'mdk-core/context/IContext';
import { JsonToXml } from './JsonToXml';

export abstract class BaseWebView {
    public static CUSTOM_SCHEME = "sdflocal";
    // Add a fake host to the URL since otherwise Android gets confused and duplicates the first path component
    public static CUSTOM_URL_PREFIX = `${BaseWebView.CUSTOM_SCHEME}://sdf-host`;
    public static reusableWebView: BaseWebView;

    protected _reloadRequired = false;
    protected _isApplicationSuspended = false;
    protected _context: IContext;
    protected _cacheMaxLimit: number;
    protected _isFormDataSafe: boolean = false;
    protected _formTemplateDataHandler: string;
    protected _submissionHandler: string;
    protected _formConfig: any;
    protected _isFormDataSafeCallback: ((_: boolean) => void)|undefined;
    protected _isFormDataSafeTimeout: any;
    protected _fileStore = {};

    public abstract getView(): any;
    public abstract viewIsNative(): boolean;

    public reloadRequired() {
        return this._reloadRequired;
    }

    public setIsApplicationSuspended(value) {
        this._isApplicationSuspended = value;
    }
    public getIsApplicationSuspended() {
        return this._isApplicationSuspended;
    }

    set isFormDataSafe(isFormDataSafe: boolean) {this._isFormDataSafe = isFormDataSafe;}
    get isFormDataSafe(): boolean {return this._isFormDataSafe;}
    set isFormDataSafeCallback(isFormDataSafe: ((_: boolean) => void)|undefined) {this._isFormDataSafeCallback = isFormDataSafe;};
    get isFormDataSafeCallback(): ((_: boolean) => void) | undefined {return this._isFormDataSafeCallback;};
    set isFormDataSafeTimeout(timeout: any) {this._isFormDataSafeTimeout = timeout;};
    get isFormDataSafeTimeout(): any {return this._isFormDataSafeTimeout;};
    set formTemplateDataHandler(formTemplateDataHandler: string) {this._formTemplateDataHandler = formTemplateDataHandler;}
    get formTemplateDataHandler(): string {return this._formTemplateDataHandler;}
    set submissionHandler(submissionHandler: string) {this._submissionHandler = submissionHandler;}
    get submissionHandler(): string {return this._submissionHandler;}
    set formConfig(formConfig: Object) {this._formConfig = formConfig;}
    get formConfig(): Object {return this._formConfig;}
    set context(context: IContext) {this._context = context;}
    get context(): IContext {return this._context;}

    public pressButton(buttonname) {
        switch(buttonname) {
            case 'save-final':
                this.evaluateJavaScript('document.querySelector(".fr-buttons .fr-save-final-button button").click()');
                break;
            case 'save-not-final':
                this.evaluateJavaScript('document.querySelector(".fr-buttons .fr-save-not-final-button button").click()');
                break;
            case 'reopen':
                this.evaluateJavaScript('document.querySelector(".fr-buttons .fr-reopen-button button").click()');
                break;
            case 'clear':
                this.evaluateJavaScript('document.querySelector(".fr-buttons .fr-clear-button button").click()');
                break;
            default:
                // ok to do nothing
                break;
        }
    }

    public setCacheMaxLimit(cacheMaxLimit) {
        this._cacheMaxLimit = cacheMaxLimit;
    }

    public initialLoad(): void {
        // debug delay for debugger attachment.
        const debugDelay = this._formConfig.debugDelay || 0;
        setTimeout(() => this.initialLoadPlatform(), debugDelay)
    }

    protected abstract initialLoadPlatform(): void;

    public reloadWebView(formConfig: any) {
        new EventHandler().executeActionOrRule(this._formTemplateDataHandler, this._context).then((result) => {
            if (result && result.length > 0) {
                let binding = {};
                if (this.context && this.context.binding) {
                    binding = this.context.binding;
                }
                this.loadDataIntoWebView(
                    result, 
                    formConfig.applicationName, 
                    formConfig.formName, 
                    formConfig.formId, 
                    formConfig.formData, 
                    formConfig.formStatus, 
                    formConfig.formVersion, 
                    formConfig.startDate, 
                    formConfig.fontSize,
                    JsonToXml(binding));
            }
        });
    }

    protected loadDataIntoWebView(templateData: string, applicationName, formName, formId, formData, formStatus, formVersion, startDate, fontSize, contextXML): void {
        // method to create JSON string to call WebView's initData method
        let localFormData = formData;
        if (typeof(localFormData) !== 'string' || localFormData === 'PGZvcm0+PC9mb3JtPg==s') { // b64 to <form></form>
            localFormData = '';
        }
        const endDate = new Date().getTime();
        const timeDiff = endDate - startDate;

        const debugDelay = 0;

        // template data
        const JSMethodString = [
            templateData, 
            applicationName, 
            formName, 
            formId, 
            localFormData,
            formStatus, 
            formVersion, 
            this._cacheMaxLimit, 
            fontSize, 
            timeDiff, 
            contextXML,
            debugDelay].reduce((prev, current) => {
                return prev + '\'' + String(current) + '\',';
            }, 'initData(') + '\'\')';
        
        // call Webview's initData method
        this.evaluateJavaScript(JSMethodString);
    }

    public destroyForm() {
        this.evaluateJavaScript('destroyForm()');
    }

    public warmupForm(templateData, applicationName, formName, formVersion) {
        // template data
        const JSMethodString = [
            templateData, 
            applicationName, 
            formName, 
            formVersion].reduce((prev, current) => {
                return prev + '\'' + current + '\',';
            }, 'warmupForm(') + ')';
        this.evaluateJavaScript(JSMethodString);
    }

    public getIsFormDataSafe(callback: (_: boolean) => void, timeoutms: number) {
        const currentTimeout = this.isFormDataSafeTimeout;
        // avoid multiple calls
        if (currentTimeout) {
            return;
        }
        this.isFormDataSafeCallback = callback;
        const timeoutCallback = () => {
            this.isFormDataSafeTimeout = undefined;
            this.isFormDataSafeCallback = undefined;

            callback(false);
        }

        const timeout = setTimeout(timeoutCallback, timeoutms);
        this.isFormDataSafeTimeout = timeout;
        this.isFormDataSafeCallback = callback;

        this.evaluateJavaScript('postMessageIsFormDataSafe()');
    }

    public isFormDataSafeReturned(result: boolean) {
        console.log('isformdatasafereturned called');
        const currentTimeout = this.isFormDataSafeTimeout;
        // avoid multiple calls
        if (!currentTimeout) {
            return;
        }

        clearTimeout(currentTimeout)

        const callback = this.isFormDataSafeCallback;
        if (callback) {
            callback(result);
        }

        this.isFormDataSafeTimeout = undefined;
        this.isFormDataSafeCallback = undefined;
    }

    public processJSMessage(message: any, thisobject: any) {
        let jsonData: any;
        let self = this;
        // android has an invalid 'this'
        if (thisobject) {
            self = thisobject;
        }
        try {
            jsonData = JSON.parse(message);
        } catch (error) {
            // TODO: Log this
            return;
        }
        const communicationType: string = jsonData['communication-type'];
        const data: string = jsonData.data;
        const eventHandler: any = new EventHandler();

        if ((communicationType === 'isFormDataSafe')) {
            self.isFormDataSafe = data === 'true';
            self.isFormDataSafeReturned(self.isFormDataSafe);
        } else {
            if (self.submissionHandler) {
                if (self._context) {
                    self._context.binding = jsonData;
                }
                const promiseId = jsonData.promiseid;
                return eventHandler.executeActionOrRule(self.submissionHandler, self._context).then((result) => {
                    let resultstring = result;
                    try {
                        if (typeof resultstring !== 'string') {
                            resultstring = JSON.stringify(result);
                        }
                    } catch (error) {
                        throw new Error(`Submission result not a string or json. ${error}`);
                    }
                    const responseJson = {
                        statusCode: 200,
                        headers: [['Content-Type', 'application/json']],
                        body: self.transformStringToBase64(resultstring).replace(/\n/g,''),
                    }
                    
                    self.evaluateJavaScript(`SDFSubmissionProvider.promiseResolve(${promiseId}, '${JSON.stringify(responseJson)}');`);
                })
                .catch ((error) => {
                    // TODO: log this!
                    console.log(error);
                    let e = '';
                    if (error && error.message) {
                        e = error.message;
                    }
                    const responseJson = {
                        statusCode: 500,
                        headers: [['Content-Type', 'text/plain']],
                        body: self.transformStringToBase64(e).replace(/\n/g,''),
                    };
                    self.evaluateJavaScript(`SDFSubmissionProvider.promiseReject(${promiseId}, '${JSON.stringify(responseJson)}');`);
                });
            } else {
                // TODO: log error message for no submission handler
            }
        }
    }

    public processLogMessage(message: string) {
        console.log(message);
    }

    public abstract evaluateJavaScript(expression: string);
    public abstract resetHeight(width: number, height: number): void;
    public abstract transformStringToBase64(string: string): string;
    protected abstract decodeBase64(b64: string): any;
  
    public storeFiles(results: any) {
        for (let i = 0; i < results.length; i++) {
            const obj = results.getItem(i);
            console.log(`Storing "${obj.URLPath}" with content type ${obj.ContentType}`);
            const data = {
                ...this.parseContentType(obj.ContentType),
                content: this.decodeBase64(obj.FileContent)
            };
            this._fileStore[obj.URLPath] = data;
            console.log(`Stored "${obj.URLPath}" = mimeType: ${data.mimeType} encoding: ${data.encoding} len: ${data.content.length}`);
        }
    }
  
    private parseContentType(contentType: string | undefined) {
        if (!contentType) return { mimeType: null, encoding: null };
        const parts = contentType.split(";", 2).map(s => s.trim());
        const p1 = parts[1]?.toLowerCase();
        const charset = p1 && p1.startsWith("charset=") ? p1.slice("charset=".length) : null;
        return {
            mimeType: parts[0],
            encoding: charset
        }
    }

    public loadFromStore(url: string) {
        if (url === `${BaseWebView.CUSTOM_URL_PREFIX}/forms/_/formload`) {
            // Hack to allow relative requests for resources like /forms/_/apps/fr/style/images/sap/SAP_R_grad_scrn.png to work.
            // This will be unnecessary when Orbeon starts using Webpack for runtime files.
            url = `${BaseWebView.CUSTOM_URL_PREFIX}/forms/fr/service/formload`;
        }
        const path = url.slice(BaseWebView.CUSTOM_URL_PREFIX.length);
        console.log(`Attempting to load from store: ${path}`);
        const obj = this._fileStore[path];
        return obj;
    }

    public static initialPageURL(): string {
        return `${BaseWebView.CUSTOM_URL_PREFIX}/forms/_/formload`;
    }
}