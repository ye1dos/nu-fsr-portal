import * as React from "react";
import { observer } from "mobx-react";
import { toJS } from "mobx";
import { RouteComponentProps, Link, Redirect } from "react-router-dom";
import { AppStateObserver, injectAppState } from "../../stores";
import Loader from "react-loader-spinner";
import Breadcrumps from "../../components/Breadcrumps";
import CompetitionRequirements from "../../components/CompetitionRequirements";
import CompetitionInfo from "../../components/CompetitionInfo";
import ApplicationForm from "../../components/ApplicationForm";
import ProcessApplicationForm from "../../components/ProcessApplicationForm"
import { scrollIt } from "../../plugins/smooth-scroll";
import PersonalTables from "../../components/PersonalTables";
import Popup from "reactjs-popup";

import "./CompetitionDetail.css";
import { cubaREST } from "../../cubaREST";
import { toast } from "react-toastify";
import { Trans } from "react-i18next";
import i18n from "../../i18n";
import LoadButtons from "../../helpers/loadButtons";
import Agreement from "../../components/Agreement";

export interface CompetitionDetailProps {}

export interface CompetitionDetailState {}
@injectAppState
@observer
class CompetitionDetail extends React.Component<
  AppStateObserver & RouteComponentProps,
  CompetitionDetailProps,
  CompetitionDetailState
