import * as React from "react";
import { observer } from "mobx-react";
import { AppStateObserver, injectAppState } from "../../stores";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import { Trans } from "react-i18next";

export interface ForgotPasswordProps {}

export interface ForgotPasswordState {}
@injectAppState
@observer
class ForgotPassword extends React.Component<
  AppStateObserver & RouteComponentProps,
  ForgotPasswordProps,
  ForgotPasswordState
> {
  state = {
    username: "",
  };
  handleUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  };

  handleOnSubmit = (event) => {
    event.preventDefault();
    this.props.appState.userStore
      .addNewRestoreHash(this.state.username)
      .then((res) => {
        let status = JSON.parse(res).status;
        if (status === "SUCCESS") {
          this.props.history.push("/forgot-password/confirmation");
        }
        if (status === "ERROR") {
          toast.error("Пользователь с таким логином не существует", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      });
  };

  constructor(props) {
    super(props);
  }
  render() {
    const { language } = this.props.appState.userStore;
    return (
      <React.Fragment>
        <div className="sign-in__wrapper">
          <div className="sign-in__container">
            <h1 className="sign-in__header">
              <Trans>EnterRecoveryEmail</Trans>
            </h1>
            <form className="sign-in__panel" onSubmit={this.handleOnSubmit}>
              <div className="sign-in__login">
                <label className="sign-in__label">
                  <Trans>Username</Trans>
                </label>
                <input
                  type="text"
                  className="sign-in__input sign-in__input_login"
                  placeholder="e-mail"
                  value={this.state.username}
                  onChange={(event) => this.handleUsernameChange(event)}
                />
              </div>
              <button className="sign-in__button">
                <Trans>Send</Trans>
              </button>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }

  renderLoginError(error) {
    if (error) {
      return <p className="sign-in__error">{error}</p>;
    }
  }
}

export default ForgotPassword;
