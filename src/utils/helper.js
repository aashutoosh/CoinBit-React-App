import { getFromLocalStorage } from "./localStorageUtils";

export function getSubscribedSymbols() {
    const watchlistSymbols = getFromLocalStorage("watchlist") || [];
    const pendingAlertsSymbols = getFromLocalStorage("pendingAlerts")?.map(({ symbol }) => symbol) || [];

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
        pendingAlerts: getFromLocalStorage("pendingAlerts") || [],
        triggeredAlerts: getFromLocalStorage("triggeredAlerts") || [],
    };
}