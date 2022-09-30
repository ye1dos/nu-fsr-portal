import * as React from "react";
import "./Competition.css";
import { Link } from "react-router-dom";
import { format, differenceInCalendarDays } from "date-fns";
import { ru, enGB } from "date-fns/locale";
import { Trans } from "react-i18next";
import { observer } from "mobx-react";
import { AppStateObserver, injectAppState } from "../../stores";
import { toast } from "react-toastify";
import i18next from "i18next";
import localeChanger from "../../helpers/localeChanger";

export interface CompetitionProps {
  name: string;
  dateStart: string;
  dateEnd: string;
  id: string;
  status: string;
  info: string;
  isMainPage?: boolean;
  anketaOk: any;
}

export interface CompetitionState {}

@injectAppState
@observer
class Competition extends React.Component<
  AppStateObserver & CompetitionProps,
  CompetitionState
> {
  public static defaultProps = {
    isMainPage: false,
  };
  handleNotActive = () => {
    toast.error(i18next.t("fillOut"), {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
  render() {
    const { name, dateStart, dateEnd, id, status, info } = this.props;
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
            {/* <Link className="apply-button" to={{pathname: `/competition/${id}`}}>
              <Trans>Apply</Trans>
            </Link> */}

            {this.props.anketaOk ? (
              <Link className="apply-button" to={{pathname: `/competition/${id}`}}>
              <Trans>Apply</Trans>
            </Link>
            ) : (
              <button className="apply-button" onClick={this.handleNotActive}>
              <Trans>Apply</Trans>
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
            <Link className="results-button" to={`/competition/${id}`}>
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
                      <Trans>Status</Trans>
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
    ) {
      style = {
        background: "#FDF5F1",
        borderBottom: "none",
      };
    } else if (this.props.isMainPage && this.props.status === "COMPLETED") {
      style = {
        background: "#f0f4fb",
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
    ) {
      style = {
        background: "#FFC000",
        padding: "6px 4px",
      };
    }

    return style;
  }
}

export default Competition;
