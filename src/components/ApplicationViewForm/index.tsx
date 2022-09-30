import * as React from "react";
import { Link } from "react-router-dom";
import { toJS } from "mobx";
import { AppStateObserver, injectAppState } from "../../stores";
import { observer } from "mobx-react";
import FileComponent from "../../components/FileComponent";
import Loader from "react-loader-spinner";
import { toast } from "react-toastify";

import deleteIcon from "../../assets/icons/delete-icon.svg";
import { Trans } from "react-i18next";
import i18next from "i18next";

export interface ApplicationViewFormProps {
  documents;
  application;
  tabs;
  mounted;
  experiences;
}

export interface ApplicationViewFormState {}

@injectAppState
@observer
class ApplicationViewForm extends React.Component<
  ApplicationViewFormProps & AppStateObserver,
  ApplicationViewFormState
> {
  state = {
    tabs: this.props.tabs,
    mounted: this.props.mounted,
    experiences: this.props.application && this.props.application.teamMembers || [],
    activeTab: 0,
  };

  loadFile = (id) => {
    return this.props.appState.filesStore.downloadFile(id);
  };

  componentDidMount = () => {};

  handleTabClick = (index) => {
    let tabs = [...this.state.tabs];

    for (let i = 0; i < tabs.length; i++) {
      tabs[i].active = false;
      if (i === index) tabs[i].active = true;
    }

    this.setState({ tabs, activeTab: index });
  };

  programsChecked = (name) => {
    let checked = false;
    for (let i = 0; i < this.props.application.programs.length; i++) {
      const program = this.props.application.programs[i];
      if (program.name === name) {
        checked = true;
        break;
      }
    }
    return checked;
  };

  render() {
    const { isLoadingApplication } = this.props.appState.applicationsStore;
    const { application, documents } = this.props;
    const { tabs, activeTab } = this.state;
    const { language } = this.props.appState.userStore;
    if (isLoadingApplication) {
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
    if (application) {
      const { docFirst, appDocs } = application;
      const { direction } = this.props.application; 
      return (
        <React.Fragment>
          <div className="application-form__heading">
            <h2>
              <Trans>Form</Trans>
            </h2>
          </div>
          {console.log("app_view")}
          {this.props.application.direction && (
            <table className="scp-form">
              <tbody>
                <tr>
                  <th>
                    <label htmlFor="">
                      <Trans>Direction</Trans>
                    </label>
                  </th>
                  <td>
                    <input
                      defaultValue={this.props.application.direction.name}
                      readOnly
                      style={{ width: "500px" }}
                      className="general-info__input"
                      type="text"
                      name="directionName"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          )}
          {(application.appDocs && application.appDocs.length > 0)
            ? documents &&
              documents.length > 0 && (
                <div className="application-form__documents">
                  <div
                    className="application-form__headings"
                    style={{ justifyContent: "start", paddingRight: "10px" }}
                  >
                    <p style={{ width: "300px", paddingLeft: "10px" }}>
                      <Trans>DocType</Trans>
                    </p>
                    <p
                      style={{
                        width: "400px",
                        display: "flex",
                        justifyContent: "space-around",
                        paddingLeft: "10px",
                      }}
                    >
                      <Trans>File</Trans>
                    </p>
                    <p
                      style={{
                        width: "400px",
                        display: "flex",
                        justifyContent: "space-around",
                        paddingLeft: "10px",
                      }}
                    >
                      <Trans>ArchivedFiles</Trans>
                    </p>
                    <p
                      style={{
                        width: "300px",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Trans>ArchivedFiles</Trans> 2
                    </p>
                  </div>
                  {documents
                    .slice()
                    .sort((a, b) =>
                      a.docType.name.localeCompare(b.docType.name)
                    )
                    .map((document, idx) => (
                      <div
                        key={document.id}
                        className="application-form__document"
                        style={{ justifyContent: "start" }}
                      >
                        <p
                          style={{
                            width: "300px",
                            paddingRight: "10px",
                            wordBreak: "break-all",
                          }}
                        >
                          {(document.docType && document.docType.name) || null}{" "}
                          {document.mandatory && (
                            <span className="mandatory">*</span>
                          )}
                        </p>
                        <div
                          className="inputfile__container"
                          style={{
                            width: "500px",
                            justifyContent: "space-around",
                            paddingRight: "10px",
                            wordBreak: "break-all",
                          }}
                        >
                          {this.renderAppDocFile(document, appDocs)}
                        </div>
                        <div
                          className="inputfile__container"
                          style={{
                            width: "400px",
                            justifyContent: "space-evenly",
                            paddingRight: "10px",
                            wordBreak: "break-all",
                          }}
                        >
                          {this.renderArchivedFile(document, appDocs)}
                        </div>
                        <div
                            className="inputfile__container"
                            style={{
                              width: "300px",
                              justifyContent: "flex-end",
                              wordBreak: "break-all",
                            }}
                          >
                            {this.renderArchivedFile2(document, appDocs)}
                          </div>
                      </div>
                    ))}
                </div>
              )
            : documents &&
              documents.length > 0 && (
                <div className="application-form__documents">
                  <div className="application-form__headings">
                    <p>
                      <Trans>DocType</Trans>
                    </p>
                    <p>
                      <Trans>File</Trans>
                    </p>
                  </div>
                  {documents
                    .slice()
                    .sort((a, b) =>
                      a.docType.name.localeCompare(b.docType.name)
                    )
                    .map((document, idx) => (
                      <div
                        key={document.id}
                        className="application-form__document"
                      >
                        <p>
                          {(document.docType && document.docType.name) || null}{" "}
                          {document.mandatory && (
                            <span className="mandatory">*</span>
                          )}
                        </p>
                        <div className="inputfile__container">
                          {this.renderDocFile(document, docFirst)}
                        </div>
                      </div>
                    ))}
                </div>
              )}

          <div className="application-table__container">
            <div className="application-table__tabs">
              {tabs.map((tab, index) => (
                <div
                  className={this.renderTabClass(tab)}
                  key={index}
                  onClick={() => this.handleTabClick(index)}
                >
                  {i18next.t(tab.name)}
                </div>
              ))}
            </div>
            <div className="application-table-view__body">
              <table className="application-table-view">
                {this.renderTable()}
              </table>
            </div>
          </div>
        </React.Fragment>
      );
    }
  }
  renderTable() {
    const { activeTab } = this.state;
    const expenses = this.props.appState.applicationsStore.application.expense;
    const { programs } = this.props.appState.applicationsStore.application;
    const { experiences } = this.state;
    switch (activeTab) {
      case 0:
        return (
          <React.Fragment>
            <thead>
              <tr>
                <th style={{ minWidth: "367px", width: "367px" }}>
                <Trans>naimenovaniye</Trans>
                </th>
                <th><Trans>information</Trans></th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program) => (
                <tr key={program.id}>
                  <td>
                    <div
                      className="application-table__program-name"
                      style={{ justifyContent: "center" }}
                    >
                      <p>{program.name}</p>
                    </div>
                  </td>
                  <td style={{ textAlign: "left" }}>{program.info}</td>
                </tr>
              ))}
            </tbody>
          </React.Fragment>
        );
      case 1:
        if (expenses) {
          return (
            <React.Fragment>
              <thead>
                <tr>
                  <th style={{ minWidth: "367px", width: "367px" }}>
                    <Trans>statyaRashodov</Trans>
                  </th>
                  <th><Trans>Sum</Trans></th>
                  <th><Trans>Currency</Trans></th>
                </tr>
              </thead>
              <tbody>
                {expenses && expenses.map((expense, idx) => (
                  <tr key={idx}>
                    <td>
                      <label htmlFor="">{expense.item.name}</label>
                    </td>
                    <td>
                      <label htmlFor="">{expense.cost}</label>
                    </td>
                    <td>
                      <label htmlFor="">{expense.currency.name}</label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </React.Fragment>
          );
        }
        case 2:
          return (
            <React.Fragment>
              <thead>
              <tr>
                  <th>
                   <Trans>TeamMemberEmail</Trans>
                  </th>
                  <th><Trans>IIN</Trans></th>
                  <th><Trans>Name</Trans></th>
                  <th><Trans>Surname</Trans></th>
                  <th><Trans>Middlename</Trans></th>
                  <th><Trans>WorkExperience</Trans></th>
                  <th><Trans>specificRole</Trans></th>
                </tr>
              </thead>
              <tbody>
                {experiences.map((experience, idx) => (
                  <tr key={idx}>
                    <td>
                      <label htmlFor="">{experience.email}</label>
                    </td>
                    <td>
                      <label htmlFor="">{experience.iin}</label>
                    </td>
                    <td>
                      <label htmlFor="">{experience.firstName}</label>
                    </td>
                    <td>
                      <label htmlFor="">{experience.lastName}</label>
                    </td>
                    <td>
                      <label htmlFor="">{experience.middleName}</label>
                    </td>
                    <td>
                      <label htmlFor="">{experience.workExperience}</label>
                    </td>
                    <td>
                      <label htmlFor="">{experience.role}</label>
                    </td>
                  </tr>
                  )
                )}
              </tbody>
            </React.Fragment>
          );
    }
  }
  renderTabClass(tab) {
    let className = "application-table__tab";
    if (tab.active) className += " active";
    return className;
  }
  renderDocFile(document, docFirst) {
    if (docFirst.length > 0) {
      let doc;

      for (let i = 0; i < docFirst.length; i++) {
        if (
          document.docType.id === docFirst[i].docType.id &&
          document.docOwner.id === docFirst[i].docOwner.id
        ) {
          doc = docFirst[i];
          // return <p>{doc.file.name}</p>;
          return (
            <FileComponent
              getFile={this.loadFile}
              id={doc.file.id}
              name={doc.file.name}
              extension={doc.file.extension}
              withFileIcon={false}
              withDownloadIcon={false}
            />
          );
        }
      }
    }
  }
  renderAppDocFile(document, ivanFile) {
    const appDocs = this.props.application.appDocs;
    if (appDocs.length > 0) {
      let doc;
      let idx;
      for (var i = 0; i < appDocs.length; i++) {
        if (document.docType.id === appDocs[i].doc.docType.id) {
          idx = i;
          break;
        }
      }
      if ( typeof idx !== "undefined" ) {
        if (ivanFile[idx].doc.file.id !== appDocs[idx].doc.file.id) {
          doc = ivanFile[idx].doc;
          return (
              <FileComponent
                  getFile={this.loadFile}
                  id={doc.file.id}
                  name={doc.file.name}
                  extension={doc.file.extension}
                  withFileIcon={false}
                  withDownloadIcon={false}
              />
          );
        }
        for (let j = 0; j < appDocs[idx].docs.length; j++) {
          if (appDocs[idx].docs[j].isArchive === false) {
            doc = appDocs[idx].docs[j];
            return (
                <FileComponent
                    getFile={this.loadFile}
                    id={doc.file.id}
                    name={doc.file.name}
                    extension={doc.file.extension}
                    withFileIcon={false}
                    withDownloadIcon={false}
                />
            );
          }
        }
      }
    }
  }
  renderArchivedFile(document, appDocs) {
    if (appDocs.length > 0) {
      let doc;
      let idx;
      for (var i = 0; i < appDocs.length; i++) {
        if (document.docType.id === appDocs[i].doc.docType.id) {
          idx = i;
          break;
        }
      }
      let archivedFiles = [];
      if ( typeof idx !== "undefined" ) {
        if (appDocs[idx].docs.length > 2) {
          for (let j = 0; j < appDocs[idx].docs.length; j++) {
            if (appDocs[idx].docs[j].isArchive === true) {
              archivedFiles.push(appDocs[idx].docs[j]);
            }
          }
          if (archivedFiles.length > 1) {
            doc = archivedFiles[1];
            return (
                <FileComponent
                    getFile={this.loadFile}
                    id={doc.file.id}
                    name={doc.file.name}
                    extension={doc.file.extension}
                    withFileIcon={false}
                    withDownloadIcon={false}
                />
            );
          }
        }
        if (appDocs[idx].docs.length <= 2) {
          for (let j = 0; j < appDocs[idx].docs.length; j++) {
            if (appDocs[idx].docs[j].isArchive === true) {
              doc = appDocs[idx].docs[j];
              return (
                  <FileComponent
                      getFile={this.loadFile}
                      id={doc.file.id}
                      name={doc.file.name}
                      extension={doc.file.extension}
                      withFileIcon={false}
                      withDownloadIcon={false}
                  />
              );
            }
          }
        }
      }
    }
  }
  renderArchivedFile2(document, appDocs) {
    if (appDocs.length > 0) {
      let doc;
      let idx;
      for (var i = 0; i < appDocs.length; i++) {
        if (document.docType.id === appDocs[i].doc.docType.id) {
          idx = i;
          break;
        }
      }
      let archivedFiles = [];
      if ( typeof idx !== "undefined" ) {
        if (appDocs[idx].docs.length <= 2) {
          for (let j = 0; j < appDocs[idx].docs.length; j++) {
            if (appDocs[idx].docs[j].isArchive === true) {
              archivedFiles.push(appDocs[idx].docs[j]);
            }
          }
          if (archivedFiles.length > 1) {
            doc = archivedFiles[1];
            return (
                <FileComponent
                    getFile={this.loadFile}
                    id={doc.file.id}
                    name={doc.file.name}
                    extension={doc.file.extension}
                    withFileIcon={false}
                    withDownloadIcon={false}
                />
            );
          }
        }
        if (appDocs[idx].docs.length > 2) {
          for (let j = 0; j < appDocs[idx].docs.length; j++) {
            if (appDocs[idx].docs[j].isArchive === true) {
              doc = appDocs[idx].docs[j];
              return (
                  <FileComponent
                      getFile={this.loadFile}
                      id={doc.file.id}
                      name={doc.file.name}
                      extension={doc.file.extension}
                      withFileIcon={false}
                      withDownloadIcon={false}
                  />
              );
            }
          }
        }
      }
      return;
    }
  }
}

export default ApplicationViewForm;
