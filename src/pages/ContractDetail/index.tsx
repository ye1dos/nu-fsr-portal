import * as React from "react";
import { observer } from "mobx-react";
import { toJS } from "mobx";
import { RouteComponentProps, Link } from "react-router-dom";
import { AppStateObserver, injectAppState } from "../../stores";
import Loader from "react-loader-spinner";
import { format } from "date-fns";
import { enGB, eo, ru } from "date-fns/locale";
import Breadcrumps from "../../components/Breadcrumps";
import FileComponent from "../../components/FileComponent";
import Popup from "reactjs-popup";
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import ExpenseRow from "../../components/ExpenseRow";

import penIcon from "../../assets/icons/pen-icon.svg";
import deleteIcon from "../../assets/icons/delete-icon.svg";
import "./ContractDetail.css";
import i18next from "i18next";
import { Trans } from "react-i18next";

// console.log(penIcon);
export interface ContractDetailProps {}

export interface ContractDetailState {}
@injectAppState
@observer
class ContractDetail extends React.Component<
  AppStateObserver & RouteComponentProps,
  ContractDetailProps,
  ContractDetailState
> {
  state = {
    links: [
      { path: "/cabinet", name: "Личный кабинет" },
      { path: "/contracts", name: "spisokDog" },
      {
        path: `/contract/${this.props.match.params["id"]}`,
        name: "Мой договор",
      },
    ],
    tabs: [
      { name: "План расходов", active: true },
      { name: "Факт расходов", active: false },
      { name: "Отчеты и документы", active: false },
    ],
    reportIndex: -1,
    expenseRegisterIndex: -1,
    activeTab: 0,
  };
  componentDidMount() {
    const id = this.props.match.params["id"];
    this.props.appState.contractsStore.loadEntity(id);
    this.props.appState.contractsStore.loadExpenseRegister(id);
  }

  loadFile = (id) => {
    return this.props.appState.filesStore.downloadFile(id);
  };

  capitalize(string) {
    return string.charAt(0) + string.slice(1).toLowerCase();
  }
  handleTabClick = (index) => {
    let tabs = [...this.state.tabs];

    for (let i = 0; i < tabs.length; i++) {
      tabs[i].active = false;
      if (i === index) tabs[i].active = true;
    }

    this.setState({ tabs, activeTab: index });
  };
  handleInputChange = (event, index) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    const reports = [...this.props.appState.contractsStore.contract.reports];
    let form = reports[index];
    form[name] = value;
  };
  handleRegisterInputChange = (event, index) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    console.log(name);
    console.log(value);
    const expenseRegister = [
      ...this.props.appState.contractsStore.expenseRegister,
    ];
    let form = expenseRegister[index];
    form[name] = value;
  };
  handleInputDateChange = (event, index) => {
    const value = event.target.value;
    const name = event.target.name;
    const reports = this.props.appState.contractsStore.contract.reports;
    let form = reports[index];
    form[name] = value;
  };
  handleRegisterInputDateChange = (event, index) => {
    const value = event.target.value;
    const name = event.target.name;
    const expenseRegister = this.props.appState.contractsStore.expenseRegister;
    let form = expenseRegister[index];
    form[name] = value;
  };
  handleFileChange = (files) => {
    let file;

    if (files[0]) {
      console.log(files[0]);
      this.props.appState.filesStore.uploadFile(files[0]).then((response) => {
        file = response.data;
        this.props.appState.contractsStore.contract.reports[
          this.state.reportIndex
        ].scan = file;
      });
    }
  };

  handleExpenseFileChange = (files) => {
    let file;
    let bill;
    const expenseRegister = this.props.appState.contractsStore.expenseRegister[
      this.state.expenseRegisterIndex
    ];
    if (files[0]) {
      console.log(files[0]);
      this.props.appState.filesStore.uploadFile(files[0]).then((response) => {
        file = response.data;
        bill = {
          scan: file,
          registerExpense: expenseRegister,
        };
        this.props.appState.contractsStore
          .updateRegisterExpenseBill(bill)
          .then((res) => {
            let newBill = res;
            newBill.scan = file;
            expenseRegister.bill.push(newBill);
          });

        // console.log(toJS(expenseRegister));
      });
    }
  };

  editReport = (index) => {
    this.setState({ reportIndex: index });
  };
  deleteReport = (index) => {
    this.props.appState.contractsStore.contract.reports.splice(index, 1);
  };
  editExpense = (index) => {
    this.setState({ expenseRegisterIndex: index });
  };
  confirmExpense = (index) => {
    this.setState({ expenseRegisterIndex: -1 });
  };
  handleExpenseRowOutClick = () => {};
  deleteExpense = (index) => {
    const expense = this.props.appState.contractsStore.expenseRegister[index];
    if (expense.id) {
      this.props.appState.contractsStore.deleteExpenseRegister(expense.id);
    }

    this.props.appState.contractsStore.expenseRegister.splice(index, 1);
  };
  addReport = () => {
    let date = new Date();
    let contractId = this.props.appState.contractsStore.contract.id;
    this.props.appState.contractsStore.contract.reports.push({
      name: "Отчет",
      date: date.toISOString().slice(0, 10),
      contract: {
        id: contractId,
      },
    });
    let index = this.props.appState.contractsStore.contract.reports.length - 1;
    this.setState({ reportIndex: index });
  };
  addExpenseRegister = async () => {
    const { expenseItems, currencies } = this.props.appState.contractsStore;
    let date = new Date();

    let expense = {
      amount: 0,
      billingDate: date.toISOString().slice(0, 10),
      dateRegistered: date.toISOString().slice(0, 10),
      approved: false,
      name: "Отчет",
      date: date.toISOString().slice(0, 10),
      currencyName: currencies[0].name,
      itemName: expenseItems[0].name,
      bill: [],
      expenseItem: expenseItems[0],
      currency: currencies[0],
      contract: { id: this.props.match.params["id"] },
      rateKZT: 0,
      id: "",
    };

    try {
      const res = await this.props.appState.contractsStore.updateExpenseRegister(
        expense
      );
      expense.id = res.id;
      console.log(toJS(expense));
      this.props.appState.contractsStore.expenseRegister.push(expense);
      let index = this.props.appState.contractsStore.expenseRegister.length - 1;
      console.log(index);
      this.setState({ expenseRegisterIndex: index });
      // this.props.appState.contractsStore.expenseRegister.push(res);
    } catch (error) {
      console.log(error);
    }
  };
  handleDateChange = (date) => {
    this.props.appState.contractsStore.contract.reports[
      this.state.reportIndex
    ].date = date;
  };
  handleExpenseItemChange = (event, index) => {
    const itemName = event.target.value;
    const expenses = this.props.appState.contractsStore.expenseRegister;
    expenses[index].itemName = itemName;
  };
  handleCurrencyChange = (event, index) => {
    const expenses = this.props.appState.contractsStore.expenseRegister;
    let form = expenses[index];
    const currencyName = event.target.value;
    form.currencyName = currencyName;
  };
  sendContract = () => {
    const contract = this.props.appState.contractsStore.contract;
    if (this.state.activeTab === 1) {
      this.saveExpenseRegister();
    } else if (this.state.activeTab === 2) {
      this.props.appState.contractsStore.updateContract(contract);
    }
  };
  saveExpenseRegister = () => {
    return (async () => {
      let expenses = await this.createExpenses();
      return expenses;
    })();
  };
  createExpenses = () => {
    const expenses = this.props.appState.contractsStore.expenseRegister;
    const { expenseItems, currencies } = this.props.appState.applicationsStore;
    let f = async () => {
      let result = [];
      for (let i = 0; i < expenses.length; i++) {
        let expense = expenses[i];
        for (let j = 0; j < expenseItems.length; j++) {
          const item = expenseItems[j];
          if (expense.itemName === "") {
            expense.expenseItem = expenseItems[0];
            break;
          }
          if (expense.itemName === item.name) {
            expense.expenseItem = item;
            break;
          }
        }
        for (let k = 0; k < currencies.length; k++) {
          const currency = currencies[k];
          if (expense.currencyName === "") {
            expense.currency = currencies[0];
            break;
          }
          if (expense.currencyName === currency.name) {
            expense.currency = currency;
            break;
          }
        }
        // delete expense.itemName;
        // delete expense.currencyName;
        expense.contract = { id: this.props.match.params["id"] };
        expense.rateKZT = 0;
        try {
          const res = await this.props.appState.contractsStore.updateExpenseRegister(
            expense
          );
          result.push(expense);
        } catch (error) {
          console.log(error);
        }
      }
      if (result.length === expenses.length) {
        toast.success(i18next.t("Success"), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      } else {
        toast.error(i18next.t("Error"), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
      return result;
    };
    return f();
  };
  render() {
    const { links } = this.state;
    return (
      <React.Fragment>
        <Breadcrumps links={links} />
        <h1 className="page-title">Мой договор</h1>
        <div className="contract__wrapper">{this.renderContract()}</div>
      </React.Fragment>
    );
  }
  renderContract() {
    const { contract, isLoadingContract } = this.props.appState.contractsStore;
    const { tabs } = this.state;
    if (isLoadingContract) {
      return (
        <div className="loader-container">
          <Loader
            type="Triangle"
            color="#209898"
            height={200}
            width={200}
            timeout={15000}
          />
        </div>
      );
    }
    if (contract) {
      return (
        <React.Fragment>
          <div className="contract__container">
            <div className="contract__left">
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <th className="contract__key">Конкурс</th>
                    <td className="contract__value">
                      {contract.competition.competitionType.name}
                    </td>
                  </tr>
                  <tr>
                    <th className="contract__key">Обучающийся</th>
                    <td className="contract__value">
                      {this.capitalize(contract.applicant.firstname)}{" "}
                      {this.capitalize(contract.applicant.lastname)}
                    </td>
                  </tr>
                  <tr>
                    <th className="contract__key">Номер договора</th>
                    <td className="contract__value">
                      {contract.contractNumber}
                    </td>
                  </tr>
                  {contract.company && (
                    <tr>
                      <th className="contract__key">Организация</th>
                      <td className="contract__value">
                        {contract.company.name}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <th className="contract__key">Общая сумма</th>
                    <td className="contract__value">{contract.amount} тенге</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="contract__right">
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr style={{ marginTop: "23px" }}>
                    <th className="contract__key">Дата начала обучения</th>
                    <td className="contract__value">
                      {contract.startStudyDate}
                    </td>
                  </tr>
                  <tr style={{ marginTop: "23px" }}>
                    <th className="contract__key">Дата окончания обучения</th>
                    <td className="contract__value">{contract.endStudyDate}</td>
                  </tr>
                  <tr style={{ marginTop: "23px" }}>
                    <th className="contract__key">Дата начала отработки</th>
                    <td className="contract__value">
                      {contract.startAdjustmentDate}
                    </td>
                  </tr>
                  <tr style={{ marginTop: "23px" }}>
                    <th className="contract__key">Дата окончания отработки</th>
                    <td className="contract__value">
                      {contract.endAdjustmentDate}
                    </td>
                  </tr>
                  <tr>
                    <th className="contract__key">Дата подписания</th>
                    <td className="contract__value">{contract.dateSigned}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {contract.scan && (
            <div className="contract__scan">
              <p>Скан копия</p>
              <FileComponent
                id={contract.scan.id}
                name={contract.scan.name}
                extension={contract.scan.extension}
                getFile={this.loadFile}
                withDownloadIcon={true}
                withFileIcon={true}
              />
            </div>
          )}

          <div className="contract-table__container">
            <div className="contract-table__tabs">
              {tabs.map((tab, index) => (
                <div
                  className={this.renderTabClass(tab)}
                  key={index}
                  onClick={() => this.handleTabClick(index)}
                >
                  {i18next.t(tab.name)}
                </div>
              ))}
            </div>
            <div className="contract-table__body">
              <table className="contract-table">
                {this.renderTable(contract)}
              </table>
            </div>
            {this.renderAddButton()}
            {this.state.activeTab !== 0 && (
              <div className="application-form__footer">
                <Popup
                  trigger={
                    <button className="contract-send__button">Отправить</button>
                  }
                  modal
                  closeOnDocumentClick
                >
                  {(close) => (
                    <div className="modal">
                      <div className="modal__header">
                        <h1><Trans>Confirmation</Trans></h1>
                      </div>
                      <div className="modal__content">
                        Вы действительно закончили ввод необходимых данных и
                        готовы отправить их на рассмотрение в ФСР?
                      </div>
                      <div className="modal__actions">
                        <button
                          className="confirm-button"
                          onClick={() => {
                            close();
                            this.sendContract();
                          }}
                        >
                          Да
                        </button>
                        <button className="cancel-button" onClick={close}>
                          <Trans>Cancel</Trans>
                        </button>
                      </div>
                    </div>
                  )}
                </Popup>
              </div>
            )}
          </div>
        </React.Fragment>
      );
    }
  }
  renderTable(contract) {
    const { activeTab, expenseRegisterIndex } = this.state;
    const {
      expenseRegister,
      expenseItems,
      currencies,
    } = this.props.appState.contractsStore;
    switch (activeTab) {
      case 0:
        return (
          <React.Fragment>
            <thead>
            <tr>
                  <th style={{ minWidth: "367px", width: "367px" }}>
                    <Trans>statyaRashodov</Trans>
                  </th>
                  <th><Trans>Sum</Trans></th>
                  <th><Trans>Currency</Trans></th>
                </tr>
            </thead>
            <tbody>
              {contract.expense.map((expense, idx) => (
                <tr key={idx}>
                  <td>{expense.item ? expense.item.name : ""}</td>
                  <td>{expense.total}</td>
                  <td>{expense.currency ? expense.currency.name : ""}</td>
                </tr>
              ))}
            </tbody>
          </React.Fragment>
        );
      case 1:
        return (
          <React.Fragment>
            <thead>
              <tr>
                <th style={{ minWidth: "367px", width: "367px" }}>
                  Статья расходов
                </th>
                <th>Сумма</th>
                <th>Валюта</th>
                <th>Дата выставления счета</th>
                <th>Дата оплаты</th>
                <th>Одобренный</th>
                <th>Скан-копия</th>
              </tr>
            </thead>
            <tbody>
              {expenseRegister.map((expense, idx) => (
                <ExpenseRow
                  expense={expense}
                  index={idx}
                  editIndex={expenseRegisterIndex}
                  key={idx}
                  expenseItems={expenseItems}
                  currencies={currencies}
                  handleExpenseItemChange={this.handleExpenseItemChange}
                  handleRegisterInputChange={this.handleRegisterInputChange}
                  handleCurrencyChange={this.handleCurrencyChange}
                  handleRegisterInputDateChange={
                    this.handleRegisterInputDateChange
                  }
                  handleExpenseFileChange={this.handleExpenseFileChange}
                  onOutClick={this.handleExpenseRowOutClick}
                  editExpense={this.editExpense}
                  deleteExpense={this.deleteExpense}
                  confirmExpense={this.confirmExpense}
                  loadFile={this.loadFile}
                />
              ))}
            </tbody>
          </React.Fragment>
        );
      case 2:
        return (
          <React.Fragment>
            <thead>
              <tr>
                <th>Название</th>
                <th>Дата</th>
                <th>Информация</th>
                <th>Приложение</th>
              </tr>
            </thead>
            <tbody>
              {contract.reports.map((report, idx) => {
                if (idx === this.state.reportIndex) {
                  return (
                    <tr key={idx}>
                      <td>
                        <input
                          defaultValue={report.name}
                          name="name"
                          onChange={(event) =>
                            this.handleInputChange(event, idx)
                          }
                        />
                      </td>
                      <td>
                        <InputMask
                          defaultValue={report.date}
                          name="date"
                          onChange={(event) =>
                            this.handleInputDateChange(event, idx)
                          }
                          mask="9999-99-99"
                          maskChar=" "
                        />
                      </td>
                      <td>
                        <input
                          defaultValue={report.info}
                          name="info"
                          onChange={(event) =>
                            this.handleInputChange(event, idx)
                          }
                        />
                      </td>
                      <td>
                        <div className="last-column">
                          {report.scan && (
                            <FileComponent
                              id={report.scan.id}
                              name={report.scan.name}
                              extension={report.scan.extension}
                              key={report.id}
                              getFile={this.loadFile}
                            />
                          )}
                          <div className="inputfile__container">
                            <label htmlFor={`inputfile-report-${idx}`}>
                              <Trans>ChooseFile</Trans>
                            </label>
                            <input
                              type="file"
                              onChange={(e) =>
                                this.handleFileChange(e.target.files)
                              }
                              id={`inputfile-report-${idx}`}
                            />
                          </div>

                          <div className="contract-edit-actions">
                            <button onClick={() => this.deleteReport(idx)}>
                              Удалить
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                } else {
                  return (
                    <tr key={idx}>
                      <td>{report.name}</td>
                      <td>{report.date}</td>
                      <td>{report.info}</td>
                      <td>
                        <div className="last-column">
                          {report.scan && (
                            <FileComponent
                              id={report.scan.id}
                              name={report.scan.name}
                              extension={report.scan.extension}
                              key={report.id}
                              getFile={this.loadFile}
                            />
                          )}
                          {!report.scan && <p>Скан не прикреплен</p>}
                        </div>
                        {report.show && (
                          <div className="contract-edit-actions">
                            <button onClick={() => this.editReport(idx)}>
                              Изменить
                            </button>
                            <button onClick={() => this.deleteReport(idx)}>
                              Удалить
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </React.Fragment>
        );
    }
  }
  renderAddButton() {
    const { activeTab } = this.state;
    switch (activeTab) {
      case 1:
        return (
          <div className="add-expense__container">
            <button className="add-expense" onClick={this.addExpenseRegister}>
            <Trans>Add</Trans>
            </button>
          </div>
        );
      case 2:
        return (
          <div className="add-expense__container">
            <button className="add-expense" onClick={this.addReport}>
              <Trans>Add</Trans>
            </button>
          </div>
        );
    }
  }
  renderTabClass(tab) {
    let className = "contract-table__tab";
    if (tab.active) className += " active";
    return className;
  }
}

export default ContractDetail;
