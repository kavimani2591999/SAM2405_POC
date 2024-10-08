
export default function EquipmentInstallationCreateLinksById(context) {
    let links = [];
    if (context.binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
        let equipmentLink = context.createLinkSpecifierProxy('FunctionalLocation', 'MyFunctionalLocations', ''  , context.binding.FuncLocIdIntern);
        links.push(equipmentLink.getSpecifier());
    }

    return links;
}
