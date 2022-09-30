import * as React from "react";
import "../Competition/Competition.css";
import { Link } from "react-router-dom";
import { format, differenceInCalendarDays } from "date-fns";
import { ru, enGB } from "date-fns/locale";
import { Trans } from "react-i18next";
import { observer } from "mobx-react";
import { AppStateObserver, injectAppState } from "../../stores";
import { toast } from "react-toastify";
import Popup from "reactjs-popup";
import {cubaREST} from "../../cubaREST";
import i18next from "i18next";
import {toJS} from "mobx";
import localeChanger from "../../helpers/localeChanger";

export interface SentApplicationViewProps {
  name: string;
  dateStart: string;
  dateEnd: string;
  id: string;
  status: string;
  info: string;
  isMainPage?: boolean;
  appId: any;
  anketaOk: any;
}

export interface SentApplicationViewState { }

@injectAppState
@observer
class SentApplicationView extends React.Component<
  AppStateObserver & SentApplicationViewProps,
  {}
> {
  public static defaultProps = {
    isMainPage: false,
  };
  handleNotActive = () => {
    toast.error("Вам не доступна подача заявки, заполните анкету в личном кабинете", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
  // deny
  buttonDeny = (applicationId) => {
    return cubaREST.invokeService(
        "fsr_ApplicationService",
        "endApplication",
        {
          applicationId: applicationId
        }
    )
  }
  onClickDeny = () => {
    this.buttonDeny(this.props.appId)
        .then(res => {
          toast.success(i18next.t("Success"), {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          setTimeout(() => {
            window.location.href = "/";
          }, 500);
        })
        .catch((err) => {
          toast.error("Возникла ошибка", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        });
  }
  denyButton = () => {
    return (
        <Popup
            trigger={
              <div style={{marginTop: '20px', display: 'flex', justifyContent: 'center'}}>
                <button
                    className="deny-button"
                >
                  <Trans>Deny</Trans>
                </button>
              </div>}
            modal
            closeOnDocumentClick
        >
          {(close) => (
              <div className="modal" style={{ maxWidth: "500px" }}>
                <div className="modal__header">
                  <h1><Trans>areUSure</Trans></h1>
                </div>
                <div className="modal__actions">
                  <button
                      className="confirm-button"
                      onClick={this.onClickDeny}
                  >
                    <Trans>Yes</Trans>
                  </button>
                  <button className="cancel-button" onClick={close}>
                    <Trans>Cancel</Trans>
                  </button>
                </div>
              </div>
          )}
        </Popup>
    )
  }
  render() {
    const { name, dateStart, dateEnd, id, status, info, appId } = this.props;
    const { language } = this.props.appState.userStore;
    const localeDate = localeChanger(language);
    const competitionLasts = dateStart
      ? differenceInCalendarDays(new Date(dateStart), new Date())
      : null;
    let competitionRightComponent;

    let styleComp = this.stylePanel();
    switch (status) {
      case "COLLECTION_OF_APPLICATION":
        competitionRightComponent = (
          <div className="competition__right">
            {this.props.anketaOk ? (
                <>
                  <Link
                      className="apply-button"
                      style={{ background: "green" }}
                      to={`/application/${appId}/${id}`}
                  >
                    <Trans>ViewAsMember</Trans>
                  </Link>
                  {this.denyButton()}
                </>
            ) : (
              <button
                className="apply-button"
                style={{ background: "green" }}
                onClick={this.handleNotActive}
              >
                <Trans>ViewAsMember</Trans>
              </button>
            )}
            <p className="competition__last">
              {competitionLasts > 0 ? `Осталось ${competitionLasts} дней` : ""}
            </p>
          </div>
        );
        break;
      case "REVIEW":
        competitionRightComponent = (
          <div className="competition__right">
            {this.props.anketaOk ? (
                <>
                  <Link
                      className="apply-button"
                      style={{ background: "green" }}
                      to={`/application/${appId}/${id}`}
                  >
                    <Trans>ViewAsMember</Trans>
                  </Link>
                  {this.denyButton()}
                </>
            ) : (
              <button
                className="apply-button"
                style={{ background: "green" }}
                onClick={this.handleNotActive}
              >
                <Trans>ViewAsMember</Trans>
              </button>
            )}
            <p className="competition__last">
              {competitionLasts > 0 ? `Осталось ${competitionLasts} дней` : ""}
            </p>
          </div>
        );
        break;
      case "COMPLETED":
        competitionRightComponent = (
          <div className="competition__right">
            <Link className="results-button" to={`/application/${appId}/${id}`}>
              <Trans>ViewResults</Trans>
            </Link>
          </div>
        );
        break;
      default:
        competitionRightComponent = <div className="competitionRight"></div>;
        break;
    }
    return (
      <div className="competition__panel" style={styleComp}>
        <h3 className="competition__name">{name}</h3>
        <p className="competition__desc">{info}</p>
        <div className="competition__container">
          <div className="competition__left">
            <table className="competition__info">
              <thead>
                <tr>
                  <th>
                    <p className="competition__info__header">
                      <Trans>StartDateApplication</Trans>
                    </p>
                  </th>
                  <th>
                    <p className="competition__info__header">
                      <Trans>EndDateApplication</Trans>
                    </p>
                  </th>
                  <th>
                    <p className="competition__info__header">
                      <Trans>CompetitionType</Trans>
                    </p>
                  </th>
                  <th>
                    <p className="competition__info__header">
                       <Trans>ApplicationType</Trans>
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <p className="competition__info__value">
                      <span>
                        {dateStart
                          ? format(Date.parse(dateStart), "dd MMMM u", {
                              locale: localeDate,
                            })
                          : "Не назначена"}
                      </span>
                    </p>
                  </td>
                  <td>
                    <p className="competition__info__value">
                      <span>
                        {dateEnd
                          ? format(Date.parse(dateEnd), "dd MMMM u", {
                              locale: localeDate,
                            })
                          : "Не назначена"}
                      </span>
                    </p>
                  </td>
                  <td>
                    <p className="competition__info__value">{name}</p>
                  </td>
                  <td>
                    <p className="competition__info__value">
                      <Trans>{status}</Trans>
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {competitionRightComponent}
        </div>
      </div>
    );
  }
  stylePanel() {
    let style;
    if (
      this.props.isMainPage &&
      this.props.status === "COLLECTION_OF_APPLICATION"
      ||
      this.props.isMainPage &&
      this.props.status === "REVIEW"
    ) {
      style = {
        background: "#FDF5F1",
        borderBottom: "none",
      };
    } else if (this.props.isMainPage && this.props.status === "COMPLETED") {
      style = {
        background: "#b7d1ff",
        borderBottom: "none",
      };
    }

    return style;
  }
  styleDate() {
    let style;
    if (
      this.props.isMainPage &&
      this.props.status === "COLLECTION_OF_APPLICATION"
      ||
      this.props.isMainPage &&
      this.props.status === "REVIEW"
    ) {
      style = {
        background: "#FFC000",
        padding: "6px 4px",
      };
    }

    return style;
  }
}

export default SentApplicationView;
