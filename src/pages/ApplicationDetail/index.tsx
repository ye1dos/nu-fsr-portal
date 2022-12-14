import * as React from "react";
import { observer } from "mobx-react";
import { toJS } from "mobx";
import { RouteComponentProps, Link, Redirect } from "react-router-dom";
import { AppStateObserver, injectAppState } from "../../stores";
import Loader from "react-loader-spinner";
import Breadcrumps from "../../components/Breadcrumps";
import CompetitionRequirements from "../../components/CompetitionRequirements";
import CompetitionInfo from "../../components/CompetitionInfo";
import ApplicationEditForm from "../../components/ApplicationEditForm";
import ApplicationViewForm from "../../components/ApplicationViewForm";
import ProcessApplicationFormForBusinessPlanView from "../../components/ProcessApplicationFormForBusinessPlanView";
import PersonalTables from "../../components/PersonalTables";
import PersonalViewTables from "../../components/PersonalViewTables";
import ApplicationInfo from "../../components/ApplicationInfo";
import Popup from "reactjs-popup";
import { cubaREST } from "../../cubaREST";
import "./ApplicationDetail.css"
import { format } from "date-fns";
import { enGB, eo, ru } from "date-fns/locale";
import ProcessApplicationEditForm from "../../components/ProcessApplicationEditForm";
import { Trans } from "react-i18next";
import LoadButtons from "../../helpers/loadButtons";
import Agreement from "../../components/Agreement";
import localeChanger from "../../helpers/localeChanger";

export interface ApplicationDetailProps {}

export interface ApplicationDetailState {}
@injectAppState
@observer
class ApplicationDetail extends React.Component<
  AppStateObserver & RouteComponentProps,
  ApplicationDetailProps,
  ApplicationDetailState
