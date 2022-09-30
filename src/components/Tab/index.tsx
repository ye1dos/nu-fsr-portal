import * as React from "react";
import { Trans } from "react-i18next";
import "./Tab.css";

export interface TabProps {
  name: string;
  active: boolean;
  onTabClick: any;
}

export interface TabState {}

class Tab extends React.Component<TabProps, TabState> {
  state = {};
  render() {
    const { name, onTabClick } = this.props;
    return (
      <div className={this.renderClasses()} onClick={() => onTabClick(name)}>
        <Trans>{name}</Trans>
      </div>
    );
  }
  renderClasses() {
    let classes = "tab";
    if (this.props.active) {
      classes += " active";
    }
    return classes;
  }
}

export default Tab;
