import * as React from "react";
import Header from "../../components/Header";
import NavigationTabs from "../../components/NavigationTabs";
import "./MainLayout.css";
import { AppStateObserver, injectAppState } from "../../stores";
import { observer } from "mobx-react";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import IdleTimer from "react-idle-timer";
import TeamMemberDetails from "../../components/TeamMembersDetails";
import { toast } from "react-toastify";

export interface MainLayoutProps {}

export interface MainLayoutState {}

@injectAppState
@observer
class MainLayout extends React.Component<
  AppStateObserver & RouteComponentProps,
  MainLayoutProps,
  MainLayoutState
> {
  constructor(props) {
    super(props);
    this.idleTimer = null;
  }

  idleTimer;

  state = {
    timeout: 1000 * 60 * 15,
    isTimedOut: false,
    teamMember: false,
    teamRole: null,
    applicant: null,
    anketaOk: null
  };

  onAction = (e) => {
    this.setState({ isTimedOut: false });
  };

  onActive = (e) => {
    this.setState({ isTimedOut: false });
  };

  onIdle = (e) => {
    const isTimedOut = this.state.isTimedOut;
    if (isTimedOut) {
      this.props.history.push("/");
    } else {
      this.idleTimer.reset();
      this.setState({ isTimedOut: true });
      this.props.appState.userStore.logout();
      this.props.history.push("/sign-in");
    }
  };

  Func = async () => {
    try {
      let userInfo = await this.props.appState.userStore.getUserInfo2();
      let teamRole = await this.props.appState.userStore.teamMemberOrTeamLead(userInfo.id);
      
      let applicant = await this.props.appState.applicantsStore.loadApplicant2(userInfo.login);
      teamRole && this.setState({teamRole: JSON.parse(teamRole).teamRole});
      applicant && this.setState({applicant})
      localStorage.setItem("UserInfoId", userInfo.id);
    }
    catch (e) {
      
    }
  }
  componentDidMount = () => {
    this.Func();
  }

  render() {
    const { authenticated } = this.props.appState.userStore;
    if (!authenticated) {
      return (
        <React.Fragment>
          <Redirect to="/sign-in" />
          {this.props.children}
        </React.Fragment>
      );
    }
    else if (authenticated && this.state.teamRole && this.state.teamRole.isTeamMember) {
      return (
        <React.Fragment>
          {/* {console.log(this.state.applicant)} */}
          <IdleTimer
            ref={(ref) => {
              this.idleTimer = ref;
            }}
            element={document}
            onActive={this.onActive}
            onIdle={this.onIdle}
            onAction={this.onAction}
            debounce={250}
            timeout={this.state.timeout}
          />
          <Header />
          <div className="page-wrapper">
            <div className="page-container">
              {this.props.location.pathname !== "/cabinet/personal" ? <TeamMemberDetails
                anketaOk={this.state.teamRole.anketaOk}
                appId={this.state.teamRole.applicationId}
                competitionId={this.state.teamRole.competitionId}
                userId={localStorage.getItem("UserInfoId")}
                /> : this.props.children}
            </div>
          </div>
        </React.Fragment>
      )
    }
    else if (this.state.teamRole && !this.state.teamRole.isTeamMember && this.state.applicant && this.state.applicant[0].applicantType === "THIRD_PERSON") {
      localStorage.removeItem("fsr_cubaAccessToken")
      console.log(this.state.applicant);
      
      return (
      <React.Fragment>
        <Redirect to="/sign-in" />
        {toast.error("У вас нет активной заявки в котором вы член команды", {
        position: toast.POSITION.BOTTOM_CENTER,
      })}
      </React.Fragment>)
    }
    else {
      return (
        <React.Fragment>
          <IdleTimer
            ref={(ref) => {
              this.idleTimer = ref;
            }}
            element={document}
            onActive={this.onActive}
            onIdle={this.onIdle}
            onAction={this.onAction}
            debounce={250}
            timeout={this.state.timeout}
          />
          {/* {console.log(this.state.teamRole)} */}
          <Header />
          <div className="page-wrapper">
            <div className="page-container">
              <NavigationTabs />
              {this.props.children}
            </div>
          </div>
        </React.Fragment>
      );
    }
  }
}

export default withRouter(MainLayout);
