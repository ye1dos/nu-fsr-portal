import * as React from "react";
import Tab from "@material/react-tab";
import TabBar from "@material/react-tab-bar";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { observer } from "mobx-react";
import { AppStateObserver, injectAppState } from "../../stores";
import { Trans } from "react-i18next";

import "@material/react-tab-bar/dist/tab-bar.css";
import "@material/react-tab-scroller/dist/tab-scroller.css";
import "@material/react-tab/dist/tab.css";
import "@material/react-tab-indicator/dist/tab-indicator.css";
import "./NavigationTabs.css";

export interface NavigationTabsProps {}

export interface NavigationTabsState {}

@injectAppState
@observer
class NavigationTabs extends React.Component<
  AppStateObserver & RouteComponentProps,
  NavigationTabsProps,
  NavigationTabsState
> {
  state = {
    activeIndex: -1,
    tabs: [
      { title: "Comps", active: false, path: "/" },
      // { title: "CompsAndResults", active: false, path: "/competitions" },
      // { title: "FAQ", active: false, path: "/faq" },
    ],
  };

  componentWillMount() {
    const { tabs } = this.state;
    const { pathname } = this.props.location;
    let activeIndex;
    for (let i = 0; i < tabs.length; i++) {
      if (pathname === tabs[i].path) {
        activeIndex = i;
      }
    }
    this.setState({ activeIndex });
  }

  handleActiveIndexUpdate = (activeIndex) => {
    this.setState({ activeIndex });
    this.props.history.push(this.state.tabs[activeIndex].path);
  };

  render() {
    const { tabs } = this.state;
    const { language } = this.props.appState.userStore;
    return (
      <React.Fragment>
        <div style={{ position: "relative" }}>
          <TabBar
            activeIndex={this.state.activeIndex}
            handleActiveIndexUpdate={this.handleActiveIndexUpdate}
            className="navigation__tabbar"
          >
            {tabs.map((tab, idx) => (
              <Tab active={tab.active} className="navigation__tab" key={idx}>
                <span>
                  <Trans>{tab.title}</Trans>
                </span>
              </Tab>
            ))}
          </TabBar>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(NavigationTabs);
