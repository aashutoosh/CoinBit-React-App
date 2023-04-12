import React, { createContext, useMemo } from 'react';

export const PrimaryNotificationsContext = createContext();

export function PrimaryNotificationsProvider({ children, primaryNotification }) {
  const contextValue = useMemo(() => primaryNotification, [primaryNotification]);
  return (
    <PrimaryNotificationsContext.Provider value={contextValue}>
      {children}
    </PrimaryNotificationsContext.Provider>
  );
}