> {
  state = {
    file: null,
    base64URL: "",
    password: null,
    tabs: [
      { name: "Programs", active: true },
      // { name: "PlanRashodov", active: false },
      { name: "teamMembers", active: false}
    ],
    mounted: false,
    experiences: [],
    links: [
      {
        name: "li4nyKabinet",
        path: "/cabinet/applications",
      },
      {
        name: "MyApplication",
        path: this.props.match.params["compId"],
      },
    ],
    statuses: {
      NEW: "??????????",
      COLLECTION_OF_APPLICATION: "???????? ????????????",
      REVIEW: "???? ????????????????????????",
      COMPLETED: "????????????????",
    },
    intervalId: null,
    directions: [],
    buttonsInfo: new Map(),
    comment: "",
    checkedCompetition: null,
    dataMap: null,
    checkProgram: true,
    agreeProgramPassCheck: false
  };

  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.personalRef = React.createRef();
  }
  formRef;
  personalRef;

  loadEntitiesService2 = async () => {

      await this.props.appState.applicationsStore.loadEntity(
        this.props.match.params["id"]
      );
      let competition = await this.props.appState.competitionsStore.loadEntity2(
        this.props.match.params["compId"]
      );

      let checkedCompetition = competition.competitionType;
      let userInfo = await this.props.appState.userStore.getUserInfo2();
      this.setState({ checkedCompetition });
      // if (competition.status === "TEAMLEAD_REWORK") {
      //   let dataMap = await this.props.appState.applicationsStore.populatorFrontVisible(this.props.match.params["id"]);
      //   this.setState({dataMap: JSON.parse(dataMap)});
      // }
      if (checkedCompetition.isEasyStart) {
        try {
          let buttonsInfo = await this.props.appState.competitionsStore.getButtons(
            this.props.match.params["id"],
            userInfo.id
          );
          if(buttonsInfo) {
            this.setState({
              buttonsInfo: JSON.parse(buttonsInfo),
            });
          }
          if(!buttonsInfo) {
            this.setState({errorMessage: "???? ???? ?????????????? ???????????? ?????? ?????? ?? ?????? ?????????????????????? ?????? ?????? ???? ???? ?????????????????? ????????????????????"})
          }
        }
        catch (error) {
          console.log(error);
        }

      }

      if (checkedCompetition.needTeamMembers === false) {
        this.setState({
          tabs: [
            { name: "??????????????????", active: true },
            { name: "???????? ????????????????", active: false }
          ],
        });

        let application_id = this.props.match.params["id"];
        let exp = await this.props.appState.applicationsStore.getExperiences(
          application_id
        );
        this.setState({
          experiences: exp,
        });
      }
      if ((checkedCompetition.code = "SCP")) {
        let res = await this.props.appState.applicationsStore.getDirections2();
        this.setState({
          directions: res,
        });
      }
      this.setState({
        mounted: true,
      });
  };

  componentDidMount() {
    this.props.appState.competitionsStore.loadEntity(
      this.props.match.params["compId"]
    );

    this.loadEntitiesService2();
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

  sendApplication = () => {
    console.log("saveApplication");
    this.formRef.current.sendApplication();
    if (this.personalRef.current) {
      this.personalRef.current.sendApplicantForm();
    }
  };
  verifyApplication = () => {
    this.formRef.current.verifyApplication();
    if (this.personalRef.current) {
      this.personalRef.current.verifyApplication();
    }
  }
  saveApplication = () => {
    this.formRef.current.saveApplication();
    if (this.personalRef.current) {
      this.personalRef.current.sendApplicantForm();
    }
  };
  saveApplicationWithProcess = (key, procTaskId) => {
    this.formRef.current.saveApplicationWithProcess(key, procTaskId);
    if (this.personalRef.current) {
      this.personalRef.current.saveApplicationWithProcess(key, procTaskId);
    }
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
  handleCommentChange = (e) => {
    this.setState({
      comment: e.target.value,
    });
  };
  hideByName = (name, applicant) => {
    if (name === "????????????????"
        || name === "?????????????????????? ???? ???????????? ????????????????"
        || name === "???????????? ???? ???????????? ???????????????????? ????????????"
        || name === "?????????????????????? ???? ???????????? ?????????????? ????????????????"
        || name === "???????????? ???? ???????????? ?????????????? ????????????"
        || name === "???????????? ???? ???????????? ???????????? ??????????") {
      return <Trans>RO</Trans>;
    }
    else if (name === "?????????????????????? SP" || name === "??????????????????????") {
      return <Trans>InnerCommission</Trans>;
    }
    else if (name === "???????????????? ??????????????????"
        || name === "?????????????????? ???? ???????????? ?????????????? ????????????"
        || name === "?????????????????? ???? ???????????? ???????????????????? ????????????") {
      return <Trans>BoardMember</Trans>;
    }
    else if (name === "?????????????? ??????????????????????") {
      return <Trans>OuterCommission</Trans>;
    }
    else {
      return applicant
    }
  }
  loadStars = () => {
    const { application } = this.props.appState.applicationsStore;
    return (
    <React.Fragment>
      <h2 className="stars-count"><Trans>starCount</Trans></h2>
      <table className="stars-table">
          <thead>
            <tr>
              <th><p className="stars__info__header">
                <Trans>ImyaShaga</Trans>
              </p></th>
              <th><p className="stars__info__header">
                <Trans>KolvoZvezd</Trans>
              </p></th>
            </tr>
          </thead>
        <tbody>
            {application.star.map((star) => (
              <tr>
                    <td><p className="stars__info__value">
                      {star.starDict.taskName}
                    </p></td>
                    <td><p className="stars__info__value">
                      {star.amount}
                    </p></td>
              </tr>
            ))}
            <tr>
              <td><p className="stars__info__value">
                <Trans>Itogo</Trans>
              </p></td>
              <td><p className="stars__info__value">
              {application.star.reduce((sum, el) => sum + el.amount, 0)}
              </p></td>
            </tr>
        </tbody>
      </table>
    </React.Fragment>)
  };

  statusTable = (dataMap) => {
    const { language } = this.props.appState.userStore;
    const localeDate = localeChanger(language);
    return (
        <React.Fragment>
          <h2 style={{marginTop: "100px", paddingBottom: "10px", display: "flex", justifyContent: "flex-start"}}><Trans>ProccessState</Trans></h2>
          <table className="datamap-table">
            <thead>
              <tr>
                <th>
                  <p className="datamap__info__header">
                    <Trans>Applicant</Trans>
              </p>
                </th>
                <th>
                  <p className="datamap__info__header">
                    <Trans>answer</Trans>
              </p>
                </th>
                <th>
                  <p className="datamap__info__header">
                  <Trans>naimenovaniye</Trans>
              </p>
                </th>
                <th>
                  <p className="datamap__info__header">
                  <Trans>startDate</Trans>
                  </p>
                </th>
                <th>
                  <p className="datamap__info__header">
                  <Trans>endDate</Trans>
                  </p>
                </th>
              {/*  <th>*/}
              {/*    <p className="datamap__info__header">*/}
              {/*    <Trans>comment</Trans>*/}
              {/*</p>*/}
              {/*  </th>*/}
              </tr>
            </thead>
              <tbody>
            {dataMap.map((data) => {
              return (
              <React.Fragment>
                <tr>
                  <td>
                    <p className="datamap__info__value">
                      {this.hideByName(data.name, data.applicant)}
                    </p>
                  </td>
                  <td>
                    <p className="datamap__info__value">
                      {data.outcome}
                    </p>
                  </td>
                  <td>
                    <p className="datamap__info__value" style={{padding: "10px 0px"}}>
                      {data.name}
                    </p>
                  </td>
                  <td>
                    <p className="datamap__info__value">
                    {data.startDate &&
                      format(Date.parse(data.startDate), "dd MMMM u HH:mm", {
                        locale: localeDate,
                      })
                      }
                    </p>
                  </td>
                  <td>
                    <p className="datamap__info__value">
                      {data.endDate &&
                      format(Date.parse(data.endDate), "dd MMMM u HH:mm", {
                        locale: localeDate,
                      })
                      }
                    </p>
                  </td>
                  {/*<td>*/}
                  {/*  <p className="datamap__info__value" style={{maxWidth: "300px", padding: "10px 0px"}}>*/}
                  {/*    {data.comment}*/}
                  {/*  </p>*/}
                  {/*</td>*/}
                </tr>
              </React.Fragment>
              )
            })}
            </tbody>
          </table>
        </React.Fragment>
    )
  }

  handleCheckProgram = (bool) => {
    this.setState({
      checkProgram: bool
    })
  }

  render() {
    const { links } = this.state;
    const { language } = this.props.appState.userStore;
    return (
      <React.Fragment>
        <Breadcrumps links={links} />
        <div className="competition-container">{this.renderCompetition()}</div>
      </React.Fragment>
    );
  }
  renderCompetition() {
    const { competition, isLoadingCompetition } = this.props.appState.competitionsStore;
    const { applicant } = this.props.appState.applicantsStore;
    const { application } = this.props.appState.applicationsStore;
    const { base64URL, password, tabs, mounted, experiences, directions, checkedCompetition } =
      this.state;
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
      return <Redirect to="/sign-in" />;//programPassCheck
    }
    if (cubaREST.restApiToken && competition && application && checkedCompetition) {
      return (
        <div>
          {/* {application.programs.length && ['Start Grant', 'Impulse Grant'].includes(application.programs[0].name) && (
            <div className="application-table-view m-t-20">
              <thead className="m-t-20">
                <tr>
                  <th colSpan={2}>
                    <p>???????????? ???? ???? ?????????????????? ???????????? ?????????????????? JAS Camp (???? 8 ???????????? ??????????????????+???? 2 ???????????? ???????????? ???????????? ?????????????????????????????????????? + ???????????? ??????????????)?</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <label htmlFor="checkYes" className="m-x-10"> ????, ???????? ?????????????????? ???????????? ?????????????????? (???? 8 ???????????? ??????????????????+???? 2 ???????????? ???????????? ???????????? ?????????????????????????????????????? + ???????????? ??????????????)</label>
                    <input
                        type="radio"
                        name="check"
                        id="checkYes"
                        checked={this.state.checkProgram}
                        onChange={(event) =>
                          this.setState({
                            checkProgram: true
                          })
                        }
                    />
                  </td>
                  <td>
                    <label htmlFor="checkNo" className="m-x-10">??????, ???????? ?????????????????? ?????????????????????? ?????????????????? JAS Camp (???? 2 ???????????? ???????????? ???????????? ?????????????????????????????????????? + ???????????? ??????????????) ?? ???????????????? ??????????????????, ???????????????????????????? ?????????????????????? ??????????????????????/?????????????????? ?? ?????????????? ?????????????????? ???????? ??????</label>
                    <input
                        type="radio"
                        name="check"
                        id="checkNo"
                        checked={!this.state.checkProgram}
                        onChange={(event) =>
                          this.setState({
                            checkProgram: false
                          })
                        }
                    />
                  </td>
                </tr>
              </tbody>
            </div>
          )} */}
          <ApplicationInfo application={application} />
          <CompetitionInfo
              appStatus={application.applicationStatus}
              competition={competition}
              statuses={this.state.statuses}
              loadFile={this.loadFile}
          />
          <CompetitionRequirements
            competition={competition}
            loadAttachment={this.loadAttachment}
            loadFile={this.loadFile}
          />
          {
            (
              application.applicationStatus === "NEW" ||
              application.applicationStatus === "REWORK_DOCS" ||
              application.applicationStatus === "PENDING" ||
              application.applicationStatus === "TEAMLEAD_REWORK" ||
              application.applicationStatus === "REVISION_AFTER_VALIDATION"
            ) 
            && 
            (
              this.state.checkedCompetition.isEasyStart === true ?
                (
                  <ProcessApplicationEditForm
                    espFile={base64URL}
                    password={password}
                    documents={competition.reqDocs}
                    application={application}
                    ref={this.formRef}
                    tabs={tabs}
                    mounted={mounted}
                    experiences={experiences}
                    directions={directions}
                    comment={this.state.comment}
                    checkProgram={this.state.checkProgram}
                    handleCheckProgram={this.handleCheckProgram}
                  />
                )
                :
                (
                  <ApplicationEditForm
                    espFile={base64URL}
                    password={password}
                    documents={competition.reqDocs}
                    application={application}
                    ref={this.formRef}
                    tabs={tabs}
                    mounted={mounted}
                    experiences={experiences}
                    directions={directions}
                  />
                )
            )
          }
          {
            this.state.checkProgram &&
            application.applicationStatus !== "NEW" &&
            application.applicationStatus !== "REWORK_DOCS" &&
            application.applicationStatus !== "PENDING" &&
            application.applicationStatus !== "TEAMLEAD_REWORK" &&
            application.applicationStatus !== "REVISION_AFTER_VALIDATION" && (
              <ProcessApplicationFormForBusinessPlanView
                espFile={base64URL}
                password={password}
                application={application}
                ref={this.formRef}
                documents={competition.reqDocs}
                comment={this.state.comment}
              />
            )}
          {
            competition.status !== "COMPLETED" &&
            competition.competitionType.code === "TLP" &&
            (
              application.applicationStatus === "NEW" ||
              application.applicationStatus === "REWORK_DOCS") &&
              applicant && (
                <PersonalTables
                  applicant={applicant}
                  loadFile={this.loadFile}
                  ref={this.personalRef}
                />
            )
          }
          {
            competition.status !== "COMPLETED" &&
            competition.competitionType.code === "TLP" &&
            application.applicationStatus !== "NEW" &&
            application.applicationStatus !== "REWORK_DOCS" && (
              <PersonalViewTables
                applicant={applicant}
                loadFile={this.loadFile}
                ref={this.personalRef}
              />
            )}
          {
            application.applicationStatus === "PHASE_1_FINISHED" && (
              <>
                {this.state.checkedCompetition &&
                  this.state.checkedCompetition.isEasyStart && (
                    <h2
                      style={{
                        display: "flex",
                        color: "green",
                        justifyContent: "center",
                        paddingTop: "50px",
                      }}
                    >
                      <Trans>phase1Finished</Trans>
                    </h2>
                  )}
              </>
            )
          }
          {
            competition.status !== "COMPLETED" &&
            (
              application.applicationStatus !== "NEW" &&
              application.applicationStatus !== "PENDING" &&
              application.applicationStatus !== "TEAMLEAD_REWORK") && (
              <>
                {
                  this.state.checkedCompetition &&
                  this.state.checkedCompetition.isEasyStart &&
                  application.star && application.star.length !== 0 &&
                  this.loadStars()
                }
              </>
              )
            }
          {
            application.applicationStatus !== "NEW" &&
            (
              <React.Fragment>
                {this.state.checkedCompetition &&
                  this.state.checkedCompetition.isEasyStart &&
                  this.state.dataMap &&
                  this.statusTable(this.state.dataMap)}
              </React.Fragment>
            )}
          {
            competition.status !== "COMPLETED" &&
            (application.applicationStatus === "NEW" ||
              application.applicationStatus === "REWORK_DOCS" ||
              application.applicationStatus === "PENDING" ||
              application.applicationStatus === "TEAMLEAD_REWORK" ||
              application.applicationStatus === "REVISION_AFTER_VALIDATION" ||
                application.applicationStatus === "BUSINESS_PLAN") && (
              <React.Fragment>
                <Agreement />
                {this.state.checkedCompetition &&
                this.state.checkedCompetition.isEasyStart
                  ? this.state.buttonsInfo && (
                    <LoadButtons
                        appId={this.props.match.params["id"]}
                        buttonsInfo={this.state.buttonsInfo}
                        saveApplicationWithProcess={this.saveApplicationWithProcess}
                        onFileChange={this.onFileChange}
                        handlePassword={this.handlePassword}
                    />
                  )
                  : !this.state.buttonsInfo && (
                      <div className="application-form__footer">
                        <button
                          className="application-form__save"
                          onClick={this.saveApplication}
                        >
                          <Trans>Save</Trans>
                        </button>
                      </div>
                    )}
              </React.Fragment>
            )}
          {
            competition.status !== "COMPLETED" &&
            (application.applicationStatus === "NEW" ||
              application.applicationStatus === "REWORK_DOCS") && (
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
                  <div className="modal">
                    <div className="modal__header">
                      <h1><Trans>Confirmation</Trans></h1>
                    </div>
                    <div className="modal__content">
                      ???? ?????????????????????????? ?????????????????? ???????? ?????????????????????? ???????????? ??
                      ???????????? ?????????????????????? ???????????? ???? ???????????????????????? ????????????????????
                      ?????????????????
                    </div>
                    <div className="modal__actions">
                      <button
                        className="confirm-button"
                        onClick={() => {
                          this.sendApplication();
                          close();
                        }}
                      >
                        ????
                      </button>
                      <button className="cancel-button" onClick={close}>
                        <Trans>Cancel</Trans>
                      </button>
                    </div>
                  </div>
                )}
              </Popup>
            )}
        </div>
      );
    }
  }
}

export default ApplicationDetail;
