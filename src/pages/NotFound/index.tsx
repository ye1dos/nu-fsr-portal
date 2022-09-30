import * as React from "react";
import "./NotFound.css";
import { Link } from "react-router-dom";
import image from "../../assets/images/notFound.svg";

export interface NotFoundProps {}
const NotFound: React.SFC<NotFoundProps> = () => {
  return (
    <div className="nf__wrapper">
      <div className="nf__container">
        <h1 className="nf__oops">Ой!</h1>
        <h2 className="nf__descriptions">
          Похоже мы не можем найти нужную вам страницу
        </h2>
        <p className="nf__code">Код ошибки: 404</p>
        <p className="nf__links-heading">Вот несколько полезных ссылок:</p>
        <div className="nf__links">
          <Link to="/" className="nf__link">
            Главная
          </Link>
          <Link to="/faq" className="nf__link">
            Часто задаваемые вопросы
          </Link>
        </div>
      </div>
      <img src={image} alt="not found" className="nf__image" />
    </div>
  );
};

export default NotFound;
