import * as React from "react";
import { observer } from "mobx-react";
import { AppStateObserver, injectAppState } from "../../stores";
import Loader from "react-loader-spinner";
import { toJS } from "mobx";
import { Link } from "react-router-dom";
import "./Applications.css";
import { format } from "date-fns";
import { enGB, ru } from "date-fns/locale";
import { Trans } from "react-i18next";
import localeChanger from "../../helpers/localeChanger";
import i18next from "i18next";

export interface ApplicationsProps {}

export interface ApplicationsState {}

@injectAppState
@observer
class Applications extends React.Component<
  AppStateObserver,
  ApplicationsProps,
  ApplicationsState
> {
  state = {};
  componentDidMount() {
    this.props.appState.applicationsStore.loadEntities();
  }
  render() {
    return <React.Fragment>{this.renderApplications()}</React.Fragment>;
  }
  renderApplications() {
    const {
      applicationList,
      isLoadingList,
    } = this.props.appState.applicationsStore;

    const { language } = this.props.appState.userStore;
    const localeDate = localeChanger(language);

    // console.log(toJS(applicationList));

    if (isLoadingList) {
      return (
        <div className="loader-container">
          <Loader
            type="Triangle"
            color="#209898"
            height={200}
            width={200}
            timeout={15000}
          />
        </div>
      );
    }
    if (applicationList) {
      return (
        <div className="app-table__container">
          <table className="app-table">
            <thead>
              <tr>
                <th>
                  {/*<Trans>ApplicationNumber</Trans>*/}
                </th>
                <th>
                  <Trans>ApplyDate</Trans>
                </th>
                <th>
                  <Trans>Status</Trans>
                </th>
                <th>
                  <Trans>CompetitionName</Trans>
                </th>
                <th>
                  <Trans>CompetitionStatus</Trans>
                </th>
              </tr>
            </thead>
            <tbody>
              {applicationList.map((application, idx) => (
                <tr key={idx}>
                  <td>
                    <Link
                      to={`/application/${application.id}/${application.competition.id}`}
                    >
                      {application.serialNumber}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/application/${application.id}/${application.competition.id}`}
                    >
                      {application.dateApply
                        ? format(
                            Date.parse(application.dateApply),
                            "dd MMMM yyyy",
                            {
                              locale: localeDate,
                            }
                          )
                        : format(
                            Date.parse(application.dateRegistration),
                            "dd MMMM yyyy",
                            {
                              locale: localeDate,
                            }
                          )}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/application/${application.id}/${application.competition.id}`}
                    >
                      {i18next.t(application.applicationStatus)}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/application/${application.id}/${application.competition.id}`}
                    >
                      {application.competition.name}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/application/${application.id}/${application.competition.id}`}
                    >
                      {application.competition.status}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  }
}

export default Applications;
