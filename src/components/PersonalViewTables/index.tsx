import * as React from "react";
// import FileComponent from "../../components/FileComponent";
import { observer } from "mobx-react";
import { AppStateObserver, injectAppState } from "../../stores";
import i18next from "i18next";
import { Trans } from "react-i18next";

// import { toJS } from "mobx";

// import editIcon from "../../assets/icons/edit-icon.svg";

export interface PersonalViewTablesProps {
  applicant;
  loadFile;
}

export interface PersonalViewTablesState {}

@injectAppState
@observer
class PersonalViewTables extends React.Component<
  PersonalViewTablesProps & AppStateObserver,
  PersonalViewTablesState
> {
  state = {
    tabs: [
      { name: "Достижения", active: true },
      { name: "Опыт работы", active: false },
      { name: "Образование", active: false },
      { name: "Судимость", active: false },
      { name: "Связанные лица", active: false },
      // { name: "Документы", active: false }
    ],
    docTypeOptions: [
      {
        value: "REGISTRATION_APPLICATION",
        label: "Заявление на постановку на учет",
      },
      { value: "IDCARD", label: "Удостоверение личности" },
      { value: "PASSPORT", label: "Паспорт" },
      {
        value: "MARRIAGE_CERTIFICATE",
        label: "Свидетельство о заключении брака",
      },
      {
        value: "CERTIFICATE_OF_DIVORCE",
        label: "Свидетельство о расторжении брака",
      },
      { value: "CERTIFICATE_OF_EMPLOYMENT", label: "Справка с работы" },
      {
        value: "CERTIFICATE_OF_HOUSING",
        label: "Справки об отсутствии жилья/наличии",
      },
      { value: "ADDRESS_REFERENCE", label: "Адресная справка" },
      { value: "BIRTH_CERTIFICATE", label: "Свидетельство о рождении" },
      {
        value: "PARTICIPATION_APPLICATION",
        label: "Заявление на участие в конкурсе",
      },
      { value: "DISABILITY_CERTIFICATE", label: "Справка об инвалидности" },
      {
        value: "REFERENCE_LETTER",
        label: "Рекомендательное письмо по шаблону",
      },
      {
        value: "DIPLOMA_CERTIFICATE_PATENT_AWARD",
        label: "Диплом (магистр/кандидат наук)",
      },
    ],
    docOwnerOptions: [
      { value: "APPLICANT", label: "Заявитель" },
      { value: "SPOSE", label: "Супруг/супруга" },
      { value: "CHILDREN", label: "Дети" },
      { value: "PARENTS", label: "Родители" },
    ],
    achievementsOptions: [
      { value: "HAS_REFERENCE_LETTER", label: "Рекомендательное письмо" },
      { value: "HAS_SCHOLAR_DEGREE", label: "Ученая степень" },
      { value: "HAS_MAGISTER_DEGREE", label: "Степень магистра" },
      { value: "HAS_ARTICLES", label: "Статьи в научных журналах" },
      { value: "TEAMLEAD_EXPERIENCE", label: "Опыт лидера" },
      { value: "PATENT_AUTHORSHIP", label: "Авторство патента" },
      { value: "GOVORG_AWARDS", label: "Государственная награда" },
      {
        value: "CERTIF_OF_HONOR_LETTERS",
        label: "Сертификат, Диплом или Почетная Грамота",
      },
      { value: "WORK_EXPERIENCE", label: "Стаж работы" },
    ],
    higherEducationOptions: [
      { value: "MASTER", label: "Магистр" },
      { value: "DOCTOR", label: "Доктор" },
    ],
    activeTab: 0,
    docIndex: -1,
    achievementIndex: -1,
    educationIndex: -1,
    convictionIndex: -1,
    workExperienceIndex: -1,
    relativeIndex: -1,
  };

  handleTabClick = (index) => {
    let tabs = [...this.state.tabs];

    for (let i = 0; i < tabs.length; i++) {
      tabs[i].active = false;
      if (i === index) tabs[i].active = true;
    }

    this.setState({ tabs, activeTab: index });
  };

  toggleDocsEdit = (index) => {
    this.props.applicant.docs.forEach((element) => {
      element.show = false;
    });
    this.props.applicant.docs[index].show = !this.props.applicant.docs[index]
      .show;
  };
  editDoc = (index) => {
    this.setState({ docIndex: index });
  };
  deleteDoc = (index) => {
    this.props.applicant.docs.splice(index, 1);
  };
  addDoc = () => {
    this.props.applicant.docs.forEach((element) => {
      element.show = false;
    });
    this.props.applicant.docs.push({
      file: { name: "" },
      info: "",
      docType: "PASSPORT",
      docOwner: "APPLICANT",
    });
    let index = this.props.applicant.docs.length - 1;
    this.setState({ docIndex: index });
  };

  handleDocTypeChange = (event, index) => {
    this.props.applicant.docs[index].docType = event.target.value;
    console.log(`Option selected:`, event.target.value);
  };
  handleDocOwnerChange = (event, index) => {
    this.props.applicant.docs[index].docOwner = event.target.value;
    console.log(`Option selected:`, event.target.value);
  };

  handleFileChange = (files) => {
    let file;

    if (files[0]) {
      console.log(files[0]);
      this.props.appState.filesStore.uploadFile(files[0]).then((response) => {
        file = response.data;
        this.props.applicant.docs[this.state.docIndex].file = file;
      });
    }
  };
  saveDoc = () => {
    return (async () => {
      this.props.applicant.docs.forEach((element) => {
        element.show = false;
        delete element.show;
      });
      this.setState({ docIndex: -1 });
      let docs = await this.createDocs();
      this.props.applicant.docs = docs;
    })();
  };
  createDocs = () => {
    return (async () => {
      let docFirst = [];
      for (const doc of this.props.applicant.docs) {
        try {
          let document = await this.props.appState.filesStore.updateDocument(
            doc
          );
          docFirst.push(document);
        } catch (error) {
          console.log(error);
        }
      }
      return docFirst;
    })();
  };

  render() {
    const { tabs } = this.state;
    const { applicant } = this.props;
    return (
      <div className="personal-table__container">
        <div className="personal-table__tabs">
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
        <div className="personal-table__body">
          <table className="personal-table">
            {this.renderTable(applicant)}
          </table>
        </div>
      </div>
    );
  }
  renderTable(applicant) {
    const { activeTab } = this.state;
    switch (activeTab) {
      case 0:
        return (
          <React.Fragment>
            <thead>
              <tr>
                <th><Trans>naimenovaniye</Trans></th>
                <th>Критерий</th>
                <th>Количество</th>
                <th>Информация</th>
              </tr>
            </thead>
            <tbody>
              {applicant.achievements.map((achievement, idx) => {
                return (
                  <tr key={idx}>
                    <td>{achievement.name}</td>
                    <td>{achievement.achievement}</td>
                    <td>{achievement.quantity}</td>
                    <td>
                      <div className="last-column">{achievement.info}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </React.Fragment>
        );
      case 1:
        return (
          <React.Fragment>
            <thead>
              <tr>
                <th>Начало</th>
                <th>Конец</th>
                <th>Место работы</th>
                <th>Позиция</th>
              </tr>
            </thead>
            <tbody>
              {applicant.workExperience.map((experience, idx) => {
                return (
                  <tr key={idx}>
                    <td>{experience.startDate}</td>
                    <td>{experience.endDate}</td>
                    <td>{experience.workPlace}</td>
                    <td>
                      <div className="last-column">{experience.position}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </React.Fragment>
        );
      case 2:
        return (
          <React.Fragment>
            <thead>
              <tr>
                <th>Высшее образование</th>
                <th>Университет</th>
                <th>Страна</th>
                <th>Программа обучения</th>
                <th>Год поступления</th>
                <th>Год завершения</th>
                <th>Специальность</th>
                <th>Язык обучения</th>
                <th>Средний балл успеваемости</th>
                <th>Средний балл диплома</th>
              </tr>
            </thead>
            <tbody>
              {applicant.education.map((ed, idx) => {
                return (
                  <tr key={idx}>
                    <td>{ed.higherEducation}</td>
                    <td>{ed.universityName}</td>
                    <td>{ed.country}</td>
                    <td>{ed.studyProgram}</td>
                    <td>{ed.yearEntry}</td>
                    <td>{ed.yearGraduat}</td>
                    <td>{ed.specialty}</td>
                    <td>{ed.studyLanguage}</td>
                    <td>{ed.gpa}</td>
                    <td>
                      <div className="last-column">{ed.dpa}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </React.Fragment>
        );
      case 3:
        return (
          <React.Fragment>
            <thead>
              <tr>
                <th>Причина</th>
                <th>Информация</th>
                <th>Год</th>
              </tr>
            </thead>
            <tbody>
              {applicant.conviction.map((cv, idx) => {
                return (
                  <tr key={idx}>
                    <td>{cv.reason}</td>
                    <td>{cv.info}</td>
                    <td>
                      <div className="last-column">{cv.year}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </React.Fragment>
        );
      case 4:
        return (
          <React.Fragment>
            <thead>
              <tr>
                <th>ФИО</th>
                <th>ИИН</th>
                <th>Номер документы</th>
                <th>Кем выдан</th>
                <th>Дата выдачи</th>
                <th>Номер телефона</th>
                <th>Почта</th>
              </tr>
            </thead>
            <tbody>
              {applicant.relative.map((rl, idx) => {
                return (
                  <tr key={idx}>
                    <td>{rl.fio}</td>
                    <td>{rl.iin}</td>
                    <td>{rl.documNumber}</td>
                    <td>{rl.issuedBy}</td>
                    <td>{rl.dateIssue}</td>
                    <td>{rl.phone}</td>
                    <td>
                      <div className="last-column">{rl.email}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </React.Fragment>
        );
      // case 5:
      //   return (
      //     <React.Fragment>
      //       <thead>
      //         <tr>
      //           <th>Название</th>
      //           <th>Действителен</th>
      //           <th>Тип документа</th>
      //           <th>Принадлежность документа</th>
      //           <th>Примечание</th>
      //         </tr>
      //       </thead>
      //       <tbody>
      //         {applicant.docs.map((doc, idx) => {
      //           if (idx === this.state.docIndex) {
      //             return (
      //               <tr key={idx}>
      //                 <td>
      //                   <FileComponent
      //                     getFile={this.props.loadFile}
      //                     id={doc.file.id}
      //                     name={doc.file.name}
      //                     extension={doc.file.extension}
      //                     withFileIcon={false}
      //                     withDownloadIcon={false}
      //                   />
      //                   <div className="inputfile__container">
      //                     <label htmlFor={`inputfile-${idx}`}>
      //                       Выберите файл
      //                     </label>
      //                     <input
      //                       type="file"
      //                       onChange={e =>
      //                         this.handleFileChange(e.target.files)
      //                       }
      //                       id={`inputfile-${idx}`}
      //                     />
      //                   </div>
      //                 </td>
      //                 <td></td>
      //                 <td>
      //                   <select
      //                     value={doc.docType}
      //                     onChange={event =>
      //                       this.handleDocTypeChange(event, idx)
      //                     }
      //                   >
      //                     {this.state.docTypeOptions.map((o, idx) => (
      //                       <option value={o.value} key={idx}>
      //                         {o.label}
      //                       </option>
      //                     ))}
      //                   </select>
      //                 </td>
      //                 <td>
      //                   <select
      //                     value={doc.docOwner}
      //                     onChange={event =>
      //                       this.handleDocOwnerChange(event, idx)
      //                     }
      //                   >
      //                     {this.state.docOwnerOptions.map((o, idx) => (
      //                       <option value={o.value} key={idx}>
      //                         {o.label}
      //                       </option>
      //                     ))}
      //                   </select>
      //                 </td>
      //                 <td>
      //                   <input
      //                     value={doc.info}
      //                     name="info"
      //                     onChange={event =>
      //                       this.handleDocsInputChange(event, idx)
      //                     }
      //                   />
      //                 </td>
      //               </tr>
      //             );
      //           } else {
      //             return (
      //               <tr key={idx}>
      //                 <td>
      //                   {/* {doc.file ? (
      //                     <FileComponent
      //                       getFile={this.props.loadFile}
      //                       id={doc.file.id}
      //                       name={doc.file.name}
      //                       extension={doc.file.extension}
      //                       withFileIcon={false}
      //                       withDownloadIcon={false}
      //                     />
      //                   ) : (
      //                     <p>File not found</p>
      //                   )} */}
      //                 </td>
      //                 <td>{doc.valid}</td>
      //                 <td>{doc.docType}</td>
      //                 <td>{doc.docOwner}</td>
      //                 <td>
      //                   <div className="last-column">
      //                     {doc.info}
      //                     <img
      //                       src={editIcon}
      //                       className="edit-icon"
      //                       alt=""
      //                       onClick={() => this.toggleDocsEdit(idx)}
      //                     />
      //                     {doc.show && (
      //                       <div className="edit-actions">
      //                         <button onClick={() => this.editDoc(idx)}>
      //                           Изменить
      //                         </button>
      //                         <button onClick={() => this.deleteDoc(idx)}>
      //                           Удалить
      //                         </button>
      //                       </div>
      //                     )}
      //                   </div>
      //                 </td>
      //               </tr>
      //             );
      //           }
      //         })}
      //       </tbody>
      //     </React.Fragment>
      //   );
    }
  }
  renderTabClass(tab) {
    let className = "personal-table__tab";
    if (tab.active) className += " active";
    return className;
  }
}

export default PersonalViewTables;
