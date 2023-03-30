import React, { createContext } from "react";

export const PrimaryNotificationsContext = createContext();

export function PrimaryNotificationsProvider({ children, primaryNotification }) {
  return (
    <PrimaryNotificationsContext.Provider value={{ primaryNotification }}>
      {children}
    </PrimaryNotificationsContext.Provider>
  );
}
