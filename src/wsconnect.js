import { WEBSOCKET_URL, WEBSOCKET_RECONNECT_SEC, WEBSOCKET_INITIAL_WAIT_SEC } from './config';

// Websocket
class WsConnect {
  constructor() {
    this.initialSymbols = null;
    this.dataHandler = null;
    this.notificationHandler = null;
    this.ws = null;
  }

  init(symbolsArray, dataHandler, notificationHandler) {
    if (symbolsArray.length === 0) return null;

    this.initialSymbols = symbolsArray;
    this.dataHandler = dataHandler;
    this.notificationHandler = notificationHandler;
    const allStreams = this.initialSymbols
      .map((symbol) => `${symbol.toLowerCase()}@ticker`)
      .join('/');

    this.ws = new WebSocket(WEBSOCKET_URL + allStreams);

    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onerror = this.onError.bind(this);
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
    return undefined;
  }

  onOpen() {
    this.notificationHandler('WebSocket Connected', 'ri-link-m');
  }

  onError() {
    this.notificationHandler('WebSocket error', 'ri-error-warning-line');
  }

  onClose() {
    this.notificationHandler('WebSocket disonnected', 'ri-link-unlink-m');

    // Reconnect to the WebSocket after 10 seconds
    setTimeout(() => {
      this.init(this.initialSymbols, this.dataHandler, this.notificationHandler);
    }, WEBSOCKET_RECONNECT_SEC);
  }

  onMessage(event) {
    this.dataHandler(JSON.parse(event.data));
  }

  subscribeSymbol(symbol) {
    const symbolObject = {
      id: Date.now(),
      method: 'SUBSCRIBE',
      params: [`${symbol.toLowerCase()}@ticker`],
    };

    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(symbolObject));
      this.notificationHandler(`Subscribed: ${symbol}`, 'ri-checkbox-circle-line');
    } else {
      // Try again after 2 seconds
      setTimeout(() => {
        this.subscribeSymbol(symbol);
      }, WEBSOCKET_INITIAL_WAIT_SEC);
    }
  }

  unsubscribeSymbol(symbol) {
    const symbolObject = {
      id: Date.now(),
      method: 'UNSUBSCRIBE',
      params: [`${symbol.toLowerCase()}@ticker`],
    };

    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(symbolObject));
      this.notificationHandler(`Unsubscribed: ${symbol}`, 'ri-delete-bin-line');
    } else {
      // Try again after 2 seconds
      setTimeout(() => {
        this.unsubscribeSymbol(symbol);
      }, WEBSOCKET_INITIAL_WAIT_SEC);
    }
  }
}

export default WsConnect;
