import { getFromLocalStorage } from "./localStorageUtils";


export function getUniqueSymbols() {
    const watchlistSymbols = getFromLocalStorage('watchlist') || [];
    const pendingAlertsSymbols = (getFromLocalStorage('pendingAlerts')?.map(({ symbol }) => symbol)) || [];

    const allSymbols = [...watchlistSymbols, ...pendingAlertsSymbols];
    const allUniqueSymbols = [...(new Set(allSymbols))];

    return allUniqueSymbols;
}