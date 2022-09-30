import * as React from "react";
import { differenceInCalendarDays } from "date-fns";
import { format } from "date-fns";
import { enGB, eo, ru } from "date-fns/locale";
import FileComponent from "../components/FileComponent";
import { toJS } from "mobx";
import { Trans } from "react-i18next";
import { observer } from "mobx-react";
import { AppStateObserver, injectAppState } from "../stores";
import localeChanger from "../helpers/localeChanger";
// import { addToCalendar } from "js-add-to-calendar-buttons";

export interface CompetitionInfoProps {
  appStatus?;
  competition;
  statuses;
  loadFile;
  scrollToForm?;
}

export interface CompetitionInfoState {}

@injectAppState
@observer
class CompetitionInfo extends React.Component<
  AppStateObserver & CompetitionInfoProps,
  CompetitionInfoState
> {
  state = {};
  componentDidMount() {
    // var myCalendar = addToCalendar({
    //   options: {
    //     class: "my-class",
    //     // You can pass an ID. If you don't, one will be generated for you
    //     id: "my-id"
    //   },
    //   data: {
    //     // Event title
    //     title: "Get on the front page of HN",
    //     // Event start date
    //     start: new Date("June 15, 2013 19:00"),
    //     // Event timezone. Will convert the given time to that zone
    //     timezone: "America/Los_Angeles",
    //     // Event duration (IN MINUTES)
    //     duration: 120,
    //     // You can also choose to set an end time
    //     // If an end time is set, this will take precedence over duration
    //     // end: new Date('June 15, 2013 23:00'),
    //     // You can also choose to set 'all day'
    //     // If this is set, this will override end time, duration and timezone
    //     // allday:true,
    //     // Event Address
    //     address: "The internet",
    //     // Event Description
    //     description:
    //       "Get on the front page of HN, then prepare for world domination."
    //   }
    // });
    // document.querySelector("#asd").appendChild(myCalendar);
  }
  render() {
    const { competition, statuses } = this.props;
    const { language } = this.props.appState.userStore;
    const localeDate = localeChanger(language);
    console.log(this.props.appStatus)
    return (
      <React.Fragment>
        <h1 className="comp__header">{competition.competitionType.name}</h1>
        <div className="competition__container">
          <div className="competition__x">
            <p className="competition__desc">{competition.info}</p>
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
                  {this.props.appStatus === 'BUSINESS_PLAN' && <th>
                    <p className="competition__info__header">
                      <Trans>dateDeadline</Trans>
                    </p>
                  </th>}
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
                        {competition.dateStartRegistration
                          ? format(
                              Date.parse(competition.dateStartRegistration),
                              "dd MMMM u",
                              {
                                locale: localeDate,
                              }
                            )
                          : "Не назначена"}
                      </span>
                    </p>
                  </td>
                  <td>
                    <p className="competition__info__value">
                      <span>
                        {competition.dateEndRegistration
                          ? format(
                              Date.parse(competition.dateEndRegistration),
                              "dd MMMM u",
                              {
                                locale: localeDate,
                              }
                            )
                          : "Не назначена"}
                      </span>
                    </p>
                  </td>
                  {this.props.appStatus === 'BUSINESS_PLAN' && <td>
                    <p className="competition__info__value">
                      <span>
                        {competition.dateDeadline
                            ? format(
                                Date.parse(competition.dateDeadline),
                                "dd MMMM u",
                                {
                                  locale: localeDate,
                                }
                            )
                            : "Не назначена"}
                      </span>
                    </p>
                  </td>}
                  <td>
                    <p className="competition__info__value">
                      {competition.competitionType.name}
                    </p>
                  </td>
                  <td>
                    <p className="competition__info__value">
                      <Trans>{competition.status}</Trans>
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            {/* <p
              className="comp-results__text"
              dangerouslySetInnerHTML={this.createMarkup(
                competition.description
              )}
            ></p> */}
          </div>
          {/* {this.renderCompetitionButton(
            competition.status,
            competition.dateStartRegistration
          )} */}
          {/* <div id="asd" className="apply-button"></div> */}
        </div>
        {competition.status === "COMPLETED" &&
          this.renderResults(competition.resultText, competition.resultFiles)}
      </React.Fragment>
    );
  }
  renderCompetitionButton(status, dateStart) {
    const { scrollToForm } = this.props;
    const competitionLasts = dateStart
      ? differenceInCalendarDays(new Date(dateStart), new Date())
      : null;
    if (status === "COLLECTION_OF_APPLICATION") {
      return (
        <div className="competition__right">
          <button className="apply-button" onClick={scrollToForm}>
            <Trans>Apply</Trans>
          </button>
          <p className="competition__last">
            {competitionLasts > 0 ? `Осталось ${competitionLasts} дней` : ""}
          </p>
        </div>
      );
    }
    return <div className="competitionRight"></div>;
  }
  renderResults(text, files) {
    const { loadFile } = this.props;
    if (files) {
      return (
        <div className="comp-results">
          <h1 className="comp-results__heading">Результаты</h1>
          <p
            className="comp-results__text"
            dangerouslySetInnerHTML={this.createMarkup(text)}
          ></p>
          {files.map((file, idx) => {
            return (
              <div className="comp-result__file" key={idx}>
                <FileComponent
                  key={idx}
                  getFile={loadFile}
                  id={file.file.id}
                  name={file.file.name}
                  extension={file.file.extension}
                  withFileIcon={true}
                  withDownloadIcon={false}
                />
              </div>
            );
          })}
        </div>
      );
    }
  }
  createMarkup(markup) {
    return { __html: markup };
  }
}

export default CompetitionInfo;
