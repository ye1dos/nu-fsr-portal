import * as React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Triangle } from "../../assets/icons/triangle.svg";
import onClickOutside from "react-onclickoutside";
import Popup from "reactjs-popup";
import { Trans } from "react-i18next";

import "./HeaderMenu.css";

export interface HeaderMenuProps {
  logout;
  handleClickOutside;
}

export interface HeaderMenuState {}

class HeaderMenu extends React.Component<HeaderMenuProps, HeaderMenuState> {
  state = {
    menu: [
      { name: "personalData", link: "/cabinet/personal" },
      // { name: "fsrMessages", link: "/cabinet/messages" },
      { name: "myApplications", link: "/cabinet/applications" },
      // { name: "myContracts", link: "/cabinet/contracts" },
      { name: "changePassword", link: "/cabinet/change-password" },
    ],
  };
  handleClickOutside = () => {
    this.props.handleClickOutside();
  };
  render() {
    const { menu } = this.state;
    const { logout } = this.props;
    return (
      <div className="header-menu">
        <Triangle className="triangle" />
        <div className="header-menu__container">
          {menu.map((item, idx) => (
            <Link
              className="header-menu__item"
              to={item.link}
              key={idx}
              onClick={this.props.handleClickOutside}
            >
              <Trans>{item.name}</Trans>
            </Link>
          ))}
          <Popup
            trigger={
              <a className="header-menu__item">
                <Trans>Logout</Trans>
              </a>
            }
            modal
          >
            {(close) => (
              <div className="modal">
                <div className="modal__header">
                  <h1>
                    <Trans>Confirmation</Trans>
                  </h1>
                </div>
                <div className="modal__content">
                  <Trans>ConfirmationLogout</Trans>
                </div>
                <div className="modal__actions">
                  <button
                    className="confirm-button"
                    onClick={() => {
                      close();
                      logout();
                    }}
                  >
                    <Trans>Yes</Trans>
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => {
                      close();
                      this.props.handleClickOutside();
                    }}
                  >
                    <Trans>Cancel</Trans>
                  </button>
                </div>
              </div>
            )}
          </Popup>
        </div>
      </div>
    );
  }
}

export default onClickOutside(HeaderMenu);
