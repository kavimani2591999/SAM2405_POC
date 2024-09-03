import { IContext } from 'mdk-core/context/IContext';
import { BaseWebView } from './BaseWebView';

@NativeClass()
class WKScriptMessageHandlerImpl extends NSObject implements WKScriptMessageHandler {
    public static ObjCProtocols: any = [WKScriptMessageHandler];
    public locationPromise: any;
    protected _context: any;
    protected _submissionHandler: string;

    public static init(): WKScriptMessageHandlerImpl {
        const handler = <WKScriptMessageHandlerImpl>WKScriptMessageHandlerImpl.new();
        return handler;
    }

    set context(context) {this._context = context;}
    get context() {return this._context;}
    set submissionHandler(submissionHandler) {this._submissionHandler = submissionHandler;}
    get submissionHandler() {return this._submissionHandler;}

    public userContentControllerDidReceiveScriptMessage(userContentController: WKUserContentController, message: WKScriptMessage): void {
        ReusableWebView.reusableWebView.processJSMessage(message.body, undefined);
    }
}

@NativeClass()
class WKScriptConsoleMessageHandlerImpl extends NSObject implements WKScriptMessageHandler {
    public static ObjCProtocols: any = [WKScriptMessageHandler];

    public static init(): WKScriptConsoleMessageHandlerImpl {
        console.log("WKScriptConsoleMessageHandlerImpl.init()");
        const handler = <WKScriptConsoleMessageHandlerImpl>WKScriptConsoleMessageHandlerImpl.new();
        return handler;
    }

    public userContentControllerDidReceiveScriptMessage(userContentController: WKUserContentController, message: WKScriptMessage): void {
        try {
            ReusableWebView.reusableWebView.processLogMessage(message.body);
        } catch (error) {
            console.log(error);
        }
    }
}

@NativeClass()
class WKNavigationHandlerImpl extends NSObject implements WKNavigationDelegate {
    public static ObjCProtocols = [WKNavigationDelegate];
    _context: IContext;

    public setContext(context) {
        this._context = context;
    }

    public static init(): WKNavigationHandlerImpl {
        const handler = <WKNavigationHandlerImpl>WKNavigationHandlerImpl.new();
        return handler;
    }

    public decidePolicyForNavigationAction(navigationAction: WKNavigationAction,  decisionHandler: any) {
        console.log('entered decidePolicyForNavigationAction');
        let response = WKNavigationActionPolicy.Allow;
        if (navigationAction.shouldPerformDownload) {
            response = WKNavigationActionPolicy.Download;
        }
        decisionHandler(response);

        console.log('exit decidePolicyForNavigationAction');
    }

    public webViewDidFinishNavigation(webView: WKWebView, navigation: WKNavigation): void {
        console.log('entered webViewDidFinishNavigation');
        ReusableWebView.reusableWebView.reloadWebView(ReusableWebView.reusableWebView.formConfig);

        console.log('exit webViewDidFinishNavigation');
    }
}

@NativeClass()
class WKURLSchemeHandlerImpl extends NSObject implements WKURLSchemeHandler {
    public static ObjCProtocols = [WKURLSchemeHandler];
    public reusableWebView: any;

    public static init(): WKURLSchemeHandlerImpl {
        const handler = <WKURLSchemeHandlerImpl>WKURLSchemeHandlerImpl.new();
        return handler;
    }

    public webViewStartURLSchemeTask(webView: WKWebView, urlSchemeTask: WKURLSchemeTask): void {
        const req = urlSchemeTask.request;
        console.log(`startURLSchemeTask - method: ${req.HTTPMethod} url: ${req.URL.absoluteString}`);

        const url = req.URL;

        const data = this.reusableWebView.loadFromStore(url.absoluteString);
        if (!data) {
            console.log("Responding with 404");
            const resp = NSHTTPURLResponse.alloc().initWithURLStatusCodeHTTPVersionHeaderFields(url, 404, "HTTP/1.1", null);
            urlSchemeTask.didReceiveResponse(resp);
            return;
        }

        console.log(`Responding with 200: mimeType: ${data.mimeType} length: ${data.content.length} encoding: ${data.encoding}`);
        const resp = NSURLResponse.alloc().initWithURLMIMETypeExpectedContentLengthTextEncodingName(url, data.mimeType, data.content.length, data.encoding);

        console.log("Sending response");
        urlSchemeTask.didReceiveResponse(resp);
        urlSchemeTask.didReceiveData(data.content);
        urlSchemeTask.didFinish();

        console.log("Finished URL scheme task");
    }

    public webViewStopURLSchemeTask(webView: WKWebView, urlSchemeTask: WKURLSchemeTask): void {
        console.log('stopURLSchemeTask');
    }
}

