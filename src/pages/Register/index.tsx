import * as React from "react";
import { observer } from "mobx-react";
import { AppStateObserver, injectAppState } from "../../stores";
import { Link, Redirect, RouteComponentProps } from "react-router-dom";

import "./Register.css";

export interface RegisterProps {}

export interface RegisterState {}
@injectAppState
@observer
class Register extends React.Component<
  AppStateObserver & RouteComponentProps,
  RegisterProps,
  RegisterState
> {
  state = {
    password: "",
    passwordConfirm: "",
    hash: "",
    error: "",
    passwordError: "",
    passwordConfirmError: ""
  };
  handlePasswordConfirmChange = event => {
    this.setState({ passwordConfirm: event.target.value });
  };
  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  };

  handleOnSubmit = event => {
    event.preventDefault();
    this.login();
  };

  validate = (password1, password2) => {
    if (password1 === "") {
      this.setState({ passwordError: "Введите пароль" });
    } else this.setState({ passwordError: "" });
    if (password2 === "") {
      this.setState({ passwordConfirmError: "Введите пароль повторно" });
    } else this.setState({ passwordConfirmError: "" });
    if (password1 && password2) {
      if (password1 === password2) {
        this.setState({ error: "" });
        return true;
      } else {
        this.setState({ error: "Пароли не совпадают" });
        return false;
      }
    } else {
      return false;
    }
  };
  componentDidMount() {
    this.setState({ hash: this.props.match.params["hash"] });
  }

  login = () => {
    const { password, passwordConfirm } = this.state;
    if (this.validate(password, passwordConfirm)) {
      this.props.appState.userStore
        .restoreUserByHash({
          hash: this.state.hash,
          password: this.state.password
        })
        .then(res => {
          console.log(res);
          this.props.history.push("/sign-in");
        });
    }
  };
  constructor(props) {
    super(props);
  }
  render() {
    const {
      password,
      passwordConfirm,
      error,
      passwordError,
      passwordConfirmError
    } = this.state;
    return (
      <React.Fragment>
        <div className="sign-in__wrapper">
          <div className="sign-in__container">
            <h1 className="sign-in__header">Подтверджение регистрации</h1>
            <form className="sign-in__panel" onSubmit={this.handleOnSubmit}>
              <div className="sign-in__login">
                {/* <label className="sign-in__label">Пароль</label> */}
                <input
                  type="password"
                  className="register__input"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={event => this.handlePasswordChange(event)}
                />
              </div>
              {passwordError && (
                <p className="register__error">{passwordError}</p>
              )}
              <div className="sign-in__password">
                {/* <label className="sign-in__label">Повторите пароль</label> */}
                <input
                  type="password"
                  className="register__input"
                  placeholder="Повторите пароль"
                  value={passwordConfirm}
                  onChange={event => this.handlePasswordConfirmChange(event)}
                />
              </div>
              {passwordConfirmError && (
                <p className="register__error">{passwordConfirmError}</p>
              )}
              {error && <p className="register__error">{error}</p>}
              <Link to="/sign-up" className="sign-up__link">
                Зарегистрироваться
              </Link>
              <button onClick={this.login} className="sign-in__button">
                Войти
              </button>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Register;
