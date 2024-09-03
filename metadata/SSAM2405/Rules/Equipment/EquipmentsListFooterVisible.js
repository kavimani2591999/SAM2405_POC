import EquipmentCount from './EquipmentCount';

export default function EquipmentsListFooterVisible(sectionProxy) {
    return EquipmentCount(sectionProxy) > 2;
}
