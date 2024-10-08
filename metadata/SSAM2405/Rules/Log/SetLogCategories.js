import libCom from '../Common/Library/CommonLibrary';

export default function SetLogCategories(context) {
    let logger = context.getLogger();

    try {
        if (context.getValue()) {
            const values = context.getValue();
            let categories = [];
           
            if (values && values.length) {
                categories = values.map((value) => {
                    return 'mdk.trace.' + value.ReturnValue;
                });

                libCom.setStateVariable(context.getPageProxy(), 'LogCategories', values.map((value) => {
                    return value.ReturnValue;
                }));
            } else {
                libCom.setStateVariable(context.getPageProxy(), 'LogCategories', []);
            }

            context.setDebugSettings(false, true, categories);
        }
    } catch (exception) {
        logger.log(String(exception), 'Error');
        return undefined;
    }
}
