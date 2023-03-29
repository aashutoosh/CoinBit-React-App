import Header from "../components/Header/Header";
import AlertModal from "../components/AlertModal/AlertModal";
// import PrimaryNotification from "../components/Notification/PrimaryNotification";
import SecondaryNotification from "../components/Notification/SecondaryNotification";
// import NotificationWindow from "../components/Notification/NotificationWindow";
// import NotificationList from "../components/Notification/NotificationList";
import Watchlist from "../components/Watchlist/Watchlist";
import AlertSection from "../components/AlertsSection/AlertSection";
// import SettingsSection from "../components/SettingsSection/SettingsSection";
// import AboutSection from "../components/AboutSection/AboutSection";

import alertsReducer from "../reducers/alertsReducer";

import React, { useReducer, useState } from "react";
import { getFromLocalStorage } from "../utils/localStorageUtils";

export default function Layout() {
  const [secNotf, setSecNotf] = useState({});
  const [alertModal, setAlertModal] = useState({});
  const [activeSection, setActiveSection] = useState("alerts");
  const initialAlerts = {
    pendingAlerts: getFromLocalStorage("pendingAlerts") || [],
    triggeredAlerts: getFromLocalStorage("triggeredAlerts") || [],
  };

  const [allAlerts, dispatchAlerts] = useReducer(alertsReducer, initialAlerts);

  const secNotfHandler = (message, icon = "ri-notification-4-line") => {
    setSecNotf({ message, icon });
  };

  const createAlertHandler = (alertObject) => {
    setAlertModal(alertObject);
  };

  const activeSectionHandler = (section) => {
    setActiveSection(section);
  };

  return (
    <>
      <Header activeSectionHandler={activeSectionHandler} />
      {/* <PrimaryNotification /> */}
      <SecondaryNotification message={secNotf.message} icon={secNotf.icon} />
      <AlertModal modalObject={alertModal} dispatchAlerts={dispatchAlerts} />

      <main className="main container">
        {/* <NotificationList /> */}
        <Watchlist
          secondaryNotification={secNotfHandler}
          createAlert={createAlertHandler}
          activeSection={activeSection}
        />
        <AlertSection
          createAlert={createAlertHandler}
          activeSection={activeSection}
          allAlerts={allAlerts}
          dispatchAlerts={dispatchAlerts}
        />
        {/* <SettingsSection /> */}
        {/* <AboutSection /> */}
      </main>
    </>
  );
}
