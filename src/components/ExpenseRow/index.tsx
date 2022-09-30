import * as React from "react";
import ReactDOM from "react-dom";
import Popup from "reactjs-popup";
import InputMask from "react-input-mask";
// import onClickOutside from "react-onclickoutside";
import FileComponent from "../../components/FileComponent";
import { AppStateObserver, injectAppState } from "../../stores";
import { observer } from "mobx-react";
import { toJS } from "mobx";

import penIcon from "../../assets/icons/pen-icon.svg";
import deleteIcon from "../../assets/icons/delete-icon.svg";
import okIcon from "../../assets/icons/ok-icon.svg";
import { Trans } from "react-i18next";

export interface ExpenseRowProps {
  expense;
  index;
  editIndex;
  expenseItems;
  currencies;
  handleExpenseItemChange;
  handleRegisterInputChange;
  handleCurrencyChange;
  handleRegisterInputDateChange;
  handleExpenseFileChange;
  deleteExpense;
  editExpense;
  confirmExpense;
  loadFile;
  onOutClick;
}

export interface ExpenseRowState {}

@injectAppState
@observer
class ExpenseRow extends React.Component<ExpenseRowProps, ExpenseRowState> {
  state = {};

  //   handleClickOutside = () => {
  //     this.props.onOutClick();
  //   };

  render() {
    const { expense, index } = this.props;
    return <React.Fragment>{this.renderRow(expense, index)}</React.Fragment>;
  }
  renderRow = (expense, index) => {
    const {
      editIndex,
      expenseItems,
      currencies,
      handleExpenseItemChange,
      handleRegisterInputChange,
      handleCurrencyChange,
      handleRegisterInputDateChange,
      handleExpenseFileChange,
      deleteExpense,
      editExpense,
      confirmExpense,
    } = this.props;
    if (index === editIndex) {
      return (
        <tr key={index} ref={`expense-row-${index}`}>
          <td>
            <select
              value={expense.itemName}
              onChange={(event) => handleExpenseItemChange(event, index)}
            >
              {expenseItems.map((item, index) => {
                return (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </td>
          <td>
            <input
              value={expense.amount}
              className="expense-plan__input"
              type="number"
              name="amount"
              onChange={(event) => handleRegisterInputChange(event, index)}
            />
          </td>
          <td>
            <select
              value={expense.currencyName}
              onChange={(event) => handleCurrencyChange(event, index)}
            >
              {currencies.map((currency, index) => {
                return (
                  <option key={index} value={currency.name}>
                    {currency.name}
                  </option>
                );
              })}
            </select>
          </td>
          <td>
            <InputMask
              defaultValue={expense.billingDate}
              name="billingDate"
              onChange={(event) => handleRegisterInputDateChange(event, index)}
              mask="9999-99-99"
              maskChar=" "
              className="general-info__input"
            />
          </td>
          <td>
            <InputMask
              defaultValue={expense.dateRegistered}
              name="dateRegistered"
              onChange={(event) => handleRegisterInputDateChange(event, index)}
              mask="9999-99-99"
              maskChar=" "
              className="general-info__input"
            />
          </td>
          <td>{expense.approved ? "да" : "нет"}</td>
          <td>
            <div className="last-column">
              <div className="bill__container">
                {this.renderBill(expense.bill)}
              </div>

              <div className="inputfile__container expense-inputfile__container">
                <Popup trigger={<label>Загрузить скан</label>} modal>
                  {(close) => (
                    <div className="modal">
                      <div className="modal__content">
                        <label htmlFor={`inputfile-bill-${index}`}>
                        <Trans>ChooseFile</Trans>
                        </label>
                        <input
                          type="file"
                          onChange={(e) =>
                            handleExpenseFileChange(e.target.files)
                          }
                          id={`inputfile-bill-${index}`}
                        />
                        <div className="bill__container_modal">
                          {this.renderBill(expense.bill)}
                        </div>
                      </div>
                      <div className="modal__actions">
                        <button
                          className="confirm-button"
                          onClick={() => {
                            close();
                          }}
                        >
                          Да
                        </button>
                        <button
                          className="cancel-button"
                          onClick={() => {
                            close();
                          }}
                        >
                          <Trans>Cancel</Trans>
                        </button>
                      </div>
                    </div>
                  )}
                </Popup>
              </div>
              <div className="contract-edit-actions">
                <button
                  className="confirm-expense__button"
                  onClick={confirmExpense}
                >
                  <span>OK</span>
                  <img src={okIcon} className="ok-icon" />
                </button>
              </div>
            </div>
          </td>
        </tr>
      );
    } else {
      return (
        <tr key={index} ref={`expense-row-${index}`}>
          <td>{expense.itemName}</td>
          <td>{expense.amount}</td>
          <td>{expense.currencyName}</td>
          <td>{expense.billingDate}</td>
          <td>{expense.dateRegistered}</td>
          <td>{expense.approved ? "да" : "нет"}</td>
          <td>
            <div className="last-column">
              <div className="bill__container">
                {this.renderBill(expense.bill)}
              </div>
              {!expense.approved && (
                <div className="contract-edit-actions">
                  <img
                    src={penIcon}
                    className="pen-icon"
                    alt=""
                    onClick={() => editExpense(index)}
                  />
                  <img
                    src={deleteIcon}
                    className="pen-icon"
                    alt=""
                    onClick={() => deleteExpense(index)}
                  />
                </div>
              )}
            </div>
          </td>
        </tr>
      );
    }
  };

  renderBill(bill) {
    const { loadFile } = this.props;
    if (bill && bill.length > 0) {
      return bill.map((bill, idx) => (
        <FileComponent
          id={bill.scan.id}
          name={bill.scan.name}
          extension={bill.scan.extension}
          getFile={loadFile}
          key={idx}
        />
      ));
    } else {
      return <p style={{ marginTop: "13px" }}>Скан не прикреплен</p>;
    }
  }
}

export default ExpenseRow;
