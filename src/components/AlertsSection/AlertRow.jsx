import React, { useRef } from 'react';
import { ariaSymbolName } from '../../utils/helper';

export default function AlertRow({ alert, pendingAlertsType, actionHandler, tableData }) {
  const rowRef = useRef(null);
  const editButtonRef = useRef(null);
  const deleteButtonRef = useRef(null);

  const editButtonHandler = () => actionHandler('edit', alert);
  const deleteButtonHandler = () => actionHandler('delete', alert);

  const editKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      editButtonHandler();
    }
  };
  const deleteKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      deleteButtonHandler();
    }
  };

  return (
    <tr className="row" data-key={alert.createdon} tabIndex={0} ref={rowRef}>
      <td>
        <div className="textContent">
          <span className="title">{alert.title}</span>
          <span className="description">{alert.description}</span>
        </div>
      </td>
      <td>
        <div className="control__buttons">
          {pendingAlertsType && (
            <i
              ref={editButtonRef}
              tabIndex={0}
              role="button"
              className="control__buttons--edit ri-pencil-line"
              onClick={editButtonHandler}
              onKeyDown={editKeyDown}
              aria-label="Edit alert"
            />
          )}
          <i
            ref={deleteButtonRef}
            tabIndex={0}
            role="button"
            className="control__buttons--delete ri-close-line"
            onClick={deleteButtonHandler}
            onKeyDown={deleteKeyDown}
            aria-label="Delete alert"
          />
        </div>
      </td>
      <td>
        <span className="symbol" aria-label={ariaSymbolName(alert.symbol)}>
          {alert.symbol}
        </span>
        {pendingAlertsType && (
          <span className={`ltp ${tableData[alert.symbol]?.priceColor}`}>
            {tableData[alert.symbol]?.price}
          </span>
        )}
      </td>
      <td>
        <span>{alert.condition}</span>
      </td>
      <td>{alert.price}</td>
    </tr>
  );
}
