import * as React from "react";
import Header from "../../components/Header";
import { AppStateObserver, injectAppState } from "../../stores";
import { observer } from "mobx-react";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import IdleTimer from "react-idle-timer";

export interface HeaderLayoutProps {}

export interface HeaderLayoutState {}

@injectAppState
@observer
class HeaderLayout extends React.Component<
  AppStateObserver & RouteComponentProps,
  HeaderLayoutProps,
  HeaderLayoutState
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
  }
  componentDidMount() {}
  render() {
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
        <Header />
        <div className="page-wrapper">
          <div className="page-container">{this.props.children}</div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(HeaderLayout);
