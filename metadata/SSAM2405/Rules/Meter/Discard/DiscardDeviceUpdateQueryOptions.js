export default function DiscardDeviceUpdateQueryOptions(context, replaceBinbing) {
    const binding = replaceBinbing || context.binding;

    let deviceNavEditlink = binding.Device_Nav['@odata.editLink'];
    deviceNavEditlink = deviceNavEditlink.replace(/'/g, "''"); //escape the single quote inside the edit with another single quote to please OData

    return `$filter=RequestURL eq '${deviceNavEditlink}'`;
}
