import React, { useContext, useEffect, useMemo, useState } from 'react';

import { WebSocketContext } from '../../context/websocketContext';
import { PrimaryNotificationsContext } from '../../context/primaryNotificationsContext';
import { SecondaryNotificationsContext } from '../../context/secondaryNotificationsContext';

import AlertRow from './AlertRow';

export default function Table({
  allAlerts,
  alertsType,
  dispatchAlerts,
  createAlert,
  websocketActions,
}) {
  const secondaryNotification = useContext(SecondaryNotificationsContext);
  const primaryNotification = useContext(PrimaryNotificationsContext);
  const pendingAlertsType = alertsType === 'pending';
  const alerts = pendingAlertsType ? allAlerts.pendingAlerts : allAlerts.triggeredAlerts;
  const [tableData, setTableData] = useState({});
  const wsData = useContext(WebSocketContext);

  const alertsMemo = useMemo(() => alerts, [alerts]);
  const alertsTypeMemo = useMemo(() => alertsType, [alertsType]);

  const removeSymbolData = (alert) => {
    // If pending type then only can unsubscribe after alert deleted
    if (pendingAlertsType) {
      websocketActions.wsUnsubscribe(alert.symbol, 'pendingAlerts');

      if (alertsMemo.filter((a) => a.symbol === alert.symbol).length === 1) {
        const updatedData = { ...tableData };
        delete updatedData[alert.symbol];
        setTableData(updatedData);
      }
    }
  };

  const actionHandler = (type, alert) => {
    if (type === 'edit') {
      createAlert({
        type: 'update',
        payload: alert,
      });
    } else if (type === 'delete') {
      dispatchAlerts({
        type: 'DELETE_ALERT',
        isPending: pendingAlertsType,
        payload: alert,
        secondaryNotification,
      });

      removeSymbolData(alert);
    }
  };

  useEffect(() => {
    if (alertsTypeMemo === 'pending') {
      const initialData = {};
      alertsMemo.forEach((alert) => {
        initialData[alert.symbol] = {
          price: 0.0,
          priceColor: '',
        };
      });
      setTableData(initialData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (wsData && alertsTypeMemo === 'pending') {
      const {
        data: { s: symbol, c: currentPrice },
      } = wsData;
      const prevData = tableData[symbol];

      let priceColor = '';
      if (prevData && prevData.price) {
        priceColor = currentPrice > prevData.price ? 'green' : 'red';
      }

      const newSymbolData = {
        price: Number(currentPrice),
        priceColor,
      };

      setTableData((prevTableData) => ({ ...prevTableData, [symbol]: newSymbolData }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsData, alertsTypeMemo]);

  useEffect(() => {
    function conditionMatched(alert) {
      dispatchAlerts({
        type: 'TRIGGER_ALERT',
        isPending: pendingAlertsType,
        payload: alert,
        primaryNotification,
        secondaryNotification,
      });

      removeSymbolData(alert);
    }

    if (wsData) {
      const {
        data: { s: symbol, c: currentPrice },
      } = wsData;

      const pendingAlerts = allAlerts.pendingAlerts.filter((alert) => alert.symbol === symbol);

      pendingAlerts.forEach((alert) => {
        const currentPriceNumber = Number(currentPrice);
        const alertPriceNumber = Number(alert.price);
        const { condition } = alert;
        switch (condition) {
          case '>=':
            if (currentPriceNumber >= alertPriceNumber) {
              conditionMatched(alert);
            }
            break;
          case '<=':
            if (currentPriceNumber <= alertPriceNumber) {
              conditionMatched(alert);
            }
            break;
          case '>':
            if (currentPriceNumber > alertPriceNumber) {
              conditionMatched(alert);
            }
            break;
          case '<':
            if (currentPriceNumber < alertPriceNumber) {
              conditionMatched(alert);
            }
            break;
          case '==':
            if (currentPriceNumber === alertPriceNumber) {
              conditionMatched(alert);
            }
            break;
          default:
            break;
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsData]);

  return (
    <div className="table__container">
      <table className="alerts__table">
        <thead>
          <tr>
            <th>Name</th>
            <th />
            <th>Symbol</th>
            <th>Condition</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody className="alerts__table--tbody">
          {alertsMemo.map((alert) => (
            <AlertRow
              key={alert.createdon}
              alert={alert}
              pendingAlertsType={pendingAlertsType}
              actionHandler={actionHandler}
              tableData={tableData}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
