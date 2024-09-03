import MassUpdatePageMetadataGenerator from './MassUpdatePageMetadataGenerator';
import libCom from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default async function MassUpdatePageNav(context) {
    libCom.setStateVariable(context, 'FDCPreviousPage', libCom.getCurrentPageName(context));
    libCom.setStateVariable(context, 'FDCPreviousPageBinding', context.evaluateTargetPathForAPI('#Page:-Current').binding);
    if (context.getPageProxy().getActionBinding()) {
        context.getPageProxy().evaluateTargetPathForAPI('#Page:' + libCom.getCurrentPageName(context)).getClientData().ActionBinding = context.getPageProxy().getActionBinding();
    } else {
        context.getPageProxy().evaluateTargetPathForAPI('#Page:' + libCom.getCurrentPageName(context)).getClientData().ActionBinding = '';
    }
    let pageMetadata = await MassUpdatePageMetadataGenerator(context);
    let actionProperties = {
        'PageMetadata': pageMetadata,
        'PageToOpen': '/SAPAssetManager/Pages/GenericPage.page',
        'ModalPageFullscreen': true,
    };
    return context.getPageProxy().executeAction({
        'Name': '/SAPAssetManager/Actions/Common/GenericNav.action',
        'Properties': actionProperties,
        'Type': 'Action.Type.Navigation',
    });

}
