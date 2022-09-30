import * as React from "react";
import { observer } from "mobx-react";
import { AppStateObserver, injectAppState } from "../../stores";
import Avatar from "../Avatar";
import InputMask from "react-input-mask";
import PhotoComponent from "../PhotoComponent";
import OutsideClickHandler from "react-outside-click-handler";

import "./GeneralInfo.css";
import { toast } from "react-toastify";
import { Trans } from "react-i18next";
import i18next from "i18next";
import { toJS } from "mobx";
import DatePickerComponent from "../DatePicker";
import { cubaREST } from "../../cubaREST";
export interface GeneralInfoProps {
  applicant;
}

export interface GeneralInfoState {}

@injectAppState
@observer
class GeneralInfo extends React.Component<
  GeneralInfoProps & AppStateObserver,
  any
> {
  constructor(props) {
    super(props);
    this.avatarComponent = React.createRef();
    this.photoComponent = React.createRef();
  }

  avatarComponent;
  photoComponent;
  // formatDate = (date) => {
  //   console.log(date);
    
  //   const dateArr = date.split("-");
  //   const dd = dateArr[0];
  //   const yyyy = dateArr[2];
  //   dateArr[0] = yyyy;
  //   dateArr[2] = dd;
  //   return dateArr.join("-");
  // }
  state = {
    graduateNIS: this.props.applicant.graduateNIS || {},
    graduateNU: this.props.applicant.graduateNU || {},
    thirdPerson: this.props.applicant.thirdPerson || {},
    stillWork: this.props.applicant.staff && !this.props.applicant.staff.dateFired ? true : false,
    birthDay: this.props.applicant && this.props.applicant.birthDay || null,
    dateEnroll: this.props.applicant.student && this.props.applicant.student.dateEnroll || null,
    dateHired: this.props.applicant.staff && this.props.applicant.staff.dateHired || null,
    dateFired: this.props.applicant.staff && this.props.applicant.staff.dateFired || null,
    cellNumber: this.props.applicant.phone && this.props.applicant.phone.cellNumber || null,
    info: [
      { name: "IDNumber", value: "idNumber", type: "text" },
      { name: "Name", value: "firstname", type: "text" },
      { name: "Surname", value: "lastname", type: "text" },
      { name: "Middlename", value: "middlename", type: "text" },
      { name: "BirthDate", value: "birthDay", type: "date" },
      {
        name: "Gender", value: "gender", type: "radio",
        list: [
          { name: "MALE", caption: "Male" },
          { name: "FEMALE", caption: "Female" },
        ],
      },
      {
        name: "maritalStatus",
        value: "maritalStatus",
        type: "dropdown",
        list: [
          { name: "SINGLE", caption: "notMarried" },
          { name: "MARRIED", caption: "married" },
          { name: "DIVORCED", caption: "divorced" },
          { name: "WIDOW", caption: "widow" },
        ],
      },
      { name: "telefon", value: "phone", value2: "cellNumber", type: "number" },
      { name: "email", value: "email", type: "text" },
      { name: "citizenship", value: "citizenship", type: "dropdown" },
      { name: "IIN", value: "iin", type: "number" },
      {
        name: "applicantType",
        value: "applicantType",
        type: "dropdown",
        list: [
          { name: "EMPLOYEE", caption: "Employee" },
          { name: "STUDENT", caption: "Student" },
          // { name: "ORGANIZATION", caption: "Организация" },
          { name: "GRADUATE_NIS", caption: "GraduateNIS" },
          { name: "GRADUATE_NU", caption: "GraduateNU" },
          // { name: "THIRD_PERSON", caption: "Третье лицо" },
        ],
      },
      // { name: "Паспорт заявителя" },
      // { name: "Адрес" },
      { name: "hasGraBolashak", value: "hasGraBolashak", type: "checkbox" },
    ],
    studentInfo: [
      { name: "GPA", value: "gpa", type: "number" },
      { name: "entryPoints", value: "entryPoints", type: "number" },
      { name: "school", value: "school", type: "dropdown" },
      { name: "grade", value: "grade", type: "number" },
      { name: "dateEnroll", value: "dateEnroll", type: "date" },
      { name: "studyProgram", value: "studyProgram", type: "dropdown" },
      { name: "socialStatus", value: "socialStatus", type: "dropdown" },
    ],
    employeeInfo: [
      { name: "company", value: "company", type: "dropdown" },
      { name: "department", value: "department", type: "text" },
      { name: "position", value: "position", type: "text" },
      { name: "dateHired", value: "dateHired", type: "date" },
      { name: "dateFired", value: "dateFired", type: "date" },
      { name: "stillWork", value: "stillWork", type: "checkbox" }
    ],
    organizationInfo: [
      { name: "name", value: "name", type: "text" },
      { name: "bank", value: "bank", type: "text" },
      { name: "bin", value: "bin", type: "text" },
      { name: "bik", value: "bik", type: "text" },
      { name: "kbe", value: "kbe", type: "text" },
      { name: "iban", value: "iban", type: "text" },
      // { name: "Адрес", value: "address", type: "text" },
      { name: "description", value: "description", type: "text" },
    ],
    graduateNISInfo: [
      { name: "address", value: "address", type: "text" },
      { name: "contactPerson", value: "contactPerson", type: "text" },
      { name: "university", value: "university", type: "text" },
      { name: "faculty", value: "faculty", type: "text" },
      { name: "specialty", value: "specialty", type: "text" },
      { name: "startYear", value: "startYear", type: "date" },
      { name: "endYear", value: "endYear", type: "date" },
      { name: "organization", value: "organization", type: "text" },
      { name: "department", value: "department", type: "text" },
      { name: "position", value: "position", type: "text" },
      { name: "isWork", value: "isWork", type: "checkbox" },
    ],
    graduateNUInfo: [
      { name: "address", value: "address", type: "text" },
      { name: "contactPerson", value: "contactPerson", type: "text" },
      { name: "university", value: "university", type: "text" },
      { name: "faculty", value: "faculty", type: "text" },
      { name: "specialty", value: "specialty", type: "text" },
      { name: "startYear", value: "startYear", type: "date" },
      { name: "endYear", value: "endYear", type: "date" },
      { name: "organization", value: "organization", type: "text" },
      { name: "department", value: "department", type: "text" },
      { name: "position", value: "position", type: "text" },
      { name: "isWork", value: "isWork", type: "checkbox" },
    ],
    thirdPersonInfo: [
      { name: "address", value: "address", type: "text" },
      { name: "contactPerson", value: "contactPerson", type: "text" },
      { name: "university", value: "university", type: "text" },
      { name: "faculty", value: "faculty", type: "text" },
      { name: "specialty", value: "specialty", type: "text" },
      { name: "startYear", value: "startYear", type: "date" },
      { name: "endYear", value: "endYear", type: "date" },
      { name: "organization", value: "organization", type: "text" },
      { name: "department", value: "department", type: "text" },
      { name: "position", value: "position", type: "text" },
      { name: "isWork", value: "isWork", type: "checkbox" },
    ],
    countryEnums: [],
    studyProgramEnums: [],
    socialStatusEnums: [],
    companyEnums: [],
    schoolEnums: [],
    applicantID: "",
    companyID: this.props.appState.userStore.companies[0].id,
    schoolID: "",
    showAvatarModal: false,
  };
  componentDidMount = () => {
    this.setState({ applicantID: this.props.applicant.id });
    this.getEnums();
  };
  getEnums = () => {
    this.props.appState.userStore.enums.forEach((element) => {
      if (element.name === "com.company.fsr.entity.Country") {
        this.setState({ countryEnums: element.values });
      }
      if (element.name === "com.company.fsr.entity.StudyProgram") {
        this.setState({ studyProgramEnums: element.values });
      }
      if (element.name === "com.company.fsr.entity.SocialStatus") {
        this.setState({ socialStatusEnums: element.values });
      }
    });
    let companies = [];
    this.props.appState.userStore.companies.forEach((company) => {
      if (
        this.props.applicant.staff &&
        this.props.applicant.staff.company &&
        this.props.applicant.staff.company.id === company.id
      ) {
        this.setState({ companyID: company.id });
      }
      companies.push({ name: company.id, caption: company.name });
    });
    let schools = [];
    this.props.appState.userStore.schools.forEach((school) => {
      if (
        this.props.applicant.student &&
        this.props.applicant.student.school &&
        this.props.applicant.student.school.id === school.id
      ) {
        this.setState({ schoolID: school.id });
      }
      schools.push({ name: school.id, caption: school.name });
    });

    this.setState({
      companyEnums: companies,
      schoolEnums: schools,
    });
  };

  loadFile = (id) => {
    return this.props.appState.filesStore.downloadFile(id);
  };
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "iin") {
      console.log(value.length)
      if (value.length >= 12) {
        this.props.applicant[name] = Math.max(0, value.toString().slice(0, 12));
        return;
      }
    }
    this.props.applicant[name] = value;
    if (name === "birthDate") {
      this.state.birthDay = value;
    }
  };
  handleExtraInputChange = (event) => {
    const { applicant } = this.props;
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "dateEnroll" || name === "dateHired" || name === "dateFired") {
      this.state[name] = value;
    }
    let form;
    switch (applicant.applicantType) {
      case "STUDENT":
        if (!applicant.student) {
          applicant.student = {};
        }
        form = { form: applicant.student };
        break;
      case "EMPLOYEE":
        if (!applicant.staff) {
          applicant.staff = {};
        }
        form = { form: applicant.staff };
        break;
      case "ORGANIZATION":
        if (!applicant.organization) {
          applicant.organization = {};
        }
        form = { form: applicant.organization };
        break;
      case "GRADUATE_NIS":
        if (!applicant.graduateNIS) {
          applicant.graduateNIS = {}
        }
        form = { form: this.state.graduateNIS };
        break;
      case "GRADUATE_NU":
        if (!applicant.graduateNU) {
          applicant.graduateNU = {}
        }
        form = { form: this.state.graduateNU };
        break;
      case "THIRD_PERSON":
        if (!applicant.thirdPerson) {
          applicant.thirdPerson = {};
        }
        form = { form: this.state.thirdPerson };
        break;
    }
    form.form[name] = value;
  };

  handleIsWorkCheckbox = (event) => {
    const { applicant } = this.props;
    const target = event.target;
    const value = target.checked;

    let form = null;
    if (applicant.applicantType === "EMPLOYEE") {
      if (value) {
        this.setState({
          stillWork: true
        })
      }
      if (!value) {
        this.setState({
          stillWork: !this.state.stillWork
        });
      }
    }
    if (applicant.applicantType === "GRADUATE_NIS") {
      form = { form: applicant.graduateNIS };

      if (value) {
        this.setState((prev) => ({
          ...prev,
          graduateNIS: {
            ...prev.graduateNIS,
            position: null,
            organization: null,
            department: null,
          },
        }));
      }
      this.setState(
        (prev) => ({
          ...prev,
          graduateNIS: {
            ...prev.graduateNIS,
            isWork: !this.state.graduateNIS.isWork,
          },
        }),
        () => console.log(this.state.graduateNIS.isWork)
      );
    } else if (applicant.applicantType === "THIRD_PERSON") {
      form = { form: applicant.thirdPerson };
      if (value) {
        this.setState((prev) => ({
          ...prev,
          thirdPerson: {
            ...prev.thirdPerson,
            position: null,
            organization: null,
            department: null,
          },
        }));
      }
      this.setState(
        (prev) => ({
          ...prev,
          thirdPerson: {
            ...prev.thirdPerson,
            isWork: !this.state.thirdPerson.isWork,
          },
        }),
        () => console.log(this.state.thirdPerson.isWork)
      );
    } 
    else if (applicant.applicantType === "GRADUATE_NU") {
      form = { form: applicant.graduateNU };
      if (value) {
        this.setState((prev) => ({
          ...prev,
          graduateNU: {
            ...prev.graduateNU,
            position: null,
            organization: null,
            department: null,
          },
        }));
      }
      this.setState(
        (prev) => ({
          ...prev,
          graduateNU: {
            ...prev.graduateNU,
            isWork: !this.state.graduateNU.isWork,
          },
        }),
        () => console.log(this.state.graduateNU.isWork)
      );
    }

  };
  handleSelectChange = (event, name) => {
    this.props.applicant[name] = event.target.value;
    console.log(`Option selected:`, event.target.value);
  };
  handleExtraSelectChange = (event, name) => {
    const { applicant } = this.props;
    let form;
    switch (applicant.applicantType) {
      case "STUDENT":
        if (!applicant.student) {
          applicant.student = {};
        }
        form = { form: applicant.student };
        break;
      case "EMPLOYEE":
        if (!applicant.staff) {
          applicant.staff = {};
        }
        form = { form: applicant.staff };
        break;
      case "ORGANIZATION":
        if (!applicant.organization) {
          applicant.organization = {};
        }
        form = { form: applicant.organization };
        break;
    }

    if (name === "company") {
      this.setState({ companyID: event.target.value });
      form.form[name] = { id: event.target.value };
    } else if (name === "school") {
      this.setState({ schoolID: event.target.value });
      form.form[name] = { id: event.target.value };
    } else {
      form.form[name] = event.target.value;
    }
  };
  handleRadioChange = (event, name) => {
    this.props.applicant[name] = event.target.value;
    console.log(`Option selected:`, event.target.value);
  };
  verifyApplicant = () => {
    this.props.applicant.birthDay = this.state.birthDay;
    if (this.props.applicant.student) {
      this.props.applicant.student.dateEnroll = this.state.dateEnroll;
    }
    if (this.props.applicant.staff) {
      this.props.applicant.staff.dateHired = this.state.dateHired;
      this.props.applicant.staff.dateFired = this.props.applicant.staff.dateFired ? this.state.dateFired : null;
    }
    
    // const regex = new RegExp("([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-]([0-9]{4})");
    const { applicant } = this.props;
    
    console.log(toJS(applicant));
    applicant.graduateNIS = this.state.graduateNIS;
    applicant.graduateNU = this.state.graduateNU;
    applicant.thirdPerson = this.state.thirdPerson;
    if(applicant.applicantType === "EMPLOYEE" && !applicant.staff.company) {
      applicant.staff.company = {"id": this.state.companyEnums[0].name};
    }

    let verified = true;
    
    if (!applicant.citizenship) {
      applicant.citizenship = "KAZAKHSTAN";
    } 
    if (!applicant.maritalStatus) { 
      applicant.maritalStatus = "SINGLE"
    }
    // if (!applicant.idNumber) {
    //   toast.error("Введите ID Номер", {
    //     position: toast.POSITION.BOTTOM_CENTER,
    //   });
    //   verified = false;
    // }
    if (!applicant.firstname) {
      toast.error("Введите Имя", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      verified = false;
    } else if (!applicant.lastname) {
      toast.error("Введите Фамилию", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      verified = false;
    } else if (!applicant.birthDay) {
      toast.error("Введите Дату рождения", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      verified = false;
    } 
    // else if (!regex.test(applicant.birthDay)) {
    //   toast.error("Формат Даты Рождения не верный, попробуйте в формате DD-MM-YYYY", {
    //     position: toast.POSITION.BOTTOM_CENTER,
    //   });
    //   verified = false;
    // }
    else if (!applicant.gender) {
      toast.error("Выберите Пол", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      verified = false;
    } else if (!applicant.iin) {
      toast.error("Выберите ИИН", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      verified = false;
    }
    else if (!this.state.cellNumber) {
      console.log(this.state.cellNumber.length)
      toast.error("Введите Номер Телефона в формате +7 (XXX) XXX-XXXX", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      verified = false;
    } else if (applicant.applicantType === "STUDENT") {
      if (!applicant.student.studyProgram) {
        applicant.student.studyProgram = this.state.studyProgramEnums[0].name;
      }
      if (!applicant.student.school) {
        applicant.student.school = {id: this.state.schoolEnums[0].name};
      }
      if (!applicant.student.socialStatus) {
        delete applicant.student.socialStatus;
      }
      if (applicant.student.gpa) {
        if (typeof applicant.student.gpa !== "number") {
          applicant.student.gpa = Number((applicant.student.gpa).replace(",", "."));
        }
      }
      if (!applicant.student.gpa) {
        toast.error("Введите GPA до десятичных", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.student.entryPoints) {
        toast.error("Введите Баллы при поступлении", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.student.grade) {
        toast.error("Введите Курс", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      }
       else if (!applicant.student.dateEnroll) {
        toast.error("Введите Дату зачисления", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } 
      // else if (!regex.test(applicant.student.dateEnroll)) {
      //   toast.error("Формат Даты Зачисления не верный, попробуйте в формате DD-MM-YYYY", {
      //     position: toast.POSITION.BOTTOM_CENTER,
      //   });
      //   verified = false;
      // }
    } else if (applicant.applicantType === "EMPLOYEE") {
      if (!applicant.staff.company) {
        applicant.staff.company = this.state.companyEnums[0].name;
      }
      
      if (!applicant.staff.department) {
        toast.error("Введите Департамент", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.staff.position) {
        toast.error("Введите Должность", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } 
      else if (!applicant.staff.dateHired) {
        toast.error("Введите Дату найма", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } 
      // else if (!regex.test(applicant.staff.dateHired)) {
      //   toast.error("Формат Даты Найма не верный, попробуйте в формате DD-MM-YYYY", {
      //     position: toast.POSITION.BOTTOM_CENTER,
      //   });
      //   verified = false;
      // } 
      if (this.state.stillWork) {
        delete applicant.staff.dateFired;
      }
      if(!this.state.stillWork) {
      if (!applicant.staff.dateFired) {
        toast.error("Введите Дату увольнения", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } 
      // else if (!regex.test(applicant.staff.dateFired)) {
      //   toast.error("Формат Даты Увольнения не верный, попробуйте в формате DD-MM-YYYY", {
      //     position: toast.POSITION.BOTTOM_CENTER,
      //   });
      //   verified = false;
      // }
      }
      
    } else if (applicant.applicantType === "ORGANIZATION") {
      if (!applicant.organization.name) {
        toast.error("Введите Наименование", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.organization.bank) {
        toast.error("Введите Банк", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.organization.bin) {
        toast.error("Введите БИН", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.organization.bik) {
        toast.error("Введите БИК", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.organization.kbe) {
        toast.error("Введите Кбе", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.organization.iban) {
        toast.error("Введите IBAN", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.organization.description) {
        toast.error("Введите Описание", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      }
    } else if (applicant.applicantType === "GRADUATE_NIS") {
      if (!applicant.graduateNIS.specialty) {
        toast.error("Введите Специальность", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.graduateNIS.address) {
        toast.error("Введите Адрес", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.graduateNIS.university) {
        toast.error("Введите Вуз/ТиПО", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.graduateNIS.startYear) {
        toast.error("Введите Год начала", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.graduateNIS.contactPerson) {
        toast.error("Введите Контактное лицо", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.graduateNIS.endYear) {
        toast.error("Введите Год окончания", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.graduateNIS.faculty) {
        toast.error("Введите Факультет", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!this.state.graduateNIS.isWork) {
        this.setState(
          (prev) => ({
            ...prev,
            graduateNIS: {
              ...prev.graduateNIS,
              isWork: false,
            },
          }));

        if (!applicant.graduateNIS.position) {
          toast.error("Введите Должность", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          verified = false;
        } else if (!applicant.graduateNIS.organization) {
          toast.error("Введите Организацию", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          verified = false;
        } else if (!applicant.graduateNIS.department) {
          toast.error("Введите Департамент/отдел", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          verified = false;
        }
      }
    } else if (applicant.applicantType === "GRADUATE_NU") {
      if (!applicant.graduateNU.specialty) {
        toast.error("Введите Специальность", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.graduateNU.address) {
        toast.error("Введите Адрес", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.graduateNU.university) {
        toast.error("Введите Вуз/ТиПО", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.graduateNU.startYear) {
        toast.error("Введите Год начала", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.graduateNU.contactPerson) {
        toast.error("Введите Контактное лицо", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.graduateNU.endYear) {
        toast.error("Введите Год окончания", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.graduateNU.faculty) {
        toast.error("Введите Факультет", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!this.state.graduateNU.isWork) {
        this.setState(
          (prev) => ({
            ...prev,
            graduateNU: {
              ...prev.graduateNU,
              isWork: false,
            },
          }));
        if (!applicant.graduateNU.position) {
          toast.error("Введите Должность", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          verified = false;
        } else if (!applicant.graduateNU.organization) {
          toast.error("Введите Организацию", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          verified = false;
        } else if (!applicant.graduateNU.department) {
          toast.error("Введите Департамент/отдел", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          verified = false;
        }
      }
    } else if (applicant.applicantType === "THIRD_PERSON") {
      if (!applicant.thirdPerson.specialty) {
        toast.error("Введите Специальность", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.thirdPerson.address) {
        toast.error("Введите Адрес", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.thirdPerson.university) {
        toast.error("Введите Вуз/ТиПО", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.thirdPerson.startYear) {
        toast.error("Введите Год начала", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.thirdPerson.contactPerson) {
        toast.error("Введите Контактное лицо", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.thirdPerson.endYear) {
        toast.error("Введите Год окончания", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!applicant.thirdPerson.faculty) {
        toast.error("Введите Факультет", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        verified = false;
      } else if (!this.state.thirdPerson.isWork) {
        this.setState(
          (prev) => ({
            ...prev,
            thirdPerson: {
              ...prev.thirdPerson,
              isWork: false,
            },
          }));
        
        if (!applicant.thirdPerson.position) {
          toast.error("Введите Должность", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          verified = false;
        } else if (!applicant.thirdPerson.organization) {
          toast.error("Введите Организацию", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          verified = false;
        } else if (!applicant.thirdPerson.department) {
          toast.error("Введите Департамент/отдел", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          verified = false;
        }
      }
    }
    console.log("end verification")
    if(verified) {
      this.sendApplicantForm();
    }
  }
  sendPhone = async (cp) => {
    const form: any = {applicant: {id: this.props.applicant.id}, cellNumber: cp};
    return await cubaREST
      .commitEntity("fsr_PhoneNumber", form);
  }
  formatNumber = (num) => {
    return num.replace(' ','');
  }
  sendApplicantForm = async () => {
    const { applicant } = this.props;
    const stateSP = this.state.cellNumber && this.state.cellNumber.replace(/\s/g, '').replace(/\-/g, '').replace(/\(/g, '').replace(/\)/g, '');
    const cP =  this.props.applicant.phone && this.props.applicant.phone.cellNumber || null;
    console.log(stateSP, cP);
    
    if (stateSP !== null && stateSP !== cP) {
      console.log(await this.sendPhone(stateSP))
      this.props.applicant.phone = await this.sendPhone(stateSP) || null;
    }
    this.props.appState.applicantsStore.updateApplicant(applicant);
  };
  savePhoto = () => {
    const { applicant } = this.props;
    const newFile = this.avatarComponent.current.state.file;
    this.props.appState.filesStore.uploadFile(newFile).then((res) => {
      applicant.photo = res.data;
      if (this.photoComponent.current.props.photo) {
        this.photoComponent.current.fetchFile();
      }
    });
  };
  openAvatarModal = () => {
    this.setState({ showAvatarModal: true });
  };
  closeAvatarModal = () => {
    this.setState({ showAvatarModal: false });
  };
  handleChangeDate = (date) => {
    this.setState({ birthDay: date });
  }
  handlePhoneChange = (e) => {
    this.setState({ cellNumber: e.target.value });
  }
  handleChangeDateExtra = (date) => {
    if (this.props.applicant.applicantType === "EMPLOYEE") {
      this.setState({ dateHired: date });
      this.setState({ dateFired: date });
    }
    else if (this.props.applicant.applicantType === "STUDENT") {
      this.setState({ dateEnroll: date });
    }
  }
  render() {
    const { info, showAvatarModal } = this.state;
    const { applicant } = this.props;
    const { language } = this.props.appState.userStore;
    return (
      <div className="general-info__container">
        <table className="general-info__table">
          <tbody>
            {info.map((item, idx) => (
              <tr key={idx}>
                <th>{i18next.t(item.name)}</th>
                {this.renderInput(item)}
              </tr>
            ))}
            {this.renderExtraInfo(applicant.applicantType)}
          </tbody>
        </table>
        <div className="personal-form__footer">
          <button
            className="personal-form__save"
            onClick={this.verifyApplicant}
          >
            <Trans>Save</Trans>
          </button>
        </div>

        <PhotoComponent
          getFile={this.loadFile}
          photo={applicant.photo}
          openAvatarModal={this.openAvatarModal}
          ref={this.photoComponent}
        />
        {showAvatarModal && (
          <div className="avatar-modal">
            <OutsideClickHandler onOutsideClick={this.closeAvatarModal}>
              <Avatar ref={this.avatarComponent} />
              <div className="modal__actions">
                <button
                  className="confirm-button"
                  onClick={() => {
                    this.savePhoto();
                    this.closeAvatarModal();
                  }}
                >
                  <Trans>Save</Trans>
                </button>
                <button
                  className="cancel-button"
                  onClick={this.closeAvatarModal}
                >
                  <Trans>Cancel</Trans>
                </button>
              </div>
            </OutsideClickHandler>
          </div>
        )}
      </div>
    );
  }
  renderInput = (item) => {
    const { applicant } = this.props;
    if (item.type === "text") {
      if (item.value === "email") {
        return (
          <td>
            <input
              defaultValue={applicant[item.value]}
              className="general-info__input"
              name={item.value}
              readOnly
            />
          </td>
        );
      }
      return (
        <td>
          <input
            defaultValue={applicant[item.value]}
            className="general-info__input"
            onChange={this.handleInputChange}
            name={item.value}
          />
        </td>
      );
    } else if (item.type === "date") {
      return (
        <td>
          <DatePickerComponent
            selected={this.state.birthDay}
            type="NONE"
            handleChangeDate={this.handleChangeDate}
          />
        </td>
      );
    } else if (item.type === "number") {
      if (item.name === "telefon") {
        return (
          <InputMask 
            defaultValue={this.state.cellNumber}
            name="phone"
            onChange={e => this.handlePhoneChange(e)}
            mask="+9 (999) 999-9999"
            maskChar=" "
            className="general-info__input"
            style={{width: '100%'}}
          />
        )
      }
      return (
        <td>
          <input
            key={item.name + applicant.applicantType}
            type = "number"
            value={applicant[item.value]}
            className="general-info__input"
            onChange={this.handleInputChange}
            name={item.value}
          />
        </td>
      );
  } else if (item.type === "checkbox") {
      return (
        <td>
          <input
            name={item.value}
            type="checkbox"
            checked={applicant[item.value]}
            onChange={this.handleInputChange}
            className="general-info__input__checkbox"
          />
        </td>
      );
    } else if (item.type === "dropdown") {
      if (item.list && item.list.length > 0) {
        return (
          <td>
            <select
              value={applicant[item.value]}
              onChange={(event) => this.handleSelectChange(event, item.value)}
              className="general-info__input__select"
            >
              {item.list.map((o, idx) => (
                <option value={o.name} key={idx}>
                  {i18next.t(o.caption)}
                </option>
              ))}
            </select>
          </td>
        );
      } else {
        if (item.value === "citizenship") {
          item.list = this.state.countryEnums;

        if (item.list) {
          if (!applicant[item.value]) {
            applicant[item.value] = "KAZAKHSTAN";
          }
          return (
            <td>
              <select
                value={applicant[item.value]}
                onChange={(event) => this.handleSelectChange(event, item.value)}
                className="general-info__input__select"
              >
                {item.list.map((o, idx) => (
                  <option value={o.name} key={idx}>
                    {o.caption}
                  </option>
                ))}
              </select>
            </td>
          );
        }
        }
        if (item.list) {
          return (
            <td>
              <select
                value={applicant[item.value]}
                onChange={(event) => this.handleSelectChange(event, item.value)}
                className="general-info__input__select"
              >
                {item.list.map((o, idx) => (
                  <option value={o.name} key={idx}>
                  {/*{o.caption}*/}
                  {i18next.t(o.caption)}
                  </option>
                ))}
              </select>
            </td>
          );
        }
      }
    } else if (item.type === "radio") {
      return (
        <td>
          <div style={{ display: "flex" }}>
            {item.list.map((o, idx) => (
              <div key={idx} className="general-info__input__radio-container">
                <input
                  type="radio"
                  name={item.value}
                  checked={applicant[item.value] === o.name}
                  value={o.name}
                  onChange={(event) =>
                    this.handleRadioChange(event, item.value)
                  }
                  className="general-info__input__radio"
                />
                <label htmlFor="" className="general-info__input__radio-label">
                  {/*{o.caption}*/}
                  {i18next.t(o.caption)}
                </label>
              </div>
            ))}
          </div>
        </td>
      );
    }
  };
  renderExtraInfo(type) {
    const { studentInfo, employeeInfo, organizationInfo, graduateNISInfo, graduateNUInfo, thirdPersonInfo } = this.state;
    switch (type) {
      case "STUDENT":
        return studentInfo.map((item, idx) => (
          <tr key={idx}>
            <th>{i18next.t(item.name)}</th>
            {this.renderExtraInput(item)}
          </tr>
        ));
      case "EMPLOYEE":
        return employeeInfo.map((item, idx) => (
          <tr key={idx}>
            <th>{i18next.t(item.name)}</th>
            {this.renderExtraInput(item)}
          </tr>
        ));
      // case "ORGANIZATION":
      //   return organizationInfo.map((item, idx) => (
      //     <tr key={idx}>
      //       <th>{item.name}</th>
      //       {this.renderExtraInput(item)}
      //     </tr>
      //   ));
      case "GRADUATE_NIS":
        return graduateNISInfo.map((item, idx) => (
          <tr key={idx}>
            <th>{i18next.t(item.name)}</th>
            {this.renderExtraInput(item)}
          </tr>
        ));
      case "GRADUATE_NU":
        return graduateNUInfo.map((item, idx) => (
          <tr key={idx}>
            <th>{i18next.t(item.name)}</th>
            {this.renderExtraInput(item)}
          </tr>
        ));
      case "THIRD_PERSON":
        return thirdPersonInfo.map((item, idx) => (
          <tr key={idx}>
            <th>{i18next.t(item.name)}</th>
            {this.renderExtraInput(item)}
          </tr>
        ));
    }
  }
  renderExtraInput = (item) => {
    const { applicant } = this.props;
    let form;
    switch (applicant.applicantType) {
      case "STUDENT":
        if (!applicant.student) {
          applicant.student = {};
        }
        form = { form: applicant.student };
        break;
      case "EMPLOYEE":
        if (!applicant.staff) {
          applicant.staff = {};
        }
        form = { form: applicant.staff };
        break;
      // case "ORGANIZATION":
      //   if (!applicant.organization) {
      //     applicant.organization = {};
      //   }
      //   form = { form: applicant.organization };
      //   break;
      case "GRADUATE_NIS":
        if (!applicant.graduateNIS) {
          applicant.graduateNIS = {};
        }
        form = { form: this.state.graduateNIS };
        break;
      case "GRADUATE_NU":
          if (!applicant.graduateNU) {
            applicant.graduateNU = {};
          }
          form = { form: this.state.graduateNU };
          break;
      case "THIRD_PERSON":
        if (!applicant.thirdPerson) {
          applicant.thirdPerson = {};
        }
        form = { form: this.state.thirdPerson };
        break;
    }
    if (item.type === "text") {
      return (
        <td>
          <input
            key={item.name+applicant.applicantType}
            value={form.form[item.value]}
            className="general-info__input"
            onChange={this.handleExtraInputChange}
            name={item.value}
          />
        </td>
      );
    } else if (item.type === "number") {
      if (applicant.applicantType === "STUDENT" && item.value === "gpa") {
        return (
          <td>
            <InputMask
              key={item.name + applicant.applicantType}
              // type = "number"
              value={form.form[item.value]}
              className="general-info__input"
              mask="9,99"
              maskChar="-"
              onChange={this.handleExtraInputChange}
              name={item.value}
            />
          </td>
        )
      }
        return (
          <td>
            <input
              key={item.name + applicant.applicantType}
              type = "number"
              value={form.form[item.value]}
              className="general-info__input"
              onChange={this.handleExtraInputChange}
              name={item.value}
            />
          </td>
        );
    } else if (item.type === "date") {
      console.log(this.state, item.value)
      if (applicant.applicantType === "EMPLOYEE" || applicant.applicantType === "STUDENT") {
        return (
          <td>
            <DatePickerComponent
              selected={this.state[item.value]}
              type="EXTRA"
              handleChangeDateExtra={this.handleChangeDateExtra}
          />
            {/* <InputMask
              key={item.name + applicant.applicantType}
              defaultValue={this.state[item.value]}
              name={item.value}
              onChange={this.handleExtraInputChange}
              mask="99-99-9999"
              maskChar=" "
              className="general-info__input"
            /> */}
          </td>
        );
      }
      return (
        <td>
          <InputMask
            key={item.name+applicant.applicantType}
            defaultValue={(form.form[item.value])}
            name={item.value}
            onChange={this.handleExtraInputChange}
            mask="9999"
            maskChar=""
            className="general-info__input"
          />
        </td>
      );
    } else if (item.type === "checkbox") {
      if (item.value === "stillWork") {
        return (
          <td>
            <input
              key={item.name+applicant.applicantType}
              name={item.value}
              type="checkbox"
              checked={this.state.stillWork}
              onChange={this.handleIsWorkCheckbox}
              className="general-info__input__checkbox"
            />
          </td>
        );
      }
      if (item.value === "isWork") {
        if (applicant.applicantType === "THIRD_PERSON") {
          return (
            <td>
              <input
                key={item.name+applicant.applicantType}
                name={item.value}
                type="checkbox"
                checked={this.state.thirdPerson.isWork}
                onChange={this.handleIsWorkCheckbox}
                className="general-info__input__checkbox"
              />
            </td>
          );
        }
        if (applicant.applicantType === "GRADUATE_NU") {
          return (
            <td>
              <input
                key={item.name+applicant.applicantType}
                name={item.value}
                type="checkbox"
                checked={this.state.graduateNU.isWork}
                onChange={this.handleIsWorkCheckbox}
                className="general-info__input__checkbox"
              />
            </td>
          );
        }
        if (applicant.applicantType === "GRADUATE_NIS") {
          return (
            <td>
              <input
                key={item.name+applicant.applicantType}
                name={item.value}
                type="checkbox"
                checked={this.state.graduateNIS.isWork}
                onChange={this.handleIsWorkCheckbox}
                className="general-info__input__checkbox"
              />
            </td>
          );
        }
      }
      // return (
      //   <td>
      //     <input
      //       key={item.name+applicant.applicantType}
      //       name={item.value}
      //       type="checkbox"
      //       checked={this.state.thirdPerson.isWork}
      //       onChange={this.handleExtraInputChange}
      //       className="general-info__input__checkbox"
      //     />
      //   </td>
      // );
    } else if (item.type === "dropdown") {
      if (item.list && item.list.length > 0) {
        return (
          <td>
            <select
              value={form.form[item.value]}
              onChange={(event) =>
                this.handleExtraSelectChange(event, item.value)
              }
              className="general-info__input__select"
            >
              {item.list.map((o, idx) => (
                <option value={o.name} key={idx}>
                  {/*{o.caption}*/}
                  {i18next.t(item.caption)}
                </option>
              ))}
            </select>
          </td>
        );
      } else {
        if (item.value === "studyProgram") {
          item.list = this.state.studyProgramEnums;
        }
        if (item.value === "socialStatus") {
          return (
            <td>
              <select
                value={form.form[item.value]}
                onChange={(event) =>
                  this.handleExtraSelectChange(event, item.value)
                }
                className="general-info__input__select"
              >
                <option value={null}></option>
                {this.state.socialStatusEnums.map((o, idx) => (
                  <option value={o.name} key={idx}>
                    {o.caption}
                  </option>
                ))}
              </select>
            </td>
          );
        }
        if (item.value === "company") {
          return (
            <td>
              <select
                value={this.state.companyID}
                onChange={(event) =>
                  this.handleExtraSelectChange(event, item.value)
                }
                className="general-info__input__select"
              >
                {this.state.companyEnums.map((o, idx) => (
                  <option value={o.name} key={idx}>
                    {o.caption}
                  </option>
                ))}
              </select>
            </td>
          );
        }
        if (item.value === "school") {
          return (
            <td>
              <select
                value={this.state.schoolID}
                onChange={(event) =>
                  this.handleExtraSelectChange(event, item.value)
                }
                className="general-info__input__select"
              >
                {this.state.schoolEnums.map((o, idx) => (
                  <option value={o.name} key={idx}>
                    {o.caption}
                  </option>
                ))}
              </select>
            </td>
          );
        }
        if (item.list) {
          return (
            <td>
              <select
                value={form.form[item.value]}
                onChange={(event) =>
                  this.handleExtraSelectChange(event, item.value)
                }
                className="general-info__input__select"
              >
                {item.list.map((o, idx) => (
                  <option value={o.name} key={idx}>
                    {o.caption}
                  </option>
                ))}
              </select>
            </td>
          );
        }
      }
    }
  };
}

export default GeneralInfo;
