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

import { getFromLocalStorage } from "../utils/localStorageUtils";
import { SecondaryNotificationsProvider } from "../context/secondaryNotificationsContext";

import alertsReducer from "../reducers/alertsReducer";
import React, { useReducer, useState } from "react";

export default function Layout() {
  const [secondaryNotification, setSecondaryNotification] = useState({});
  const [alertModal, setAlertModal] = useState({});
  const [activeSection, setActiveSection] = useState("alerts");
  const initialAlerts = {
    pendingAlerts: getFromLocalStorage("pendingAlerts") || [],
    triggeredAlerts: getFromLocalStorage("triggeredAlerts") || [],
  };

  const [allAlerts, dispatchAlerts] = useReducer(alertsReducer, initialAlerts);

  const createAlertHandler = (alertObject) => {
    setAlertModal(alertObject);
  };

  const activeSectionHandler = (section) => {
    setActiveSection(section);
  };

  const secondaryNotificationHandler = (message, icon) => {
    setSecondaryNotification({ message, icon });
  };

  return (
    <SecondaryNotificationsProvider secondaryNotification={secondaryNotificationHandler}>
      <Header activeSectionHandler={activeSectionHandler} />
      {/* <PrimaryNotification /> */}
      <SecondaryNotification message={secondaryNotification.message} icon={secondaryNotification.icon} />
      <AlertModal modalObject={alertModal} dispatchAlerts={dispatchAlerts} />
      <main className="main container">
        {/* <NotificationList /> */}
        <Watchlist createAlert={createAlertHandler} activeSection={activeSection} />
        <AlertSection
          createAlert={createAlertHandler}
          activeSection={activeSection}
          allAlerts={allAlerts}
          dispatchAlerts={dispatchAlerts}
        />
        {/* <SettingsSection /> */}
        {/* <AboutSection /> */}
      </main>
    </SecondaryNotificationsProvider>
  );
}
