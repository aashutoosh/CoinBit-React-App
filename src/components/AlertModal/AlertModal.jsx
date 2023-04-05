import React, { useContext, useEffect, useRef, useState } from "react";
import { SecondaryNotificationsContext } from "../../context/secondaryNotificationsContext";
import { WebSocketContext } from "../../context/websocketContext";
import { getUniqueSymbols } from "../../utils/helper";
import "./alertModal.scss";

function AllSymbolsOptions() {
  const allSymbols = getUniqueSymbols();
  const symbolsOption = allSymbols.map((symbol) => (
    <option value={symbol} key={symbol}>
      {symbol}
    </option>
  ));

  return symbolsOption;
}

function AlertModal({ modalObject, dispatchAlerts }) {
  const { secondaryNotification } = useContext(SecondaryNotificationsContext);
  const wsData = useContext(WebSocketContext);
  const updateAlert = modalObject.type === "update";
  const initialFormData = {
    title: updateAlert ? modalObject.payload.title : "",
    description: updateAlert ? modalObject.payload.description : "",
    symbol: updateAlert ? modalObject.payload.symbol : modalObject.symbol,
    condition: updateAlert ? modalObject.payload.condition : ">=",
    price: updateAlert ? modalObject.payload.price : "",
  };

  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [priceData, setPriceData] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    if (wsData) {
      const formSymbol = formData.symbol || getUniqueSymbols()?.[0];
      if (wsData.data.s === formSymbol) {
        const currentPrice = Number(wsData.data.c);
        const symbolData = {
          price: currentPrice,
          priceColor: priceData?.price ? (currentPrice > priceData.price ? "green" : "red") : "",
        };

        setPriceData(symbolData);
      }
    }
  }, [wsData]);

  const showModal = () => {
    setIsVisible(true);
    setFormData(initialFormData);
    setTimeout(() => {
      modalRef.current.classList.remove("show");
      modalRef.current.classList.add("show");
    }, 100);
  };

  const hideModal = () => {
    modalRef.current.classList.remove("show");
    setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  useEffect(() => {
    if (modalObject.type) showModal();
  }, [modalObject]);

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
    const formData = new FormData(form);
    const alertObject = {
      title: formData.get("title"),
      description: formData.get("description"),
      symbol: formData.get("symbol"),
      condition: formData.get("condition"),
      price: formData.get("price"),
      createdon: Date.now(),
    };

    if (updateAlert) {
      dispatchAlerts({
        type: "UPDATE_ALERT",
        payload: alertObject,
        alertKey: modalObject.payload.createdon,
        secondaryNotification,
      });
    } else {
      dispatchAlerts({
        type: "ADD_ALERT",
        payload: alertObject,
        secondaryNotification,
      });
    }

    hideModal();
  };

  return (
    isVisible && (
      <section className="alertmodal" id="alertmodal" ref={modalRef}>
        <h2 className="alertmodal__title">{`${modalObject.type === "create" ? "Create" : "Update"} Alert`}</h2>
        <i className="alertmodal__close ri-close-line" onClick={hideModal} />
        <form className="alertmodal__form" data-key="" autoComplete="off" onSubmit={handleSubmit}>
          <div className="alertmodal__form--fields">
            <input
              type="text"
              className="input title"
              name="title"
              id="title"
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
              <span id="modalSymbolPrice" className={`alertmodal__form--price ${priceData.priceColor}`}>
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
            {`${modalObject.type === "create" ? "Create" : "Update"}`}
          </button>
        </form>
      </section>
    )
  );
}

export default React.memo(AlertModal);
