export default function MaintenancePlantForEquipment(controlProxy) {
    let context;

    try {
        context = controlProxy.getPageProxy();
    } catch (err) {
        controlProxy = controlProxy.binding.clientAPI;
        context = controlProxy.getPageProxy();
    }
    let maintenacePlantLstPkr = context.getControl('FormCellContainer').getControl('MaintenacePlantLstPkr').getValue();

    let maintenacePlantLstPkrValue = maintenacePlantLstPkr && maintenacePlantLstPkr.length ? maintenacePlantLstPkr[0].ReturnValue : '';

    let maintenacePlant = maintenacePlantLstPkrValue || controlProxy.binding.MaintPlant || '';

    return maintenacePlant;
}
