import * as React from "react";
import { Link } from "react-router-dom";

import "./Breadcrumps.css";
import homeIcon from "../../assets/icons/home-icon.svg";
import arrowRightIcon from "../../assets/icons/arrow-right.svg";
import i18next from "i18next";

export interface BreadcrumpsProps {
  links;
}

const Breadcrumps: React.SFC<BreadcrumpsProps> = props => {
  const { links } = props;
  return (
    <div className="breadcrumps__container">
      <Link to="/">
        <img src={homeIcon} alt="home icon" />
      </Link>
      {links.map((link, idx) => (
        <div className="breadcrumps__item" key={idx}>
          <img src={arrowRightIcon} alt="" className="breadcrumps__arrow" />
          <Link to={link.path} className="breadcrumps__link">
            {i18next.t(link.name)}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Breadcrumps;
