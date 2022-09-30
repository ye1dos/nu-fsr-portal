import {
  action,
  observable,
  IObservableArray,
  IObservableObject,
  runInAction,
} from "mobx";
import i18n from "../i18n";
import { cubaREST, myCuba } from "../cubaREST";
import {
  EnumInfo,
  MetaClassInfo,
  MetaPropertyInfo,
  PermissionInfo,
  UserInfo,
} from "@cuba-platform/rest/dist-node/model";

export class UserStore {
  rootStore;
  @observable userName;
  @observable userInfo;
  @observable initialized = false;
  @observable authenticated = false;
  @observable usingAnonymously = false;
  @observable permissions: IObservableArray<PermissionInfo>;
  @observable metadata: IObservableArray<MetaClassInfo>;
  @observable messages: IObservableObject;
  @observable enums: IObservableArray<EnumInfo>;
  @observable docOwners;
  @observable docTypes;
  @observable language = "ru";
  @observable locale = "ru";
  @observable loginError;
  @observable companies = [];
  @observable schools = [];
  @observable teamRole = {};
  constructor(rootStore) {
    this.rootStore = rootStore;
  }
  @action
  login(login: string, password: string) {
    return cubaREST
      .login(login, password)
      .then(
        action(() => {
          this.userName = login;
          this.authenticated = true;
          this.loginError = "";
          this.initialize();
          window.location.reload();
        })
      )
      .catch(
        action((error) => {
          console.log(error);
          this.loginError = "Неправильный логин или пароль";
        })
      );
  }
  @action
  logout(): Promise<void> {
    if (cubaREST.restApiToken != null) {
      return cubaREST.logout().then(
        action(() => {
          this.authenticated = false;
          localStorage.removeItem("applicant");
          localStorage.removeItem("UserInfoId");
          localStorage.removeItem("procId");
          localStorage.removeItem("appId");
          console.log("LOG_OUTED");
        })
      );
    }
    return Promise.resolve();
  }
  initialize() {
    console.log("initialize");
    const accessToken = localStorage.getItem("fsr_cubaAccessToken");
    myCuba.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    if (accessToken) {
      this.authenticated = true;
    }
    cubaREST
      .getUserInfo()
      .then(
        action((userInfo) => {
          if (cubaREST.restApiToken == null) {
            this.usingAnonymously = true;
            this.authenticated = false;
          } else {
            this.authenticated = true;
            this.usingAnonymously = false;
          }
          if (!this.usingAnonymously && this.authenticated) {
            this.userName = userInfo.name;
            this.userInfo = observable(userInfo);
            localStorage.setItem("applicant", userInfo.login);
            this.rootStore.applicantsStore.loadApplicant(); // Fetching applicant
            this.rootStore.contractsStore.loadEntities(); // Fetching applicant
            this.rootStore.applicationsStore.loadEntities();
            this.initialized = true;
          }
        })
      )
      .catch(
        action(() => {
          this.initialized = true;
          this.authenticated = false;
        })
      );

    cubaREST.loadEnums().then(
      action((enums: EnumInfo[]) => {
        this.enums = observable(enums);
      })
    );
    this.loadCompanies();
    this.loadSchools();
  }

  @action
  getUserInfo() {
    cubaREST
      .getUserInfo()
      .then(
        action((userInfo) => {
          if (cubaREST.restApiToken == null) {
            this.usingAnonymously = true;
            this.authenticated = false;
          } else {
            this.authenticated = true;
            this.usingAnonymously = false;
          }
          if (!this.usingAnonymously && this.authenticated) {
            this.userName = userInfo.name;
            this.userInfo = observable(userInfo);
            // console.log("userInfo");
            // console.log(userInfo);
            localStorage.setItem("applicant", userInfo.login);
            this.rootStore.applicantsStore.loadApplicant(); // Fetching applicant
            this.rootStore.contractsStore.loadEntities(); // Fetching applicant
            this.rootStore.applicationsStore.loadEntities();
            this.initialized = true;
          }
        })
      )
      .catch(
        action(() => {
          this.initialized = true;
          this.authenticated = false;
        })
      );
  }

  @action
  getUserInfo2() {
    return cubaREST.getUserInfo()
  }

  @action
  loadCompanies = () => {
    cubaREST
      .loadEntities("fsr_Company")
      .then((resp) => {
        runInAction(() => {
          this.companies = resp;
          console.log("loaded companies");
        });
      })
      .catch(action(() => {}));
  };

  @action
  loadSchools = () => {
    cubaREST
      .loadEntities("fsr_RefSchool")
      .then((resp) => {
        runInAction(() => {
          this.schools = resp;
        });
      })
      .catch(action(() => {}));
  };

  @action
  changeLanguage(lang) {
    this.language = lang;
    switch (lang) {
      case "en":
        this.locale = "enUS";
        break;
      case "ru":
        this.locale = "ru";
      case "kz":
        this.locale = "kz";
      default:
        this.locale = "ru";
        break;
    }
    i18n.changeLanguage(lang);
  }

  @action
  register(form) {
    return cubaREST.commitEntity("sec$User", form);
  }

  @action
  restoreUserByHash = (form) => {
    return cubaREST.invokeService(
      "fsr_ApplicantUserService",
      "restoreUserByHash",
      { hash: form.hash, password: form.password }
    );
  };

  @action
  addNewRestoreHash = (login) => {
    return cubaREST.invokeService(
      "fsr_ApplicantUserService",
      "addNewRestoreHash",
      { login: login }
    );
  };

  @action
  changePassword = (form) => {
    return cubaREST.invokeService(
      "fsr_ApplicantUserService",
      "changeUserPassword",
      form
    );
  };
  @action
  teamMemberOrTeamLead(userId) {
    return cubaREST
    .invokeService(
      "fsr_ApplicantUserService", 
      "teamMemberOrTeamLeadRoleByUserId",
      {
        userId: userId
      })
  }
}
