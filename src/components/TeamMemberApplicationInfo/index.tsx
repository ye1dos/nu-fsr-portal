import * as React from "react";
import { format } from "date-fns";
import { enGB, eo, ru } from "date-fns/locale";
import "./ApplicationInfo.css";
import { AppStateObserver, injectAppState } from "../../stores";
import { observer } from "mobx-react";
import { Trans } from "react-i18next";
import localeChanger from "../../helpers/localeChanger";
export interface TeamMemberApplicationInfoProps {
  application;
}

export interface TeamMemberApplicationInfoState {}
@injectAppState
@observer
class TeamMemberApplicationInfo extends React.Component<
TeamMemberApplicationInfoProps & AppStateObserver,
TeamMemberApplicationInfoState
> {
  state = {
    stars: null
  };

  // async loadEntities() {
  //   let stars = await this.props.appState.applicationsStore.getStarsForApplication();
  //   this.setState({
  //     stars
  //   })
  // }
  componentDidMount() {
    // this.loadEntities();
  }

  render() {
    const { application } = this.props;
    const { stars } = this.state;
    const { language } = this.props.appState.userStore;
    const localeDate = localeChanger(language);
    if(!application) {
      return (
        <React.Fragment>

        </React.Fragment>
      );
    }
    if(application) {
    return (
      <React.Fragment>
        <div className="application-info">
          <div>
            <p className="competition__info__header"><Trans>ApplicationNumber</Trans></p>
            <p className="competition__info__value">
              {application.serialNumber}
            </p>
          </div>
          <div>
            <p className="competition__info__header"><Trans>Status</Trans></p>
            <p className="competition__info__value">
              {application.applicationStatus}
            </p>
          </div>
          {stars && (
            <div>
              <p className="competition__info__header"><Trans>YourStars</Trans></p>
              <p className="competition__info__value">
                {application.applicationStatus}
              </p>
            </div>
          )}
          <div>
            <p className="competition__info__header"><Trans>teamLead</Trans></p>
            <p className="competition__info__value">
              {application.applicant.fio}
            </p>
          </div>
          <div>
            <p className="competition__info__header"><Trans>ApplyDate</Trans></p>
            <p className="competition__info__value">
              {application.dateApply
                ? format(Date.parse(application.dateApply), "dd MMMM u", {
                    locale: localeDate,
                  })
                : format(
                    Date.parse(application.dateRegistration),
                    "dd MMMM u",
                    {
                      locale: localeDate,
                    }
                  )}
            </p>
          </div>
        </div>
      </React.Fragment>
    );
            
  }
  }
}

export default TeamMemberApplicationInfo;
