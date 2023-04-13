import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SecondaryNotificationsContext } from '../../context/secondaryNotificationsContext';
import { WebSocketContext } from '../../context/websocketContext';
import { getUniqueSymbols } from '../../utils/helper';
import './alertModal.scss';

function AllSymbolsOptions() {
  const allSymbols = getUniqueSymbols();
  const symbolsOption = allSymbols.map((symbol) => (
    <option value={symbol} key={symbol} tabIndex={0}>
      {symbol}
    </option>
  ));

  return symbolsOption;
}

function CloseButton({ closeHandler }) {
  const closeButtonRef = useRef(null);
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') closeHandler();
  };

  return (
    <i
      ref={closeButtonRef}
      className="alertmodal__close ri-close-line"
      onClick={closeHandler}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    />
  );
}

function AlertModal({ modalObject, dispatchAlerts }) {
  const secondaryNotification = useContext(SecondaryNotificationsContext);
  const wsData = useContext(WebSocketContext);
  const updateAlert = modalObject.type === 'update';
  const initialFormData = useMemo(
    () => ({
      title: updateAlert ? modalObject.payload.title : '',
      description: updateAlert ? modalObject.payload.description : '',
      symbol: updateAlert ? modalObject.payload.symbol : modalObject.symbol,
      condition: updateAlert ? modalObject.payload.condition : '>=',
      price: updateAlert ? modalObject.payload.price : '',
    }),
    [updateAlert, modalObject],
  );
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [priceData, setPriceData] = useState({});
  const modalRef = useRef(null);

  const formDataRef = useRef(formData);
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  const priceDataRef = useRef(priceData);
  useEffect(() => {
    priceDataRef.current = priceData;
  }, [priceData]);

  useEffect(() => {
    if (wsData) {
      const { data } = wsData;
      const formSymbol = formDataRef.current.symbol || getUniqueSymbols()?.[0];
      if (data.s === formSymbol) {
        const currentPrice = Number(data.c);
        let priceColor = '';
        if (priceDataRef.current?.price) {
          priceColor = currentPrice > priceDataRef.current.price ? 'green' : 'red';
        }
        const symbolData = {
          price: currentPrice,
          priceColor,
        };

        setPriceData(symbolData);
      }
    }
  }, [wsData]);

  const showModal = useCallback(() => {
    setIsVisible(true);
    setFormData(initialFormData);
    setTimeout(() => {
      modalRef.current.classList.remove('show');
      modalRef.current.classList.add('show');
    }, 100);
  }, [setIsVisible, setFormData, modalRef, initialFormData]);

  const hideModal = () => {
    modalRef.current.classList.remove('show');
    setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  useEffect(() => {
    if (modalObject.type) showModal();
  }, [modalObject, showModal]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    const currentFormData = new FormData(form);
    const alertObject = {
      title: currentFormData.get('title'),
      description: currentFormData.get('description'),
      symbol: currentFormData.get('symbol'),
      condition: currentFormData.get('condition'),
      price: currentFormData.get('price'),
      createdon: Date.now(),
    };

    if (updateAlert) {
      dispatchAlerts({
        type: 'UPDATE_ALERT',
        payload: alertObject,
        alertKey: modalObject.payload.createdon,
        secondaryNotification,
      });
    } else {
      dispatchAlerts({
        type: 'ADD_ALERT',
        payload: alertObject,
        secondaryNotification,
      });
    }

    hideModal();
  };

  return (
    isVisible && (
      <section className="alertmodal" id="alertmodal" ref={modalRef}>
        <h2 className="alertmodal__title">{`${
          modalObject.type === 'create' ? 'Create' : 'Update'
        } Alert`}</h2>
        <CloseButton closeHandler={hideModal} />
        <form className="alertmodal__form" data-key="" autoComplete="off" onSubmit={handleSubmit}>
          <div className="alertmodal__form--fields">
            <input
              id="title"
              type="text"
              className="input title"
              name="title"
              onChange={handleInputChange}
              value={formData.title}
              required
            />
            <label htmlFor="title" className="label alertmodal__form--title">
              Title
            </label>
          </div>
          <div className="alertmodal__form--fields">
            <input
              type="text"
              className="input description"
              name="description"
              id="description"
              onChange={handleInputChange}
              value={formData.description}
              required
            />
            <label htmlFor="description" className="label alertmodal__form--desc">
              Description
            </label>
          </div>
          <div className="fields">
            <div className="alertmodal__form--fields">
              <select
                name="symbol"
                className="select symbol"
                onChange={handleInputChange}
                value={formData.symbol || getUniqueSymbols()?.[0]}
                id="modalSymbolSelect"
              >
                <AllSymbolsOptions />
              </select>
              <label htmlFor="modalSymbolSelect" className="label alertmodal__form--symbol">
                Symbol
              </label>
              <span
                id="modalSymbolPrice"
                className={`alertmodal__form--price ${priceData.priceColor}`}
              >
                {priceData.price}
              </span>
            </div>
            <div className="alertmodal__form--fields">
              <select
                name="condition"
                className="select condition"
                onChange={handleInputChange}
                value={formData.condition}
                id="condition"
              >
                <option value=">=">Greater than or equal to (&gt;=)</option>
                <option value="<=">Less than or equal to (&lt;=) </option>
                <option value="<">Less than (&lt;) </option>
                <option value=">">Greater than (&gt;)</option>
                <option value="==">Equal to (==)</option>
              </select>
              <label htmlFor="condition" className="label alertmodal__form--condition">
                Condition
              </label>
            </div>
          </div>
          <div className="alertmodal__form--fields">
            <input
              type="number"
              min={0}
              step="any"
              className="input price"
              name="price"
              onChange={handleInputChange}
              value={formData.price}
              id="price"
              required
            />
            <label htmlFor="price" className="label alertmodal__form--price">
              Alert Price
            </label>
          </div>
          <button className="alertmodal__form--submit" type="submit">
            {`${modalObject.type === 'create' ? 'Create' : 'Update'}`}
          </button>
        </form>
      </section>
    )
  );
}

export default React.memo(AlertModal);
