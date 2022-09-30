import * as React from "react";
import { toJS } from "mobx";
import { AppStateObserver, injectAppState } from "../../stores";
import { observer } from "mobx-react";
import { format } from "date-fns";
import { enGB, eo, ru } from "date-fns/locale";
import TeamMemberViewPage from "../TeamMemberViewPage";
import Popup from "reactjs-popup";
import TeamMemberApplicationInfo from "../TeamMemberApplicationInfo";
import { Trans } from "react-i18next";
import i18n from "../../i18n";
import LoadButtons from "../../helpers/loadButtons";
import localeChanger from "../../helpers/localeChanger";
export interface TeamMemberDetailsProps {
    appId : any;
    competitionId : any;
    userId: any;
    anketaOk: any;
}

export interface TeamMemberDetailsState {}

@injectAppState
@observer
class TeamMemberDetails extends React.Component<
TeamMemberDetailsProps & AppStateObserver,
    TeamMemberDetailsState
> {
  state = {
    file: null,
    base64URL: "",
    password: null,
    tabs: [
      { name: "Programs", active: true },
      { name: "PlanRashodov", active: false },
      { name: "teamMembers", active: false}
      ],
      application: null,
      competition: null,
      buttonsInfo: new Map(),
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
      comment: null,
      statuses: {
        NEW: "Новый",
        COLLECTION_OF_APPLICATION: "Сбор заявок",
        REVIEW: "На рассмотрении",
        COMPLETED: "Завершен",
      },
      directions: [],
      errorMessage: null,
      anketaMessage: "Вам не доступна подача заявки, заполните анкету в личном кабинете",
      dataMap: null,
      anketaOk: this.props.anketaOk,
  };
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.personalRef = React.createRef();
  }
  formRef;
  personalRef;
  loadEntities = async () => {
    let buttonsInfo =  null;
    let application = await this.props.appState.applicationsStore.loadEntity2(this.props.appId);
    let competition = await this.props.appState.competitionsStore.loadEntity2(this.props.competitionId);
    let dataMap = await this.props.appState.applicationsStore.populatorFrontVisible(this.props.appId);
    try {
      let teamRole = await this.props.appState.userStore.teamMemberOrTeamLead(this.props.userId);
      let parsedTeamRole = JSON.parse(teamRole);
      this.setState({anketaOk: parsedTeamRole.teamRole.anketaOk});
    }
    catch (e) {
      
    }
    this.setState({dataMap: JSON.parse(dataMap)});
    this.setState({application});
    this.setState({competition});

    try {
      buttonsInfo = await this.props.appState.competitionsStore.getButtons(this.props.appId, localStorage.getItem("UserInfoId"));
      
      if(buttonsInfo) {
        this.setState({
          buttonsInfo: JSON.parse(buttonsInfo),
        });
      }
      if(!buttonsInfo) {
        this.setState({errorMessage: "Вы уже отправили ответ"})
      }
    }
    catch(e) {
      console.log("buttonInfo Error")
    }
  }
  componentDidMount = () => {
      this.loadEntities();
  };
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
  handleCommentChange = (e) => {
    this.setState({
      comment: e.target.value
    })
  }
  verifyApplication3 = () => {
    this.formRef.current.verifyApplication3();
    if (this.personalRef.current) {
      this.personalRef.current.verifyApplication3();
    }
  }
  hideByName = (name, applicant) => {
    if (name === "Проверки"
        || name === "Направление на членов комиссии"
        || name === "Звезды по итогам внутренней оценки"
        || name === "Направление на членов внешней комиссии"
        || name === "Звезды по итогам внешней оценки"
        || name === "Звезды по итогам бизнес плана") {
      return <Trans>RO</Trans>;
    }
    else if (name === "Голосование SP" || name === "Голосование") {
      return <Trans>InnerCommission</Trans>;
    }
    else if (name === "Итоговое Правление"
        || name === "Правление по итогам внешней оценки"
        || name === "Правление по итогам внутренней оценки") {
      return <Trans>BoardMember</Trans>;
    }
    else if (name === "Внешнее голосование") {
      return <Trans>OuterCommission</Trans>;
    }
    else {
      return applicant;
    }
  }
  loadStars = (application) => {
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
                    <p className="datamap__info__value">
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
                  {/*  <p className="datamap__info__value" style={{maxWidth: "300px"}}>*/}
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
  render() {
    const { 
        application, 
        buttonsInfo,
        base64URL, 
        password ,
        competition
    } = this.state;
    const { language } = this.props.appState.userStore;
      return (
        <React.Fragment>
          <div className="competition-container">
            <TeamMemberApplicationInfo
              application={application}
            />
            {competition &&
            <TeamMemberViewPage
              competition={competition}
              espFile={base64URL}
              password={password}
              application={application}
              ref={this.formRef}
              comment={this.state.comment}
            />}
            {this.state.anketaOk === false && 
            <h2 style={{display: "flex", color: "red", justifyContent: "center", paddingTop: "50px"}}><Trans>fillOut</Trans></h2>
            }
            {application && application.star && application.star.length !== 0 &&
                  this.loadStars(application)}
            {this.state.dataMap && (this.statusTable(this.state.dataMap))}
            {this.state.anketaOk &&
                <React.Fragment>
                  {buttonsInfo && (
                      <LoadButtons
                          appId={localStorage.getItem('appId')}
                          buttonsInfo={this.state.buttonsInfo}
                          saveApplicationWithProcess={this.saveApplicationWithProcess}
                          onFileChange={this.onFileChange}
                          handlePassword={this.handlePassword}
                      />
                  )}
                  </React.Fragment>}
          </div>
        </React.Fragment>
      );
  }
}


export default TeamMemberDetails;
