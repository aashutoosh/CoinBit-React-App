import { sendDiscordAlert } from '../utils/discord';
import { updateLocalStorage } from '../utils/localStorageUtils';

export default function alertsReducer(currentAlerts, action) {
  const { pendingAlerts } = currentAlerts;
  const { triggeredAlerts } = currentAlerts;
  let updatedPendingAlerts;
  let updatedTriggeredAlerts;

  switch (action.type) {
    case 'ADD_ALERT': {
      updatedPendingAlerts = [action.payload, ...pendingAlerts];
      updateLocalStorage('pendingAlerts', updatedPendingAlerts);
      action.secondaryNotification('Alert Created!', 'ri-checkbox-circle-line');

      return { ...currentAlerts, pendingAlerts: updatedPendingAlerts };
    }

    case 'TRIGGER_ALERT': {
      const alertObject = pendingAlerts.filter(
        (alert) => alert.createdon === action.payload.createdon,
      )[0];

      const filteredPendingAlerts = pendingAlerts.filter(
        (alert) => alert.createdon !== action.payload.createdon,
      );
      updateLocalStorage('pendingAlerts', filteredPendingAlerts);

      updatedTriggeredAlerts = [alertObject, ...triggeredAlerts];
      updateLocalStorage('triggeredAlerts', updatedTriggeredAlerts);

      action.primaryNotification({
        symbol: action.payload.symbol,
        title: action.payload.title,
        description: action.payload.description,
        condition: `${action.payload.symbol} ${action.payload.condition} ${action.payload.price}`,
        icon: 'ri-notification-4-line',
      });

      sendDiscordAlert(action.payload, action.secondaryNotification);

      return {
        pendingAlerts: filteredPendingAlerts,
        triggeredAlerts: updatedTriggeredAlerts,
      };
    }

    case 'UPDATE_ALERT': {
      // Only pending alerts can be updated
      const filteredPendingAlerts = pendingAlerts.filter(
        (alert) => alert.createdon !== action.alertKey,
      );
      updatedPendingAlerts = [action.payload, ...filteredPendingAlerts];
      updateLocalStorage('pendingAlerts', updatedPendingAlerts);
      action.secondaryNotification('Alert Updated!', 'ri-edit-2-line');

      return { ...currentAlerts, pendingAlerts: updatedPendingAlerts };
    }

    case 'DELETE_ALERT': {
      // Both pending and triggered alerts can be deleted
      const alertsArray = action.isPending ? 'pendingAlerts' : 'triggeredAlerts';
      const updatedAlerts = currentAlerts[alertsArray].filter(
        (alert) => alert.createdon !== action.payload.createdon,
      );
      updateLocalStorage(alertsArray, updatedAlerts);
      action.secondaryNotification(
        `${action.isPending ? 'Pending' : 'Triggered'} alert deleted!`,
        'ri-delete-bin-6-line',
      );

      return { ...currentAlerts, [alertsArray]: updatedAlerts };
    }

    default:
      return currentAlerts;
  }
}
