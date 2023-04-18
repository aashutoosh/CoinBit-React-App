import { getFromLocalStorage } from './localStorageUtils';

export function getSubscribedSymbols() {
  const watchlistSymbols = getFromLocalStorage('watchlist') || [];
  const pendingAlerts = getFromLocalStorage('pendingAlerts') || [];
  const pendingAlertsSymbols = pendingAlerts.map((alert) => alert.symbol);

  return { watchlist: watchlistSymbols, pendingAlerts: pendingAlertsSymbols };
}

export function getUniqueSymbolsArray(symbolsObject) {
  const allSymbols = [...symbolsObject.watchlist, ...symbolsObject.pendingAlerts];
  const allUniqueSymbols = [...new Set(allSymbols)];

  return allUniqueSymbols;
}

export function getUniqueSymbols() {
  const symbolsObject = getSubscribedSymbols();
  return getUniqueSymbolsArray(symbolsObject);
}

export function getAllAlerts() {
  return {
    pendingAlerts: getFromLocalStorage('pendingAlerts') || [],
    triggeredAlerts: getFromLocalStorage('triggeredAlerts') || [],
  };
}

export function ariaSymbolName(symbol) {
  // Replace all characters in the symbol with spaces
  // to create a string that screen readers will pronounce each letter separately like BTCUSDT to B T C U S D T
  return symbol.split('').join(' ');
}

export function ariaLabelizeSymbol(symbol, originalString) {
  // replace all occurrences of the symbol in the string
  // The regular expression uses the 'g' flag to replace all occurrences, not just the first one
  return originalString.replace(new RegExp(symbol, 'g'), ariaSymbolName(symbol));
}
