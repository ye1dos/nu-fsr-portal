import * as React from "react";
import { observer } from "mobx-react";
import { Switch, Route, NavLink } from "react-router-dom";
import { AppStateObserver, injectAppState } from "../../stores";
import Applications from "../../components/Applications";
import Personal from "../../components/Personal";
import Contracts from "../Contracts";
import Messages from "../Messages";
import ChangePassword from "../ChangePassword";
import Breadcrumps from "../../components/Breadcrumps";
import Popup from "reactjs-popup";
import i18n from "../../i18n";
import "./Cabinet.css";
import { Trans } from "react-i18next";

export interface CabinetProps {}

export interface CabinetState {}

@injectAppState
@observer
class Cabinet extends React.Component<
  AppStateObserver,
  CabinetProps,
  CabinetState
> {
  state = {
    menuLinks: [
      { name: "personalData", path: "/cabinet/personal" },
      // { name: "fsrMessages", path: "/cabinet/messages" },
      { name: "myApplications", path: "/cabinet/applications" },
      // { name: "myContracts", path: "/cabinet/contracts" },
      { name: "changePassword", path: "/cabinet/change-password" },
    ],
    links: [{ path: "/cabinet", name: "li4nyKabinet" }],
  };

  logout = () => {
    this.props.appState.userStore.logout();
  };

  render() {
    const { links } = this.state;
    const { language } = this.props.appState.userStore;
    return (
      <React.Fragment>
        <Breadcrumps links={links} />
        <div className="cabinet-container">
          <div className="cabinet__menu">
            {this.state.menuLinks.map((item, index) => (
              <NavLink
                className="cabinet__item"
                activeClassName="cabinet__item_active"
                to={item.path}
                key={index}
              >
                {i18n.t(item.name)}
              </NavLink>
            ))}

            <Popup
              trigger={
                <div className="cabinet__item cabinet__item_logout">
                  {i18n.t("Logout")}
                </div>
              }
              modal
            >
              {(close) => (
                <div className="modal">
                  <div className="modal__header">
                    <h1><Trans>Confirmation</Trans></h1>
                  </div>
                  <div className="modal__content">
                    <Trans>ConfirmationLogout</Trans>
                  </div>
                  <div className="modal__actions">
                    <button
                      className="confirm-button"
                      onClick={() => {
                        close();
                        this.logout();
                      }}
                    >
                      Да
                    </button>
                    <button
                      className="cancel-button"
                      onClick={() => {
                        close();
                      }}
                    >
                      <Trans>Cancel</Trans>
                    </button>
                  </div>
                </div>
              )}
            </Popup>
          </div>
          <div className="cabinet-view__container">
            <Switch>
              <Route path="/cabinet/applications" component={Applications} />
              <Route path="/cabinet/personal" component={Personal} />
              <Route path="/cabinet/contracts" component={Contracts} />
              <Route path="/cabinet/messages" component={Messages} />
              <Route
                path="/cabinet/change-password"
                component={ChangePassword}
              />
            </Switch>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Cabinet;
