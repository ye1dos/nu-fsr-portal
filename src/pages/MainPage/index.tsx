import React, { Fragment } from "react";
import { AppStateObserver, injectAppState } from "../../stores";
import { observer } from "mobx-react";
import Competition from "../../components/Competition";
import Loader from "react-loader-spinner";

import competitionTypeIcon from "../../assets/icons/competitionType-icon.svg";
import { Trans } from "react-i18next";

import "./MainPage.css";
import { toJS } from "mobx";
import SentApplicationView from "../../components/sentApplicationView";

export interface MainPageProps {}
export interface MainPageProps {}

export interface MainPageState {}
@injectAppState
@observer
class MainPage extends React.Component<
  AppStateObserver,
  MainPageProps,
  MainPageState
> {
  state = {
    mounted: false,
  };

  compare(a, b) {
    let comparision = 0;
    if (a.dateStartRegistration < b.dateStartRegistration) {
      comparision = 1;
    } else if (a.dateStartRegistration > b.dateStartRegistration) {
      comparision = -1;
    }
    return comparision;
  }

  async componentDidMount() {
    try {
      await this.props.appState.competitionsStore.loadCompetitions();
      this.props.appState.competitionsStore.loadCompetitionTypes();
    }
    catch (e) {

    }
  }

  render() {
    const {
      activeCompetitions,
      archivedCompetitions,
      competitionTypes,
      isLoadingList,
      createdApplications,
      anketaOk,
      competitions
    } = this.props.appState.competitionsStore;
    const { language } = this.props.appState.userStore;
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

    return (
      <Fragment>
        {competitions && this.renderAllCompetitions(competitions, anketaOk)}
        {/*{createdApplications && this.renderSentApplications(createdApplications, anketaOk)}*/}
        {/*{activeCompetitions && this.renderActiveCompetitions(activeCompetitions, anketaOk)}*/}
        <div className="breakline"></div>
        {archivedCompetitions && this.renderArchivedCompetitions(archivedCompetitions, anketaOk)}
        {this.renderProjects(competitionTypes)}
      </Fragment>
    );
  }
  renderAllCompetitions = (comps, isItOk) => {
    return comps
        .slice()
        .sort(this.compare)
        .map((competition) => (
            competition.applicationId ?
                <SentApplicationView
                    anketaOk={isItOk}
                    key={competition.id}
                    name={competition.name}
                    dateStart={competition.dateStartRegistration}
                    dateEnd={competition.dateEndRegistration}
                    id={competition.id}
                    status={competition.status}
                    info={competition.info}
                    isMainPage={true}
                    appId={competition.applicationId}
                />
                :
                <Competition
                    anketaOk={isItOk}
                    key={competition.id}
                    name={competition.name}
                    dateStart={competition.dateStartRegistration}
                    dateEnd={competition.dateEndRegistration}
                    id={competition.id}
                    status={competition.status}
                    info={competition.info}
                    isMainPage={true}
                />
        ));
  }
  renderSentApplications(createdApplications, isItOk) {
    let createdApps = [];
    if(createdApplications) {
      createdApps = createdApplications;
    }
    return createdApps
      .slice()
      .sort(this.compare)
      .map((competition, idx) => (
        <SentApplicationView
          anketaOk={isItOk}
          key={competition.id}
          name={competition.name}
          dateStart={competition.dateStartRegistration}
          dateEnd={competition.dateEndRegistration}
          id={competition.id}
          status={competition.status}
          info={competition.info}
          isMainPage={true}
          appId={competition.applicationId}
        />
      ));
  }

  renderActiveCompetitions(activeCompetitions, isItOk) {
      return activeCompetitions
        .slice()
        .sort(this.compare)
        .map((competition) => (
          <Competition
            anketaOk={isItOk}
            key={competition.id}
            name={competition.name}
            dateStart={competition.dateStartRegistration}
            dateEnd={competition.dateEndRegistration}
            id={competition.id}
            status={competition.status}
            info={competition.info}
            isMainPage={true}
          />
        ));
  }

  renderArchivedCompetitions(archivedCompetitions, isItOk) {
      return archivedCompetitions
        .slice()
        .sort(this.compare)
        .map((competition) => (
          <Competition
            anketaOk={isItOk}
            key={competition.id}
            name={competition.name}
            dateStart={competition.dateStartRegistration}
            dateEnd={competition.dateEndRegistration}
            id={competition.id}
            status={competition.status}
            info={competition.info}
            isMainPage={true}
          />
        ));
  }

  renderProjects(compTypes) {
    if (compTypes) {
        return (
          <Fragment>
            <h1 className="competition-types__heading">
              <Trans>ListOfProjectsAndPrograms</Trans>
            </h1>
            {compTypes.map((type) => (
              <div className="competition-type" key={type.id}>
                <p className="competition-type__name">
                  <img
                    src={competitionTypeIcon}
                    alt=""
                    style={{ marginRight: "4px" }}
                  />
                  {type.name}
                </p>
                <p className="competition-type__info">{type.info}</p>
                {
                  (type.code === "TLP" || type.code === "SGC") &&
                <div className="competition-type__contacts-container">
                  <p className="competition-type__contacts">
                    <Trans>managerContacts</Trans>
                  </p>
                  <p className="competition-type__contacts">
                      Madina Karimova
                  </p>
                  <p className="competition-type__contacts">
                    <Trans>tel</Trans>: +7 7172 725624 
                  </p>
                  <p className="competition-type__contacts">
                    email: madina.karimova@nu.edu.kz
                  </p>
                </div>
                }
               {
               type.code === "SPO" && 
               <div className="competition-type__contacts-container">
                  <p className="competition-type__contacts">
                    <Trans>managerContacts</Trans>
                  </p>
                  <p className="competition-type__contacts">
                    Dina Kenensarinova
                  </p>
                  <p className="competition-type__contacts">
                  <Trans>tel</Trans>: +7 7172 725623
                  </p>
                  <p className="competition-type__contacts">
                    email: dina.kenensarinova@nu.edu.kz
                  </p>
                </div>
                }
              {
               (type.code === "JSI" || type.code === "SDF") && 
               <div className="competition-type__contacts-container">
                  <p className="competition-type__contacts">
                  <Trans>managerContacts</Trans>
                  </p>
                  <p className="competition-type__contacts">
                    Zhanar Tulegenova
                  </p>
                  <p className="competition-type__contacts">
                  <Trans>tel</Trans>: + 7 7172725625
                  </p>
                  <p className="competition-type__contacts">
                    email: zhanar.tulegenova@nu.edu.kz
                  </p>
                </div>
                }
              </div>
            ))}
          </Fragment>
        );
    }
  }
}

export default MainPage;
