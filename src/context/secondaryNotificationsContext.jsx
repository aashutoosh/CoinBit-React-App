import React, { createContext, useMemo } from 'react';

export const SecondaryNotificationsContext = createContext();

export function SecondaryNotificationsProvider({ children, secondaryNotification }) {
  const contextValue = useMemo(() => secondaryNotification, [secondaryNotification]);
  return (
    <SecondaryNotificationsContext.Provider value={contextValue}>
      {children}
    </SecondaryNotificationsContext.Provider>
  );
}