> {
  state = {
    file: null,
    base64URL: "",
    password: null,
    appId: null,
    tabs: [
      { name: "Programs", active: true },
      // { name: "PlanRashodov", active: false },
      { name: "teamMembers", active: false}
    ],
    links: [
      {
        name: "Конкурсы",
        path: "/competitions",
      },
      {
        name: "Конкурс",
        path: this.props.match.params["id"],
      },
    ],
    statuses: {
      NEW: "Новый",
      COLLECTION_OF_APPLICATION: "Сбор заявок",
      REVIEW: "На рассмотрении",
      COMPLETED: "Завершен",
    },
    mounted: false,
    directions: [],
    buttonsInfo: new Map(),
    comment: "",
    checkedCompetition: null,
    errorMessage: null
  };

  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.personalRef = React.createRef();
  }
  formRef;
  personalRef;

  loadEntitiesService = async () => {
      let buttonsInfo = null;
      let competitionId = this.props.match.params["id"];
      let applicationList = null;

      let competition = await this.props.appState.competitionsStore.loadEntity2(
        this.props.match.params["id"]
      );
      
      let checkedCompetition = competition.competitionType;
      this.setState({checkedCompetition})

        await this.props.appState.competitionsStore.loadEntity(competitionId);
        let userInfo = await this.props.appState.userStore.getUserInfo2();
        console.log(toJS(userInfo))

        let applicant = await this.props.appState.applicantsStore.loadApplicant2(userInfo.email);
        // console.log(toJS(applicant))

        // let dataMap = await this.props.appState.applicationsStore.populatorFrontVisible(applicant.id);
        // this.setState({dataMap});

        if (checkedCompetition.needTeamMembers === false) {
          this.setState({
            tabs: [
              { name: "Programs", active: true },
              { name: "PlanRashodov", active: false },
            ],
          });
        }
        if (checkedCompetition.isEasyStart) {
          let processAnswer = null;
          // StartProcess
          console.log("start")
          try {
            processAnswer = await this.props.appState.applicationsStore.StartProcess(competitionId,applicant[0].id);
          }
          catch {
            toast.error("Ошибка при создании процесса", {
              position: toast.POSITION.BOTTOM_CENTER,
            });
          }
          const ids: any = Object.entries(JSON.parse(processAnswer));
          let appId = null;
          let procId = null;
          if (ids[0][0] !== "status") {
            appId = ids[0][0];
            procId = ids[0][1];
            localStorage.setItem("appId", appId);
            this.setState({appId: appId});
            localStorage.setItem("procId", procId);
          } else if (ids[0][0] !== "message") {
            
          }
          else {
            appId = ids[1][0];
            procId = ids[1][1];
            localStorage.setItem("appId", appId);
            this.setState({appId: appId});
            localStorage.setItem("procId", procId);
          }
          try {
            await this.props.appState.applicationsStore.loadEntity(appId);
          }
          catch(e) {
            toast.error("Заявка не найдена", {
              position: toast.POSITION.BOTTOM_CENTER,
            });
          }
          
          try {
            buttonsInfo = await this.props.appState.competitionsStore.getButtons(
              appId,
              userInfo.id
            );
            
            if(buttonsInfo) {
              this.setState({
                buttonsInfo: JSON.parse(buttonsInfo),
              });
            }
            if(!buttonsInfo) {
              this.setState({errorMessage: "Вы не сможете подать так как у вас отсутствует ИИН или вы не гражданин Казахстана"})
            }
          }
          catch(e) {
            console.log("buttonInfo Error")
          }
        }
      applicationList =
        await this.props.appState.applicationsStore.loadEntitiesService(
          userInfo.email
        );
        
      // Fetch Directions only for SCP
      if ((checkedCompetition.code = "SCP")) {
        let res = await this.props.appState.applicationsStore.getDirections2();
        this.setState({
          directions: res,
        });
      }
      this.setState({
        mounted: true,
      });

      if (!checkedCompetition.isEasyStart) {
      // For applicationList
      let hasApplication = false;
      let applicationID = "";
      if (applicationList) {
        for (let i = 0; i < applicationList.length; i++) {
          let app = applicationList[i];
          if (app.competition.id === competitionId) {
            hasApplication = true;
            applicationID = app.id;
            break;
          }
        }
        console.log("applicationList");
        if (hasApplication) {
          this.props.history.push(
            `/application/${applicationID}/${competitionId}`
          );
        }
        }
      }
  };

  componentDidMount() {
    this.loadEntitiesService();
  }

  loadDocument = (id) => {
    return this.props.appState.filesStore.loadDocument(id);
  };

  loadAttachment = (id) => {
    return this.props.appState.filesStore.loadAttachment(id);
  };

  loadFile = (id) => {
    return this.props.appState.filesStore.downloadFile(id);
  };

  onFileChange = (e) => {
    console.log(e.target.files[0]);
    let { file } = this.state;

    file = e.target.files[0];

    this.getBase64(file)
      .then((result) => {
        file["base64"] = result;
        this.setState({
          base64URL: result,
          file,
        });
      })
      .catch((err) => {
        console.log(err);
      });

    this.setState({
      file: e.target.files[0],
    });
  };

  handlePassword = (e) => {
    this.setState({ password: e.target.value });
  };
  getBase64 = (file) => {
    return new Promise((resolve) => {
      let fileInfo;
      let baseURL: string | ArrayBuffer = "";
      // Make new FileReader
      let reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        baseURL = reader.result;
        console.log(baseURL);
        resolve(baseURL);
      };
      console.log(fileInfo);
    });
  };

  saveApplicationWithProcess = (key, procTaskId) => {
    this.formRef.current.saveApplicationWithProcess(key, procTaskId);
    if (this.personalRef.current) {
      this.personalRef.current.saveApplicationWithProcess(key, procTaskId);
    }
  };

  saveApplication = () => {
    this.formRef.current.saveApplication();
    if (this.personalRef.current) {
      this.personalRef.current.sendApplicantForm();
    }
  };

  sendApplication = () => {
    console.log("saveApplication");
    this.formRef.current.sendApplication();
    if (this.personalRef.current) {
      this.personalRef.current.sendApplicantForm();
    }
  };
  
  render() {
    const { links, tabs } = this.state;
    const { language } = this.props.appState.userStore;
    return (
      <React.Fragment>
        <Breadcrumps links={links} />
        <div className="competition-container">{this.renderCompetition()}</div>
      </React.Fragment>
    );
  }
  renderCompetition() {
    const { competition, isLoadingCompetition, notFound } =
      this.props.appState.competitionsStore;
    const { applicant } = this.props.appState.applicantsStore;
    const { application, isApplicationSaving, applicationSaved } =
      this.props.appState.applicationsStore;

    if (isLoadingCompetition) {
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
    if (!cubaREST.restApiToken) {
      return <Redirect to="/sign-in" />;
    }
    // {console.log(this.state.checkedCompetition)}
    if (cubaREST.restApiToken && competition && this.state.checkedCompetition) {
      return (
        <div>
          <CompetitionInfo
            competition={competition}
            statuses={this.state.statuses}
            loadFile={this.loadFile}
          />
          <CompetitionRequirements
            competition={competition}
            loadAttachment={this.loadAttachment}
            loadFile={this.loadFile}
          />
          {competition.status !== "COMPLETED" && this.state.appId &&
          (!this.state.checkedCompetition.isEasyStart ? (
              <ApplicationForm
                  espFile={this.state.base64URL}
                  password={this.state.password}
                  documents={competition.reqDocs}
                  competitionId={competition.id}
                  ref={this.formRef}
                  tabs={this.state.tabs}
                  mounted={this.state.mounted}
                  directions={this.state.directions}
              />
          ) : (
              <ProcessApplicationForm
                  espFile={this.state.base64URL}
                  password={this.state.password}
                  documents={competition.reqDocs}
                  competitionId={competition.id}
                  appId={this.state.appId}
                  ref={this.formRef}
                  tabs={this.state.tabs}
                  mounted={this.state.mounted}
                  directions={this.state.directions}
                  comment={this.state.comment}
              />
          ))}
          {competition.status !== "COMPLETED" &&
            competition.competitionType.code === "TLP" &&
            applicant && (
              <PersonalTables
                applicant={applicant}
                loadFile={this.loadFile}
                ref={this.personalRef}
              />
            )}
          <Agreement />
          {/* BUTTONS */}
          {competition.status !== "COMPLETED" &&
          this.state.checkedCompetition.isEasyStart && this.state.appId && (
            <div className="process_application-form__footer">
              {this.state.buttonsInfo && (
                <LoadButtons
                    appId={this.state.appId}
                    buttonsInfo={this.state.buttonsInfo}
                    saveApplicationWithProcess={this.saveApplicationWithProcess}
                    onFileChange={this.onFileChange}
                    handlePassword={this.handlePassword}
              />
              )}
              {this.state.errorMessage && this.state.buttonsInfo && <h2 style={{display: "flex", color: "red", justifyContent: "center", fontSize: "20px"}}><Trans>IINisNULL</Trans></h2>}
            </div>
          )}
          {competition.status !== "COMPLETED" && !this.state.checkedCompetition.isEasyStart && (
            <div className="application-form__footer">
            {/*  Not used code 2 popups*/}
            <Popup
                  trigger={
                    <button className="application-form__save">
                      <Trans>Save</Trans>
                    </button>
                  }
                  modal
                  closeOnDocumentClick
                >
                  {(close) => (
                    <div className="modal" style={{maxWidth: "500px"}}>
                      <div className="modal__header">
                        <h1><Trans>AttachESP</Trans></h1>
                      </div>
                      <div className="modal__content">
                        <div className="esp__file">
                          <input
                            type="file"
                            id="file"
                            onChange={this.onFileChange}
                          />
                        </div>
                        <div className="esp__password">
                          <label className="esp_password__label" htmlFor=""><Trans>ESPpassword</Trans></label>
                          <input
                          className="esp__password__input"
                            type="password"
                            placeholder="••••••••••"
                            onChange={this.handlePassword}
                          />
                        </div>
                      </div>
                      <div className="modal__actions">
                        <button
                          className="confirm-button"
                          onClick={() => {
                            this.saveApplication();
                            close();
                          }}
                        >
                          <Trans>Send</Trans>
                        </button>
                        <button className="cancel-button" onClick={close}>
                          <Trans>Cancel</Trans>
                        </button>
                      </div>
                    </div>
                  )}
                </Popup>
              
                <Popup
            trigger={
              <button className="application-form__submit">
                <Trans>Apply</Trans>
              </button>
            }
            modal
            closeOnDocumentClick
          >
            {(close) => (
              <div className="modal" style={{maxWidth: "500px"}}>
                <div className="modal__header">
                  <h1><Trans>AttachESP</Trans></h1>
                </div>
                <div className="modal__content">
                  <div className="esp__file">
                    <input
                      type="file"
                      id="file"
                      onChange={this.onFileChange}
                    />
                  </div>
                  <div className="esp__password">
                    <label htmlFor=""><Trans>ESPpassword</Trans></label>
                    <input
                      type="password"
                      placeholder="••••••••••"
                      onChange={this.handlePassword}
                    />
                  </div>
                </div>
                <div className="modal__actions">
                  <button
                    className="confirm-button"
                    onClick={() => {
                      this.sendApplication();
                      close();
                    }}
                  >
                    <Trans>Send</Trans>
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


          {isApplicationSaving && (
            <div className="competition-loading__modal">
              <Loader
                type="Triangle"
                color="#00B8AA"
                height={200}
                width={200}
                timeout={15000}
              />
            </div>
          )}
        </div>
      );
    }
    if (!competition && notFound) {
      return <Redirect to="/404" />;
    }
  }
}

export default CompetitionDetail;
