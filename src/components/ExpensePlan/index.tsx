import * as React from "react";
import { format } from "date-fns";
import { enGB, eo, ru } from "date-fns/locale";
import DatePicker from "react-date-picker";
import "./ExpensePlan.css";
import { toJS } from "mobx";
import { Trans } from "react-i18next";

export interface ExpensePlanProps {
  expenses;
  expenseItems;
  expenseItemName;
  expenseForm;
  pays;
  handleExpenseItemChange;
  handleCurrencyChange;
  handleInputChange;
  handlePaysChange;
  handleDateChange;
  handleExpenseDistribute;
  handleNewExpense;
  handleGridAmountChange;
  handleGridDateChange;
  toggleGridChange;
  saveGridChange;
  saveExpense;
  showExpense;
}

export interface ExpensePlanState {}

class ExpensePlan extends React.Component<ExpensePlanProps, ExpensePlanState> {
  state = {};
  render() {
    const {
      expenses,
      expenseItems,
      expenseItemName,
      expenseForm,
      pays,
      showExpense
    } = this.props;

    if (expenseItems) {
      return (
        <React.Fragment>
          <h1 className="expense-plan__header">План расходов</h1>
          <div className="expenses__container">
            {expenses.map((exp, idx) => (
              <div className="expense__item" key={idx}>
                <div className="expense__item_v">{exp.item.name}</div>
                <div className="expense__item_k">
                  {exp.cost} {exp.currency}
                </div>
              </div>
            ))}
          </div>
          {showExpense ? (
            <div className="expese-plan__wrapper">
              <div className="expense-plan__item">
                <p>Статья расходов</p>
                <select
                  value={expenseItemName}
                  onChange={event => this.props.handleExpenseItemChange(event)}
                >
                  {expenseItems.map(item => {
                    return (
                      <option
                        value={JSON.stringify(item)}
                        data-id={item.id}
                        key={item.id}
                      >
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="expense-plan__item">
                <p>Валюта</p>
                <select
                  value={expenseForm.currency}
                  onChange={this.props.handleCurrencyChange}
                >
                  <option value="USD">USD</option>
                  <option value="KZT">KZT</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div className="expense-plan__item">
                <p>Курс в KZT</p>
                <input
                  type="number"
                  value={expenseForm.rateKZT}
                  name="rateKZT"
                  onChange={this.props.handleInputChange}
                  className="expense-plan__input"
                />
              </div>
              <div className="expense-plan__item">
                <p>Процент</p>
                <input
                  type="number"
                  value={expenseForm.percent}
                  name="percent"
                  onChange={this.props.handleInputChange}
                  className="expense-plan__input"
                />
              </div>
              <div className="expense-plan__item">
                <div className="expense-plan__computation">
                  <p>Сумма</p>
                  <input
                    value={expenseForm.cost}
                    className="expense-plan__input"
                    type="number"
                    name="cost"
                    onChange={this.props.handleInputChange}
                  />
                </div>
                <div className="expense-plan__computation">
                  <p>Количество выплат</p>
                  <input
                    className="expense-plan__input"
                    type="number"
                    value={pays.amount}
                    name="amount"
                    onChange={this.props.handlePaysChange}
                  />
                </div>
                <div className="expense-plan__computation">
                  <p>Промежуток</p>
                  <input
                    className="expense-plan__input"
                    type="number"
                    value={pays.interval}
                    name="interval"
                    onChange={this.props.handlePaysChange}
                  />
                </div>
                <div className="expense-plan__computation">
                  <div className="expense-plan__period">
                    <input
                      type="radio"
                      value={pays.intervalName}
                      name="intervalName"
                      onChange={this.props.handlePaysChange}
                      data-name="years"
                    />
                    <p>Год</p>
                  </div>
                  <div className="expense-plan__period">
                    <input
                      type="radio"
                      value={pays.intervalName}
                      name="intervalName"
                      onChange={this.props.handlePaysChange}
                      data-name="months"
                    />
                    <p>Месяц</p>
                  </div>
                </div>
                <div className="expense-plan__computation">
                  <p>Начало выплат</p>
                  <DatePicker
                    onChange={this.props.handleDateChange}
                    value={pays.startDate}
                  />
                </div>
                <div className="expense-plan__computation__submit">
                  <button
                    className="apply-button"
                    onClick={this.props.handleExpenseDistribute}
                  >
                    Распределить
                  </button>
                </div>
              </div>
              <div className="expense-plan__item">
                <div className="expense-plan__grid__container">
                  <h1 className="expense-plan__grid__header">Сетка расходов</h1>
                  <div className="expanse-plan__grid__headings">
                    <p className="expanse-plan__grid__item">Плановая дата</p>
                    <p className="expanse-plan__grid__item">Плановая сумма</p>
                  </div>
                  {this.renderGrid()}
                </div>
              </div>
              <div className="expense-plan__item">
                <p>ИПН</p>
                <label className="expense-plan__label">{expenseForm.pit}</label>
              </div>
              <div className="expense-plan__item">
                <p>Общая сумма</p>
                <label className="expense-plan__label">
                  {expenseForm.total}
                </label>
              </div>
              <div className="expense-plan__item">
                <button
                  className="apply-button"
                  onClick={this.props.saveExpense}
                >
                  <Trans>Save</Trans>
                </button>
              </div>
            </div>
          ) : (
            <button
              className="apply-button"
              onClick={this.props.handleNewExpense}
            >
              Создать
            </button>
          )}
        </React.Fragment>
      );
    }
  }
  renderGrid() {
    
    const {
      handleGridAmountChange,
      handleGridDateChange,
      toggleGridChange,
      saveGridChange
    } = this.props;
    if (this.props.expenseForm.grid) {
      console.log(this.props.expenseForm.grid);
      let grids = this.props.expenseForm.grid.map((grid, idx) => {
        if (!grid.canChange) {
          return (
            <div className="expanse-plan__grid" key={idx}>
              <p>
              {console.log(toJS(grid))}
                {grid.planDate
                  ? format(Date.parse(grid.planDate), "dd MMMM u", {
                      locale: ru
                    })
                  : ""}
              </p>
              <p className="expanse-plan__grid__item">{grid.planAmount}</p>
              <button
                className="expense-plan__grid__edit"
                onClick={() => toggleGridChange(idx)}
              >
                Изменить
              </button>
            </div>
          );
        } else {
          return (
            <div className="expanse-plan__grid" key={idx}>
              <DatePicker
                onChange={event => handleGridDateChange(event, idx)}
                value={grid.planDate}
              />
              <input
                type="number"
                value={grid.planAmount}
                onChange={event => handleGridAmountChange(event, idx)}
              />
              <button onClick={() => saveGridChange(idx)}><Trans>Save</Trans></button>
            </div>
          );
        }
      });
      return grids;
    }
  }
}

export default ExpensePlan;
