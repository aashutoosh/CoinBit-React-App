import React, { useState } from 'react';

import Heading from './Heading';
import Table from './Table';
import EmptyText from './EmptyText';

import './alertSection.scss';

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
          allAlerts={allAlerts}
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
