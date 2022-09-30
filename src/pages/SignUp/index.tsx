import * as React from "react";
import "./SignUp.css";
import { AppStateObserver, injectAppState } from "../../stores";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router-dom";
import { Trans } from "react-i18next";
// import i18next from "i18next";
import i18n from "../../i18n";
import { toast } from "react-toastify";
import i18next from "i18next";

export interface SignUpProps {}

export interface SignUpState {}

@injectAppState
@observer
class SignUp extends React.Component<
  AppStateObserver & RouteComponentProps,
  SignUpProps,
  SignUpState
> {
  state = {
    form: {
      idNumber: "",
      firstname: "",
      lastname: "",
      middlename: "",
      email: "",
      applicantType: "STUDENT",
      agree: false,
      iin: '',
    },
    buttons: [
      {
        name: "Student",
        active: true,
        value: "STUDENT",
      },
      {
        name: "Employee",
        active: false,
        value: "EMPLOYEE",
      },
      // {
      //   name: "Organization",
      //   active: false,
      //   value: "ORGANIZATION",
      // },
      {
        name: "GraduateNIS",
        active: false,
        value: "GRADUATE_NIS",
      },
      {
        name: "GraduateNU",
        active: false,
        value: "GRADUATE_NU",
      },
      // {
      //   name: "ThirdPerson",
      //   active: false,
      //   value: "THIRD_PERSON",
      // },
    ],
    emailError: "",
    firstnameError: "",
    lastnameError: "",
    idNumberError: "",
    iinError: "",
  };

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    
    let form = { ...this.state.form };
    
    if(name == 'iin') {
      const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);

      console.log('isNumeric', isNumeric(value));
      
      if(!isNumeric(value)) {
        return
      }
      
      if(value.length <= 12) {
        form['iin'] = value
        this.setState({
          form,
        });
      }
      return 
    }
    // console.log(form);
    form[name] = value;
    this.setState({
      form,
    });
  };
  validateForm = (form) => {
    this.checkIdNameSurname(form)
    return form.idNumber !== "" &&
          form.firstname !== "" &&
          form.lastname !== "" &&
          // form.middlename !== "" &&
          form.email !== "" &&
          form.applicantType !== "" &&
          form.agree !== false &&
          form.iin !== ''
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const form = { ...this.state.form };
    form.email = form.email.trim();
    if (this.validateForm(form)) {
      console.log("yeah");
      console.log(form);
      delete form.agree;
      this.props.appState.applicantsStore
        .registerApplicant(form)
        .then((res) => {
          let result = res as string;
          let status = JSON.parse(result).status;
          let message = JSON.parse(result).message
              ? JSON.parse(result).message
              : i18next.t("Error");
              if (status === "SUCCESS") {
                toast.success("Заявка на регистрацию отправлена, ожидайте письмо на почту", {
                  position: toast.POSITION.BOTTOM_CENTER,
                });
                this.props.history.push("/sign-up/confirmation");
              }
              else if(status === "EMAIL_ERROR") {
                toast.error(message, {
                  position: toast.POSITION.BOTTOM_CENTER,
                });
              }
              else if(status === "ERROR") {
                toast.error("Возможно email или id уже есть в базе, попробуйте еще раз", {
                  position: toast.POSITION.BOTTOM_CENTER,
                });
              }
              else if (status === "WARNING") {
                toast.error(message, {
                  position: toast.POSITION.BOTTOM_CENTER,
                });
              }
        })
        .catch((err) => {
          toast.error("Возникла ошибка", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        });
    } else {
      console.log("oops");
    }
  };


  checkEmail = (email) => {
    // let index = email.lastIndexOf("@");
    // let nu = email.substr(index);
    // if (nu !== "@nu.edu.kz") {
    //   this.setState({ emailError: "Email должен содержать @nu.edu.kz" });
    //   return false;
    // } else {
    //   this.setState({ emailError: "" });
    //   return true;
    // }
    return true;
  };

  checkIdNameSurname = (form) => {
    if (form.firstname === "") this.setState({ firstnameError: "Введите имя" });
    else this.setState({ firstnameError: "" });

    if (form.lastname === "")
      this.setState({ lastnameError: "Введите фамилию" });
    else this.setState({ lastnameError: "" });
    
    if (form.idNumber === "") this.setState({ idNumberError: "Введите ID" });
    else this.setState({ idNumberError: "" });
    
    if (form.iin === "") this.setState({ iinError: "Введите ИИН" });
    else this.setState({ iinError: "" });

    if (form.email === "") this.setState({ emailError: "Введите email" });
    else this.setState({ emailError: "" });
    
    if (form.idNumber && form.firstname && form.lastname) return true;
    else return false;
  };

  setApplicantType = (type) => {
    let buttons = [...this.state.buttons];
    buttons.forEach((button) => {
      if (button.value === type) button.active = true;
      else button.active = false;
    });
    let form = { ...this.state.form };
    form.applicantType = type;
    this.setState({ buttons, form });
  };

  render() {
    const { form, buttons } = this.state;
    const { language } = this.props.appState.userStore;
    return (
      <div className="signup__wrapper">
        <div className="signup__container">
          <h1 className="signup__header">
            <Trans>SignUpPage</Trans>
          </h1>
          <form
            className="signup-form"
            onSubmit={this.handleSubmit}
            autoComplete="off"
          >
            <label className="signup-form__label">
              <Trans>ApplicantType</Trans>
            </label>
            <div className="signup__user-type">
              {buttons.map((btn, idx) => (
                <button
                  key={idx}
                  className={this.renderApplicantTypeClass(btn.active)}
                  type="button"
                  onClick={() => this.setApplicantType(btn.value)}
                >
                  <Trans>{btn.name}</Trans>
                </button>
              ))}
            </div>
            <div className="signup-form__item">
              <label className="signup-form__label">
                ID<span>*</span>
              </label>
              <input
                className="signup-form__input"
                type="text"
                placeholder="ID"
                value={form.idNumber}
                name="idNumber"
                onChange={this.handleInputChange}
                autoComplete="off"
              />
            </div>
            <p className="signup__error">{this.state.idNumberError}</p>
            <div className="signup-form__item">
              <label className="signup-form__label">
                <Trans>Name</Trans>
                <span>*</span>
              </label>
              <input
                className="signup-form__input"
                type="text"
                placeholder={i18n.t("Name")}
                value={form.firstname}
                name="firstname"
                onChange={this.handleInputChange}
                autoComplete="off"
              />
            </div>
            <p className="signup__error">{this.state.firstnameError}</p>
            <div className="signup-form__item">
              <label className="signup-form__label">
                <Trans>Surname</Trans>
                <span>*</span>
              </label>
              <input
                className="signup-form__input"
                type="text"
                placeholder={i18n.t("Surname")}
                value={form.lastname}
                name="lastname"
                onChange={this.handleInputChange}
                autoComplete="off"
              />
            </div>
            <p className="signup__error">{this.state.lastnameError}</p>
            <div className="signup-form__item">
              <label className="signup-form__label">
                <Trans>Middlename</Trans>
              </label>
              <input
                className="signup-form__input"
                type="text"
                placeholder={i18n.t("Middlename")}
                value={form.middlename}
                name="middlename"
                onChange={this.handleInputChange}
                autoComplete="off"
              />
            </div>
            <div className="signup-form__item">
              <label className="signup-form__label">
                <Trans>IIN</Trans><span>*</span>
              </label>
              <input
                  className="signup-form__input"
                  type="text"
                  placeholder={i18n.t("IIN")}
                  value={form.iin}
                  name="iin"
                  onChange={this.handleInputChange}
                  autoComplete="off"
              />
            </div>
            <p className="signup__error">{this.state.iinError}</p>
            <div className="signup-form__item">
              <label className="signup-form__label">
                <Trans>EmailAddress</Trans>
                <span>*</span>
              </label>
              <input
                className="signup-form__input"
                type="text"
                placeholder={i18n.t("EmailAddress")}
                value={form.email}
                name="email"
                onChange={this.handleInputChange}
                autoComplete="off"
              />
            </div>
            <p className="signup__error">{this.state.emailError}</p>
            <div className="signup-form__item agreement">
              <input
                type="checkbox"
                onChange={this.handleInputChange}
                checked={form.agree}
                name="agree"
                autoComplete="off"
              />
              <p className="signup__agreement-text">
                <Trans>SignUpAgreement</Trans>
              </p>
            </div>
            <div className="signup-form__item submit">
              <button className="signup-form__button">
                <Trans>Confirm</Trans>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  renderApplicantTypeClass(active) {
    let buttonClass = "confirm-button";
    if (!active) buttonClass += "_reverse";
    return buttonClass;
  }
}

export default SignUp;
