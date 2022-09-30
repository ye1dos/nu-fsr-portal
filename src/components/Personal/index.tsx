import * as React from "react";
import { observer } from "mobx-react";
import { AppStateObserver, injectAppState } from "../../stores";
import GeneralInfo from "../../components/GeneralInfo";
import PersonalTables from "../../components/PersonalTables";
import Loader from "react-loader-spinner";

import "./Personal.css";

export interface PersonalProps {}

export interface PersonalState {}

@injectAppState
@observer
class Personal extends React.Component<
  AppStateObserver,
  PersonalProps,
  PersonalState
> {
  state = {};
  loadFile = (id) => {
    return this.props.appState.filesStore.downloadFile(id);
  };
  render() {
    return <React.Fragment>{this.renderPerson()}</React.Fragment>;
  }

  renderPerson() {
    const { applicant, loading } = this.props.appState.applicantsStore;
    if (loading) {
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
    if (applicant) {
      return (
        <React.Fragment>
          <GeneralInfo applicant={applicant} />
        </React.Fragment>
      );
    }
  }
}

export default Personal;
