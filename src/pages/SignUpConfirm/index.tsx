import * as React from "react";
import { Link } from "react-router-dom";

import "./SignUpConfirm.css";

export interface SignUpConfirmProps {}

const SignUpConfirm: React.SFC<SignUpConfirmProps> = () => {
  return (
    <div className="signup__wrapper">
      <div className="signup__container">
        <h1 className="signup-confirm__heading">Спасибо за обращение</h1>
        <p className="signup-confirm__text first">
          На указанный Вами адрес электронной почты было отправлено письмо.
        </p>
        <p className="signup-confirm__text">
          Для продолжения регистрации перейдите по ссылке, указанной в письме.
        </p>
        <Link to="/sign-in" className="signup-confirm__link">
          Войти
        </Link>
      </div>
    </div>
  );
};

export default SignUpConfirm;
