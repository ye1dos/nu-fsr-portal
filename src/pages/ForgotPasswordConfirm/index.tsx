import * as React from "react";
import { Link } from "react-router-dom";
import { Trans } from "react-i18next";
import { observer } from "mobx-react";
import { AppStateObserver, injectAppState } from "../../stores";

export interface ForgotPasswordConfirmPropsProps {}

export interface ForgotPasswordConfirmPropsState {}
@injectAppState
@observer
class ForgotPasswordConfirmProps extends React.Component<
  AppStateObserver & ForgotPasswordConfirmPropsProps,
  ForgotPasswordConfirmPropsState
> {
  state = {};
  render() {
    const { language } = this.props.appState.userStore;
    return (
      <div className="signup__wrapper">
        <div className="signup__container">
          <h1 className="signup-confirm__heading">
            <Trans>ThanksforContacting</Trans>
          </h1>
          <p className="signup-confirm__text first">
            <Trans>EmailSentMessage</Trans>
          </p>
          <p className="signup-confirm__text">
            <Trans>ContinueRecoveryText</Trans>
          </p>
          <Link to="/sign-in" className="signup-confirm__link">
            <Trans>Login</Trans>
          </Link>
        </div>
      </div>
    );
  }
}

export default ForgotPasswordConfirmProps;
