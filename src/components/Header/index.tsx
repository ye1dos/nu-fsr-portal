import React, { Fragment } from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { observer } from "mobx-react";
import { AppStateObserver, injectAppState } from "../../stores";
import logo from "../../assets/icons/logo.png";
import HeaderMenu from "../HeaderMenu";
import { Trans } from "react-i18next";

import "./Header.css";

export interface HeaderProps {}
export interface HeaderState {}

@injectAppState
@observer
class Header extends React.Component<
  AppStateObserver & RouteComponentProps,
  HeaderProps,
  HeaderState
> {
  state = {
    showMenu: false,
  };

  toggleMenu = () => {
    let show = this.state.showMenu;
    show = !show;
    this.setState({ showMenu: show });
  };
  closeMenu = () => {
    this.setState({ showMenu: false });
  };
  logout = () => {
    this.props.appState.userStore.logout();
  };
  handleLanguageChange(language) {
    this.props.appState.userStore.changeLanguage(language);
    this.forceUpdate();
    console.log(language);
    // console.log(this.props);
  }
  render() {
    const { language, authenticated, userName } = this.props.appState.userStore;
    const { showMenu } = this.state;
    return (
      <Fragment>
        <div className="header-wrapper">
          <div className="header-container">
            <Link to="/">
              <img src={logo} alt="logo" className="logo" />
            </Link>
            <div className="header-container__main">
              <div className="header-container__up">
                <p className="header__title">
                  <Trans>PortalHeading</Trans>
                </p>
                <div className="header__links">{this.renderMenu()}</div>
              </div>
              <div className="header-container__down">
                <div className="header-container__down__left">
                  <div className="header__languages">
                  <p
                      className={this.renderActiveLang("kz")}
                      onClick={() => this.handleLanguageChange("kz")}
                    >
                      ҚАЗ
                    </p>
                    <p
                      className={this.renderActiveLang("ru")}
                      onClick={() => this.handleLanguageChange("ru")}
                    >
                      РУС
                    </p>
                    <p
                      className={this.renderActiveLang("en")}
                      onClick={() => this.handleLanguageChange("en")}
                    >
                      ENG
                    </p>
                  </div>

                  {authenticated && (
                    <p className="header__username">
                      <Trans>YouLoggedIn</Trans>:<span>{userName}</span>
                    </p>
                  )}
                  <a href="http://fund.nu.edu.kz/" className="fund__link">
                    <Trans>ReturnToTheSite</Trans>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
  renderMenu() {
    const { authenticated } = this.props.appState.userStore;
    const { showMenu } = this.state;
    if (authenticated) {
      return (
        <Fragment>
          <div className="header__link" onClick={this.toggleMenu}>
            <Trans>Profile</Trans>
          </div>
          <div className="header-menu__wrapper">
            {showMenu ? (
              <HeaderMenu
                logout={this.logout}
                handleClickOutside={this.closeMenu}
              />
            ) : (
              ""
            )}
          </div>
        </Fragment>
      );
    }
  }
  renderActiveLang(lang) {
    const { language } = this.props.appState.userStore;
    // console.log(language);
    let className = "header__language";
    if (lang === language) className += " active";
    return className;
  }
}

export default withRouter(Header);
