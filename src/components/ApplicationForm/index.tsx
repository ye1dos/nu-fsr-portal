import * as React from "react";
import {
  Link,
  RouteComponentProps,
  RouteProps,
  RouteChildrenProps,
} from "react-router-dom";
import { toJS } from "mobx";
import { AppStateObserver, injectAppState } from "../../stores";
import { observer } from "mobx-react";
import FileComponent from "../../components/FileComponent";
import { toast } from "react-toastify";
import InputMask from "react-input-mask";
import Loader from "react-loader-spinner";

import deleteIcon from "../../assets/icons/delete-icon.svg";
import "./ApplicationForm.css";
import { Trans } from "react-i18next";
import i18next from "i18next";

export interface ApplicationFormProps {
  espFile;
  password;
  documents;
  competitionId;
  tabs;
  mounted;
  directions;
}

export interface ApplicationFormState {}

@injectAppState
@observer
class ApplicationForm extends React.Component<
  AppStateObserver & ApplicationFormProps,
  ApplicationFormState
> {
  state = {
    application: {},
    docFirst: [],
    programs: [],
    tabs: this.props.tabs,
    mounted: this.props.mounted,
    activeTab: 0,
    expenseItemName: "",
    expenseItem: {
      name: "",
      id: "",
    },
    expenses: [],
    expenseForm: {
      item: {},
      itemName: "",
      currency: {},
      currencyName: "",
      rateKZT: 0,
      percent: 0,
      pit: 0,
      total: 0,
      totalKZT: 0,
      cost: 0,
      grid: [],
    },
    experiences: [],
    experienceForm: {
      email: "",
      iin: null,
      firstName: "",
      lastName: "",
      middleName: "",
      workExperience: null,
      role: ""
    },
    stateId: "",
    university: "",
    school: "",
    department: "",
    startStudyDate: "",
    endStudyDate: "",
    requestedAmount: null,
    directionId: "",
    fileLoading: {
      type: null,
      owner: null,
    },
    directions: []
  };

  loadFile = (id) => {
    return this.props.appState.filesStore.downloadFile(id);
  };


  // componentDidUpdate (prevProps, prevState) {
  //  // compare props
  //   if (prevProps.mounted !== this.props.mounted) {
  //     this.setState({
  //       mounted: this.props.mounted,
  //       tabs: this.props.tabs
  //     })
  //   }
  // };

  handleFileChange = (files, docType, docOwner) => {
    this.setState({
      fileLoading: { type: docType.name, owner: docOwner.name },
    });
    let file;
    let docFirst = [...this.state.docFirst];

    for (let i = 0; i < docFirst.length; i++) {
      if (
        docFirst[i].docType.name === docType.name &&
        docFirst[i].docOwner.name === docOwner.name
      ) {
        docFirst.splice(i, 1);
      }
    }

    if (files[0]) {
      console.log(files[0]);
      this.props.appState.filesStore
        .uploadFile(files[0])
        .then((response) => {
          file = response.data;
          docFirst = this.checkDocuments(
            files,
            file,
            docFirst,
            docType,
            docOwner
          );
          this.setState({ docFirst });
          this.setState({ fileLoading: { type: null, owner: null } });
          console.log(docFirst);
        })
        .catch((error) => {
          this.setState({ fileLoading: { type: null, owner: null } });
          toast.error(i18next.t("Error"), {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          console.log(error);
        });
    }

    //this.props.appState.applicationsStore.application.docFirst = documents;
  };

  checkDocuments(files, file, list, type, owner) {
    if (files.length !== 0) {
      let myDocument = {
        file: file,
        name: file.name,
        docType: type,
        docOwner: owner,
        applicant: this.props.appState.applicantsStore.applicant,
      };

      list.push(myDocument);
    }
    return list;
  }

  sendApplication = () => {
    (async () => {
      let application = await this.saveApplication();
      this.props.appState.applicationsStore
        .sendApplication(application)
        .then((res) => {
          console.log(res);
        });
    })();
  };

  saveApplication = () => {
    this.props.appState.applicationsStore.isApplicationSaving = true;
    return (async () => {
      let programs = this.state.programs.map((program) => JSON.parse(program));
      let expenses = await this.createExpenses();
      let docFirst = await this.createDocs();
      const { states } = this.props.appState.applicationsStore;
      const { directions } = this.props;
      // console.log(expenses);
      console.log(docFirst);
      const {
        stateId,
        university,
        school,
        department,
        startStudyDate,
        endStudyDate,
        directionId,
        requestedAmount,
        experiences
      } = this.state;
      let applicant = {
        id: this.props.appState.applicantsStore.applicant.id,
      };
      let competition = {
        id: this.props.appState.competitionsStore.competition.id,
      };

      let applicationState;
      for (let i = 0; i < states.length; i++) {
        const state = states[i];
        if (stateId === "") {
          applicationState = states[0];
        }
        if (stateId === state.id) {
          applicationState = state;
        }
      }

      let directionState;
      for (let i = 0; i < directions.length; i++ ) {
        const direction = directions[i];
        if(directionId === "") {
          directionState = directions[0];
        }
        if(directionId === direction.id) {
          directionState = direction;
        }
      }

      let application = {
        expense: expenses,
        applicant: applicant,
        competition: competition,
        docFirst: docFirst,
        programs: programs,
        applicationStatus: "NEW",
        university: university ? university : null,
        school: school ? school : null,
        department: department ? department : null,
        startStudyDate: startStudyDate ? startStudyDate : null,
        endStudyDate: endStudyDate ? endStudyDate : null,
        state: applicationState ? applicationState : null,
        direction: directionState ? directionState : null,
        requestedAmount: requestedAmount ? requestedAmount : null,
        teamMembers: experiences ? experiences : null
      };

      if (
        this.props.appState.competitionsStore.competition.status ===
        "COLLECTION_OF_APPLICATION"
      ) {
        this.props.appState.applicationsStore
          .updateEntityService(application, this.props.espFile, this.props.password)
          .then(async(res) => {
            this.props.appState.applicationsStore.loadEntities();
            this.props.appState.applicationsStore.isApplicationSaving = false;
            let result = res as string;
            let status = JSON.parse(result).status;
            let message = JSON.parse(result).message
              ? JSON.parse(result).message
              : i18next.t("Error");
            try {
              let sent_application = await this.props.appState.applicationsStore.loadEntitiesService_forExperience(this.props.competitionId);

              let exp = [];
              for ( let i = 0; i < this.state.experiences.length; i++ ) {
                exp[i] = this.state.experiences[i]
                exp[i].application = {id: sent_application[0].id}
              }
              // exp id putting
              // console.log(exp)
              for( let i = 0; i < exp.length; i++) {
                await this.props.appState.applicationsStore.sendExperiences(exp[i]);
              }
            }
            catch(e) {
            }

              
            if (status === "SUCCESS") {
              toast.success(i18next.t("Success"), {
                position: toast.POSITION.BOTTOM_CENTER,
              });
              this.props.appState.applicationsStore.applicationSaved = true;
              window.location.reload();
            } else if (status === "ERROR") {
              toast.error(message, {
                position: toast.POSITION.BOTTOM_CENTER,
              });
            } else if (status === "WARNING") {
              toast.error(message, {
                position: toast.POSITION.BOTTOM_CENTER,
              });
            }
          })
          .catch((e) => {
            toast.error("Возникла ошибка", {
              position: toast.POSITION.BOTTOM_CENTER,
            });
            this.props.appState.applicationsStore.isApplicationSaving = false;
            throw e;
          });
      } else {
        toast.error("К сожалению вы не уже можете поменять заявку", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
      return application;
    })();
  };

  createExpenses = () => {
    const expenses = [...this.state.expenses];
    const { expenseItems, currencies } = this.props.appState.applicationsStore;
    let f = async () => {
      let result = [];
      for (let i = 0; i < expenses.length; i++) {
        let expense = expenses[i];
        for (let j = 0; j < expenseItems.length; j++) {
          const item = expenseItems[j];
          if (expense.itemName === "") {
            expense.item = expenseItems[0];
            break;
          }
          if (expense.itemName === item.name) {
            expense.item = item;
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
        delete expense.currencyName;
        delete expense.itemName;
        expense.grid = [];
        expense.grid.push({
          planAmount: expense.cost,
          planDate: this.state.endStudyDate,
        });
        result.push(expense);
      }
      return result;
    };
    return f();
  };

  createDocs = () => {
    return (async () => {
      let docFirst = [];
      for (const doc of this.state.docFirst) {
        try {
          let document = await this.props.appState.filesStore.updateDocument(
            doc
          );
          docFirst.push(document);
        } catch (error) {
          console.log(error);
        }
      }
      return docFirst;
    })();
  };


  handleTabClick = (index) => {
    let tabs = [...this.state.tabs];

    for (let i = 0; i < tabs.length; i++) {
      tabs[i].active = false;
      if (i === index) tabs[i].active = true;
    }

    this.setState({ tabs, activeTab: index });
  };

  handleProgramChange = (event) => {
    let checked = event.target.checked;
    let programsSet = new Set([...this.state.programs]);
    let program = {
      name: event.target.dataset.name,
      id: event.target.dataset.id,
    };

    let programStr = JSON.stringify(program);

    if (checked) {
      programsSet.add(programStr);
    } else if (programsSet.has(programStr)) {
      programsSet.delete(programStr);
    }

    const programs = Array.from(programsSet);

    this.setState({ programs });
    //this.props.appState.applicationsStore.entity.programs = x;
  };
  programsChecked = (name) => {
    let checked = false;
    for (let i = 0; i < this.state.programs.length; i++) {
      const program = this.state.programs[i];
      if (JSON.parse(program).name === name) {
        checked = true;
        break;
      }
    }
    return checked;
  };

  handleExpenseItemChange = (event, index) => {
    const itemName = event.target.value;
    const expenses = [...this.state.expenses];
    expenses[index].itemName = itemName;
    this.setState({ expenses });
  };

  handleStateChange = (event) => {
    const stateId = event.target.value;
    this.setState({ stateId });
  };

  handleDirectionChange = (event) => {
    const directionId = event.target.value;
    this.setState({ directionId });
  }

  handleTalapInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.state[name] = value;
  };

  handleSCPInputChange = (event) => {
    const target = event.target;
    let value = target.value;
    const name = target.name;
    this.state[name] = value;
  };

  handleCurrencyChange = (event, index) => {
    const expenses = [...this.state.expenses];
    let form = expenses[index];
    const currencyName = event.target.value;
    form.currencyName = currencyName;
    form.pit = (Number(form.cost) / 100) * form.percent;
    form.total = Number(form.cost) + form.pit;
    this.setState({ expenses });
  };

  handleInputChangeExpenses = (event, index) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    const expenses = [...this.state.expenses];
    let form = expenses[index];
    form[name] = value;

    form.pit = (Number(form.cost) / 100) * form.percent;
    form.total = Number(form.cost) + form.pit;
    this.setState({ expenses });
  };

  addExpense = () => {
    const newExpense = { ...this.state.expenseForm };
    const expenses = [...this.state.expenses];
    expenses.push(newExpense);
    this.setState({ expenses });
  };
  deleteExpense = (index) => {
    let expenses = [...this.state.expenses];
    if (expenses.length > 0) expenses.splice(index, 1);
    this.setState({ expenses });
  };

  handleInputChangeExperience = (event, index) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    const experiences = [...this.state.experiences];
    let form = experiences[index];
    form[name] = value;

    this.setState({ experiences });
  }
  addExperience = () => {
    const newExperience = {...this.state.experienceForm };
    const experiences = [...this.state.experiences];
    experiences.push(newExperience);
    this.setState({ experiences });
  }
  deleteExperience = (index) => {
    let experiences = [...this.state.experiences];
    if (experiences.length > 0) experiences.splice(index, 1);
    this.setState( { experiences });
  }

  render() {
    const { documents } = this.props;
    const { tabs, activeTab, docFirst } = this.state;
    const { states } = this.props.appState.applicationsStore;
    const { directions } = this.props;
    const { language } = this.props.appState.userStore;
    return (
      <React.Fragment>
        <div className="application-form__heading">
          <h2>
            <Trans>Form</Trans>
          </h2>
        </div>
        <div className="application-form__disclaimer">
          <span>!</span>
          <Trans>Please</Trans>
        </div>
        <Link to="/cabinet/personal" className="cabinet-link">
          <Trans>LinkToView</Trans>
        </Link>
        {this.props.appState.competitionsStore.competition.competitionType
          .code === "TLP" && (
          <table className="talap-form">
            <tbody>
              <tr>
                <th>
                  <label htmlFor="">Страна / Штат поступления</label>
                </th>
                <td>
                  <select
                    value={this.state.stateId}
                    onChange={(event) => this.handleStateChange(event)}
                    className="general-info__input__select"
                  >
                    {states.map((state, idx) => {
                      return (
                        <option key={idx} value={state.id}>
                          {state.country}, {state.name}
                        </option>
                      );
                    })}
                  </select>
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor="">Зарубежный ВУЗ / Организация</label>
                </th>
                <td>
                  <input
                    type="text"
                    className="general-info__input"
                    defaultValue={this.state.university}
                    name="university"
                    onChange={this.handleTalapInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor="">Школа / Факультет поступления</label>
                </th>
                <td>
                  <input
                    type="text"
                    className="general-info__input"
                    defaultValue={this.state.school}
                    name="school"
                    onChange={this.handleTalapInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor="">Получаемая степень</label>
                </th>
                <td>
                  <input
                    type="text"
                    className="general-info__input"
                    defaultValue={this.state.department}
                    name="department"
                    onChange={this.handleTalapInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor="">Начало обучения</label>
                </th>
                <td>
                  <InputMask
                    defaultValue={this.state.startStudyDate}
                    name="startStudyDate"
                    onChange={this.handleTalapInputChange}
                    mask="9999.99.99"
                    maskChar=" "
                    className="general-info__input"
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor="">Конец обучения</label>
                </th>
                <td>
                  <InputMask
                    defaultValue={this.state.endStudyDate}
                    name="endStudyDate"
                    onChange={this.handleTalapInputChange}
                    mask="9999.99.99"
                    maskChar=" "
                    className="general-info__input"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {this.props.appState.competitionsStore.competition.competitionType
          .code === "SCP" && (
          <table className="scp-form">
            <tbody>
              <tr>
                <th>
                  <label htmlFor="">Направление</label>
                </th>
                <td>
                  <select
                    value={this.state.directionId}
                    onChange={(event) => this.handleDirectionChange(event)}
                    className="general-info__input__select"
                  >
                    {directions.map((direction, idx) => {
                      return (
                        <option key={idx} value={direction.id}>
                          {direction.name}
                        </option>
                      );
                    })}
                  </select>
                </td>
              </tr>
              <tr>
                <th>
                  <label>Запрашеваемая сумма (в KZT)</label>
                </th>
                <td>
                  <input
                    placeholder="0"
                    defaultValue={this.state.requestedAmount}
                    className="general-info__input"
                    type="number"
                    name="requestedAmount"
                    onChange={this.handleSCPInputChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {documents && documents.length > 0 && (
          <div className="application-form__documents">
            <div className="application-form__headings">
              <p><Trans>DocType</Trans></p>
              <p><Trans>File</Trans></p>
            </div>
            {/* {console.log("documents")}
            {console.log(toJS(documents[0]))} */}
            {documents
                .slice()
                .sort((a, b) => a.docType.name.localeCompare(b.docType.name))
                .map((document, idx) => (
                  <div key={document.id} className="application-form__document">
                    <p>
                      {document.docType && document.docType.name}{" "}
                      {document.mandatory && (
                        <span className="mandatory">*</span>
                      )}
                    </p>
                    <div className="inputfile__container">
                      {this.renderDocFile(document, docFirst)}
                      {this.renderFileLoader(
                        (document.docType && document.docType.name) || null,
                        (document.docOwner && document.docOwner?.name) || null
                      )}
                      <label
                        htmlFor={`inputfile-${idx}`}
                        style={{ marginLeft: "13px" }}
                      >
                        <Trans>ChooseFile</Trans>
                      </label>
                      <input
                        type="file"
                        onChange={(e) =>
                          this.handleFileChange(
                            e.target.files,
                            document.docType,
                            document.docOwner
                          )
                        }
                        id={`inputfile-${idx}`}
                      />
                    </div>
                  </div>
                ))}
          </div>
        )}

        <div className="application-table__container">
          <div className="application-table__tabs">
            {this.props.appState.competitionsStore.competition.competitionType
              .code === "SCP"
              ? tabs.map(
                  (tab, index) =>
                    index !== 1 && (
                      <div
                        className={this.renderTabClass(tab)}
                        key={index}
                        onClick={() => this.handleTabClick(index)}
                      >
                        {i18next.t(tab.name)}
                      </div>
                    )
                )
              : tabs.map((tab, index) => (
                  <div
                    className={this.renderTabClass(tab)}
                    key={index}
                    onClick={() => this.handleTabClick(index)}
                  >
                    {i18next.t(tab.name)}
                  </div>
                ))}
          </div>
          <div className="application-table__body">
            <table className="application-table">{this.renderTable()}</table>
          </div>
          {/*{activeTab === 1 && (*/}
          {/*  <div className="add-expense__container">*/}
          {/*    <button className="add-expense" onClick={this.addExpense}>*/}
          {/*    <Trans>Add</Trans>*/}
          {/*    </button>*/}
          {/*  </div>*/}
          {/*)}*/}
          {activeTab === 1 && (
            <div className="add-expense__container">
              <button className="add-expense" onClick={this.addExperience}>
              <Trans>Add</Trans>
              </button>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
  renderTable() {
    const { activeTab, expenseItemName, expenseForm, expenses, experiences } = this.state;
    const { expenseRegister } = this.props.appState.contractsStore;
    const { compPrograms } = this.props.appState.competitionsStore;
    const { expenseItems, currencies } = this.props.appState.applicationsStore;
    // const { experience } = this.props.appState.applicantsStore;
    switch (activeTab) {
      case 0:
        return (
          <React.Fragment>
            <thead>
              <tr>
                <th style={{ minWidth: "367px", width: "367px" }}>
                <Trans>naimenovaniye</Trans>
                </th>
                <th><Trans>information</Trans></th>
              </tr>
            </thead>
            <tbody>
              {compPrograms && compPrograms.map((program) => (
                <tr key={program.id}>
                  <td>
                    <div className="application-table__program-name">
                      <p>{program.name}</p>
                      <input
                        type="checkbox"
                        data-name={program.name}
                        data-id={program.id}
                        checked={this.programsChecked(program.name)}
                        onChange={(event) => this.handleProgramChange(event)}
                      />
                    </div>
                  </td>
                  <td>{program.info}</td>
                </tr>
              ))}
            </tbody>
          </React.Fragment>
        );
      case 1:
        if (expenseItems && currencies) {
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
                {expenses && expenses.map((expense, idx) => (
                  <tr key={idx}>
                    <td>
                      <select
                        value={expense.itemName}
                        onChange={(event) =>
                          this.handleExpenseItemChange(event, idx)
                        }
                      >
                        {expenseItems.map((item, idx) => {
                          return (
                            <option key={idx} value={item.name}>
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                    <td>
                      <input
                        value={expense.cost}
                        className="expense-plan__input"
                        type="number"
                        name="cost"
                        onChange={(event) => this.handleInputChangeExpenses(event, idx)}
                      />
                    </td>
                    <td>
                      <select
                        value={expense.currencyName}
                        onChange={(event) =>
                          this.handleCurrencyChange(event, idx)
                        }
                      >
                        {currencies.map((currency, idx) => {
                          return (
                            <option key={idx} value={currency.name}>
                              {currency.name}
                            </option>
                          );
                        })}
                      </select>
                      <img
                        src={deleteIcon}
                        alt=""
                        className="expense-delete"
                        onClick={() => this.deleteExpense(idx)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </React.Fragment>
          );
        }
      case 2:
          return (
            <React.Fragment>
              <thead>
              <tr>
                <th>
                   <Trans>TeamMemberEmail</Trans>
                </th>
                  <th style={{minWidth:"200px"}}><Trans>IIN</Trans></th>
                  <th style={{minWidth:"200px"}}><Trans>Name</Trans></th>
                  <th style={{minWidth:"200px"}}><Trans>Surname</Trans></th>
                  <th style={{minWidth:"200px"}}><Trans>Middlename</Trans></th>
                  <th><Trans>WorkExperience</Trans></th>
                  <th><Trans>specificRole</Trans></th>
                </tr>
              </thead>
              <tbody>
                {experiences.map((experience, idx) => (
                  <tr key={idx}>
                    <td>
                    <input
                        value={experience.email}
                        className="expense-plan__input"
                        type="text"
                        name="email"
                        onChange={(event) => this.handleInputChangeExperience(event, idx)}
                      />
                    </td>
                    <td>
                    <input
                        value={experience.iin}
                        className="expense-plan__input"
                        type="number"
                        name="iin"
                        onChange={(event) => this.handleInputChangeExperience(event, idx)}
                      />
                    </td>
                    <td>
                    <input
                        value={experience.firstName}
                        className="expense-plan__input"
                        type="text"
                        name="firstName"
                        onChange={(event) => this.handleInputChangeExperience(event, idx)}
                      />
                    </td>
                    <td>
                    <input
                        value={experience.lastName}
                        className="expense-plan__input"
                        type="text"
                        name="lastName"
                        onChange={(event) => this.handleInputChangeExperience(event, idx)}
                      />
                    </td>
                    <td>
                    <input
                        value={experience.middleName}
                        className="expense-plan__input"
                        type="text"
                        name="middleName"
                        onChange={(event) => this.handleInputChangeExperience(event, idx)}
                      />
                    </td>
                    <td>
                    <input
                        value={experience.workExperience}
                        className="expense-plan__input"
                        type="number"
                        name="workExperience"
                        onChange={(event) => this.handleInputChangeExperience(event, idx)}
                      />
                    </td>
                    <td>
                    <input
                        value={experience.role}
                        className="expense-plan__input"
                        type="text"
                        name="role"
                        onChange={(event) => this.handleInputChangeExperience(event, idx)}
                      />
                    <img
                        src={deleteIcon}
                        alt=""
                        className="expense-delete"
                        onClick={() => this.deleteExperience(idx)}
                      />
                    </td>
                  </tr>
                  )
                )}
              </tbody>
            </React.Fragment>
          );
    }
  }
  renderTabClass(tab) {
    let className = "application-table__tab";
    if (tab.active) className += " active";
    return className;
  }
  renderDocFile(document, docFirst) {
    if (docFirst.length > 0) {
      let doc;

      for (let i = 0; i < docFirst.length; i++) {
        if (
          document.docType.name === docFirst[i].docType.name &&
          document.docOwner.name === docFirst[i].docOwner.name
        ) {
          doc = docFirst[i];
          // return <p>{doc.file.name}</p>;
          return (
            <FileComponent
              getFile={this.loadFile}
              id={doc.file.id}
              name={doc.file.name}
              extension={doc.file.extension}
              withFileIcon={false}
              withDownloadIcon={false}
            />
          );
        }
      }
    }
  }
  renderFileLoader(type, owner) {
    if (
      this.state.fileLoading.type === type &&
      this.state.fileLoading.owner === owner
    ) {
      return (
        <Loader
          type="Triangle"
          color="#209898"
          height={37}
          width={37}
          timeout={15000}
        />
      );
    }
  }
}

export default ApplicationForm;
