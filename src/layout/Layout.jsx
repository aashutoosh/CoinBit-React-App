import Header from "../components/Header/Header";
import AlertModal from "../components/AlertModal/AlertModal";
import PrimaryNotification from "../components/Notification/PrimaryNotification";
import SecondaryNotification from "../components/Notification/SecondaryNotification";
import NotificationWindow from "../components/Notification/NotificationWindow";
import Watchlist from "../components/Watchlist/Watchlist";
import AlertSection from "../components/AlertsSection/AlertSection";
// import SettingsSection from "../components/SettingsSection/SettingsSection";
// import AboutSection from "../components/AboutSection/AboutSection";

import { getFromLocalStorage } from "../utils/localStorageUtils";
import { getCurrentTime } from "../utils/currentTimeUtils";
import { PrimaryNotificationsProvider } from "../context/primaryNotificationsContext";
import { SecondaryNotificationsProvider } from "../context/secondaryNotificationsContext";

import alertsReducer from "../reducers/alertsReducer";
import React, { useReducer, useState } from "react";

export default function Layout() {
  const [showNotificationWindow, setShowNotificationWindow] = useState(false);
  const [primaryNotification, setPrimaryNotification] = useState({});
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

  const primaryNotificationHandler = (notificationObject) => {
    setPrimaryNotification({ key: Date.now(), time: getCurrentTime(), ...notificationObject });
  };

  const secondaryNotificationHandler = (message, icon) => {
    setSecondaryNotification({ message, icon });
  };

  const toggleNotificationWindow = () => {
    setShowNotificationWindow(!showNotificationWindow);
  };

  return (
    <PrimaryNotificationsProvider primaryNotification={primaryNotificationHandler}>
      <SecondaryNotificationsProvider secondaryNotification={secondaryNotificationHandler}>
        <Header
          activeSectionHandler={activeSectionHandler}
          onBellClick={toggleNotificationWindow}
          showNotificationWindow={showNotificationWindow}
        />
        <PrimaryNotification notification={primaryNotification} />
        <SecondaryNotification message={secondaryNotification.message} icon={secondaryNotification.icon} />
        <AlertModal modalObject={alertModal} dispatchAlerts={dispatchAlerts} />
        <main className="main container">
          <NotificationWindow primaryNotification={primaryNotification} showWindow={showNotificationWindow} />
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
    </PrimaryNotificationsProvider>
  );
}
