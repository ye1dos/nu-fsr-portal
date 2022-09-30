import * as React from "react";
import { toJS } from "mobx";
import { AppStateObserver, injectAppState } from "../../stores";
import { observer } from "mobx-react";
import FileComponent from "../../components/FileComponent";
import InputMask from "react-input-mask";
import Loader from "react-loader-spinner";
import { toast } from "react-toastify";
import verifyApplication from "../../helpers/verifyApplication";
import deleteIcon from "../../assets/icons/delete-icon.svg";
import t, { Trans, useTranslation } from "react-i18next";
import i18next from "i18next";
import ExtraFields from "../ExtraFields";
import manageApplication from "../../helpers/manageApplication";

export interface ProcessApplicationEditFormProps {
  espFile;
  password;
  documents;
  application;
  tabs;
  mounted;
  experiences;
  directions;
  comment;
  checkProgram;
  handleCheckProgram;
}

export interface ProcessApplicationEditFormState {}

@injectAppState
@observer
class ProcessApplicationEditForm extends React.Component<
  ProcessApplicationEditFormProps & AppStateObserver,
  ProcessApplicationEditFormState
> {
  state = {
    application: {},
    appDocs: this.props.application.appDocs,
    docFirst: this.props.application.docFirst,
    programs: this.props.application.programs,
    tabs: this.props.tabs,
    mounted: this.props.mounted,
    activeTab: 0,
    expenseItemName: "",
    expenseItem: {
      name: "",
      id: "",
    },
    relevance: this.props.application.relevance || null,
    applicationForm: this.props.application.applicationForm || null,
    efficiencyAndResult: this.props.application.efficiencyAndResult || null,
    resource: this.props.application.resource || null,
    sustainability: this.props.application.sustainability || null,
    innovativeness: this.props.application.innovativeness || null,
    projectIdea: this.props.application.projectIdea || null,
    businessModel: this.props.application.businessModel || null,
    effectiveness: this.props.application.effectiveness || null,
    scalability: this.props.application.scalability || null,
    organizationPotential: this.props.application.organizationPotential || null,
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
    expenses: this.props.application.expense,
    teamMembers: this.props.application.teamMembers || null,
    experienceForm: {
      email: "",
      iin: null,
      firstName: "",
      lastName: "",
      middleName: "",
      workExperience: null,
      role: "",
    },
    stateId: "",
    university: "",
    school: "",
    department: "",
    startStudyDate: "",
    endStudyDate: "",
    requestedAmount: this.props.application.requestedAmount || null,
    directionId:
      (this.props.application.direction &&
        this.props.application.direction.id) ||
      "",
    fileLoading: {
      type: null,
      owner: null,
    },
    direction: this.props.application.direction || {},
    ivanFile:
      this.props.application.appDocs.length > 0
        ? this.props.application.appDocs
        : this.props.application.docFirst,
    checkProgram: true,
    agreeProgramPassCheck: false,
    name2: "ka4an"
  };

  loadFile = (id) => {
    return this.props.appState.filesStore.downloadFile(id);
  };

  handleFileChange = (files, docType, docOwner) => {
    this.setState({
      fileLoading: { type: docType.name, owner: docOwner.name },
    });
    let file;

    if (this.props.application.appDocs.length > 0) {
      // for (let i = 0; i < appDocs.length; i++) {
      //   if (
      //     appDocs[i].doc.docType.id === docType.id &&
      //     appDocs[i].doc.docOwner.id === docOwner.id
      //   ) {
      //     appDocs.splice(i, 1);
      //     this.setState({ivanFile: appDocs});
      //   }
      // }
    } else {
      let appDocs = [...this.state.ivanFile];
      for (let i = 0; i < appDocs.length; i++) {
        if (
          appDocs[i].docType.id === docType.id &&
          appDocs[i].docOwner.id === docOwner.id
        ) {
          appDocs.splice(i, 1);
          this.setState({ ivanFile: appDocs });
        }
      }
    }
    if (files[0]) {
      this.props.appState.filesStore
        .uploadFile(files[0])
        .then((response) => {
          file = response.data;
          let docs = [...this.state.ivanFile];
          let ivanDoc = this.checkDocuments(
            files,
            file,
            docs,
            docType,
            docOwner
          );
          this.setState({ ivanFile: ivanDoc });
          // console.log(toJS(ivanDoc));
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
  saveApplicationWithProcess = (outcome, procTaskId) => {
      const verify = verifyApplication(this.state, this.props.appState.applicantsStore.applicant);
      if (verify === false) {
        return;
      }
    this.props.appState.applicationsStore.isApplicationSaving = true;
    return (async () => {
      let programs = this.state.programs;
      let expenses = await this.createExpenses();
      let appDocs = await this.createDocs();
      let application = this.props.appState.applicationsStore.application;
      if (application.appDocs.length > 0) {
        application.appDocs = appDocs;
      }

      if (application.appDocs.length === 0) {
        application.docFirst = appDocs;
      }
      const { states } = this.props.appState.applicationsStore;
      const { directions } = this.props;
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
        competitionType: toJS(
          this.props.appState.competitionsStore.competition.competitionType
        ),
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

      application.expense = expenses;
      application.applicant = applicant;
      application.competition = competition;
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
      console.log(toJS(application));
      if (
        this.props.appState.competitionsStore.competition.status === "COLLECTION_OF_APPLICATION" ||
        this.props.appState.competitionsStore.competition.status === "REVIEW" ||
          this.props.appState.competitionsStore.competition.status === "BUSINESS_PLAN"
      ) {
        if (outcome === 'saveTemp') {
          this.props.appState.applicationsStore
              .updateEntityService(
                  application,
                  this.props.espFile,
                  this.props.password,
                  this.props.comment,
                  outcome,
                  procTaskId
              )
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
                  }, 500);
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
              .approveApplication(
                  application,
                  this.props.espFile,
                  this.props.password,
                  this.props.comment,
                  outcome,
                  procTaskId
              )
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
                  }, 500);
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
      let appDocs = [];
      let appDocsLength = this.props.application.appDocs.length;
      // if appdocs exist
      if (appDocsLength > 0) {
        let index = 0;
        for (const doc of this.state.ivanFile) {
          let dublicate = false;
          let docs = doc.docs;
          let id = doc.id;
          let docId = doc.doc.id;
          let valid = doc.valid;
          // check if doc.id is not duplicated in state and props
          if (docId === this.props.application.appDocs[index].doc.id) {
            dublicate = true;
          }
          if (!dublicate) {
            try {
              let document =
                await this.props.appState.filesStore.updateDocument(doc.doc);
              docs.unshift({
                ...document,
                isArchive: false,
                applicationDoc: { id: id },
              });
              appDocs.push({
                doc: {...document, isArchive: false},
                docs: [...docs],
                id: id,
                valid: valid,
              });
            } catch (error) {
              console.log(error);
            }
          } else {
            appDocs.push({ doc: doc.doc, docs: docs, id: id, valid: valid });
          }
          index++;
        }
      }
      if (appDocsLength === 0) {
        for (const doc of this.state.ivanFile) {
          try {
            let document = await this.props.appState.filesStore.updateDocument(
              doc
            );
            appDocs.push(document);
          } catch (error) {
            console.log(error);
          }
        }
      }
      return appDocs;
    })();
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
        if (checked && programs.length === 0) {
          programs.push(program);
        } else {
          let indexOfProgram = 0;
          for (let j = 0; j < programs.length; j++) {
            if (program.name === programs[j].name) {
              indexOfProgram = j;
              break;
            }
          }
          if (program.name !== programs[0].name) {
            programs.push(program);
          }
          programs.splice(indexOfProgram, 1);
        }
      }
    }
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

  handleCurrencyChange = (event, index) => {
    const expenses = this.props.application.expense;
    let form = expenses[index];
    const currencyName = event.target.value;
    form.currencyName = currencyName;
    form.total = Number(form.cost);
    this.setState({ expenses: form });
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

  addExpense = () => {
    const newExpense = { ...this.state.expenseForm };
    const expenses = this.props.application.expense;
    expenses.push(newExpense);
  };
  deleteExpense = (index) => {
    let expenses = this.props.application.expense;
    if (expenses.length > 0) expenses.splice(index, 1);
  };

  checkDocuments(files, file, list2, type, owner) {
    // check docFirst without list array

    let list = JSON.parse(JSON.stringify(this.state.ivanFile));
    // console.log(toJS(list));

    if (files.length !== 0) {
      if (this.props.application.appDocs.length > 0) {
        let myDocument = {
          file: file,
          name: file.name,
          docType: type,
          docOwner: owner,
          applicant: this.props.appState.applicantsStore.applicant,
        };

        for (var i = 0; i < list.length; i++) {
          if (type.id === list[i].doc.docType.id) {
            list[i].doc = myDocument;
            for (var j = 0; j < list[i].docs.length; j++) {
              list[i].docs[j].isArchive = true;
            }
          }
        }
        // console.log(toJS(list));
      } else {
        let myDocument = {
          file: file,
          name: file.name,
          docType: type,
          docOwner: owner,
          applicant: this.props.appState.applicantsStore.applicant,
        };
        list.push(myDocument);
      }
    }
    return list;
  }

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
  handleInputChangeExpenses = (event, index) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    const expenses = [...this.state.expenses];
    let form = expenses[index];
    form[name] = value;

    form.pit = (Number(form.cost) / 100) * form.percent;
    form.total = Number(form.cost) + form.pit;
    this.setState({ expenses: form });
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
    this.setState({ innovativeness: inn});
  }
  handleOrganizationPotentialChange = (op) => {
    this.setState({ organizationPotential: op});
  }

  handleAgreementJAS = () => {
    let lang = this.props.appState.userStore.language || 'ru'

    if(lang == 'ru') {
      return <p>Будете ли Вы проходить полную программу <a target="_blank" href='https://fund.nu.edu.kz/jas-social-impact-2022/'>JAS Camp</a> (до 8 недель инкубации+до 2 недель модуль импакт предпринимательства + оценка команды)?</p>
    }
    if(lang == 'en') {
      return <p>Will you participate in the full <a target="_blank" href='https://fund.nu.edu.kz/en/jas-social-impact-2022/'>JAS Camp</a> program (up to 8 weeks of incubation+ up to 2 weeks of Entrepreneurship impact module + team evaluation)?</p>
    }
    if(lang == 'kz') {
      return <p>Сіз <a target="_blank" href='https://fund.nu.edu.kz/kz/jas-social-impact-2022/'>JAS Camp</a> толық бағдарламасынан өтесіз бе (инкубацияның 8 аптасына дейін+2 аптаға дейін импакт-кәсіпкерлік модулі + команданы бағалау)?</p>
    }
  }
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
    console.log("rel", this.state.relevance);
    
      console.log("at", this.state.applicationForm);
      console.log("eff", this.state.efficiencyAndResult);
      console.log("resource", this.state.resource);
      console.log("sustainability", this.state.sustainability);
      console.log("innovativeness", this.state.innovativeness);
      console.log("process_app_edit");
    if (application) {
      const { states } = this.props.appState.applicationsStore;
      const { directions } = this.props;
      return (
        <React.Fragment>
          <table className="scp-form">
            <tbody>
            <tr>
              <th>
                <label htmlFor="">
                  <Trans>Direction</Trans>
                </label>
              </th>
              <td>
                <select
                    value={this.state.directionId}
                    onChange={(event) => this.handleDirectionChange(event)}
                    className="general-info__input__select"
                    style={{width: '300px'}}
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
            </tbody>
          </table>
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
              app_id={application.id}
              relevance={this.state.relevance}
              applicationForm={this.state.applicationForm}
              efficiencyAndResult={this.state.efficiencyAndResult}
              resource={this.state.resource}
              teamMembers={this.state.teamMembers}
              sustainability={this.state.sustainability}
              innovativeness={this.state.innovativeness}
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
          {/* iz za togo 4to appDocs nuzhen dlya zaprosa i on dynamic */}
          {application.programs.length && ['Start Grant', 'Impulse Grant'].includes(application.programs[0].name) && (
            <div className="application-table-view m-t-20">
              <thead className="m-t-20">
                <tr>
                  <th colSpan={2}>
                    <p>{this.handleAgreementJAS()}</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className={'td-radio'}>
                      <input
                          type="radio"
                          name="check"
                          id="checkYes"
                          checked={this.props.checkProgram}
                          onChange={(event) =>
                            this.props.handleCheckProgram(true)
                          }
                      />
                      <label htmlFor="checkYes" className="m-x-10"><Trans>yesJAS</Trans></label>
                    </div>
                  </td>
                  <td className={'td-radio'}>
                    <div className={'td-radio'}>
                      <input
                          type="radio"
                          name="check"
                          id="checkNo"
                          checked={!this.props.checkProgram}
                          onChange={(event) =>
                            this.props.handleCheckProgram(false)
                          }
                      />
                      <label htmlFor="checkNo" className="m-x-10"><Trans>noJAS</Trans></label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </div>
          )}
          { application.appDocs && application.appDocs.length === 0 ? 
            !this.props.checkProgram && documents && documents.length > 0 && (
                <div className="application-form__documents">
                  <div className="application-form__headings">
                    <p>
                      <Trans>DocType</Trans>
                    </p>
                    <p>
                      <Trans>File</Trans>
                    </p>
                  </div>
                  {documents
                    .slice()
                    .sort((a, b) =>
                      a.docType.name.localeCompare(b.docType.name)
                    )
                    .map((document, idx) => (
                      <div
                        key={document.id}
                        className="application-form__document"
                      >
                        <p>
                          {(document.docType && document.docType.name) || null}{" "}
                          {document.mandatory && (
                            <span className="mandatory">*</span>
                          )}
                        </p>
                        <div className="inputfile__container">
                          {this.renderDocFile(document, this.state.ivanFile)}
                          {this.renderFileLoader(
                            document.docType && document.docType.name,
                            (document.docOwner && document.docOwner?.name) ||
                              null
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
              )
            : !this.props.checkProgram && documents &&
              documents.length > 0 && (
                <div className="application-form__documents">
                  <div
                    className="application-form__headings"
                    style={{ justifyContent: "start", paddingRight: "10px" }}
                  >
                    <p style={{ width: "300px", paddingLeft: "10px" }}>
                      <Trans>DocType</Trans>
                    </p>
                    <p
                      style={{
                        width: "400px",
                        display: "flex",
                        justifyContent: "space-around",
                        paddingLeft: "10px",
                      }}
                    >
                      <Trans>File</Trans>
                    </p>
                    <p
                      style={{
                        width: "400px",
                        display: "flex",
                        justifyContent: "space-around",
                        paddingLeft: "10px",
                      }}
                    >
                      <Trans>ArchivedFiles</Trans>
                    </p>
                    <p
                      style={{
                        width: "300px",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Trans>ArchivedFiles</Trans> 2
                    </p>
                  </div>
                  {documents
                    .slice()
                    .sort((a, b) =>
                      a.docType.name.localeCompare(b.docType.name)
                    )
                    .map((document, idx) => (
                      <div
                        key={document.id}
                        className="application-form__document"
                        style={{ justifyContent: "start" }}
                      >
                        <p
                          style={{
                            width: "300px",
                            paddingRight: "10px",
                            wordBreak: "break-all",
                          }}
                        >
                          {(document.docType && document.docType.name) || null}{" "}
                          {document.mandatory && (
                            <span className="mandatory">*</span>
                          )}
                        </p>
                        <div
                          className="inputfile__container"
                          style={{
                            width: "500px",
                            justifyContent: "space-evenly",
                            paddingRight: "10px",
                            wordBreak: "break-all",
                          }}
                        >
                          {this.renderAppDocFile(
                            document,
                            this.state.ivanFile
                          )}
                          {this.renderFileLoader(
                            document.docType && document.docType.name,
                            (document.docOwner && document.docOwner?.name) ||
                              null
                          )}
                          <label
                            htmlFor={`inputfile-${idx}`}
                            style={{ marginLeft: "7px" }}
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
                        <div
                          className="inputfile__container"
                          style={{
                            width: "400px",
                            justifyContent: "space-evenly",
                            paddingRight: "10px",
                            wordBreak: "break-all",
                          }}
                        >
                          {this.renderArchivedFile(
                            document,
                            this.state.ivanFile
                          )}
                        </div>
                        <div
                          className="inputfile__container"
                          style={{
                            width: "300px",
                            justifyContent: "flex-end",
                            wordBreak: "break-all",
                          }}
                        >
                          {this.renderArchivedFile2(
                            document,
                            this.state.ivanFile
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
        </React.Fragment>
      );
    }
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
            <th>
              <Trans>information</Trans>
            </th>
          </tr>
          </thead>
          <tbody>
          {compPrograms &&
              compPrograms.map((program) => (
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
    // console.log(toJS(docFirst));
    if (docFirst.length > 0) {
      let doc;

      for (let i = 0; i < docFirst.length; i++) {
        if (
          document.docType.id === docFirst[i].docType.id &&
          document.docOwner.id === docFirst[i].docOwner.id
        ) {
          doc = docFirst[i];
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
  renderAppDocFile(document, ivanFile) {
    const appDocs = this.props.application.appDocs;
    if (appDocs.length > 0) {
      let doc;
      let idx;
      for (var i = 0; i < appDocs.length; i++) {
        // console.log(toJS(document.docType));
        // console.log(toJS(appDocs[i].doc.docType));
        
        if (document.docType.id === appDocs[i].doc.docType.id) {
          idx = i;
          break;
        }
      }
      if ( typeof idx !== "undefined" ) {
        if (ivanFile[idx].doc.file.id !== appDocs[idx].doc.file.id) {
          doc = ivanFile[idx].doc;
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
        for (let j = 0; j < appDocs[idx].docs.length; j++) {
          if (appDocs[idx].docs[j].isArchive === false) {
            doc = appDocs[idx].docs[j];
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
  }
  renderArchivedFile(document, ivanFile) {
    if (ivanFile.length > 0) {
      let doc;
      let idx;
      for (var i = 0; i < ivanFile.length; i++) {
        if (document.docType.id === ivanFile[i].doc.docType.id) {
          idx = i;
        }
      }
      let archivedFiles = [];
      if ( typeof idx !== "undefined" ) {
        for (let j = 0; j < ivanFile[idx].docs.length; j++) {
          if (ivanFile[idx].docs.length > 2) {
            for (let j = 0; j < ivanFile[idx].docs.length; j++) {
              if (ivanFile[idx].docs[j].isArchive === true) {
                archivedFiles.push(ivanFile[idx].docs[j]);
              }
            }
            if (archivedFiles.length > 1) {
              doc = archivedFiles[1];
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
          if (ivanFile[idx].docs.length <= 2) {
            for (let k = 0; k < this.props.application.appDocs[idx].docs.length; k++) {
              if (this.props.application.appDocs[idx].docs[k].isArchive === false && ivanFile[idx].docs[k].isArchive === true) {

                doc = ivanFile[idx].docs[k];
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
            if (ivanFile[idx].docs[j].isArchive === true) {
              doc = ivanFile[idx].docs[j];
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
      return;
    }
  }
  renderArchivedFile2(document, appDocs) {
    if (appDocs.length > 0) {
      let doc;
      let idx;
      for (let i = 0; i < appDocs.length; i++) {
        if (document.docType.id === appDocs[i].doc.docType.id) {
          idx = i;
          break;
        }
      }
      let archivedFiles = [];
      if ( typeof idx !== "undefined" ) {
        for (let j = 0; j < appDocs[idx].docs.length; j++) {
          if (appDocs[idx].docs[j].isArchive === true) {
            archivedFiles.unshift(appDocs[idx].docs[j]);
          }
        }
      }
      if (archivedFiles.length > 1) {
        doc = archivedFiles[1];
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
      return;
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

export default ProcessApplicationEditForm;
