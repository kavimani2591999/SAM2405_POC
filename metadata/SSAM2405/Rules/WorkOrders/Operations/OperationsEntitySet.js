export default function OperationsEntitySet(context, bindingObject) {
	const binding = bindingObject || context.binding;
	if (binding && binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
		return binding['@odata.readLink'] + '/Operations';
	} else {
		return 'MyWorkOrderOperations';
	}
}
