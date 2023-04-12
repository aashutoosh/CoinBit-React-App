import React, { useContext, useEffect, useRef, useState } from 'react';
import { SecondaryNotificationsContext } from '../../context/secondaryNotificationsContext';
import { WebSocketContext } from '../../context/websocketContext';
import './alertSection.scss';

function Heading({ tabChange, createAlert }) {
  const pendingTab = useRef(null);
  const triggeredTab = useRef(null);

  const tabChangeHandler = (event) => {
    const isPendingType = event.target.classList.contains('alerts__title--pending');
    if (isPendingType) {
      triggeredTab.current.classList.remove('active');
      pendingTab.current.classList.add('active');
      tabChange('pending');
    } else {
      pendingTab.current.classList.remove('active');
      triggeredTab.current.classList.add('active');
      tabChange('triggered');
    }
  };

  const keyTabChangeHandler = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      tabChangeHandler(event);
    }
  };

  const createNewAlert = () => {
    createAlert({
      type: 'create',
      symbol: '',
    });
  };

  return (
    <div className="heading">
      <div className="heading__window">
        <button
          className="alerts__title alerts__title--pending active"
          onClick={tabChangeHandler}
          ref={pendingTab}
          onKeyDown={keyTabChangeHandler}
          aria-label="Pending alerts tab"
          type="button"
        >
          <i className="ri-eye-line" />
          Pending
        </button>
        <button
          className="alerts__title alerts__title--triggered"
          onClick={tabChangeHandler}
          ref={triggeredTab}
          onKeyDown={keyTabChangeHandler}
          aria-label="Triggered alerts tab"
          type="button"
        >
          <i className="ri-eye-close-line" />
          Triggered
        </button>
      </div>
      <button
        className="alerts__create--button text"
        onClick={createNewAlert}
        type="button"
        aria-label="Create Alert"
      >
        Create Alert
      </button>
      <button
        className="alerts__create--button icon"
        onClick={createNewAlert}
        type="button"
        aria-label="Create Alert"
      >
        <i className="ri-add-line" />
      </button>
    </div>
  );
}

function AlertRow({ alert, pendingAlertsType, actionHandler, tableData }) {
  const rowRef = useRef(null);
  const editButtonRef = useRef(null);
  const deleteButtonRef = useRef(null);

  const editButtonHandler = () => actionHandler('edit', alert);
  const deleteButtonHandler = () => actionHandler('delete', alert);

  const editKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      editButtonHandler();
    }
  };
  const deleteKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      deleteButtonHandler();
    }
  };

  return (
    <tr className="row" data-key={alert.createdon} tabIndex={0} ref={rowRef}>
      <td>
        <div className="textContent">
          <span className="title">{alert.title}</span>
          <span className="description">{alert.description}</span>
        </div>
      </td>
      <td>
        <div className="control__buttons">
          {pendingAlertsType && (
            <i
              ref={editButtonRef}
              tabIndex={0}
              role="button"
              className="control__buttons--edit ri-pencil-line"
              onClick={editButtonHandler}
              onKeyDown={editKeyDown}
              aria-label="Edit"
            />
          )}
          <i
            ref={deleteButtonRef}
            tabIndex={0}
            role="button"
            className="control__buttons--delete ri-close-line"
            onClick={deleteButtonHandler}
            onKeyDown={deleteKeyDown}
            aria-label="Delete"
          />
        </div>
      </td>
      <td>
        <span className="symbol">{alert.symbol}</span>
        {pendingAlertsType && (
          <span className={`ltp ${tableData[alert.symbol]?.priceColor}`}>
            {tableData[alert.symbol]?.price}
          </span>
        )}
      </td>
      <td>
        <span>{alert.condition}</span>
      </td>
      <td>{alert.price}</td>
    </tr>
  );
}

function Table({ alerts, alertsType, dispatchAlerts, createAlert, websocketActions }) {
  const secondaryNotification = useContext(SecondaryNotificationsContext);
  const pendingAlertsType = alertsType === 'pending';
  const [tableData, setTableData] = useState({});
  const wsData = useContext(WebSocketContext);

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

      // If pending type then only can unsubscribe after alert deleted
      if (pendingAlertsType) {
        websocketActions.wsUnsubscribe(alert.symbol, 'pendingAlerts');

        if (alerts.filter((a) => a.symbol === alert.symbol).length === 1) {
          const updatedData = { ...tableData };
          delete updatedData[alert.symbol];
          setTableData(updatedData);
        }
      }
    }
  };

  useEffect(() => {
    if (alertsType === 'pending') {
      const initialData = {};
      alerts.forEach((alert) => {
        initialData[alert.symbol] = {
          price: 0.0,
          priceColor: '',
        };
      });
      setTableData(initialData);
    }
  }, []);

  useEffect(() => {
    if (wsData && alertsType === 'pending') {
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
          {alerts.map((alert) => (
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

function EmptyText() {
  return (
    <div className="alerts__empty show">
      <i className="ri-error-warning-line" />
      <span>To create an alert, please add symbols to your watchlist.</span>
    </div>
  );
}

export default function AlertSection({
  subscribedSymbols,
  createAlert,
  activeSection,
  allAlerts,
  dispatchAlerts,
  websocketActions,
}) {
  const [alertsType, setAlertsType] = useState('pending');
  const alerts = alertsType === 'pending' ? allAlerts.pendingAlerts : allAlerts.triggeredAlerts;
  return (
    <section
      className={`alerts rightside ${activeSection === 'alerts' ? 'showsection' : ''}`}
      id="alerts"
    >
      <Heading tabChange={(tabType) => setAlertsType(tabType)} createAlert={createAlert} />
      {alerts.length > 0 && (
        <Table
          alerts={alerts}
          alertsType={alertsType}
          createAlert={createAlert}
          dispatchAlerts={dispatchAlerts}
          websocketActions={websocketActions}
        />
      )}
      {subscribedSymbols.watchlist.length === 0 &&
        subscribedSymbols.pendingAlerts.length === 0 &&
        alertsType === 'pending' && <EmptyText />}
    </section>
  );
}
