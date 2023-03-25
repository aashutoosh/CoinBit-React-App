import React, { useEffect, useRef, useState } from "react";
import { getFromLocalStorage } from "../../utils/localStorageUtils";
import "./alertSection.scss";

function Heading({ tabChange }) {
  const pendingTab = useRef(null);
  const triggeredTab = useRef(null);

  const tabChangeHandler = (event) => {
    const isPendingType = event.target.classList.contains("alerts__title--pending");
    if (isPendingType) {
      triggeredTab.current.classList.remove("active");
      pendingTab.current.classList.add("active");
      tabChange("pending");
    } else {
      pendingTab.current.classList.remove("active");
      triggeredTab.current.classList.add("active");
      tabChange("triggered");
    }
  };

  return (
    <div className="heading">
      <div className="heading__window">
        <h2 className="alerts__title alerts__title--pending active" onClick={tabChangeHandler} ref={pendingTab}>
          <i className="ri-eye-line" />
          Pending
        </h2>
        <h2 className="alerts__title alerts__title--triggered" onClick={tabChangeHandler} ref={triggeredTab}>
          <i className="ri-eye-close-line" />
          Triggered
        </h2>
      </div>
      <button className="alerts__create--button text">Create Alert</button>
      <button className="alerts__create--button icon">
        <i className="ri-add-line" />
      </button>
    </div>
  );
}

function AlertRow({ alert, pendingAlertsType }) {
  return (
    <tr className="row" data-key={alert.createdon}>
      <td>
        <div className="textContent">
          <span className="title">{alert.title}</span>
          <span className="description">{alert.description}</span>
        </div>
      </td>
      <td>
        <div className="control__buttons">
          {pendingAlertsType && <i className="control__buttons--edit ri-pencil-line"></i>}
          <i className="control__buttons--delete ri-close-line"></i>
        </div>
      </td>
      <td>
        <span className="symbol">{alert.symbol}</span>
        {pendingAlertsType && <span className="ltp green">0.00</span>}
      </td>
      <td>
        <span>{alert.condition}</span>
      </td>
      <td>{alert.price}</td>
    </tr>
  );
}

function Table({ allAlerts, alertsType }) {
  const pendingAlertsType = alertsType === "pending";

  return (
    <div className="table__container">
      <table className="alerts__table">
        <thead>
          <tr>
            <th>Name</th>
            <th />
            <th>Symbol</th>
            <th>Condition</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody className="alerts__table--tbody">
          {allAlerts.map((alert) => (
            <AlertRow key={alert.createdon} alert={alert} pendingAlertsType={pendingAlertsType} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyText() {
  return (
    <div className="alerts__empty show">
      <i className="ri-error-warning-line" />
      <span>To create an alert, please add symbols to your watchlist.</span>
    </div>
  );
}

export default function AlertSection({ createAlert }) {
  const [allAlerts, setAllAlerts] = useState([]);
  const [alertsType, setAlertsType] = useState("pending");
  console.log("alertSection");

  useEffect(() => {
    console.log("useEffect");
    if (alertsType === "pending") {
      setAllAlerts(getFromLocalStorage("pendingAlerts") || []);
    } else {
      setAllAlerts(getFromLocalStorage("triggeredAlerts") || []);
    }
  }, [alertsType]);

  return (
    <section className="alerts rightside showsection" id="alerts">
      <Heading tabChange={(tabType) => setAlertsType(tabType)} />
      <Table allAlerts={allAlerts} alertsType={alertsType} />
      {allAlerts.length === 0 && alertsType === "pending" && <EmptyText />}
    </section>
  );
}
