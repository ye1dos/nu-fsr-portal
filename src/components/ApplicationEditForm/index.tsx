import * as React from "react";
import { toJS } from "mobx";
import { AppStateObserver, injectAppState } from "../../stores";
import { observer } from "mobx-react";
import FileComponent from "../../components/FileComponent";
import InputMask from "react-input-mask";
import Loader from "react-loader-spinner";
import { toast } from "react-toastify";

import deleteIcon from "../../assets/icons/delete-icon.svg";
import { Trans } from "react-i18next";
import i18next from "i18next";

export interface ApplicationEditFormProps {
  espFile;
  password;
  documents;
  application;
  tabs;
  mounted;
  experiences;
  directions;
}

export interface ApplicationEditFormState {}

@injectAppState
@observer
class ApplicationEditForm extends React.Component<
  ApplicationEditFormProps & AppStateObserver,
  ApplicationEditFormState
> {
  state = {
    tabs: this.props.tabs,
    mounted: this.props.mounted,
    experiences: this.props.experiences,
    activeTab: 0,
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
    experienceForm: {
      email: "",
      fullName: "",
      workExperience: null,
      role: ""
    },
    fileLoading: {
      type: null,
      owner: null,
    },
    direction: {}
  };

  loadFile = (id) => {
    return this.props.appState.filesStore.downloadFile(id);
  };

  handleFileChange = (files, docType, docOwner) => {
    this.setState({
      fileLoading: { type: docType.name, owner: docOwner.name },
    });
    let file;
    let docFirst = [...this.props.application.docFirst];

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
          this.props.application.docFirst = docFirst;
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
        .sendApplication(application, this.props.espFile, this.props.password)
        .then((res) => {
          console.log(res);
          window.location.reload();
        });
    })();
  };

  saveApplication = () => {
    return (async () => {
      let programs = this.props.application.programs;
      let expenses = await this.createExpenses();
      let docFirst = await this.createDocs();
      const { states, directions } = this.props.appState.applicationsStore;
      console.log(expenses);
      console.log(docFirst);
      let applicant = {
        id: this.props.appState.applicantsStore.applicant.id,
      };
      let competition = {
        id: this.props.appState.competitionsStore.competition.id,
      };

      let application = this.props.application;

      for (let i = 0; i < states.length; i++) {
        const state = states[i];
        if (application.stateId === "") {
          application.state = states[0];
        }
        if (application.stateId === state.id) {
          application.state = state;
        }
      }
      for (let i = 0; i < directions.length; i++ ) {
        const direction = directions[i];
        if(application.directionId === "") {
          application.direction = directions[0];
        }
        if(application.directionId === direction.id) {
          application.direction = direction;
        }
      }

      delete application.stateId;
      delete application.directionId;
      application.expense = expenses;
      application.applicant = applicant;
      application.docFirst = docFirst;
      application.programs = programs;

      // console.log(toJS(this.props.application));

      if (
        this.props.application.competition.status ===
        "COLLECTION_OF_APPLICATION"
      ) {
        this.props.appState.applicationsStore.updateEntity(application, this.props.espFile, this.props.password);

        let app_id = application.id;
        let exp = [];
        for ( let i = 0; i < this.state.experiences.length; i++ ) {
          exp[i] = this.state.experiences[i]
          exp[i].application = {id: app_id}
        }
        // exp id putting
        // console.log(exp)
        for( let i = 0; i < exp.length; i++) {
          await this.props.appState.applicationsStore.sendExperiences(exp[i]);
        }
      } else {
        toast.error("К сожалению вы не уже можете поменять заявку", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }

      return application;
    })();
  };

  createExpenses = () => {
    const expenses = this.props.application.expense;
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
          planDate: this.props.application.endStudyDate,
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
      for (const doc of this.props.application.docFirst) {
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

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.mounted !== this.props.mounted) {
      this.setState({
        mounted: this.props.mounted,
        tabs: this.props.tabs,
        experiences: this.props.experiences
      })
    }
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
    const { compPrograms } = this.props.appState.competitionsStore;
    const { programs } = this.props.appState.applicationsStore.application;
    let checked = event.target.checked;
    let program = {
      name: event.target.dataset.name,
      id: event.target.dataset.id,
    };

    for (let i = 0; i < compPrograms.length; i++) {
      const element = compPrograms[i];
      if (program.name === element.name) {
        if (checked) {
          programs.push(program);
        } else {
          let indexOfProgram = 0;
          for (let j = 0; j < programs.length; j++) {
            if (program.name === programs[j].name) {
              indexOfProgram = j;
              break;
            }
          }
          programs.splice(indexOfProgram, 1);
        }
      }
      this.setState({programs})
    }
    console.log("THE END");
    // console.log(toJS(programs));

    //this.props.appState.applicationsStore.entity.programs = x;
  };
  programsChecked = (name) => {
    let checked = false;
    for (let i = 0; i < this.props.application.programs.length; i++) {
      const program = this.props.application.programs[i];
      if (program.name === name) {
        checked = true;
        break;
      }
    }
    return checked;
  };

  handleExpenseItemChange = (event, index) => {
    const itemName = event.target.value;
    const expenses = this.props.application.expense;
    expenses[index].itemName = itemName;
  };

  handleStateChange = (event) => {
    const stateId = event.target.value;
    this.props.application.stateId = stateId;
  };

  handleDirectionChange = (event) => {
    const directionId = event.target.value;
    this.props.application.directionId = directionId;
  }

  handleCurrencyChange = (event, index) => {
    const expenses = this.props.application.expense;
    let form = expenses[index];
    const currencyName = event.target.value;
    form.currencyName = currencyName;
    form.total = Number(form.cost);
  };

  handleInputChange = (event, index) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    const expenses = this.props.application.expense;
    let form = expenses[index];
    form[name] = value;

    form.total = Number(form.cost);
  };

  handleInputChangeExperience = (event, index) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    const experiences =  this.state.experiences;
    let form = experiences[index];
    form[name] = value;
    experiences[name] = form[name];
    this.setState( {
      experiences: experiences
    })
  }
  addExperience = () => {
    const newExperience = {...this.state.experienceForm };
    const experiences = this.state.experiences;
    experiences.push(newExperience);
    this.setState({
      experiences: experiences
    })
    // console.log(this.state.experiences)
  }
  deleteExperience = (index) => {
    let experiences = [...this.state.experiences];
    if (experiences.length > 0) experiences.splice(index, 1);
    this.setState( { experiences });
  }

  handleTalapInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.props.application[name] = value;
    console.log(toJS(this.props.application));
  };

  handleSCPInputChange = (event) => {
    const target = event.target;
    let value = target.value;
    const name = target.name;
    this.props.application[name] = value;
  };

  addExpense = () => {
    const newExpense = { ...this.state.expenseForm };
    const expenses = this.props.application.expense;
    expenses.push(newExpense);
  };
  deleteExpense = (index) => {
    let expenses = this.props.application.expense;
    if (expenses.length > 0) expenses.splice(index, 1);
  };

  render() {
    const { isLoadingApplication } = this.props.appState.applicationsStore;
    const { application, documents } = this.props;
    const { tabs, activeTab } = this.state;
    const { language } = this.props.appState.userStore;
    if (isLoadingApplication) {
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
    if (application) {
      const { docFirst } = application;
      const { states } = this.props.appState.applicationsStore;
      const { directions } = this.props.appState.applicationsStore;
      return (
        <React.Fragment>
          {application.competition.competitionType.code === "TLP" && (
            <table className="talap-form">
              <tbody>
                <tr>
                  <th>
                    <label htmlFor="">Страна / Штат поступления</label>
                  </th>
                  <td>
                    <select
                      value={application.stateId}
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
                      defaultValue={application.university}
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
                      defaultValue={application.school}
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
                      defaultValue={application.department}
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
                      defaultValue={application.startStudyDate}
                      name="startStudyDate"
                      onChange={this.handleTalapInputChange}
                      mask="9999-99-99"
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
                      defaultValue={application.endStudyDate}
                      name="endStudyDate"
                      onChange={this.handleTalapInputChange}
                      mask="9999-99-99"
                      maskChar=" "
                      className="general-info__input"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          {
            application.competition.competitionType.code === "SCP" && (
              <table className="scp-form">
              <tbody>
                <tr>
                <th>
                  <label htmlFor="">Направление/Ценность</label>
                </th>
                <td>
                  <select
                    value={application.directionId}
                    onChange={(event) => this.handleDirectionChange(event)}
                    className="general-info__input__select"
                  >
                    {directions.map((directions, idx) => {
                      return (
                        <option key={idx} value={directions.id}>
                          {directions.name}
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
                    defaultValue={application.requestedAmount}
                    className="general-info__input"
                    type="number"
                    name="requestedAmount"
                    onChange={this.handleSCPInputChange}
                  />
                </td>
              </tr>
              </tbody>
            </table>
            )
          }
          {documents.length > 0 && (
            <div className="application-form__documents">
              <div className="application-form__headings">
                <p><Trans>DocType</Trans></p>
                <p><Trans>File</Trans></p>
              </div>
              {documents
                .slice()
                .sort((a, b) => a.docType.name.localeCompare(b.docType.name))
                .map((document, idx) => (
                  <div key={document.id} className="application-form__document">
                    <p>
                      {document.docType.name || null}{" "}
                      {document.mandatory && (
                        <span className="mandatory">*</span>
                      )}
                    </p>
                    <div className="inputfile__container">
                      {this.renderDocFile(document, docFirst)}
                      {this.renderFileLoader(
                        document.docType.name,
                        document.docOwner?.name || null
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
            <div className="application-table__body">
              <table className="application-table">{this.renderTable()}</table>
            </div>
            {activeTab === 1 && (
                <div className="add-expense__container">
                  <button className="add-expense" onClick={this.addExpense}>
                  <Trans>Add</Trans>
                  </button>
                </div>
              )}
            {activeTab === 2 && (
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
  }
  renderTable() {
    const { activeTab, expenseForm } = this.state;
    const { expenseRegister } = this.props.appState.contractsStore;
    const { compPrograms } = this.props.appState.competitionsStore;
    const expenses = this.props.appState.applicationsStore.application.expense;
    const { experiences } = this.state;
    const { expenseItems, currencies } = this.props.appState.applicationsStore;
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
        if (expenses && expenseItems && currencies) {
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
                        onChange={(event) => this.handleInputChange(event, idx)}
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
                  <th><Trans>IIN</Trans></th>
                  <th><Trans>Name</Trans></th>
                  <th><Trans>Surname</Trans></th>
                  <th><Trans>Middlename</Trans></th>
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
                        type="email"
                        name="email"
                        onChange={(event) => this.handleInputChangeExperience(event, idx)}
                      />
                    </td>
                    <td>
                    <input
                        value={experience.fullName}
                        className="expense-plan__input"
                        type="text"
                        name="fullName"
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

      console.log(toJS(document));

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

export default ApplicationEditForm;
