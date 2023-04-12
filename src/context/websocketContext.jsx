import React, { createContext } from 'react';

export const WebSocketContext = createContext();

export function WebSocketProvider({ children, wsContextValue }) {
  return <WebSocketContext.Provider value={wsContextValue}>{children}</WebSocketContext.Provider>;
}
