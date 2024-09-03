import Logger from '../../Log/Logger';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function SubOperationRequiredFields(context) {
    let requiredFields = [
        'DescriptionNote',
        'ControlKeyLstPkr',
        'WorkCenterLstPkr',
        'WorkCenterPlantLstPkr',
    ];

    ['WorkOrderLstPkr', 'OperationLstPkr'].forEach(name => {
        try {
            if (context.evaluateTargetPathForAPI(`#Control:${name}`).visible) {
                requiredFields.push(name);
            }
        } catch (err) {
            Logger.error('SubOperationRequiredFields', err);
        }
    });

    return requiredFields;
}
