import * as React from "react";
import { observer } from "mobx-react";
import { AppStateObserver, injectAppState } from "../../stores";
import { Link, RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import { Trans } from "react-i18next";

import "react-toastify/dist/ReactToastify.css";
import "./ChangePassword.css";
import i18next from "i18next";
export interface ChangePasswordProps {}

export interface ChangePasswordState {}
@injectAppState
@observer
class ChangePassword extends React.Component<
  AppStateObserver & RouteComponentProps,
  ChangePasswordProps,
  ChangePasswordState
> {
  state = {
    login: "",
    oldPw: "",
    newPw: "",
    newPwConfirm: "",
    oldPasswordError: "",
    passwordError: "",
    passwordConfirmError: "",
    error: "",
  };
  handlePasswordConfirmChange = (event) => {
    this.setState({ newPwConfirm: event.target.value });
  };
  handleOldPasswordChange = (event) => {
    this.setState({ oldPw: event.target.value });
  };
  handleNewPasswordChange = (event) => {
    this.setState({ newPw: event.target.value });
  };

  handleOnSubmit = (event) => {
    event.preventDefault();
    const { login, oldPw, newPw, newPwConfirm } = this.state;
    if (this.validate(oldPw, newPw, newPwConfirm)) {
      this.props.appState.userStore
        .changePassword({
          login: login,
          oldPw: oldPw,
          newPw: newPw,
        })
        .then((res) => {
          if (JSON.parse(res).status === "SUCCESS") {
            toast.success(i18next.t("Success"), {
              position: toast.POSITION.BOTTOM_CENTER,
            });
          } else {
            toast.error("Неверный пароль", {
              position: toast.POSITION.BOTTOM_CENTER,
            });
          }
        });
    }
  };

  validate = (oldPassword, password1, password2) => {
    if (oldPassword === "") {
      this.setState({ oldPasswordError: "Введите старый пароль" });
    } else this.setState({ oldPasswordError: "" });
    if (password1 === "") {
      this.setState({ passwordError: "Введите новый пароль" });
    } else this.setState({ passwordError: "" });
    if (password2 === "") {
      this.setState({ passwordConfirmError: "Введите новый пароль повторно" });
    } else this.setState({ passwordConfirmError: "" });
    if (password1 && password2 && oldPassword) {
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
    const login = localStorage.getItem("applicant");
    this.setState({ login });
  }

  constructor(props) {
    super(props);
  }
  render() {
    const {
      login,
      oldPw,
      newPw,
      newPwConfirm,
      oldPasswordError,
      passwordError,
      passwordConfirmError,
      error,
    } = this.state;
    return (
      <React.Fragment>
        <div className="password-change__container">
          <div className="password-change__item">
            <label htmlFor="">
              <Trans>Username</Trans>
            </label>
            <input type="text" defaultValue={login} readOnly />
          </div>
          <div className="password-change__item">
            <label htmlFor="">
              <Trans>OldPassword</Trans>
            </label>
            <input
              type="password"
              onChange={(event) => this.handleOldPasswordChange(event)}
              placeholder="••••••••••"
            />
          </div>
          <p className="password-change__error">{oldPasswordError}</p>
          <div className="password-change__item">
            <label htmlFor="">
              <Trans>NewPassword</Trans>
            </label>
            <input
              type="password"
              onChange={(event) => this.handleNewPasswordChange(event)}
              placeholder="••••••••••"
            />
          </div>
          <p className="password-change__error">{passwordError}</p>
          <div className="password-change__item">
            <label htmlFor="">
              <Trans>ConfirmPassword</Trans>
            </label>
            <input
              type="password"
              onChange={(event) => this.handlePasswordConfirmChange(event)}
              placeholder="••••••••••"
            />
          </div>
          <p className="password-change__error">{passwordConfirmError}</p>
          <p className="password-change__error">{error}</p>
          <button
            className="apply-button"
            style={{ width: "250px", marginTop: "43px" }}
            onClick={(event) => {
              this.handleOnSubmit(event);
            }}
          >
            <Trans>Save</Trans>
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default ChangePassword;
