import * as React from "react";
import Breadcrumps from "../../components/Breadcrumps";
import { AppStateObserver, injectAppState } from "../../stores";
import { observer } from "mobx-react";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { enGB, ru } from "date-fns/locale";
import FileComponent from "../../components/FileComponent";
import { Trans } from "react-i18next";

import "./Contracts.css";
import { toJS } from "mobx";
import localeChanger from "../../helpers/localeChanger";

export interface ContractsProps {}

export interface ContractsState {}

@injectAppState
@observer
class Contracts extends React.Component<
  AppStateObserver,
  ContractsProps,
  ContractsState
> {
  state = {
    links: [
      { path: "/cabinet", name: "li4nyKabinet" },
      { path: "/contracts", name: "spisokDog" },
    ],
  };
  componentDidMount() {}

  loadFile = (id) => {
    return this.props.appState.filesStore.downloadFile(id);
  };

  render() {
    const { links } = this.state;
    return (
      <React.Fragment>
        <div className="contracts__container">{this.renderContracts()}</div>
      </React.Fragment>
    );
  }
  renderContracts() {
    const { contracts, isLoadingList } = this.props.appState.contractsStore;
    const { language } = this.props.appState.userStore;
    const localeDate = localeChanger(language);
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
    if (contracts) {
      return (
        <table className="contracts-table">
          <thead>
            <tr className="contracts-table__heading">
              <th>
                <Trans>ContractNumber</Trans>
              </th>
              <th>
                <Trans>DateSigned</Trans>
              </th>
              <th>
                <Trans>TotalAmountTenge</Trans>
              </th>
              <th>
                <Trans>Status</Trans>
              </th>
              <th>
                <Trans>Scan</Trans>
              </th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract) => (
              <tr key={contract.id}>
                <td>
                  <Link to={`/contract/${contract.id}`}>
                    {contract.contractNumber}
                  </Link>
                </td>
                <td>
                  <Link to={`/contract/${contract.id}`}>
                    {contract.dateSigned
                      ? format(Date.parse(contract.dateSigned), "dd MMMM u", {
                          locale: localeDate,
                        })
                      : "Не назначена"}
                  </Link>
                </td>
                <td>
                  <Link to={`/contract/${contract.id}`}>{contract.amount}</Link>
                </td>
                <td>
                  <Link to={`/contract/${contract.id}`}>{contract.status}</Link>
                </td>
                <td>{this.renderScan(contract.scan)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      return <div>There is no contracts</div>;
    }
  }
  renderScan(scan) {
    if (scan) {
      return (
        <FileComponent
          id={scan.id}
          name={scan.name}
          extension={scan.extension}
          getFile={this.loadFile}
          withDownloadIcon={true}
        />
      );
    }
  }
}

export default Contracts;
