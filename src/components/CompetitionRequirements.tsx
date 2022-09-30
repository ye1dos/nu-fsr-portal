import * as React from "react";
import DocComponent from "../components/DocComponent";

export interface CompetitionRequirementsProps {
  competition;
  loadAttachment;
  loadFile;
}

export interface CompetitionRequirementsState {}

class CompetitionRequirements extends React.Component<
  CompetitionRequirementsProps,
  CompetitionRequirementsState
> {
  state = {};

  render() {
    const { competition } = this.props;
    // const { language } = this.props.appState.userStore;
    return (
      <React.Fragment>
        <div className="comp__requirements__wrapper">
        <div className="comp__requirements__left">
          {competition.requirements.length > 0 && (
            <div>
              <h2 className="comp__requirements__header">
                Заявитель должен одновременно соответствовать следующим
                требованиям:
              </h2>
              <p className="comp__requirements__text"></p>
              <div className="comp__requirements__container">
                {competition.requirements
                  .slice()
                  .sort(this.compareRequirements)
                  .map((req_el, req_key) => (
                    <div className="comp__requirements__item" key={req_key}>
                      <p className="comp__requirements__number">
                        {req_el.item}
                      </p>
                      <p className="comp__requirements__desc">
                        {this.capitalizeFirstLetter(req_el.description)}
                      </p>
                      <p className="comp__requirements__mandatory">
                        {req_el.mandatory ? "*" : ""}
                      </p>
                    </div>
                    
                  ))}
                  </div>
              </div>
              )}
              {competition.attachments.length > 0 && (
                <div className="comp__attachments">
                  <h2 className="comp__attachments__header">Приложения</h2>
                  <div className="comp__attachments__container">
                    {competition.attachments
                      .slice()
                      .sort((a, b) => {
                        if (a.name && b.name) {
                          return a.name.localeCompare(b.name);
                        }
                      })
                      .map((att_el) => this.renderDocComponent(att_el))}
                  </div>
                </div>
          )}
          </div>
          {/* <div className="comp__requirements__right">
            {competition.reqDocs.length > 0 && (
              <React.Fragment>
                <h2 className="comp__docs__header">Требуемые документы:</h2>
                <div className="comp__docs__container">
                  <table>
                    <tbody>
                      {competition.reqDocs
                        .slice()
                        .sort((a, b) =>
                          a.docType.name.localeCompare(b.docType.name)
                        )
                        .map((doc_el, doc_key) => (
                          <tr key={doc_key}>
                            <td>
                              {doc_el.docType ? doc_el.docType.name : ""}{" "}
                              <span className="comp__requirements__mandatory">
                                {doc_el.mandatory ? "*" : ""}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </React.Fragment>
            )}
          </div> */}
        </div>
        {competition.scorings.length > 0 && (
          <div className="comp__scorings">
            <h2>Критерий отбора</h2>
            <div className="comp__scorings__container">
              <table className="comp__scorings__table">
                <tbody>
                  {competition.scorings.map((scoring, idx) => {
                    return (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{scoring.achievement}</td>
                        <td>{scoring.point} балла(ов)</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
  renderDocComponent(element) {
    const { loadAttachment, loadFile } = this.props;
    return (
      <DocComponent
        key={element.id}
        id={element.id}
        getDoc={loadAttachment}
        getFile={loadFile}
        fileType="attachment"
        name={element.name}
      />
    );
  }
  compareRequirements(a, b) {
    let comparision = 0;
    if (a.item > b.item) {
      comparision = 1;
    } else if (a.item < b.item) {
      comparision = -1;
    }
    return comparision;
  }
  capitalizeFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }
}

export default CompetitionRequirements;
