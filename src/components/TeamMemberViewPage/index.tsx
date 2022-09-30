import * as React from "react";
import { AppStateObserver, injectAppState } from "../../stores";
import { observer } from "mobx-react";
import FileComponent from "../../components/FileComponent";
import Loader from "react-loader-spinner";
import { toast } from "react-toastify";
import { Trans } from "react-i18next";
import i18next from "i18next";
import ExtraFields from "../ExtraFields/view";

export interface TeamMemberViewPageProps {
    espFile;
    password;
    application;
    comment;
    competition;
}

export interface TeamMemberViewPageState {}

@injectAppState
@observer
class TeamMemberViewPage extends React.Component<
  TeamMemberViewPageProps & AppStateObserver,
  TeamMemberViewPageState
> {
  state = {
    application: this.props.application,
    teamMembers: this.props.application?.teamMembers || [],
    documents: this.props.competition?.reqDocs,
    verifySubmission: false,
    relevance: this.props.application?.relevance || null,
    applicationForm: this.props.application?.applicationForm || null,
    efficiencyAndResult: this.props.application?.efficiencyAndResult || null,
    resource: this.props.application?.resource || null,
    sustainability: this.props.application?.sustainability || null,
    innovativeness: this.props.application?.innovativeness || null,
    programs: this.props.application?.programs,
    bFile: this.props.application?.businessPlan || null,
    projectIdea: this.props.application.projectIdea || null,
    businessModel: this.props.application.businessModel || null,
    effectiveness: this.props.application.effectiveness || null,
    scalability: this.props.application.scalability || null,
    organizationPotential: this.props.application.organizationPotential || null,
  };
  saveApplicationWithProcess = (outcome, procTaskId) => {
    if (!this.props.comment) {
      toast.error(i18next.t("AddComments"), {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    this.props.appState.applicationsStore.isApplicationSaving = true;
    return (async () => {

      let application = this.props.application;

      this.props.appState.applicationsStore
          .approveApplication(application, this.props.espFile, this.props.password, this.props.comment, outcome, procTaskId)
          .then(async (res) => {
            this.props.appState.applicationsStore.loadEntities();
            this.props.appState.applicationsStore.isApplicationSaving = false;
            let result = res as string;
            let status = JSON.parse(result).status;
            let message = JSON.parse(result).message
                ? JSON.parse(result).message
                : i18next.t("Error");
            let ERROR = JSON.parse(result).ERROR;
            if (status === "SUCCESS") {
              toast.success(i18next.t("Success"), {
                position: toast.POSITION.BOTTOM_CENTER,
              });
              this.props.appState.applicationsStore.applicationSaved = true;
              setTimeout(() => {
                window.location.href = "/";
              }, 500)
            } else if (status === "ERROR") {
              toast.error(message, {
                position: toast.POSITION.BOTTOM_CENTER,
              });
            } else if (status === "WARNING") {
              toast.error(message, {
                position: toast.POSITION.BOTTOM_CENTER,
              });
            } else if (!status && ERROR) {
              toast.error(ERROR, {
                position: toast.POSITION.BOTTOM_CENTER,
              });
            }
          })
          .catch((e) => {
            toast.error("Возникла ошибка", {
              position: toast.POSITION.BOTTOM_CENTER,
            });
            this.props.appState.applicationsStore.isApplicationSaving = false;
            throw e;
          });
      return application;
    })();
  };
  loadFile = (id) => {
    return this.props.appState.filesStore.downloadFile(id);
  };

  renderProgramsTable() {
    const {programs} = this.props.application;
    return (
        <React.Fragment>
          <thead>
          <tr>
            <th style={{minWidth: "367px", width: "367px"}}>
              <Trans>naimenovaniye</Trans>
            </th>
            <th>
              <Trans>information</Trans>
            </th>
          </tr>
          </thead>
          <tbody>
          {programs &&
              programs.map((program) => (
                  <tr key={program.id}>
                    <td>
                      <div className="application-table__program-name">
                        <p>{program.name}</p>

                        <input
                            type="checkbox"
                            data-name={program.name}
                            data-id={program.id}
                            checked={this.programsChecked(program.name)}
                        />
                      </div>
                    </td>
                    <td>{program.info}</td>
                  </tr>
              ))}
          </tbody>
        </React.Fragment>
    );

  }

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

  renderDocFile(document, docFirst) {
    if (docFirst.length > 0) {
      let doc;

      for (let i = 0; i < docFirst.length; i++) {
        if (
            document.docType.id === docFirst[i].docType.id &&
            document.docOwner.id === docFirst[i].docOwner.id
        ) {
          doc = docFirst[i];
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
      if (typeof idx !== "undefined") {
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
      if (typeof idx !== "undefined") {
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
      if (typeof idx !== "undefined") {
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

  renderBusinessPlan(bFile) {
    if (bFile !== null && JSON.stringify(bFile) !== '{}') {
      const doc = bFile;
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

  render() {
    console.log(this.props.competition);
    const {language} = this.props.appState.userStore;
    const {application} = this.props;
    const {documents} = this.state;
    if (!application) {
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
      const {docFirst, appDocs} = application;
      const {bFile} = this.state;
      return (
          <React.Fragment>
            <div className="application-form__heading">
              <h2>
                <Trans>Form</Trans>
              </h2>
            </div>
            {console.log("tm_bp_view")}
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
                          style={{width: "500px"}}
                          className="general-info__input"
                          type="text"
                          name="directionName"
                      />
                    </td>
                  </tr>
                  </tbody>
                </table>
            )}
            {this.props.competition.status === "BUSINESS_PLAN" && (
                <div className="application-form__documents">
                  <div className="application-form__headings">
                    <p>
                      <Trans>DocType</Trans>
                    </p>
                    <p>
                      <Trans>File</Trans>
                    </p>
                  </div>
                  <div
                      className="application-form__document"
                  >
                    <p>
                      <Trans>BusinessPlan</Trans>{" "}<span className="mandatory">*</span>
                    </p>
                    <div className="inputfile__container">
                      {this.renderBusinessPlan(bFile)}
                    </div>
                  </div>
                </div>)}
            {(application.appDocs && application.appDocs.length > 0)
                ? documents &&
                documents.length > 0 && (
                    <div className="application-form__documents">
                      <div
                          className="application-form__headings"
                          style={{justifyContent: "start", paddingRight: "10px"}}
                      >
                        <p style={{width: "300px", paddingLeft: "10px"}}>
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
                                  style={{justifyContent: "start"}}
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
                    </div>)
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
              <div style={{marginTop: '20px'}} className="application-table__tabs">
                <div><h1><Trans>Programs</Trans></h1></div>
              </div>
              <div className="application-table__body">
                <table className="application-table">{this.renderProgramsTable()}</table>
              </div>
            </div>
            <ExtraFields
                program={this.state.programs}
                app_id={application.id}
                relevance={this.state.relevance}
                applicationForm={this.state.applicationForm}
                efficiencyAndResult={this.state.efficiencyAndResult}
                resource={this.state.resource}
                teamMembers={this.state.teamMembers}
                sustainability={this.state.sustainability}
                innovativeness={this.state.innovativeness}
                projectIdea={this.state.projectIdea}
                businessModel={this.state.businessModel}
                effectiveness={this.state.effectiveness}
                scalability={this.state.scalability}
                organizationPotential={this.state.organizationPotential}
            />
            <div style={{paddingBottom: '50px'}}>

            </div>
          </React.Fragment>
      );
    }
  }
}
export default TeamMemberViewPage;
