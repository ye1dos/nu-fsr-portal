import * as React from "react";
import { observer } from "mobx-react";
import { AppStateObserver, injectAppState } from "../../stores";
import { Link, Redirect } from "react-router-dom";
import "./SignIn.css";
import { Trans } from "react-i18next";
// import logo from "./../../assets/icons/logo.svg";
// import eye from "../../assets/icons/eye.svg";
import { cubaREST } from "../../cubaREST";

export interface SignInProps {}

export interface SignInState {}
@injectAppState
@observer
class SignIn extends React.Component<
  AppStateObserver,
  SignInProps,
  SignInState
> {
  state = {
    username: "",
    password: "",
    usernameError: "",
    passwordError: "",
  };
  handleUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  };
  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  handleOnSubmit = (event) => {
    event.preventDefault();
    this.login();
  };

  login = () => {
    const { username, password } = this.state;
    if (this.validate(username, password)) {
      this.props.appState.userStore.login(
        this.state.username,
        this.state.password
      );
    }
  };
  validate = (username, password) => {
    if (username === "") this.setState({ usernameError: "Введите логин" });
    else this.setState({ usernameError: "" });
    if (password === "") this.setState({ passwordError: "Введите пароль" });
    else this.setState({ passwordError: "" });
    if (username && password) return true;
    else return false;
  };
  constructor(props) {
    super(props);
  }
  render() {
    const {
      authenticated,
      loginError,
      language,
    } = this.props.appState.userStore;
    if (cubaREST.restApiToken) {
      return <Redirect to="/" />;
    }
    return (
      <React.Fragment>
        <div className="sign-in__wrapper">
          <div className="sign-in__container">
            <h1 className="sign-in__header">
              <Trans>SignIn</Trans>
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
              {this.state.usernameError ? (
                <p className="sign-in__error">{this.state.usernameError}</p>
              ) : (
                ""
              )}
              <div className="sign-in__password">
                <label className="sign-in__label">
                  <Trans>Password</Trans>
                </label>
                <input
                  type="password"
                  className="sign-in__input"
                  placeholder="••••••••••"
                  value={this.state.password}
                  onChange={(event) => this.handlePasswordChange(event)}
                />
                <Link to="forgot-password" className="forgot-password__link" style={{right: language === "kz" ? "-180px" : "-126px"}}>
                  <Trans>ForgotPassword</Trans>
                </Link>
              </div>
              {this.state.passwordError ? (
                <p className="sign-in__error">{this.state.passwordError}</p>
              ) : (
                ""
              )}
              {this.renderLoginError(loginError)}
              <Link to="/sign-up" className="sign-up__link">
                <Trans>SignUp</Trans>
              </Link>
              <button onClick={this.login} className="sign-in__button">
                <Trans>Login</Trans>
              </button>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }

  renderLoginError(error) {
    if (error && !this.state.usernameError && !this.state.passwordError) {
      return <p className="sign-in__error">{error}</p>;
    }
  }
}

export default SignIn;
