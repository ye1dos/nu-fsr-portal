import * as React from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";

import "./Competitions.css";
import Competition from "../../components/Competition";
import { AppStateObserver, injectAppState } from "../../stores";
import Loader from "react-loader-spinner";
import Tab from "../../components/Tab";
import i18next from "i18next";

export interface CompetitionsProps {}

export interface CompetitionsState {}
@injectAppState
@observer
class Competitions extends React.Component<
  AppStateObserver,
  CompetitionsProps,
  CompetitionsState
> {
  state = {
    tabs: [
      { name: "All", active: true },
      { name: "ActiveComps", active: false },
      { name: "CompletedComps", active: false },
    ],
  };

  async componentDidMount() {
    try {
      await this.props.appState.competitionsStore.loadCompetitions();
    }
    catch (e) {

    }
  }
  handleTabClick = (tabName) => {
    const tabs = [...this.state.tabs];
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      if (tab.name === tabName) {
        tab.active = true;
      } else {
        tab.active = false;
      }
    }
    this.setState({ tabs });
  };
  render() {
    const { language } = this.props.appState.userStore;
    return (
      <React.Fragment>
        <div className="competition-container">
          {this.renderAllCompetitions()}
        </div>
      </React.Fragment>
    );
  }
  renderAllCompetitions() {
    const {
      isLoadingList,
      competitions,
    } = this.props.appState.competitionsStore;

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
    } else {
      return (
        <React.Fragment>
          <div className="tab__container">
            {this.state.tabs.map((tab, idx) => (
              <Tab
                name={tab.name}
                key={idx}
                active={tab.active}
                onTabClick={this.handleTabClick}
              />
            ))}
          </div>

          {this.renderCompetitions(competitions)}
        </React.Fragment>
      );
    }
  }

  renderCompetitions(comps) {
    const {
      activeCompetitions,
      archivedCompetitions,
      anketaOk
    } = this.props.appState.competitionsStore;
    let competitions = [];
    const { tabs } = this.state;
    if (comps) {
      if (tabs[0].active) {
        competitions = [...activeCompetitions, ...archivedCompetitions];
      } else if (tabs[1].active) {
        competitions = [...activeCompetitions];
      } else if (tabs[2].active) {
        competitions = [...archivedCompetitions];
      } else {
        competitions = [...comps];
      }
      return competitions
        .slice()
        .sort(this.compare)
        .map((competition, idx) => (
          <Competition
            anketaOk={anketaOk}
            key={idx}
            name={competition.name}
            dateStart={competition.dateStartRegistration}
            dateEnd={competition.dateEndRegistration}
            id={competition.id}
            status={competition.status}
            info={competition.info}
          />
        ));
    }
  }

  compare(a, b) {
    let comparision = 0;
    if (a.dateStartRegistration < b.dateStartRegistration) {
      comparision = 1;
    } else if (a.dateStartRegistration > b.dateStartRegistration) {
      comparision = -1;
    }
    return comparision;
  }
}

export default Competitions;
