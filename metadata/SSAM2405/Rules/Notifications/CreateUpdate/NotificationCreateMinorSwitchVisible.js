import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import IsOnCreate from '../../Common/IsOnCreate';
import IsMinorWorkEnabled from '../../WorkOrders/IsMinorWorkEnabled';

export default function NotificationCreateMinorSwitchVisible(context) {
    return IsPhaseModelEnabled(context) && IsOnCreate(context) && IsMinorWorkEnabled(context);
}
