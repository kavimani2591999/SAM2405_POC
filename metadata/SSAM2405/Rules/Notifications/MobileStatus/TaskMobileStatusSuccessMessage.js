import libComm from '../../Common/Library/CommonLibrary';
export default function TaskMobileStatusSuccessMessage(context) {
    context.dismissActivityIndicator();
    const clientData = context.getClientData();
    if (clientData && clientData.ChangeStatus) {
        const status = clientData.ChangeStatus;
        const started = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        const completed = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        const success = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/SuccessParameterName.global').getValue());
        switch (status) {
            case started:
                return context.localizeText('task_started');
            case completed:
                return context.localizeText('task_completed');
            case success:
                return context.localizeText('task_successful');
            default:
                return context.localizeText('status_updated');
        }
    }
    return context.localizeText('status_updated');
}
