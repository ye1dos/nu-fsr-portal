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
import FileComponent from "../FileComponent";
import { toast } from "react-toastify";
import InputMask from "react-input-mask";
import Loader from "react-loader-spinner";
import verifyApplication from "../../helpers/verifyApplication";
import deleteIcon from "../../assets/icons/delete-icon.svg";
import "./ProcessApplicationForm.css";
import { Trans } from "react-i18next";
import i18next from "i18next";
import ExtraFields from "../ExtraFields";
import manageApplication from "../../helpers/manageApplication";

export interface ProcessApplicationFormProps {
  espFile;
  password;
  documents;
  competitionId;
  tabs;
  mounted;
  directions;
  comment;
  appId;
}

export interface ProcessApplicationFormState {}

@injectAppState
@observer
class ProcessApplicationForm extends React.Component<
  AppStateObserver & ProcessApplicationFormProps,
  ProcessApplicationFormState
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
    appId: this.props.appId ? this.props.appId : localStorage.getItem("appId"),
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
    teamMembers: null,
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
    directions: [],
    relevance: null,
    applicationForm:  null,
    efficiencyAndResult:  null,
    resource:  null,
    sustainability: null,
    innovativeness:  null,
    projectIdea: null,
    businessModel: null,
    effectiveness: null,
    scalability: null,
    organizationPotential: null,
  };

  loadFile = (id) => {
    return this.props.appState.filesStore.downloadFile(id);
  };

  componentDidUpdate(prevProps, prevState) {
    // compare props
    if (prevProps.mounted !== this.props.mounted) {
      this.setState({
        mounted: this.props.mounted,
        tabs: this.props.tabs,
      });
    }
  }

  handleFileChange = (files, docType, docOwner) => {
    this.setState({
      fileLoading: { type: docType.name, owner: docOwner.name },
    });
    let file;
    let docFirst = [...this.state.docFirst];

    for (let i = 0; i < docFirst.length; i++) {
      if (
        docFirst[i].docType.id === docType.id &&
        docFirst[i].docOwner.id === docOwner.id
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
          let ivanDoc = this.checkDocuments(
            files,
            file,
            docFirst,
            docType,
            docOwner
          );
          this.setState({ docFirst: ivanDoc });
          this.setState({ fileLoading: { type: null, owner: null } });
        })
        .catch((error) => {
          this.setState({ fileLoading: { type: null, owner: null } });
          toast.error(i18next.t("Error"), {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          console.log(error);
        });
    }
  };
  createTMDocs (teamMembers) {
    return (async () => {
        for (const tm of teamMembers) {
          let resume = tm.resume;
            try {
              let document = await this.props.appState.filesStore.updateTMDocument(resume);
              tm.resume = document;
            } catch (error) {
              console.log(error);
        }
      }
      return teamMembers;
    })();
  }
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
  saveApplicationWithProcess = (outcome, procTaskId) => {
      const verify = verifyApplication(this.state, this.props.appState.applicantsStore.applicant);
      if (verify === false) {
        return;
      }
    this.props.appState.applicationsStore.isApplicationSaving = true;
    return (async () => {
      let programs = this.state.programs;
      let expenses = await this.createExpenses();
      let docFirst = await this.createDocs();
      let application = this.props.appState.applicationsStore.application;
      const { states } = this.props.appState.applicationsStore;
      const { directions } = this.props;
      console.log(toJS(application));
      const {
        stateId,
        university,
        school,
        department,
        startStudyDate,
        endStudyDate,
        directionId,
        requestedAmount,
      } = this.state;
      let applicant = {
        id: this.props.appState.applicantsStore.applicant.id,
      };
      let competition = {
        id: this.props.appState.competitionsStore.competition.id,
        competitionType: toJS(this.props.appState.competitionsStore.competition.competitionType)
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
      for (let i = 0; i < directions.length; i++) {
        const direction = directions[i];
        if (directionId === "") {
          directionState = directions[0];
        }
        if (directionId === direction.id) {
          directionState = direction;
        }
      }
      console.log(localStorage.getItem("appId"))
        application.id = this.state.appId;

        application.expense = expenses;
        application.applicant = applicant;
        application.competition = competition;
        application.docFirst = docFirst;
        application.programs = programs;
        application.university = university ? university : null;
        application.school = school ? school : null;
        application.department = department ? department : null;
        application.startStudyDate = startStudyDate ? startStudyDate : null;
        application.endStudyDate = endStudyDate ? endStudyDate : null;
        application.state = applicationState ? applicationState : null;
        application.direction = directionState ? directionState : null;
        application.requestedAmount = requestedAmount ? requestedAmount : null;
        application.teamMembers = this.state.teamMembers ?  await this.createTMDocs(this.state.teamMembers) : null;
        application = manageApplication(this.state, application);
        
      if (
        this.props.appState.competitionsStore.competition.status ===
        "COLLECTION_OF_APPLICATION"
      ) {
        if (outcome === 'saveTemp') {
          this.props.appState.applicationsStore
              .updateEntityService(application, this.props.espFile, this.props.password, this.props.comment, outcome, procTaskId)
              .then(async (res) => {
                this.props.appState.applicationsStore.loadEntities();
                this.props.appState.applicationsStore.isApplicationSaving = false;
                let result = res as string;
                let status = JSON.parse(result).status;
                let message = JSON.parse(result).message
                    ? JSON.parse(result).message
                    : i18next.t("Error");
                let ERROR = JSON.parse(result).ERROR;
                if (status === "SUCCESS") {
                  toast.success(i18next.t("Success"), {
                    position: toast.POSITION.BOTTOM_CENTER,
                  });
                  this.props.appState.applicationsStore.applicationSaved = true;
                  setTimeout(() => {
                    window.location.href = "/";
                  }, 500)
                } else if (status === "ERROR") {
                  toast.error(message, {
                    position: toast.POSITION.BOTTOM_CENTER,
                  });
                } else if (status === "WARNING") {
                  toast.error(message, {
                    position: toast.POSITION.BOTTOM_CENTER,
                  });
                } else if (!status && ERROR) {
                  toast.error(ERROR, {
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
        }
        else if (outcome === 'sign') {
          this.props.appState.applicationsStore
              .approveApplication(application, this.props.espFile, this.props.password, this.props.comment, outcome, procTaskId)
              .then(async (res) => {
                this.props.appState.applicationsStore.loadEntities();
                this.props.appState.applicationsStore.isApplicationSaving = false;
                let result = res as string;
                let status = JSON.parse(result).status;
                let message = JSON.parse(result).message
                    ? JSON.parse(result).message
                    : i18next.t("Error");
                let ERROR = JSON.parse(result).ERROR;
                if (status === "SUCCESS") {
                  toast.success(i18next.t("Success"), {
                    position: toast.POSITION.BOTTOM_CENTER,
                  });
                  this.props.appState.applicationsStore.applicationSaved = true;
                  setTimeout(() => {
                    window.location.href = "/";
                  }, 500)
                } else if (status === "ERROR") {
                  toast.error(message, {
                    position: toast.POSITION.BOTTOM_CENTER,
                  });
                } else if (status === "WARNING") {
                  toast.error(message, {
                    position: toast.POSITION.BOTTOM_CENTER,
                  });
                } else if (!status && ERROR) {
                  toast.error(ERROR, {
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
    const programs = [...this.state.programs];
    let program = {
      name: event.target.dataset.name,
      id: event.target.dataset.id,
    };
    if (checked && programs.length === 0) {
      programs.push(program);
    } else {
      if (program.name !== programs[0].name) {
        programs.push(program);
      }
      programs.splice(0, 1);
    }
    this.setState({ programs });
  };
  programsChecked = (name) => {
    let checked = false;
    for (let i = 0; i < this.state.programs.length; i++) {
      const program = this.state.programs[i];
      if (program.name === name) {
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
  };

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
  handleRelevanceChange = (rel) => {
    console.log("dohoit")
    this.setState({ relevance: rel})
  }
  handleApplicationFormChange =(appForm) => {
    console.log("appForm change");
    this.setState({ applicationForm: appForm})
  }
  handleEfficiencyAndResultChange = (effAndRes) => {
    console.log("effandres change");
    this.setState({ efficiencyAndResult: effAndRes})
  }
  handleProjectIdeaChange = (pi) => {
    this.setState({ projectIdea: pi});
  }
  handleBusinessModelChange = (bm) => {
    this.setState({businessModel: bm});
  }
  handleEffectivenessChange = (eff) => {
    this.setState({effectiveness: eff});
  }
  handleScalabilityChange = (sc) => {
    this.setState({scalability: sc});
  }
  handleResourceChange = (res) => {
    console.log("resource change");
    this.setState({ resource: res})
  }
  handleTMChange = (tm) => {
    this.setState({ teamMembers: tm});
  }
  handleSustainabilityChange = (sus) => {
    console.log("sus change");
    this.setState({ sustainability: sus})
  }
  handleInnovativenessChange = (inn) => {
    console.log("inn change");
    this.setState({ innovativeness: inn})
  }
  handleOrganizationPotentialChange = (op) => {
    this.setState({ organizationPotential: op});
  }

  render() {
    console.log("compt page")
    const { documents } = this.props;
    const { tabs, activeTab, docFirst } = this.state;
    const { states } = this.props.appState.applicationsStore;
    const { directions } = this.props;
    const { language } = this.props.appState.userStore;
    console.log(this.state.programs);
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
                    style={{width: '300px'}}
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
        {(
            <table className="scp-form">
              <tbody>
              <tr>
                <th>
                  <label htmlFor=""><Trans>Direction</Trans></label>
                </th>
                <td>
                  <select
                      value={this.state.directionId}
                      onChange={(event) => this.handleDirectionChange(event)}
                      className="general-info__input__select"
                      style={{width: '300px'}}
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
              </tbody>
            </table>
        )}
        <div className="application-table__container">
          <div style={{marginTop: '20px'}} className="application-table__tabs">
            <div><h1><Trans>Programs</Trans></h1></div>
          </div>
          <div className="application-table__body">
            <table className="application-table">{this.renderProgramsTable()}</table>
          </div>
        </div>
        <ExtraFields
            program={toJS(this.state.programs)}
            app_id={this.state.appId}
            relevance={this.state.relevance}
            applicationForm={this.state.applicationForm}
            efficiencyAndResult={this.state.efficiencyAndResult}
            resource={this.state.resource}
            sustainability={this.state.sustainability}
            innovativeness={this.state.innovativeness}
            teamMembers={this.state.teamMembers}
            projectIdea={this.state.projectIdea}
            businessModel={this.state.businessModel}
            effectiveness={this.state.effectiveness}
            scalability={this.state.scalability}
            organizationPotential={this.state.organizationPotential}
            handleRelevanceChange={this.handleRelevanceChange}
            handleApplicationFormChange={this.handleApplicationFormChange}
            handleEfficiencyAndResultChange={this.handleEfficiencyAndResultChange}
            handleResourceChange={this.handleResourceChange}
            handleSustainabilityChange={this.handleSustainabilityChange}
            handleInnovativenessChange={this.handleInnovativenessChange}
            handleTMChange={this.handleTMChange}
            handleProjectIdeaChange={this.handleProjectIdeaChange}
            handleBusinessModelChange={this.handleBusinessModelChange}
            handleEffectivenessChange={this.handleEffectivenessChange}
            handleScalabilityChange={this.handleScalabilityChange}
            handleOrganizationPotentialChange={this.handleOrganizationPotentialChange}
        />

        {documents && documents.length > 0 && (
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
      </React.Fragment>
    );
  }
  renderProgramsTable() {
    const { compPrograms } = this.props.appState.competitionsStore;
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
          document.docType.id === docFirst[i].docType.id &&
          document.docOwner.id === docFirst[i].docOwner.id
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

export default ProcessApplicationForm;
