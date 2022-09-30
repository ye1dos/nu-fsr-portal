import * as React from "react";
import "./PersonalTables.css";
import FileComponent from "../../components/FileComponent";
import InputMask from "react-input-mask";
import { observer } from "mobx-react";
import { toast } from "react-toastify";
import { AppStateObserver, injectAppState } from "../../stores";
import { toJS } from "mobx";

import deleteIcon from "../../assets/icons/delete-icon.svg";
import penIcon from "../../assets/icons/pen-icon.svg";
import okIcon from "../../assets/icons/ok-icon.svg";
import { Trans } from "react-i18next";
import i18next from "i18next";

export interface PersonalTablesProps {
  applicant;
  loadFile;
}

export interface PersonalTablesState {}

@injectAppState
@observer
class PersonalTables extends React.Component<
  PersonalTablesProps & AppStateObserver,
  PersonalTablesState
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
      { value: "BACHELOR", label: "Бакалавр" },
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
  editAchievement = (index) => {
    this.setState({ achievementIndex: index });
  };
  confirmAchievement = (index) => {
    this.setState({ achievementIndex: -1 });
  };
  deleteAchievement = (index) => {
    this.props.applicant.achievements.splice(index, 1);
  };
  addAchievement = () => {
    this.props.applicant.achievements.forEach((element) => {
      element.show = false;
    });
    this.props.applicant.achievements.push({
      name: "New achievement",
      achievement: "HAS_REFERENCE_LETTER",
      quantity: 1,
      info: "",
    });
    let index = this.props.applicant.achievements.length - 1;
    this.setState({ achievementIndex: index });
  };

  saveAchievement = () => {
    this.props.applicant.achievements.forEach((element) => {
      element.show = false;
      delete element.show;
    });
    this.setState({ achievementIndex: -1 });
  };

  editWorkExperience = (index) => {
    this.setState({ workExperienceIndex: index });
  };
  confirmWorkExperience = (index) => {
    this.setState({ workExperienceIndex: -1 });
  };
  deleteWorkExperience = (index) => {
    this.props.applicant.workExperience.splice(index, 1);
  };
  addWorkExperience = () => {
    this.props.applicant.workExperience.forEach((element) => {
      element.show = false;
    });
    this.props.applicant.workExperience.push({
      startDate: "",
      endDate: "",
      workPlace: "",
      position: "",
    });
    let index = this.props.applicant.workExperience.length - 1;
    this.setState({ workExperienceIndex: index });
  };

  saveWorkExperience = () => {
    this.props.applicant.workExperience.forEach((element) => {
      element.show = false;
      delete element.show;
    });
    this.setState({ workExperienceIndex: -1 });
  };
  editEducation = (index) => {
    this.setState({ educationIndex: index });
  };

  confirmEducation = (index) => {
    this.setState({ educationIndex: -1 });
  };

  deleteEducation = (index) => {
    this.props.applicant.education.splice(index, 1);
  };

  addEducation = () => {
    this.props.applicant.education.forEach((element) => {
      element.show = false;
    });
    this.props.applicant.education.push({
      higherEducation: "MASTER",
      universityName: "",
      country: "KAZAKHSTAN",
      studyProgram: "",
      yearEntry: "",
      yearGraduat: "",
      specialty: "",
      studyLanguage: "",
      gpa: "",
      dpa: "",
    });
    let index = this.props.applicant.education.length - 1;
    this.setState({ educationIndex: index });
  };

  saveEducation = () => {
    this.props.applicant.education.forEach((element) => {
      element.show = false;
      delete element.show;
    });
    this.setState({ educationIndex: -1 });
  };

  editConviction = (index) => {
    this.setState({ convictionIndex: index });
  };
  confirmConviction = (index) => {
    this.setState({ convictionIndex: -1 });
  };
  deleteConviction = (index) => {
    this.props.applicant.conviction.splice(index, 1);
  };

  addConviction = () => {
    this.props.applicant.conviction.forEach((element) => {
      element.show = false;
    });
    this.props.applicant.conviction.push({
      reason: "",
      info: "",
      year: "",
    });
    let index = this.props.applicant.conviction.length - 1;
    this.setState({ convictionIndex: index });
  };

  saveConviction = () => {
    this.props.applicant.conviction.forEach((element) => {
      element.show = false;
      delete element.show;
    });
    this.setState({ convictionIndex: -1 });
  };

  editRelative = (index) => {
    this.setState({ relativeIndex: index });
  };

  confirmRelative = (index) => {
    this.setState({ relativeIndex: -1 });
  };

  deleteRelative = (index) => {
    this.props.applicant.relative.splice(index, 1);
  };

  addRelative = () => {
    this.props.applicant.relative.forEach((element) => {
      element.show = false;
    });
    this.props.applicant.relative.push({
      fio: "Фамилия Имя Отчество",
      iin: "",
      documNumber: "",
      issuedBy: "",
      dateIssue: "",
      phone: "",
      email: "",
    });
    let index = this.props.applicant.relative.length - 1;
    this.setState({ relativeIndex: index });
  };

  saveRelative = () => {
    this.props.applicant.relative.forEach((element) => {
      element.show = false;
      delete element.show;
    });
    this.setState({ relativeIndex: -1 });
  };

  handleHigherEducationChange = (event, index) => {
    this.props.applicant.education[index].higherEducation = event.target.value;
    console.log(`Option selected:`, event.target.value);
  };

  handleAchievementsChange = (event, index) => {
    this.props.applicant.achievements[index].achievement = event.target.value;
    console.log(`Option selected:`, event.target.value);
  };

  handleDocsInputChange = (event, index) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    const docs = [...this.props.applicant.docs];
    let form = docs[index];
    form[name] = value;
    this.props.applicant.docs = docs;
  };
  handleAchievementsInputChange = (event, index) => {
    const target = event.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    const achievements = [...this.props.applicant.achievements];
    let form = achievements[index];
    if (name === "quantity") {
      value = Number(value);
    }
    form[name] = value;
    this.props.applicant.achievements = achievements;
  };
  handleEducationInputChange = (event, index) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    const education = [...this.props.applicant.education];
    let form = education[index];
    form[name] = value;
    this.props.applicant.education = education;
  };
  handleConvictionInputChange = (event, index) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    const conviction = [...this.props.applicant.conviction];
    let form = conviction[index];
    form[name] = value;
    this.props.applicant.conviction = conviction;
  };
  handleWorkExperienceInputChange = (event, index) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    const workExperience = [...this.props.applicant.workExperience];
    let form = workExperience[index];
    form[name] = value;
    this.props.applicant.workExperience = workExperience;
  };
  handleRelativeInputChange = (event, index) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    const relative = [...this.props.applicant.relative];
    let form = relative[index];
    form[name] = value;
    this.props.applicant.relative = relative;
  };

  sendApplicantForm = () => {
    if (
      this.checkAchievements(this.props.applicant.achievements) &&
      this.checkWorkExperience(this.props.applicant.workExperience) &&
      this.checkEducation(this.props.applicant.education) &&
      this.checkConviction(this.props.applicant.conviction) &&
      this.checkRelative(this.props.applicant.relative)
    ) {
      this.saveAchievement();
      this.saveWorkExperience();
      this.saveEducation();
      this.saveConviction();
      this.saveRelative();
      this.props.appState.applicantsStore.updateApplicant(this.props.applicant);
    }
  };
  checkAchievements = (achievements) => {
    let valid = true;
    for (let i = 0; i < achievements.length; i++) {
      let achievement = achievements[i];
      if (achievement.name === "") {
        toast.error("Введите наименование достижения", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        valid = false;
      }
      if (achievement.quantity === "") {
        toast.error("Введите количество достижении", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        valid = false;
      }
      if (!valid) {
        this.handleTabClick(0);
        break;
      }
    }
    return valid;
  };
  checkWorkExperience = (workExperience) => {
    let valid = true;
    for (let i = 0; i < workExperience.length; i++) {
      let experience = workExperience[i];
      if (experience.startDate === "") {
        toast.error("Введите дату начала", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        valid = false;
      } else if (experience.startDate.length !== 10) {
        toast.error("Введите валидную дату начала", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        valid = false;
      }
      if (experience.endDate && experience.endDate.length !== 10) {
        toast.error("Введите валидную дату конца", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        valid = false;
      }
      if (experience.workPlace === "") {
        toast.error("Введите место работы", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        valid = false;
      }
      if (experience.position === "") {
        toast.error("Введите позицию", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        valid = false;
      }

      if (!valid) {
        this.handleTabClick(1);
        break;
      }
    }
    return valid;
  };
  checkEducation = (educationList) => {
    let valid = true;
    for (let i = 0; i < educationList.length; i++) {
      let education = educationList[i];
      if (education.universityName === "") {
        toast.error("Введите название университета", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        valid = false;
      }
      if (education.yearEntry === "") {
        toast.error("Введите год поступления", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        valid = false;
      } else if (education.yearEntry.length !== 4) {
        toast.error("Введите валидный год поступления", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        valid = false;
      }

      if (education.yearGraduat && education.yearGraduat.length !== 4) {
        toast.error("Введите валидный год завершения", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        valid = false;
      }
      if (education.gpa === "") {
        toast.error("Введите cредний балл успеваемости", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        valid = false;
      } else if (Math.ceil(education.gpa) > 4) {
        toast.error("Cредний балл успеваемости не может быть больше 4.0", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        valid = false;
      }
      if (education.dpa === "") {
        toast.error("Введите cредний балл диплома", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        valid = false;
      } else if (Math.ceil(education.dpa) > 4) {
        toast.error("Cредний балл диплома не может быть больше 4.0", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        valid = false;
      }

      if (!valid) {
        this.handleTabClick(2);
        break;
      }
    }
    return valid;
  };
  checkConviction = (convictionList) => {
    let valid = true;
    for (let i = 0; i < convictionList.length; i++) {
      let conviction = convictionList[i];
      if (conviction.reason === "") {
        toast.error("Введите причину", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        valid = false;
      }
      if (conviction.year === "") {
        toast.error("Введите год", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        valid = false;
      } else if (conviction.year && conviction.year.toString().length !== 4) {
        toast.error("Введите валидный год", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        valid = false;
      }
      if (!valid) {
        this.handleTabClick(3);
        break;
      }
    }
    return valid;
  };
  checkRelative = (relativeList) => {
    let valid = true;
    for (let i = 0; i < relativeList.length; i++) {
      let relative = relativeList[i];
      if (relative.fio === "") {
        toast.error("Введите ФИО", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        valid = false;
      }
      if (relative.dateIssue && relative.dateIssue.length !== 10) {
        toast.error("Введите валидную дату выдачи", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        valid = false;
      }
      if (!valid) {
        this.handleTabClick(4);
        break;
      }
    }
    return valid;
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
        {this.renderAddButton()}
        <div className="personal-form__footer">
          {/* {this.renderSaveButton()} */}
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
                if (idx === this.state.achievementIndex) {
                  return (
                    <tr key={idx}>
                      <td>
                        <input
                          value={achievement.name}
                          name="name"
                          onChange={(event) =>
                            this.handleAchievementsInputChange(event, idx)
                          }
                          className="personal-table__input"
                        />
                      </td>
                      <td>
                        <select
                          value={achievement.achievement}
                          onChange={(event) =>
                            this.handleAchievementsChange(event, idx)
                          }
                          className="personal-table__select"
                        >
                          {this.state.achievementsOptions.map((o, idx) => (
                            <option value={o.value} key={idx}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <InputMask
                          defaultValue={achievement.quantity}
                          name="quantity"
                          onChange={(event) =>
                            this.handleAchievementsInputChange(event, idx)
                          }
                          mask="99"
                          maskChar=" "
                          className="personal-table__input"
                        />
                      </td>
                      <td>
                        <div className="last-column">
                          <input
                            value={achievement.info}
                            name="info"
                            onChange={(event) =>
                              this.handleAchievementsInputChange(event, idx)
                            }
                            className="personal-table__input"
                          />
                          <div className="edit-actions">
                            <button
                              className="confirm-row__button"
                              onClick={this.confirmAchievement}
                            >
                              <span>OK</span>
                              <img src={okIcon} className="ok-icon" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                } else {
                  return (
                    <tr key={idx}>
                      <td>{achievement.name}</td>
                      <td>{achievement.achievement}</td>
                      <td>{achievement.quantity}</td>
                      <td>
                        <div className="last-column">
                          <p>{achievement.info}</p>
                          <div className="edit-actions">
                            <img
                              src={penIcon}
                              className="pen-icon"
                              alt=""
                              onClick={() => this.editAchievement(idx)}
                            />
                            <img
                              src={deleteIcon}
                              className="pen-icon"
                              alt=""
                              onClick={() => this.deleteAchievement(idx)}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                }
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
                if (idx === this.state.workExperienceIndex) {
                  return (
                    <tr key={idx}>
                      <td>
                        <InputMask
                          defaultValue={experience.startDate}
                          name="startDate"
                          onChange={(event) =>
                            this.handleWorkExperienceInputChange(event, idx)
                          }
                          mask="9999-99-99"
                          maskChar=""
                          placeholder="YYYY-MM-DD"
                          className="personal-table__input"
                        />
                      </td>
                      <td>
                        <InputMask
                          defaultValue={experience.endDate}
                          name="endDate"
                          onChange={(event) =>
                            this.handleWorkExperienceInputChange(event, idx)
                          }
                          mask="9999-99-99"
                          maskChar=""
                          placeholder="YYYY-MM-DD"
                          className="personal-table__input"
                        />
                      </td>
                      <td>
                        <input
                          value={experience.workPlace}
                          name="workPlace"
                          onChange={(event) =>
                            this.handleWorkExperienceInputChange(event, idx)
                          }
                          className="personal-table__input"
                        />
                      </td>
                      <td>
                        <div className="last-column">
                          <input
                            value={experience.position}
                            name="position"
                            onChange={(event) =>
                              this.handleWorkExperienceInputChange(event, idx)
                            }
                            className="personal-table__input"
                          />
                          <div className="edit-actions">
                            <button
                              className="confirm-row__button"
                              onClick={this.confirmWorkExperience}
                            >
                              <span>OK</span>
                              <img src={okIcon} className="ok-icon" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                } else {
                  return (
                    <tr key={idx}>
                      <td>{experience.startDate}</td>
                      <td>{experience.endDate}</td>
                      <td>{experience.workPlace}</td>
                      <td>
                        <div className="last-column">
                          <p>{experience.position}</p>
                          <div className="edit-actions">
                            <img
                              src={penIcon}
                              className="pen-icon"
                              alt=""
                              onClick={() => this.editWorkExperience(idx)}
                            />
                            <img
                              src={deleteIcon}
                              className="pen-icon"
                              alt=""
                              onClick={() => this.deleteWorkExperience(idx)}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                }
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
                if (idx === this.state.educationIndex) {
                  return (
                    <tr key={idx}>
                      <td>
                        <select
                          value={ed.higherEducation}
                          onChange={(event) =>
                            this.handleHigherEducationChange(event, idx)
                          }
                          className="personal-table__select"
                        >
                          {this.state.higherEducationOptions.map((o, idx) => (
                            <option value={o.value} key={idx}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          value={ed.universityName}
                          name="universityName"
                          onChange={(event) =>
                            this.handleEducationInputChange(event, idx)
                          }
                          className="personal-table__input"
                        />
                      </td>
                      <td>
                        <input
                          value={ed.country}
                          name="country"
                          onChange={(event) =>
                            this.handleEducationInputChange(event, idx)
                          }
                          className="personal-table__input"
                        />
                      </td>
                      <td>
                        <input
                          value={ed.studyProgram}
                          name="studyProgram"
                          onChange={(event) =>
                            this.handleEducationInputChange(event, idx)
                          }
                          className="personal-table__input"
                        />
                      </td>
                      <td>
                        <InputMask
                          defaultValue={ed.yearEntry}
                          name="yearEntry"
                          onChange={(event) =>
                            this.handleEducationInputChange(event, idx)
                          }
                          mask="9999"
                          placeholder="YYYY"
                          maskChar=""
                          className="personal-table__input"
                        />
                      </td>
                      <td>
                        <InputMask
                          defaultValue={ed.yearGraduat}
                          name="yearGraduat"
                          onChange={(event) =>
                            this.handleEducationInputChange(event, idx)
                          }
                          mask="9999"
                          placeholder="YYYY"
                          maskChar=""
                          className="personal-table__input"
                        />
                      </td>
                      <td>
                        <input
                          value={ed.specialty}
                          name="specialty"
                          onChange={(event) =>
                            this.handleEducationInputChange(event, idx)
                          }
                          className="personal-table__input"
                        />
                      </td>
                      <td>
                        <input
                          value={ed.studyLanguage}
                          name="studyLanguage"
                          onChange={(event) =>
                            this.handleEducationInputChange(event, idx)
                          }
                          className="personal-table__input"
                        />
                      </td>
                      <td>
                        <InputMask
                          defaultValue={ed.gpa}
                          name="gpa"
                          onChange={(event) =>
                            this.handleEducationInputChange(event, idx)
                          }
                          mask="9.9"
                          maskChar="0"
                          placeholder="4.0"
                          className="personal-table__input"
                        />
                      </td>
                      <td>
                        <div className="last-column">
                          <InputMask
                            defaultValue={ed.dpa}
                            name="dpa"
                            onChange={(event) =>
                              this.handleEducationInputChange(event, idx)
                            }
                            mask="9.9"
                            maskChar="0"
                            placeholder="4.0"
                            className="personal-table__input"
                          />
                          <div className="edit-actions">
                            <button
                              className="confirm-row__button"
                              onClick={this.confirmEducation}
                            >
                              <span>OK</span>
                              <img src={okIcon} className="ok-icon" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                } else {
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
                        <div className="last-column">
                          <p>{ed.dpa}</p>
                          <div className="edit-actions">
                            <img
                              src={penIcon}
                              className="pen-icon"
                              alt=""
                              onClick={() => this.editEducation(idx)}
                            />
                            <img
                              src={deleteIcon}
                              className="pen-icon"
                              alt=""
                              onClick={() => this.deleteEducation(idx)}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                }
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
                if (idx === this.state.convictionIndex) {
                  return (
                    <tr key={idx}>
                      <td>
                        <input
                          value={cv.reason}
                          name="reason"
                          onChange={(event) =>
                            this.handleConvictionInputChange(event, idx)
                          }
                          className="personal-table__input"
                        />
                      </td>
                      <td>
                        <input
                          value={cv.info}
                          name="info"
                          onChange={(event) =>
                            this.handleConvictionInputChange(event, idx)
                          }
                          className="personal-table__input"
                        />
                      </td>
                      <td>
                        <div className="last-column">
                          <InputMask
                            defaultValue={cv.year}
                            name="year"
                            onChange={(event) =>
                              this.handleConvictionInputChange(event, idx)
                            }
                            mask="9999"
                            placeholder="YYYY"
                            maskChar=""
                            className="personal-table__input"
                          />
                          <div className="edit-actions">
                            <button
                              className="confirm-row__button"
                              onClick={this.confirmConviction}
                            >
                              <span>OK</span>
                              <img src={okIcon} className="ok-icon" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                } else {
                  return (
                    <tr key={idx}>
                      <td>{cv.reason}</td>
                      <td>{cv.info}</td>
                      <td>
                        <div className="last-column">
                          <p>{cv.year}</p>
                          <div className="edit-actions">
                            <img
                              src={penIcon}
                              className="pen-icon"
                              alt=""
                              onClick={() => this.editConviction(idx)}
                            />
                            <img
                              src={deleteIcon}
                              className="pen-icon"
                              alt=""
                              onClick={() => this.deleteConviction(idx)}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                }
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
                <th>Номер документа</th>
                <th>Кем выдан</th>
                <th>Дата выдачи</th>
                <th>Номер телефона</th>
                <th>Почта</th>
              </tr>
            </thead>
            <tbody>
              {applicant.relative.map((rl, idx) => {
                if (idx === this.state.relativeIndex) {
                  return (
                    <tr key={idx}>
                      <td>
                        <input
                          value={rl.fio}
                          name="fio"
                          onChange={(event) =>
                            this.handleRelativeInputChange(event, idx)
                          }
                          className="personal-table__input"
                        />
                      </td>
                      <td>
                        <input
                          value={rl.iin}
                          name="iin"
                          onChange={(event) =>
                            this.handleRelativeInputChange(event, idx)
                          }
                          className="personal-table__input"
                        />
                      </td>
                      <td>
                        <input
                          value={rl.documNumber}
                          name="documNumber"
                          onChange={(event) =>
                            this.handleRelativeInputChange(event, idx)
                          }
                          className="personal-table__input"
                        />
                      </td>
                      <td>
                        <input
                          value={rl.issuedBy}
                          name="issuedBy"
                          onChange={(event) =>
                            this.handleRelativeInputChange(event, idx)
                          }
                          className="personal-table__input"
                        />
                      </td>
                      <td>
                        <InputMask
                          defaultValue={rl.dateIssue}
                          name="dateIssue"
                          onChange={(event) =>
                            this.handleRelativeInputChange(event, idx)
                          }
                          mask="9999-99-99"
                          maskChar=""
                          placeholder="YYYY-MM-DD"
                          className="personal-table__input"
                        />
                      </td>
                      <td>
                        <input
                          value={rl.phone}
                          name="phone"
                          onChange={(event) =>
                            this.handleRelativeInputChange(event, idx)
                          }
                          className="personal-table__input"
                        />
                      </td>
                      <td>
                        <div className="last-column">
                          <input
                            value={rl.email}
                            name="email"
                            onChange={(event) =>
                              this.handleRelativeInputChange(event, idx)
                            }
                            className="personal-table__input"
                          />
                          <div className="edit-actions">
                            <button
                              className="confirm-row__button"
                              onClick={this.confirmRelative}
                            >
                              <span>OK</span>
                              <img src={okIcon} className="ok-icon" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                } else {
                  return (
                    <tr key={idx}>
                      <td>{rl.fio}</td>
                      <td>{rl.iin}</td>
                      <td>{rl.documNumber}</td>
                      <td>{rl.issuedBy}</td>
                      <td>{rl.dateIssue}</td>
                      <td>{rl.phone}</td>
                      <td>
                        <div className="last-column">
                          <p>{rl.email}</p>
                          <div className="edit-actions">
                            <img
                              src={penIcon}
                              className="pen-icon"
                              alt=""
                              onClick={() => this.editRelative(idx)}
                            />
                            <img
                              src={deleteIcon}
                              className="pen-icon"
                              alt=""
                              onClick={() => this.deleteRelative(idx)}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </React.Fragment>
        );
    }
  }
  renderTabClass(tab) {
    let className = "personal-table__tab";
    if (tab.active) className += " active";
    return className;
  }
  renderAddButton() {
    const { activeTab } = this.state;
    switch (activeTab) {
      case 0:
        return (
          <div className="add-row__container">
            <button className="add-row" onClick={this.addAchievement}>
            <Trans>Add</Trans>
            </button>
          </div>
        );
      case 1:
        return (
          <div className="add-row__container">
            <button className="add-row" onClick={this.addWorkExperience}>
            <Trans>Add</Trans>
            </button>
          </div>
        );
      case 2:
        return (
          <div className="add-row__container">
            <button className="add-row" onClick={this.addEducation}>
            <Trans>Add</Trans>
            </button>
          </div>
        );
      case 3:
        return (
          <div className="add-row__container">
            <button className="add-row" onClick={this.addConviction}>
            <Trans>Add</Trans>
            </button>
          </div>
        );
      case 4:
        return (
          <div className="add-row__container">
            <button className="add-row" onClick={this.addRelative}>
            <Trans>Add</Trans>
            </button>
          </div>
        );
      case 5:
        return (
          <div className="add-row__container">
            <button className="add-row" onClick={this.addDoc}>
            <Trans>Add</Trans>
            </button>
          </div>
        );
      default:
        return (
          <div className="add-row__container">
            <button className="add-row">Добавить</button>
          </div>
        );
    }
  }
  renderSaveButton() {
    const { activeTab } = this.state;
    switch (activeTab) {
      case 0:
        return (
          <button
            className="personal-form__save"
            onClick={this.saveAchievement}
          >
            <Trans>Save</Trans>
          </button>
        );
      case 1:
        return (
          <button
            className="personal-form__save"
            onClick={this.saveWorkExperience}
          >
            <Trans>Save</Trans>
          </button>
        );
      case 2:
        return (
          <button className="personal-form__save" onClick={this.saveEducation}>
            <Trans>Save</Trans>
          </button>
        );
      case 3:
        return (
          <button className="personal-form__save" onClick={this.saveConviction}>
            <Trans>Save</Trans>
          </button>
        );
      case 4:
        return (
          <button className="personal-form__save" onClick={this.saveRelative}>
            <Trans>Save</Trans>
          </button>
        );
      case 5:
        return (
          <button className="personal-form__save" onClick={this.saveDoc}>
            <Trans>Save</Trans>
          </button>
        );
    }
  }
}

export default PersonalTables;
