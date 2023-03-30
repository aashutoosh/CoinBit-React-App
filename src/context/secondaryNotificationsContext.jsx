import React, { createContext } from "react";

export const SecondaryNotificationsContext = createContext();

export function SecondaryNotificationsProvider({ children, secondaryNotification }) {
  return (
    <SecondaryNotificationsContext.Provider value={{ secondaryNotification }}>
      {children}
    </SecondaryNotificationsContext.Provider>
  );
}
