import * as React from "react";
import { AppStateObserver, injectAppState } from "../../stores";
import { observer } from "mobx-react";
import FileComponent from "../../components/FileComponent";
import Loader from "react-loader-spinner";
import { toast } from "react-toastify";
import { Trans } from "react-i18next";
import i18next from "i18next";
import ExtraFields from "../ExtraFields/view";

export interface ProcessApplicationFormForBusinessPlanViewProps {
  espFile;
  password;
  application;
  documents;
  comment;
}

export interface ProcessApplicationFormForBusinessPlanViewState {}

@injectAppState
@observer
class ProcessApplicationFormForBusinessPlanView extends React.Component<
    ProcessApplicationFormForBusinessPlanViewProps & AppStateObserver,
    ProcessApplicationFormForBusinessPlanViewState
> {
  state = {
    teamMembers: this.props.application?.teamMembers || [],
    bFile: this.props.application?.businessPlan || null,
    relevance: this.props.application?.relevance || null,
    applicationForm: this.props.application?.applicationForm || null,
    efficiencyAndResult: this.props.application?.efficiencyAndResult || null,
    resource: this.props.application?.resource || null,
    sustainability: this.props.application?.sustainability || null,
    innovativeness: this.props.application?.innovativeness || null,
    programs: this.props.application?.programs || null,
    projectIdea: this.props.application.projectIdea || null,
    businessModel: this.props.application.businessModel || null,
    effectiveness: this.props.application.effectiveness || null,
    scalability: this.props.application.scalability || null,
    organizationPotential: this.props.application.organizationPotential || null,
    checkProgram: true 
  };

  loadFile = (id) => {
    return this.props.appState.filesStore.downloadFile(id);
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
  saveApplicationWithProcess = (outcome, procTaskId) => {
    this.props.appState.applicationsStore.isApplicationSaving = true;
    return (async () => {
      let businessPlan = await this.createDocs();
      let application = this.props.appState.applicationsStore.application;
      businessPlan.application = {id: application.id}
      application.businessPlan = businessPlan;

      // console.log(toJS(application));

      if (
          this.props.appState.competitionsStore.competition.status === "COLLECTION_OF_APPLICATION" ||
          this.props.appState.competitionsStore.competition.status === "REVIEW" ||
          this.props.appState.competitionsStore.competition.status === "BUSINESS_PLAN"
      ) {
        this.props.appState.applicationsStore
            .approveApplication(
                application,
                this.props.espFile,
                this.props.password,
                this.props.comment,
                outcome,
                procTaskId
            )
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
                }, 500);
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
      } else {
        toast.error("К сожалению вы не уже можете поменять заявку", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
      return application;
    })();
  };
  render() {
    const { isLoadingApplication } = this.props.appState.applicationsStore;
    const { application, documents } = this.props;
    const { language } = this.props.appState.userStore;
    if (isLoadingApplication || !application) {
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
      const { bFile, checkProgram } = this.state;
      return (
        <React.Fragment>
          <div className="application-form__heading">
            <h2>
              <Trans>Form</Trans>
            </h2>
          </div>
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
          {this.props.appState.competitionsStore.competition.status === "BUSINESS_PLAN" && (
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
                        <label
                            htmlFor={`inputfile-1`}
                            style={{ marginLeft: "13px" }}
                        >
                          <Trans>ChooseFile</Trans>
                        </label>
                        <input
                            type="file"
                            onChange={(e) =>
                                this.handleFileChange(
                                    e.target.files
                                )
                            }
                            id={`inputfile-1`}
                        />
                      </div>
                    </div>
          </div>)}
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
            : checkProgram && documents &&
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
  renderProgramsTable() {
    const { programs } = this.props.appState.applicationsStore.application;
    return (
        <React.Fragment>
          <thead>
          <tr>
            <th style={{ minWidth: "367px", width: "367px" }}>
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
  renderBusinessPlan(bFile) {
    if (bFile !== null) {
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
  handleFileChange = (files) => {
    // this.setState({
    //   fileLoading: { type: docType.name, owner: docOwner.name },
    // });
    let file;
    let bFile = {...this.state.bFile};
    // let docFirst = [...this.state.docFirst];

    // for (let i = 0; i < docFirst.length; i++) {
    //   if (
    //       docFirst[i].docType.id === docType.id &&
    //       docFirst[i].docOwner.id === docOwner.id
    //   ) {
    //     docFirst.splice(i, 1);
    //   }
    // }

    if (files[0]) {
      this.props.appState.filesStore
          .uploadFile(files[0])
          .then((response) => {
            console.log(files[0])
            file = response.data;
            let ivanDoc = this.checkDocuments(
                files,
                file,
                bFile
            );
            this.setState({ bFile: ivanDoc });
            // this.setState({ fileLoading: { type: null, owner: null } });
          })
          .catch((error) => {
            this.setState({ fileLoading: { type: null, owner: null } });
            toast.error(i18next.t("Error"), {
              position: toast.POSITION.BOTTOM_CENTER,
            });
            console.log(error);
          });
    }
  };
  checkDocuments(files, file, bFile) {
    if (files.length !== 0) {
      let myDocument = {
        file: file,
        name: file.name,
        applicant: this.props.appState.applicantsStore.applicant,
      };
      bFile = myDocument;
    }
    return bFile;
  };
  createDocs = () => {
    return (async () => {
      const doc = this.state.bFile;
      let businessPlan = null;

        try {
          let document = await this.props.appState.filesStore.updateDocument(
              doc
          );
          businessPlan = document;
        } catch (error) {
          console.log(error);
        }
      return businessPlan;
    })();
  };
}

export default ProcessApplicationFormForBusinessPlanView;
