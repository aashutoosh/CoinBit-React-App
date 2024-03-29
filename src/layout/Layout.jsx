import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';

import { getAllAlerts, getSubscribedSymbols, getUniqueSymbolsArray } from '../utils/helper';
import { SecondaryNotificationsProvider } from '../context/secondaryNotificationsContext';
import { PrimaryNotificationsProvider } from '../context/primaryNotificationsContext';
import { WebSocketProvider } from '../context/websocketContext';
import { getCurrentTime } from '../utils/currentTimeUtils';

import Header from '../components/Header/Header';
import AlertModal from '../components/AlertModal/AlertModal';
import PrimaryNotification from '../components/Notification/PrimaryNotification';
import SecondaryNotification from '../components/Notification/SecondaryNotification';
import NotificationWindow from '../components/Notification/NotificationWindow';
import Watchlist from '../components/Watchlist/Watchlist';
import AlertSection from '../components/AlertsSection/AlertSection';
import SettingsSection from '../components/SettingsSection/SettingsSection';
import AboutSection from '../components/AboutSection/AboutSection';
import alertsReducer from '../reducers/alertsReducer';
import WsConnect from '../wsconnect';
import SEO from '../components/SEO/SEO';

export default function Layout() {
  const [subscribedSymbols, setSubscribedSymbols] = useState(getSubscribedSymbols());
  const [showNotificationWindow, setShowNotificationWindow] = useState(false);
  const [webSocketData, setWebSocketData] = useState(null);
  const [primaryNotification, setPrimaryNotification] = useState({});
  const [secondaryNotification, setSecondaryNotification] = useState({});
  const [alertModal, setAlertModal] = useState({});
  const [activeSection, setActiveSection] = useState('alerts');
  const initialAlerts = getAllAlerts();
  const ws = useRef(null);

  const [allAlerts, dispatchAlerts] = useReducer(alertsReducer, initialAlerts);

  const primaryNotificationHandler = (notificationObject) => {
    setPrimaryNotification({
      key: Date.now(),
      time: getCurrentTime(),
      ...notificationObject,
    });
  };

  const secondaryNotificationHandler = (message, icon, ariaMessage) => {
    setSecondaryNotification({ id: Date.now(), ariaMessage, message, icon });
  };

  const wsContextValue = useMemo(() => webSocketData, [webSocketData]);

  const onWsData = (data) => {
    if (data?.stream) {
      setWebSocketData(data);
    }
  };

  const onWsNotification = (message, icon, ariaMessage) =>
    secondaryNotificationHandler(message, icon, ariaMessage);

  // Initialize the WebSocket connection
  const initializeWebsocket = (symbolsArray = getUniqueSymbolsArray(subscribedSymbols)) => {
    ws.current = new WsConnect();
    ws.current.init(symbolsArray, onWsData, onWsNotification);
  };

  const wsSubscribe = (symbol) => {
    // If websocket exist then subscribe to that symbol otherwise initialize websocket
    if (ws.current) {
      const uniqueSymbols = getUniqueSymbolsArray(subscribedSymbols);
      if (!uniqueSymbols.includes(symbol)) {
        ws.current.subscribeSymbol(symbol);
        setSubscribedSymbols({
          ...subscribedSymbols,
          watchlist: [...subscribedSymbols.watchlist, symbol],
        });
      }
    } else {
      initializeWebsocket([symbol]);
      setSubscribedSymbols({
        ...subscribedSymbols,
        watchlist: [...subscribedSymbols.watchlist, symbol],
      });
    }
  };

  const wsUnsubscribe = (symbol, origin) => {
    if (ws.current) {
      if (origin === 'watchlist') {
        setSubscribedSymbols({
          ...subscribedSymbols,
          watchlist: subscribedSymbols.watchlist.filter((s) => s !== symbol),
        });
        if (!subscribedSymbols.pendingAlerts.includes(symbol)) {
          // Unsubscribe if symbol is not present in pending alerts
          ws.current.unsubscribeSymbol(symbol);
        }
      } else if (origin === 'pendingAlerts') {
        const symbolAlertCount = allAlerts.pendingAlerts.filter(
          (alert) => alert.symbol === symbol,
        ).length;

        // Unsubscribe if symbol is not present in watchlist
        if (!subscribedSymbols.watchlist.includes(symbol) && symbolAlertCount === 1) {
          setSubscribedSymbols({
            ...subscribedSymbols,
            pendingAlerts: subscribedSymbols.pendingAlerts.filter((s) => s !== symbol),
          });

          ws.current.unsubscribeSymbol(symbol);
        }
      }
    }
  };

  const websocketActions = {
    wsSubscribe,
    wsUnsubscribe,
  };

  // Initialize websocket connection after first page load
  useEffect(() => {
    const uniqueSymbols = getUniqueSymbolsArray(subscribedSymbols);
    if (!ws.current && uniqueSymbols.length > 0) {
      initializeWebsocket();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createAlertHandler = (alertObject) => {
    setAlertModal(alertObject);

    if (!subscribedSymbols.pendingAlerts.includes(alertObject.symbol)) {
      setSubscribedSymbols({
        ...subscribedSymbols,
        pendingAlerts: [...subscribedSymbols.pendingAlerts, alertObject.symbol],
      });
    }
  };

  const activeSectionHandler = (section) => {
    setActiveSection(section);
  };

  const toggleNotificationWindow = () => {
    setShowNotificationWindow((prev) => !prev);
  };

  const hideNotificationWindow = () => {
    setShowNotificationWindow((prev) => {
      if (prev) {
        return !prev;
      }
      return prev;
    });
  };

  useEffect(() => {
    const closeNotificationWindow = (event) => {
      if (event.key === 'Escape') {
        hideNotificationWindow();
      }
    };

    document.addEventListener('keydown', closeNotificationWindow);
  }, []);

  return (
    <HelmetProvider>
      <WebSocketProvider wsContextValue={wsContextValue}>
        <PrimaryNotificationsProvider primaryNotification={primaryNotificationHandler}>
          <SecondaryNotificationsProvider secondaryNotification={secondaryNotificationHandler}>
            <SEO
              title="CoinBit React App"
              description="Get real-time cryptocurrency data updates and customized price alerts with CoinBit React App. Built using React and the Binance websocket API, this app is the ultimate tool for traders looking to stay ahead of the game."
              name="CoinBit"
              type="app"
            />
            <Header
              primaryNotification={primaryNotification}
              activeSectionHandler={activeSectionHandler}
              onBellClick={toggleNotificationWindow}
              showNotificationWindow={showNotificationWindow}
            />
            <PrimaryNotification notification={primaryNotification} />
            <SecondaryNotification notification={secondaryNotification} />
            <AlertModal modalObject={alertModal} dispatchAlerts={dispatchAlerts} />
            <main className="main container">
              <NotificationWindow
                primaryNotification={primaryNotification}
                showWindow={showNotificationWindow}
              />
              <Watchlist
                createAlert={createAlertHandler}
                activeSection={activeSection}
                websocketActions={websocketActions}
              />
              <AlertSection
                subscribedSymbols={subscribedSymbols}
                createAlert={createAlertHandler}
                activeSection={activeSection}
                allAlerts={allAlerts}
                dispatchAlerts={dispatchAlerts}
                websocketActions={websocketActions}
              />
              <SettingsSection activeSection={activeSection} />
              <AboutSection activeSection={activeSection} />
            </main>
          </SecondaryNotificationsProvider>
        </PrimaryNotificationsProvider>
      </WebSocketProvider>
    </HelmetProvider>
  );
}