export class ReusableWebView extends BaseWebView {
    private _webView: WKWebView;

    private _config: WKWebViewConfiguration;
    private _urlSchemeHandler: WKURLSchemeHandlerImpl;
    private _userContentController: WKUserContentController;
    private _webviewNavigationDelegate: WKNavigationHandlerImpl;
    private _scriptMessageHandler: WKScriptMessageHandlerImpl;
    private _consoleMessageHandler: WKScriptConsoleMessageHandlerImpl;

    set submissionHandler(submissionHandler: string) {this._scriptMessageHandler.submissionHandler = submissionHandler;}
    get submissionHandler(): string {return this._scriptMessageHandler.submissionHandler;}

    set context(context: any) {this._context = context; this._scriptMessageHandler.context = context;}

    public static getReusableWebView(reset: boolean): BaseWebView {
        if (ReusableWebView.reusableWebView && !reset) {
            const reusableWebView = <ReusableWebView>ReusableWebView.reusableWebView;
            reusableWebView._reloadRequired = true;
            return reusableWebView;
        } else {
            const reusableWebView = new ReusableWebView();
            ReusableWebView.reusableWebView = reusableWebView;
            //reusableWebView._templateDataMap = new Map();
            reusableWebView._reloadRequired = false;
            reusableWebView.initialize();
            return reusableWebView;
        }
    }

    public getView(): any {
        return this._webView;
    }

    public viewIsNative(): boolean {
        return true;
    }

    public initialLoadPlatform(): void {
        console.log("ReusableWebView.initialLoadPlatform()");
        const url = NSURL.URLWithString(BaseWebView.initialPageURL());
        this._webView.loadRequest(NSURLRequest.requestWithURL(url));
    }

    public decodeBase64(b64: string) {
        return NSData.alloc().initWithBase64Encoding(b64);
    }

    public resetHeight(width: number, height: number) {
        if (this._webView) {
            this._webView.frame = CGRectMake(0, 0, width, height);
        }
    }

    protected initialize(): void {
        console.log("ReusableWebView.initialize()");

        // initialize user content controller
        this._userContentController = WKUserContentController.new();
        this._scriptMessageHandler = WKScriptMessageHandlerImpl.init();
        this._scriptMessageHandler.context = this._context;
        this._userContentController.addScriptMessageHandlerName(this._scriptMessageHandler, 'formRunner');
        this._consoleMessageHandler = WKScriptConsoleMessageHandlerImpl.init();
        this._userContentController.addScriptMessageHandlerName(this._consoleMessageHandler, 'logHandler');

        // setup config
        this._config = WKWebViewConfiguration.new();
        this._config.userContentController = this._userContentController;
        this._urlSchemeHandler = WKURLSchemeHandlerImpl.init();
        this._urlSchemeHandler.reusableWebView = this;
        this._config.setURLSchemeHandlerForURLScheme(this._urlSchemeHandler, BaseWebView.CUSTOM_SCHEME);
        this._config.websiteDataStore = WKWebsiteDataStore.nonPersistentDataStore();
        this._webView = WKWebView.alloc().initWithFrameConfiguration(CGRectMake(0, 0, 2000, 2000), this._config);

        this._webviewNavigationDelegate = WKNavigationHandlerImpl.init();
        this._webviewNavigationDelegate.setContext(this._context);
        this._webView.navigationDelegate = this._webviewNavigationDelegate;

        // inject JS to capture console.log output and send to iOS
        const source = "function captureLog(msg) { webkit.messageHandlers.logHandler.postMessage(msg); } window.console.log = captureLog;"
        this.evaluateJavaScript(source);
    }

    public evaluateJavaScript(expression: string): void {
        this._webView.evaluateJavaScriptCompletionHandler(NSString.stringWithString(expression).description, (error: NSError) => {
            if (error !== null) {
                console.log("JAVASCRIPT ERROR: " + error)
                console.log("ATTEMPTED EVAL: " + expression);
            }
        });
    }

    /**
    * Convert A String to Base64 String
    * @param {string} textString
    * @returns {string}
    */
    public transformStringToBase64(textString) {
        const text = NSString.stringWithString(textString);
        const data = text.dataUsingEncoding(NSUTF8StringEncoding);
        // fails to compile with a 0 value. perhaps nativescript cannot handle implicit conversion to NSUInteger?
        const base64String = data.base64EncodedStringWithOptions(NSDataBase64EncodingOptions.EncodingEndLineWithLineFeed - NSDataBase64EncodingOptions.EncodingEndLineWithLineFeed);
        return base64String;
    }
}